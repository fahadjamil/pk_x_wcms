import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { Helmet } from 'react-helmet';
import LanguageModel from '../../../shared/models/LanguageModel';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';
import PreviewContentComponent from './PreviewContentComponent';

function PreviewContentComponentWrapper(props) {
    const { match } = props;
    const { params } = match;
    const isPermissionAvialable = true;

    const [themes, setThemes] = useState();
    const [page, setPage] = useState();
    const [pageHeaderResources, setPageHeaderResources] = useState<any>([]);
    const [pageBodyResources, setPageBodyResources] = useState<any>([]);
    const [staticResources, setStaticResources] = useState<any>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageModel>();
    let bodySectionScripts: any = [];

    useEffect(() => {
        let isMounted = true;

        if (isMounted && params.website && params.page) {
            getPage(params.website, params.page);
            getAllThemes(params.website);
            getLanguages(params.website);
            getStaticResourcesForPreview(params.website);
        }

        return () => {
            isMounted = false;
        };
    }, [params.website, params.page]);

    useEffect(() => {
        let isMounted = true;

        if (isMounted && params.website && params.page) {
            getStaticResourcesLinksForPreview(params.website);
        }

        return () => {
            isMounted = false;
        };
    }, [staticResources]);

    useEffect(() => {
        let scripts: any = [];

        if (Array.isArray(bodySectionScripts) && bodySectionScripts.length > 0) {
            for (const element of bodySectionScripts) {
                let script: any = document.createElement('script');

                script.src = element.src;
                script.async = true;
                scripts.push(script);
                document.body.appendChild(script);
            }
        }

        return () => {
            if (scripts.length > 0) {
                for (const script of scripts) {
                    document.body.removeChild(script);
                }
            }
        };
    }, [bodySectionScripts]);

    function getStaticResourcesForPreview(database) {
        const headerParameter = { dbName: database, collection: 'static-resources' };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/collection/data/all', httpHeaders)
            .then((result) => {
                const { data, status } = result;

                if (status === 200) {
                    if (Array.isArray(data) && data.length > 0) {
                        setStaticResources(data);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getStaticResourcesLinksForPreview(database) {
        const headerParameter = { dbName: database, collection: 'static-resources-links' };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/collection/data/all', httpHeaders)
            .then((result) => {
                const { data, status } = result;

                if (status === 200) {
                    if (Array.isArray(data) && data.length > 0) {
                        generateSiteResourcesForPreview(data);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getPage(database, pageId) {
        const headerParameter = { id: pageId };
        // const httpHeaders = getAuthorizationHeader(headerParameter);
        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: {
                dbName: database,
                id: pageId,
            },
        };

        Axios.get('/api/pages/data', httpHeaders)
            .then((result) => {
                if (result && result.data && result.data.page) {
                    setPage(result.data.page);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getAllThemes(database) {
        const headerParameter = {};
        // const httpHeaders = getAuthorizationHeader(headerParameter);
        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: {
                dbName: database,
            },
        };

        Axios.get('/api/themes', httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    setThemes(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getLanguages(database) {
        const headerParameter = {};
        // const httpHeaders = getAuthorizationHeader(headerParameter);
        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: {
                dbName: database,
            },
        };

        Axios.get('/api/websites/languages/data', httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    const lang = result.data.find(
                        (langItem) => langItem.langKey.toLowerCase() === params.lang.toLowerCase()
                    );

                    if (lang) {
                        setSelectedLanguage(lang);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function generateSiteResourcesForPreview(resources) {
        for (const resource of resources) {
            const { links, section, _id } = resource;
            const parser = new DOMParser();

            if (section === 'headerLinks') {
                const parsedHtml = parser.parseFromString(links, 'text/html');
                const headElements = generateSiteResources(parsedHtml);

                setPageHeaderResources(headElements);
            }

            if (section === 'bodyLinks') {
                const parsedHtml = parser.parseFromString(links, 'text/html');
                const bodyElements = generateSiteResources(parsedHtml);

                setPageBodyResources(bodyElements);
            }
        }
    }

    function generateSiteResources(parsedHtml) {
        let siteResources: any = [];
        const headElements = parsedHtml.head.children;
        const bodyElements = parsedHtml.body.children;

        siteResources = [...generateResources(headElements), ...generateResources(bodyElements)];

        return siteResources;
    }

    function generateResources(resources: any = []) {
        let resultingElements: any = [];

        if (resources.length > 0) {
            for (const resource of resources) {
                const tagName = resource.tagName;

                switch (tagName) {
                    case 'META':
                        resultingElements.push(resource.outerHTML);
                        break;
                    case 'LINK':
                        resultingElements.push(htmlLinkElementHandler(resource));
                        break;
                    case 'STYLE':
                        // TODO: Internal style tags not adding to head element. React helmet changes need to do.
                        resultingElements.push(resource.outerHTML);
                        break;
                    case 'SCRIPT':
                        resultingElements.push(htmlScriptElementHandler(resource));
                        break;
                    case 'TITLE':
                        break;
                    default:
                        resultingElements.push(resource.outerHTML);
                        break;
                }
            }
        }

        return resultingElements;
    }

    function htmlLinkElementHandler(element) {
        const href = element.href;
        const host = window.location.host;
        const protocol = window.location.protocol;
        const patt = new RegExp(host);
        const res = patt.test(href);

        if (res) {
            let str = href.replace(`${protocol}//${host}/`, '');
            str = str.split('/');
            const fileName = str[str.length - 1];

            if (staticResources.length > 0) {
                const resource = staticResources.find(
                    (element) => fileName === element.uploadFileName
                );

                // For single files
                if (str.length === 1 && resource) {
                    return `<link type="text/css" href="${resource.fileUrl}" rel="stylesheet" />`;
                }

                if (str.length > 1 && resource) {
                    // TODO: Handle ziped files here
                }
            }
        } else {
            // Return external link URLs
            return element.outerHTML;
        }
    }

    function htmlScriptElementHandler(element) {
        const src = element.src;
        const host = window.location.host;
        const protocol = window.location.protocol;
        const patt = new RegExp(host);
        const res = patt.test(src);

        if (src && src.length === 0) {
            // TODO: Internal script tags not working.
            // return element.outerHTML;
            return;
        }

        if (res) {
            let str = src.replace(`${protocol}//${host}/`, '');
            str = str.split('/');
            const fileName = str[str.length - 1];

            if (staticResources.length > 0) {
                const resource = staticResources.find(
                    (element) => fileName === element.uploadFileName
                );

                // For single files
                if (str.length === 1 && resource) {
                    element.src = `${resource.fileUrl}`;
                    return element.outerHTML;
                }

                if (str.length > 1 && resource) {
                    // TODO: Handle ziped files here
                }
            }
        } else {
            // Return external link URLs
            return element.outerHTML;
        }
    }

    function addPageBodyResources() {
        let data: any = [];
        let bodyResources: any = [];

        for (const element of pageBodyResources) {
            if (element) {
                const ele: any = parse(element);

                if (ele.type === 'script') {
                    data.push({ src: ele.props.src, pageSection: 'body' });
                    continue;
                }

                bodyResources.push(ele);
            }
        }
        bodySectionScripts = [...data];

        return bodyResources;
    }

    if (isPermissionAvialable) {
        if (themes && page && selectedLanguage) {
            return (
                <>
                    <Helmet>
                        {pageHeaderResources.map((element) => {
                            if (element) {
                                // TODO: Currently internal style tags and internal scripts not working.
                                return parse(element);
                            }
                        })}
                        <body className="cms-preview" />
                    </Helmet>
                    <PreviewContentComponent
                        dbName={params.website}
                        page={page}
                        editMode={false}
                        selectedLanguage={selectedLanguage}
                        theme={themes}
                        isPreview={true}
                    />
                    {addPageBodyResources()}
                </>
            );
        } else {
            return <div>Page data not found</div>;
        }
    } else {
        return <div>User do not have permission to view this page</div>;
    }
}

export default PreviewContentComponentWrapper;
