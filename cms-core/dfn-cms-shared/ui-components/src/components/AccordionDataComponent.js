import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ParagraphComponent } from './ParagraphComponent';
import { Modal } from 'react-bootstrap';
import { useCustomEventListener } from 'react-custom-events';

const MAX_HISTORY_RECORDS = 6;

function AccordionDataComponent(params) {
    const [collectionData, setCollectionData] = useState();
    const [isShowModal, setIsShowModal] = useState(false);
    const [historyData, setHistoryData] = useState();
    const [selectedDocument, setSelectedDocument] = useState();
    const [isExpandAll, setIsExpandAll] = useState(true);
    const [searchKey, setSearchKey] = useState('');
    const [currentHashValue, setcurrentHashValue] = useState('');
    const [pdfFileName, setPdfFileName] = useState('');
    const [pdfFileDisplayName, setpdfFileDisplayName] = useState('');
    const { commonConfigs } = params;
    const { data, styles, settings } = params.data;
    const selectedLanguage = params.lang;
    const { isEditMode, isPreview } = commonConfigs;
    let routerDomLocation = undefined;
    let treeData = undefined;
    let lastUpdatedHashValue = '';

    useCustomEventListener('treeItemClicked', (hash) => {
        setcurrentHashValue(hash);
    });

    useEffect(() => {
        let isUnmounted = false;
        getCustomCollectionPDFDetails();

        return () => {
            isUnmounted = true;
        };
    }, []);

    useEffect(() => {
        let isUnmounted = false;
        if (currentHashValue && currentHashValue !== '') {
            getDataFromHashValue(currentHashValue);
        }

        return () => {
            isUnmounted = true;
        };
    }, [currentHashValue]);

    useEffect(() => {
        let isUnmounted = false;

        getData(isUnmounted);

        return () => {
            isUnmounted = true;
        };
    }, [getLocationHashValue()]);

    function getData(isUnmounted) {
        if (
            !isUnmounted &&
            routerDomLocation &&
            routerDomLocation.hash &&
            routerDomLocation.hash !== ''
        ) {
            const treeSelectionHash = routerDomLocation.hash.substr(1);
            setcurrentHashValue(treeSelectionHash);
        }
    }

    function getDataFromHashValue(hashValue) {
        if (hashValue && hashValue !== '') {
            const selecetdParams = hashValue.split('/');

            if (selecetdParams) {
                if (selecetdParams.length >= 2) {
                    const treeId = selecetdParams[0];
                    const nodeId = selecetdParams[1];
                    let nodePath = '';
                    if (selecetdParams.length >= 3) {
                        nodePath = selecetdParams[2];
                    }

                    const requestParams = { treeId: treeId, nodeId: nodeId, nodePath: nodePath };
                    getCustomCollectionData(requestParams);
                }
            }
        }
    }

    function getLocationHashValue() {
        if (typeof location !== 'undefined' && routerDomLocation === undefined) {
            if (isPreview) {
                try {
                    routerDomLocation = useLocation();
                } catch (error) {
                    console.log('reactUseLocation error', error);
                }
            } else {
                routerDomLocation = location;
            }
        }

        if (routerDomLocation && routerDomLocation.hash) {
            return routerDomLocation.hash;
        } else {
            return '';
        }
    }

    function getCustomCollectionData(requestParamData) {
        if (requestParamData) {
            const jwt = localStorage.getItem('jwt-token');
            let requestUrl = '/api/tree/collection';
            let requestParams = {
                nameSpace: params.dbName,
                ...requestParamData,
            };

            if (isPreview) {
                requestUrl = '/api/custom-collections/tree/collection';
                requestParams = {
                    dbName: params.dbName,
                    ...requestParamData,
                };
            }

            const httpHeaders = {
                headers: {
                    Authorization: jwt,
                },
                params: requestParams,
            };

            Axios.get(requestUrl, httpHeaders)
                .then((result) => {
                    setCollectionData(result.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function getTitle(document) {
        if (
            document &&
            document.data &&
            document.data.fieldData &&
            document.data.fieldData[selectedLanguage.langKey]
        ) {
            if (
                settings &&
                settings.fieldMappings &&
                settings.fieldMappings.titleDataMap &&
                settings.fieldMappings.titleDataMap !== ''
            ) {
                const mappingName = settings.fieldMappings.titleDataMap
                    .toLocaleLowerCase()
                    .split(' ')
                    .join('_');
                return document.data.fieldData[selectedLanguage.langKey][mappingName];
            } else {
                return document.data.fieldData[selectedLanguage.langKey].entry_name;
            }
        } else {
            return '';
        }
    }

    function getDocumentParagraph(document) {
        if (
            document &&
            document.data &&
            document.data.fieldData &&
            document.data.fieldData[selectedLanguage.langKey]
        ) {
            if (
                settings &&
                settings.fieldMappings &&
                settings.fieldMappings.paragraphDataMap &&
                settings.fieldMappings.paragraphDataMap !== ''
            ) {
                const mappingName = settings.fieldMappings.paragraphDataMap
                    .toLocaleLowerCase()
                    .split(' ')
                    .join('_');
                return document.data.fieldData[selectedLanguage.langKey][mappingName];
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    function getDocumentUpdatedDate(document) {
        if (document && document.historyCount && document.historyCount > 1) {
            if (document.modifiedDate) {
                if (typeof document.modifiedDate === 'string') {
                    const dateObj = new Date(document.modifiedDate);
                    return dateObj.toLocaleDateString();
                } else {
                    return document.modifiedDate.toLocaleDateString();
                }
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    function getDocumentParagraphView(document) {
        try {
            const params = {
                styles: styles,
                data: { paragraph: getDocumentParagraph(document) },
            };

            return <ParagraphComponent data={params} />;
        } catch (error) {
            console.log('Document Paragraph Type Error', error);
            return <React.Fragment>{getDocumentParagraph(document)}</React.Fragment>;
        }
    }

    function getDocumentHistoryData(document) {
        if (
            document &&
            document.collection &&
            document.id &&
            document.collection !== '' &&
            document.id !== ''
        ) {
            const jwt = localStorage.getItem('jwt-token');
            let requestUrl = '/api/cms/collection/history';
            let requestParams = {
                nameSpace: params.dbName,
                id: document.id,
                collection: document.collection,
                limit: MAX_HISTORY_RECORDS,
            };

            if (isPreview) {
                requestUrl = '/api/custom-collections/history';
                requestParams = {
                    dbName: params.dbName,
                    id: document.id,
                    collection: document.collection,
                    limit: MAX_HISTORY_RECORDS,
                };
            }

            const httpHeaders = {
                headers: {
                    Authorization: jwt,
                },
                params: requestParams,
            };

            Axios.get(requestUrl, httpHeaders)
                .then((result) => {
                    setHistoryData(result.data);
                    setIsShowModal(true);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setHistoryData(undefined);
        }
    }

    function showRevisionHistory() {
        if (historyData && historyData.length > 0) {
            const historyDetailsView = historyData.map((document, index) => {
                return (
                    <div>
                        <div>{getRevisionTime(document)}</div>
                        <div>{getRevisionPargraphContent(document)}</div>
                    </div>
                );
            });

            return historyDetailsView;
        } else {
            return <React.Fragment></React.Fragment>;
        }
    }

    function getRevisionDocumentParagraph(document) {
        if (document && document.fieldData && document.fieldData[selectedLanguage.langKey]) {
            if (
                settings &&
                settings.fieldMappings &&
                settings.fieldMappings.paragraphDataMap &&
                settings.fieldMappings.paragraphDataMap !== ''
            ) {
                const mappingName = settings.fieldMappings.paragraphDataMap
                    .toLocaleLowerCase()
                    .split(' ')
                    .join('_');
                return document.fieldData[selectedLanguage.langKey][mappingName];
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    function getRevisionTime(document) {
        if (document && document.workflowState && document.workflowState.modifiedDate) {
            const modofiedDate = document.workflowState.modifiedDate;
            if (typeof modofiedDate === 'string') {
                const dateObj = new Date(modofiedDate);
                return dateObj.toLocaleDateString();
            } else {
                return modofiedDate.toLocaleDateString();
            }
        } else {
            return '';
        }
    }

    function getRevisionPargraphContent(document) {
        try {
            const params = {
                styles: styles,
                data: { paragraph: getRevisionDocumentParagraph(document) },
            };

            return <ParagraphComponent data={params} />;
        } catch (error) {
            console.log('Document Paragraph Type Error', error);
            return <React.Fragment>{getRevisionDocumentParagraph(document)}</React.Fragment>;
        }
    }

    function getLocationHref() {
        if (typeof location !== 'undefined') {
            return location.href;
        } else {
            return '';
        }
    }

    function getRevisionHistoryLink(document) {
        if (document && document.historyCount && document.historyCount > 1) {
            return (
                <a
                    onClick={() => {
                        setSelectedDocument(document);
                        getDocumentHistoryData(document);
                    }}
                    href={getLocationHref()}
                >
                    Get Revision History
                </a>
            );
        } else {
            return <React.Fragment></React.Fragment>;
        }
    }

    function getExpandCollapseText() {
        if (isExpandAll) {
            if (selectedLanguage.langKey.toLowerCase() === 'ar') {
                return 'طي الكل';
            } else {
                return 'Collapse All';
            }
        } else {
            if (selectedLanguage.langKey.toLowerCase() === 'ar') {
                return 'اظهار الكل';
            } else {
                return 'Expand All';
            }
        }
    }

    function getPrintToPDFText() {
        if (selectedLanguage.langKey.toLowerCase() === 'ar') {
            return 'طباعة الملف ';
        } else {
            return 'Print To PDF';
        }
    }

    function generateHtmlString() {
        let outputHtml = '';
        const accordionDetailed = document.getElementById('accordionDetailed');
        const children = accordionDetailed.children;
        const childElementCount = accordionDetailed.childElementCount;

        if (childElementCount > 0) {
            for (let index = 0; index < childElementCount; index++) {
                let outputChildHtml = '';
                const childElement = children[index];
                const expandedElement = childElement.getElementsByClassName('collapse show');

                if (expandedElement.length > 0) {
                    const cardHeaderElement = childElement.getElementsByClassName('card-header')[0];
                    const cardBodyElement = childElement.getElementsByClassName('card-body')[0];

                    outputChildHtml += '<div style="width:500px; padding: 16px; margin: 8px;">';
                    outputChildHtml +=
                        '<h5 style="font-family: Tajawal;font-weight: bold;font-size: 20px ;line-height: 20px;color: #C6974B;">';
                    outputChildHtml += cardHeaderElement.innerHTML;
                    outputChildHtml += '</h5>';
                    outputChildHtml +=
                        '<div style="font-family: Tajawal;font-weight: normal;font-size: 16px;line-height: 24px;color: #4B4C4D;">';
                    outputChildHtml += cardBodyElement.innerHTML;
                    outputChildHtml += '</div>';

                    outputChildHtml += '</div>';

                    outputHtml += outputChildHtml;
                }
            }
        }

        return outputHtml;
    }

    function printToPDF() {
        if (typeof window !== 'undefined') {
            // const head = document.getElementsByTagName('head');
            let domWindow = window.open('', '', 'height=600,width=920');
            domWindow.document.write('<html><head>');
            // if (head && head.length > 0) {
            //     domWindow.document.write(head[0].innerHTML);
            // }
            domWindow.document.write(
                `<link rel="preconnect" href="https://fonts.gstatic.com">
                <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;500;800&display=swap" rel="stylesheet">
                <style type="text/css">  
                    body {
                        background-color: #ffffff;
                        direction: ${
                            selectedLanguage.direction ? selectedLanguage.direction : 'ltr'
                        };
                        font-family: 'Tajawal', sans-serif;
                        font-size: 16px;
                    }
                    h5 {
                        border-bottom: 1px solid #EEEFF2;
                    }
                </style>`
            );
            domWindow.document.write('</head><body>');
            domWindow.document.write(generateHtmlString());
            domWindow.document.title = 'Rule Book';
            domWindow.document.write('</body></html>');
            domWindow.document.close();
            domWindow.focus();
            domWindow.print();
        }
    }

    function getSelectedChapterText() {
        let chapterTitle = '';
        if (collectionData && collectionData.traverse && collectionData.traverse.length > 0) {
            const chapterNode = collectionData.traverse[0];
            chapterTitle = chapterNode.localizeTitle[selectedLanguage.langKey.toLowerCase()];
        }

        return chapterTitle;
    }

    function getSearchPageURL() {
        let url = '#';

        if (
            settings &&
            settings.searchResultURL &&
            settings.searchResultURL.value &&
            settings.searchResultURL.value !== ''
        ) {
            if (selectedLanguage && selectedLanguage.langKey && selectedLanguage.langKey !== '') {
                const langKey = selectedLanguage.langKey.toLowerCase();

                url = settings.searchResultURL.value.toLowerCase();
                url = url.indexOf('/') == 0 ? url.substring(1) : url;
                url = url.indexOf(`${langKey}/`) == 0 ? url.substring(3) : url;

                url = `/${langKey}/${url}`;
            }
        }

        return url;
    }

    function getSerachText() {
        if (selectedLanguage.langKey.toLowerCase() === 'ar') {
            return 'بحث';
        } else {
            return 'Search';
        }
    }

    function getDownloadPDFText() {
        if (selectedLanguage.langKey.toLowerCase() === 'ar') {
            return 'تحميل الكتاب';
        } else {
            return 'Download PDF';
        }
    }

    function getCustomCollectionPDFDetails() {
        if (settings && settings.customReport) {
            const { collection, documentId, documentField } = settings.customReport;

            const jwt = localStorage.getItem('jwt-token');
            let requestUrl = '/api/cms/getSingleDocumentById';
            let requestParams = {
                nameSpace: params.dbName,
                searchId: documentId,
                collectionName: collection,
            };

            const httpHeaders = {
                headers: {
                    Authorization: jwt,
                },
                params: requestParams,
            };

            Axios.get(requestUrl, httpHeaders)
                .then((result) => {
                    if (result.data) {
                        const laguageFiledData = result.data.fieldData[selectedLanguage.langKey];
                        let mediaFileName = '';
                        let mediaFileDisplayName = '';
                        if (laguageFiledData && laguageFiledData[documentField]) {
                            mediaFileName = laguageFiledData[documentField];
                            mediaFileDisplayName = laguageFiledData.entry_name;
                        } else if (
                            result.data.fieldData.EN &&
                            result.data.fieldData.EN[documentField]
                        ) {
                            mediaFileName = result.data.fieldData.EN[documentField];
                            mediaFileDisplayName = result.data.fieldData.EN.entry_name;
                        }

                        setPdfFileName(mediaFileName);
                        setpdfFileDisplayName(mediaFileDisplayName);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-md-7 col-lg-8">
                    <h2>
                        <span>{getSelectedChapterText()}</span>
                    </h2>
                </div>
                <div className="col-md-5 col-lg-4"></div>
            </div>

            <div className="row">
                <div className="col-md-7 mb-2">
                    <div className="accordion-data-toolbar mb-3">
                        <button
                            className="toolbar-button expand"
                            onClick={() => {
                                setIsExpandAll((preState) => {
                                    if (preState === undefined) {
                                        return true;
                                    } else {
                                        return !preState;
                                    }
                                });
                            }}
                        >
                            {getExpandCollapseText()}
                        </button>
                        <button className="toolbar-button print" onClick={printToPDF}>
                            {getPrintToPDFText()}
                        </button>
                        {pdfFileName !== '' && (
                            <a className="toolbar-button download"
                                href={`/api/documents/${params.dbName}/${pdfFileName}`}
                                download={
                                    pdfFileDisplayName !== '' ? pdfFileDisplayName : pdfFileName
                                }
                            >
                                {getDownloadPDFText()}
                            </a>

                        )}
                    </div>
                </div>

                <form
                    className="col-md-5 mb-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (typeof window !== 'undefined' && !isPreview) {
                            window.open(`${getSearchPageURL()}#${searchKey}`, '_self');
                        }
                    }}
                >
                    <div className="input-group ">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchKey}
                            required
                            onChange={(e) => {
                                setSearchKey(e.target.value);
                            }}
                        />

                        <div className="input-group-append">
                            <button className="btn market-watch-button m-0" type="submit">
                                {getSerachText()}
                            </button>
                        </div>
                    </div>
                    {/* <a
                                href={`${getSearchPageURL()}${
                                    searchKey && searchKey.length > 0 ? '#' + searchKey : ''
                                }`}
                                className="btn market-watch-button mb-2"
                                
                            >
                                Search
                            </a> */}
                </form>
            </div>
            {collectionData && collectionData.data && (
                <React.Fragment>
                    <div id="accordionDetailed">
                        {collectionData.data.map((document, index) => {
                            let collapseClass = 'collapse';
                            if (isExpandAll === undefined) {
                                collapseClass = index === 0 ? 'collapse show' : 'collapse';
                            } else if (isExpandAll) {
                                collapseClass = 'collapse show';
                            } else {
                                collapseClass = 'collapse';
                            }

                            return (
                                <div
                                    key={document._id}
                                    className="card"
                                    id={`detailedInfoCradKey-${index}`}
                                >
                                    <div
                                        className="card-header btn"
                                        data-toggle="collapse"
                                        data-target={`#collapseDetailedInfoCrad${index}`}
                                        aria-expanded="true"
                                        aria-controls={`collapseDetailedInfoCrad${index}`}
                                        id={`detailedInfoCrad${index}`}
                                    >
                                        {/*  {getTitle(document) +
                                            '  ' +
                                            getDocumentUpdatedDate(document)} */}
                                        {getTitle(document)}
                                    </div>

                                    <div
                                        id={`collapseDetailedInfoCrad${index}`}
                                        className={collapseClass}
                                        aria-labelledby={`detailedInfoCrad${index}`}
                                        data-parent={`#detailedInfoCrad${index}`}
                                    >
                                        <div className="card-body">
                                            <div>{getDocumentParagraphView(document)}</div>
                                            {/* {getRevisionHistoryLink(document)} */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </React.Fragment>
            )}
            {/*   <Modal
                show={isShowModal}
                onHide={() => {
                    setIsShowModal(false);
                }}
                size="xl"
            >
                <Modal.Header closeButton>{getTitle(selectedDocument)}</Modal.Header>
                <Modal.Body>{showRevisionHistory()}</Modal.Body>
            </Modal> */}
        </React.Fragment>
    );
}

export default AccordionDataComponent;
