import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PagePreviewComponent } from 'ui-components';
import LanguageModel from '../../../shared/models/LanguageModel';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';

export default function PreviewContentComponent(props) {
    const [page, setPage] = useState<any>(props.page);
    const [pageContentData, setPageContentData] = useState<any>({});
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageModel>(props.selectedLanguage);
    const [templateContentData, setTemplateContentData] = useState<any>({});
    const [error, setError] = useState<any>(null);
    const [template, setTemplate] = useState<any>({});
    const dbName = props.dbName;
    const pageId = page._id;
    const themes = props.theme;

    useEffect(() => {
        getAllPageData(dbName, page.pageData);
        getTemplate(page.masterTemplate, dbName);
    }, [dbName]);

    function getAllPageData(dbName, pageData) {
        let pageDataIds = pageData.map((pageDataItem) => {
            return pageDataItem.id;
        });

        // get this from passing pageData
        const headerParameter = {idList: pageDataIds};
        // const httpHeaders = getAuthorizationHeader(headerParameter);
        const sessionId = localStorage.getItem('sessionId');
        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: {
                idList: pageDataIds, // get this from passing pageData
                dbName: dbName,
                sessionId: sessionId,
            },
        };

        Axios.get('/api/pages/contents/data', httpHeaders)
            .then((result) => {
                let pageContentResult = {};

                if (result && result.data) {
                    result.data.forEach((languageWiseContentData) => {
                        const { _id, ...contentData } = languageWiseContentData;
                        const langPageData = pageData.find(
                            (langPageData) => langPageData.id === _id
                        );

                        pageContentResult[langPageData.lang] = contentData;
                    });
                }

                setPageContentData(pageContentResult);
            })
            .catch((err) => {
                setError(err);
                console.log(err);
            });
    }

    function getTemplate(templateId, dbName) {
        const headerParameter = {id: templateId};
        // const httpHeaders = getAuthorizationHeader(headerParameter);

        const sessionId = localStorage.getItem('sessionId');
        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: {
                dbName: dbName,
                id: templateId,
                sessionId: sessionId,
            },
        };

        Axios.get('/api/templates/data', httpHeaders)
            .then((result) => {
                setTemplate(result.data);
                getAllTemplateData(dbName, result.data.templateData);
            })
            .catch((err) => {
                // setError(err);
                console.log(err);
            });
    }

    function getAllTemplateData(dbName, templateData) {
        let templateDataIds = templateData.map((templateDataItem) => {
            return templateDataItem.id;
        });

        // get this from passing templateData
        const headerParameter = {idList: templateDataIds};
        // const httpHeaders = getAuthorizationHeader(headerParameter);

        const sessionId = localStorage.getItem('sessionId');
        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: {
                idList: templateDataIds, // get this from passing templateData
                dbName: dbName,
                sessionId: sessionId,
            },
        };

        Axios.get('/api/templates/content', httpHeaders)
            .then((result) => {
                let templateContentResult = {};

                if (result && result.data) {
                    result.data.forEach((languageWiseContentData) => {
                        const { _id, ...contentData } = languageWiseContentData;
                        const langTemplateData = templateData.find(
                            (langTemplateData) => langTemplateData.id === _id
                        );
                        templateContentResult[langTemplateData.lang] = contentData;
                    });
                }

                setTemplateContentData(templateContentResult);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getHeaderData() {
        // const type = 'header';
        let contentData = templateContentData[selectedLanguage.langKey];
        // let temp = template[type]
        let previewData = { contentData, template, themes };
        return previewData;
    }

    function getPageData() {
        // const type = 'header';
        let contentData = pageContentData[selectedLanguage.langKey];
        // let temp = template[type]
        let previewData = { contentData, page, themes };
        return previewData;
    }

    function getFooterData() {
        // const type = 'header';
        let contentData = templateContentData[selectedLanguage.langKey];
        // let temp = template[type]
        let previewData = { contentData, template, themes };
        return previewData;
    }

    function openComponentList(column) {}

    return (
        <PagePreviewComponent
            headerPreviewData={getHeaderData()}
            pagePreviewData={getPageData()}
            footerPreviewData={getFooterData()}
            editMode={props.editMode}
            openComponentList={openComponentList}
            dbName={props.dbName}
            selectedLanguage={selectedLanguage}
            isPreview={props.isPreview}
        ></PagePreviewComponent>
    );
}
