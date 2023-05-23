import Axios from 'axios';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch } from 'react-redux';
import { switchPage } from '../../../redux/action';
import { Button, Modal } from 'react-bootstrap';
import { PreviewPageComponent, ComponentsConfiguration as ComponenetModels } from 'ui-components';
import { v1 as uuidv1 } from 'uuid';
import LanguageModel from '../../../shared/models/LanguageModel';
import ColumnModel, {
    InnerColumnsModel,
    InnerSectionsModel,
} from '../../../shared/models/page-data-models/ColumnModel';
import PageModel from '../../../shared/models/page-data-models/PageModel';
import SectionModel from '../../../shared/models/page-data-models/SectionModel';
import CircledPlusIcon from '../../../shared/resources/CircledPlusIcon';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';
import PopupEditorComponent from '../../editor/contents-editor/popup-editor-component';
import PopupEditorSelectorComponent from '../../editor/contents-editor/popup-editor-selector-component';
import PopupEditorColumnSelectorComponent from '../../editor/layouts-editor/popup-editor-column-selector-component';
import PopupEditorInnerSectionsSelectorComponent from '../../editor/layouts-editor/popup-editor-inner-section-selector-component';
import PopupEditorLayoutStylesSelectorComponent from '../../editor/layouts-editor/popup-editor-layout-styles-component';
import { getComponentModel } from '../PagesPreviewUtils';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';

interface ParamsModel {
    key: string;
    data: PageModel;
    pageContentData: any; // TODO: Model
    database_name: string;
    siteLanguages: LanguageModel[];
    theme: any;
    editMode: boolean;
    setSelectedPageContentdata: any;
    updateCurrentPage: any;
    getAllPages: any;
    websiteObj: any;
    getAllPageDataFromDB: any;
    handleRecordUnlock: any;
}

const deviceSize = {
    extraSmall: '',
    small: 'sm',
    medium: 'md',
    large: 'lg',
    extraLarge: 'xl',
};

const GetPreviewComponent = (props: any) => {
    const { pageContentData, language, page, themes, editMode, dbName } = props;
    let contentData = pageContentData ? pageContentData[language?.langKey] : {};
    if (page) {
        let previewData = { contentData, page, themes };
        return (
            <PreviewPageComponent
                {...previewData}
                editMode={editMode}
                openComponentList={props.openComponentList}
                openInnerSectionsList={props.openInnerSectionsList}
                openLayoutStylesList={props.openLayoutStylesList}
                openComponentEditer={props.openComponentEditer}
                confirmeLayoutDelete={props.confirmeLayoutDelete}
                changeCurrentLayout={props.changeCurrentLayout}
                dbName={dbName}
                selectedLanguage={language}
                isPreview
            />
        );
    } else {
        return <></>;
    }
};

const PageContentComponent = forwardRef((params: ParamsModel, ref) => {
    const [page, setPage] = useState<any>(params.data);
    const [languages, setLanguages] = useState<LanguageModel[]>(params.siteLanguages);
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageModel>(
        params.siteLanguages[0]
    );

    const [pageContentData, setPageContentData] = useState<any>({});
    const [error, setError] = useState<any>(null);
    const [componentState, setcomponentState] = useState<any>(ComponenetModels.components[0]);
    const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
    const [isComponentListOpen, setIsComponentListOpen] = useState<boolean>(false);
    const [isInnerSectionsListOpen, setIsInnerSectionsListOpen] = useState<boolean>(false);
    const [isLayoutChangeSectionsListOpen, setIsLayoutChangeSectionsListOpen] =
        useState<boolean>(false);
    const [isColumnsListOpen, setIsColumnsListOpen] = useState<boolean>(false);
    const [isLayoutStylesListOpen, setIsLayoutStylesListOpen] = useState<boolean>(false);
    const [isLayoutDeleteConfirmationOpen, setLayoutDeleteConfirmationOpen] =
        useState<boolean>(false);
    const [activeColumn, setActiveColumn] = useState<any>({});
    const [activeInnerColumn, setActiveInnerColumn] = useState<any>({});
    const [activeLayoutType, setActiveLayoutType] = useState<string>('');
    const [activeLayoutId, setActiveLayoutId] = useState<string>('');
    const [addNewComponentBtnParams, setAddNewComponentBtnParams] = useState<any>({ type: '' });
    const [activeLayoutStyles, setActiveLayoutStyles] = useState<any>({});
    const [addedInnerSectionIndex, setAddedInnerSectionIndex] = useState<number>(0);
    const [layoutDeleteModalConfigs, setLayoutDeleteModalConfigs] = useState<any>({});
    const dbName = params.database_name;
    const pageId = page ? page._id : '';
    const themes = params.theme;
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [showResponsivePreview, setShowResponsivePreview] = useState<boolean>(false);
    const theme = themes[0];
    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted && page) {
            setPage(params.data);
        }

        return () => {
            isMounted = false;
        };
    }, [params.data]);

    useEffect(() => {
        let isMounted = true;

        if (isMounted && page) {
            // getAllPageData(dbName, page.pageData);
            setPageContentData(params.pageContentData);
        }

        return () => {
            isMounted = false;
        };
    }, [params.pageContentData /* page */]);

    // Not in use
    async function getAllPageData(dbName, pageData) {
        let pageDataIds = pageData.map((pageDataItem) => {
            return pageDataItem.id;
        });

        const result = await params.getAllPageDataFromDB(pageDataIds);
        let pageContentResult = {};

        if (result && result.data) {
            result.data.forEach((languageWiseContentData) => {
                const { _id, ...contentData } = languageWiseContentData;
                const langPageData = pageData.find((langPageData) => langPageData.id === _id);
                pageContentResult[langPageData.lang] = contentData;
            });
        }

        setPageContentData(pageContentResult);
        params.setSelectedPageContentdata(pageContentResult);
    }

    useImperativeHandle(ref, () => ({
        onComponentClick(innerColumn, componentModel, column) {
            if (componentModel) {
                setActiveColumn(column);
                setActiveInnerColumn(innerColumn);
                openEditorComponent(componentModel);
            } else {
                openComponentList(column, innerColumn);
            }
        },

        submitPageToDrafts(pageMetaInfo = {}) {
            submitPageData(pageMetaInfo);
        },

        openPreviewMode() {
            setShowPreview(true);
        },

        openResponsivePreviewMode() {
            setShowResponsivePreview(true);
        },

        setPageEditMode() {
            setEditMode();
        },
    }));

    function setEditMode() {
        params.setSelectedPageContentdata(pageContentData);
    }

    function onSubmitHanddle(data) {
        const { editorContentData, editorStyleData, editorSettingsData } = data;

        setIsEditorOpen(false);

        if (componentState.initialDataKey) {
            updateComponentData(
                editorContentData,
                componentState.initialDataKey,
                editorStyleData,
                editorSettingsData
            );
        } else {
            addNewComponentData(editorContentData, editorStyleData, editorSettingsData);
        }
    }

    function onSubmitLayoutStylesHanddle(layoutComponentStyle) {
        setIsLayoutStylesListOpen(false);
        setCurrentLayoutStyles(layoutComponentStyle);
    }

    function setCurrentLayoutStyles(layoutComponentStyle) {
        if (activeLayoutType === 'section') {
            page &&
                page.section.forEach((section: SectionModel, sectionIndex: number) => {
                    if (section.sectionId === activeLayoutId) {
                        page.section[sectionIndex].sectionStyles = layoutComponentStyle;
                    }
                });
        }

        if (activeLayoutType === 'column') {
            page &&
                page.section.forEach((section: SectionModel, sectionIndex: number) => {
                    section.columns.forEach((column: ColumnModel, columnIndex: number) => {
                        if (column.columnId === activeLayoutId) {
                            page.section[sectionIndex]['columns'][columnIndex].columnStyles =
                                layoutComponentStyle;
                        }
                    });
                });
        }

        if (activeLayoutType === 'innerSection') {
            page.section.forEach((section: SectionModel, sectionIndex: number) => {
                section.columns.forEach((column: ColumnModel, columnIndex: number) => {
                    column.section.forEach(
                        (innerSection: InnerSectionsModel, innerSectionIndex: number) => {
                            if (innerSection.sectionId === activeLayoutId) {
                                page.section[sectionIndex]['columns'][columnIndex]['section'][
                                    innerSectionIndex
                                ].sectionStyles = layoutComponentStyle;
                            }
                        }
                    );
                });
            });
        }

        if (activeLayoutType === 'innerColumn') {
            page &&
                page.section.forEach((section: SectionModel, sectionIndex: number) => {
                    section.columns.forEach((column: ColumnModel, columnIndex: number) => {
                        column.section.forEach(
                            (innerSection: InnerSectionsModel, innerSectionIndex: number) => {
                                innerSection.columns.forEach(
                                    (innerColumn: InnerColumnsModel, innerColumnIndex: number) => {
                                        if (innerColumn.columnId === activeLayoutId) {
                                            page.section[sectionIndex]['columns'][columnIndex][
                                                'section'
                                            ][innerSectionIndex]['columns'][
                                                innerColumnIndex
                                            ].columnStyles = layoutComponentStyle;
                                        }
                                    }
                                );
                            }
                        );
                    });
                });
        }

        params.updateCurrentPage(page);
    }

    function updateComponentData(data, dataId, editorStyleData, editorSettingsData) {
        updatePageData(data, dataId, editorStyleData, editorSettingsData);
    }

    function updatePageData(data, dataId, editorStyleData, editorSettingsData) {
        if (data) {
            const { id, ...uploadedFile } = data;

            Object.keys(uploadedFile).map((languageKey) => {
                let contentData = pageContentData[languageKey];
                let uploadComponentData = { id: dataId, ...uploadedFile[languageKey] };

                if (contentData) {
                    let isComponentFound = contentData.data.some((cmp, index) => {
                        if (cmp.id === dataId) {
                            contentData.data[index] = uploadComponentData;
                            return true;
                        }

                        return false;
                    });

                    if (!isComponentFound) {
                        contentData.data.push(uploadComponentData);
                    }
                } else {
                    let newPageComponentData = {
                        data: [uploadComponentData],
                    };
                    pageContentData[languageKey] = newPageComponentData;
                }
            });
        }
        // Update ui-properties and Settings
        page.section.forEach((section: SectionModel, sectionIndex: number) => {
            if (section.columns.length !== 0) {
                section.columns.forEach((column: ColumnModel, columnIndex: number) => {
                    if (column.columnId === activeColumn.columnId) {
                        if (column.section.length !== 0) {
                            column.section.map(
                                (innerSection: InnerSectionsModel, innerSectionIndex: number) => {
                                    if (innerSection.columns.length !== 0) {
                                        innerSection.columns.map(
                                            (
                                                innerColumn: InnerColumnsModel,
                                                innerColumnIndex: number
                                            ) => {
                                                if (
                                                    innerColumn.columnId ===
                                                    activeInnerColumn.columnId
                                                ) {
                                                    page.section[sectionIndex].columns[
                                                        columnIndex
                                                    ].section[innerSectionIndex].columns[
                                                        innerColumnIndex
                                                    ]['uiProperties'] = editorStyleData;
                                                    page.section[sectionIndex].columns[
                                                        columnIndex
                                                    ].section[innerSectionIndex].columns[
                                                        innerColumnIndex
                                                    ]['settings'] = editorSettingsData;
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    }
                });
            }
        });

        params.updateCurrentPage(page);
        params.setSelectedPageContentdata(pageContentData);
    }

    function addNewComponentData(data, editorStyleData, editorSettingsData) {
        const dataId = 'cmp-' + uuidv1();

        page &&
            page.section.forEach((section: SectionModel, sectionIndex: number) => {
                if (section.columns.length !== 0) {
                    section.columns.forEach((column: ColumnModel, columnIndex) => {
                        if (column.columnId === activeColumn.columnId) {
                            if (addNewComponentBtnParams?.type == 'addNewInnerSection') {
                                const innerSectionId = 'sec-' + uuidv1();
                                const innerColumnId = 'col-' + uuidv1();
                                const colClass = `col-${deviceSize[section.device]}`;

                                let innerSection: InnerSectionsModel = {
                                    sectionId: innerSectionId,
                                    sectionStyles: '',
                                    equalColumns: true,
                                    device: section.device,
                                    columns: [],
                                };

                                let innerColumn: InnerColumnsModel = {
                                    columnId: innerColumnId,
                                    columnSize: 12,
                                    columnStyles: {
                                        cssClass: colClass,
                                    },
                                    compType: componentState.compId,
                                    data: dataId,
                                    settings: editorSettingsData,
                                    uiProperties: editorStyleData,
                                };

                                innerSection.columns.push(innerColumn);

                                // Add new inner section to the active column
                                page.section[sectionIndex]['columns'][columnIndex][
                                    'section'
                                ].splice(
                                    addNewComponentBtnParams.innerSectionIndex,
                                    0,
                                    innerSection
                                );

                                setAddNewComponentBtnParams({ type: '' });
                                return;
                            }

                            if (addNewComponentBtnParams?.type == '') {
                                if (column.section.length !== 0) {
                                    column.section.map(
                                        (
                                            innerSection: InnerSectionsModel,
                                            innerSectionIndex: number
                                        ) => {
                                            if (innerSection.columns.length !== 0) {
                                                innerSection.columns.map(
                                                    (
                                                        innerColumn: InnerColumnsModel,
                                                        innerColumnIndex: number
                                                    ) => {
                                                        if (
                                                            innerColumn.columnId ===
                                                            activeInnerColumn.columnId
                                                        ) {
                                                            page.section[sectionIndex].columns[
                                                                columnIndex
                                                            ].section[innerSectionIndex].columns[
                                                                innerColumnIndex
                                                            ]['compType'] = componentState.compId;
                                                            page.section[sectionIndex].columns[
                                                                columnIndex
                                                            ].section[innerSectionIndex].columns[
                                                                innerColumnIndex
                                                            ]['data'] = dataId;
                                                            page.section[sectionIndex].columns[
                                                                columnIndex
                                                            ].section[innerSectionIndex].columns[
                                                                innerColumnIndex
                                                            ]['uiProperties'] = editorStyleData;
                                                            page.section[sectionIndex].columns[
                                                                columnIndex
                                                            ].section[innerSectionIndex].columns[
                                                                innerColumnIndex
                                                            ]['settings'] = editorSettingsData;
                                                        }
                                                    }
                                                );
                                            } else {
                                                console.log('Inner columns is empty');
                                            }
                                        }
                                    );
                                } else {
                                    const innerSectionId = 'sec-' + uuidv1();
                                    const innerColumnId = 'col-' + uuidv1();
                                    const colClass = `col-${deviceSize[section.device]}`;

                                    let innerSection: InnerSectionsModel = {
                                        sectionId: innerSectionId,
                                        sectionStyles: '',
                                        equalColumns: true,
                                        device: section.device,
                                        columns: [],
                                    };

                                    let innerColumn: InnerColumnsModel = {
                                        columnId: innerColumnId,
                                        columnSize: 12,
                                        columnStyles: {
                                            cssClass: colClass,
                                        },
                                        compType: componentState.compId,
                                        data: dataId,
                                        settings: editorSettingsData,
                                        uiProperties: editorStyleData,
                                    };

                                    innerSection.columns.push(innerColumn);

                                    // Add new inner section to the active column
                                    return page.section[sectionIndex]['columns'][columnIndex][
                                        'section'
                                    ].push(innerSection);
                                }
                            }
                        }
                    });
                } else {
                    console.log('Columns list is empty');
                }
            });

        params.updateCurrentPage(page);

        addPageData(data, dataId);
    }

    function addPageData(uploadedFile, dataId) {
        if (uploadedFile) {
            Object.keys(uploadedFile).map((languageKey) => {
                let contentData = pageContentData[languageKey];
                const uploadComponentData = { id: dataId, ...uploadedFile[languageKey] };

                if (contentData) {
                    contentData.data.push(uploadComponentData);
                } else {
                    const newPageComponentData = {
                        data: [uploadComponentData],
                    };
                    pageContentData[languageKey] = newPageComponentData;
                }
            });

            params.setSelectedPageContentdata(pageContentData);
        }
    }

    function addSelectedEmptySection(sectionModel) {
        const secID = 'sec-' + uuidv1();
        const { columnsCount, equalColumns, columnsSize, device } = sectionModel;

        let section: SectionModel = {
            sectionId: secID,
            sectionStyles: {
                cssClass: 'container mb-5 ',
            },
            equalColumns: equalColumns,
            device: device,
            columns: [],
        };

        if (equalColumns) {
            const columnSize = 12 / columnsCount;

            for (let index = 0; index < columnsCount; index++) {
                const columnId = 'col-' + uuidv1();
                const colClass = `col-${deviceSize[device]}`;

                let column = {
                    columnId: columnId,
                    columnSize: columnSize,
                    columnStyles: {
                        cssClass: colClass,
                    },
                    section: [],
                };

                section.columns.push(column);
            }
        } else {
            if (columnsSize.length !== 0) {
                columnsSize.forEach((selectedColumn, index) => {
                    const columnId = 'col-' + uuidv1();
                    const colClass = `col-${deviceSize[device]}-${selectedColumn.columnSize}`;

                    let column = {
                        columnId: columnId,
                        columnSize: selectedColumn.columnSize,
                        columnStyles: {
                            cssClass: colClass,
                        },
                        section: [],
                    };

                    section.columns.push(column);
                });
            }
        }

        page && page.section.push(section);
        setIsColumnsListOpen(false);
        params.updateCurrentPage(page);
        params.setSelectedPageContentdata(pageContentData);
    }

    function addSelectedEmptyInnerSection(sectionModel) {
        const innerSectionId = 'sec-' + uuidv1();
        const { columnsCount, equalColumns, columnsSize, device } = sectionModel;

        let innerSection: InnerSectionsModel = {
            sectionId: innerSectionId,
            sectionStyles: '',
            equalColumns: equalColumns,
            device: device,
            columns: [],
        };

        page &&
            page.section.forEach((section: SectionModel, sectionIndex: number) => {
                section.columns.forEach((column: ColumnModel, columnIndex: number) => {
                    if (column.columnId === activeColumn.columnId) {
                        if (equalColumns) {
                            const columnSize = 12 / columnsCount;

                            for (let index = 0; index < columnsCount; index++) {
                                const columnId = 'col-' + uuidv1();
                                const colClass = `col-${deviceSize[device]}`;

                                let innerColumn: InnerColumnsModel = {
                                    columnId: columnId,
                                    columnSize: columnSize,
                                    columnStyles: {
                                        cssClass: colClass,
                                    },
                                    compType: '',
                                    data: '',
                                    settings: {},
                                    uiProperties: {},
                                };

                                innerSection.columns.push(innerColumn);
                            }
                        } else {
                            if (columnsSize.length !== 0) {
                                columnsSize.forEach((selectedColumn, index) => {
                                    const columnId = 'col-' + uuidv1();
                                    const colClass = `col-${deviceSize[device]}-${selectedColumn.columnSize}`;

                                    let innerColumn: InnerColumnsModel = {
                                        columnId: columnId,
                                        columnSize: selectedColumn.columnSize,
                                        columnStyles: {
                                            cssClass: colClass,
                                        },
                                        compType: '',
                                        data: '',
                                        settings: {},
                                        uiProperties: {},
                                    };

                                    innerSection.columns.push(innerColumn);
                                });
                            }
                        }

                        return page.section[sectionIndex]['columns'][columnIndex]['section'].splice(
                            addedInnerSectionIndex,
                            0,
                            innerSection
                        );
                    }
                });
            });

        setIsColumnsListOpen(false);
        params.updateCurrentPage(page);
        params.setSelectedPageContentdata(pageContentData);
    }

    function openEditorComponent(componentModel) {
        setIsComponentListOpen(false);
        setcomponentState(componentModel);
        setIsEditorOpen(true);
    }

    function openLayoutStylesList(
        type: string,
        layoutId: string,
        layoutStyles: any,
        layoutCategory: string = ''
    ) {
        setIsLayoutStylesListOpen(true);
        setActiveLayoutType(type);
        setActiveLayoutId(layoutId);
        setActiveLayoutStyles(layoutStyles);
    }

    function closeLayoutStylesList() {
        setIsLayoutStylesListOpen(false);
    }

    function closeEditorComponent() {
        setIsEditorOpen(false);
    }

    function openComponentList(
        column: ColumnModel,
        innerColumn: InnerColumnsModel,
        btnParams: any = {}
    ) {
        setIsEditorOpen(false);
        setIsInnerSectionsListOpen(false);
        setIsComponentListOpen(true);
        setActiveColumn(column);

        if (Object.keys(innerColumn).length !== 0) {
            setActiveInnerColumn(innerColumn);
        }

        if (Object.keys(btnParams).length !== 0) {
            setAddNewComponentBtnParams(btnParams);
        }
    }

    function openInnerSectionsList(column: ColumnModel, sectionIndex: number) {
        setIsEditorOpen(false);
        setIsComponentListOpen(false);
        setIsInnerSectionsListOpen(true);
        setActiveColumn(column);
        setAddedInnerSectionIndex(sectionIndex);
    }

    function closeComponentList() {
        setIsComponentListOpen(false);
    }

    function closeInnerSectionsList() {
        setIsInnerSectionsListOpen(false);
    }

    function handleDropDownOnchange(event) {
        setSelectedLanguage(languages[parseInt(event.target.value)]);
    }

    function loadColumnSelectionModal() {
        setIsColumnsListOpen(true);
    }

    function handleClose() {
        setShowPreview(false);
    }

    function deleteSection(layoutIds: any) {
        const { sectionId } = layoutIds;
        const updatedPage: any = { ...page };
        const updatedPageContentData: any = { ...pageContentData };
        const results =
            updatedPage && updatedPage.section.find((section) => section.sectionId === sectionId);

        results?.columns.forEach((column) => {
            column &&
                column.section.forEach((innerSection) => {
                    innerSection &&
                        innerSection.columns.forEach((innerColumn) => {
                            const { data } = innerColumn;

                            if (data && data != '') {
                                if (updatedPageContentData && Array.isArray(languages)) {
                                    for (let language of languages) {
                                        const { langKey } = language;

                                        const contentDataIndex = updatedPageContentData[
                                            langKey
                                        ]?.data.findIndex((element) => element.id === data);

                                        if (contentDataIndex !== -1) {
                                            updatedPageContentData[langKey]?.data.splice(
                                                contentDataIndex,
                                                1
                                            );
                                        }
                                    }
                                }
                            }
                        });
                });
        });

        updatedPage &&
            updatedPage.section.splice(
                updatedPage.section.findIndex((section) => section.sectionId === sectionId),
                1
            );

        params.updateCurrentPage(updatedPage);
        params.setSelectedPageContentdata(updatedPageContentData);
        setLayoutDeleteConfirmationOpen(false);
    }

    function deleteInnerSection(layoutIds: any) {
        const { sectionId, columnId, innerSectionId } = layoutIds;
        const updatedPage: any = { ...page };
        const updatedPageContentData: any = { ...pageContentData };

        const innerSectionArray =
            updatedPage &&
            updatedPage.section
                .find((section) => section?.sectionId === sectionId)
                ?.columns?.find((column) => column?.columnId === columnId)?.section;

        const results =
            innerSectionArray &&
            innerSectionArray.find((innerSection) => innerSection.sectionId === innerSectionId);

        results &&
            results.columns.forEach((innerColumn) => {
                const { data } = innerColumn;

                if (data && data != '') {
                    if (updatedPageContentData && Array.isArray(languages)) {
                        for (let language of languages) {
                            const { langKey } = language;

                            const contentDataIndex = updatedPageContentData[
                                langKey
                            ]?.data.findIndex((element) => element.id === data);

                            if (contentDataIndex !== -1) {
                                updatedPageContentData[langKey]?.data.splice(contentDataIndex, 1);
                            }
                        }
                    }
                }
            });

        innerSectionArray &&
            innerSectionArray.splice(
                innerSectionArray.findIndex((section) => section.sectionId === innerSectionId),
                1
            );

        params.updateCurrentPage(updatedPage);
        params.setSelectedPageContentdata(updatedPageContentData);
        setLayoutDeleteConfirmationOpen(false);
    }

    function deleteUiComponent(layoutIds: any) {
        const { sectionId, columnId, innerSectionId, innerColumnId } = layoutIds;
        const updatedPage: any = { ...page };
        const updatedPageContentData: any = { ...pageContentData };

        const results =
            updatedPage &&
            updatedPage.section
                .find((section) => section?.sectionId === sectionId)
                ?.columns?.find((column) => column?.columnId === columnId)
                ?.section.find((section) => section?.sectionId === innerSectionId)
                ?.columns?.find((column) => column?.columnId === innerColumnId);

        if (results) {
            const innerColumn = { ...results };
            const { data } = innerColumn;

            if (data && data != '') {
                if (updatedPageContentData && Array.isArray(languages)) {
                    for (let language of languages) {
                        const { langKey } = language;

                        const contentDataIndex = updatedPageContentData[langKey]?.data.findIndex(
                            (element) => element.id === data
                        );

                        if (contentDataIndex !== -1) {
                            updatedPageContentData[langKey]?.data.splice(contentDataIndex, 1);
                        }
                    }
                }
            }

            results.compType = '';
            results.data = '';
            results.settings = {};
            results.uiProperties = {};
        }

        params.updateCurrentPage(updatedPage);
        params.setSelectedPageContentdata(updatedPageContentData);
        setLayoutDeleteConfirmationOpen(false);
    }

    async function submitPageData(pageMetaInfo: any = {}) {
        try {
            const previousPageObj = { ...page };
            const { _id, ...submitPageData } = page;
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);
            let updatedPageName = submitPageData?.pageName;

            if (pageMetaInfo && Object.keys(pageMetaInfo).length > 0) {
                const {
                    pageName,
                    masterTemplate,
                    path,
                    isHomePage,
                    isSearchDisabled,
                    ...metaInfo
                } = pageMetaInfo;
                submitPageData.pageName = pageName;
                submitPageData.masterTemplate = masterTemplate;
                submitPageData.path = path;
                submitPageData.isHomePage = isHomePage;
                submitPageData.isSearchDisabled = isSearchDisabled;
                submitPageData.pageInfo = metaInfo;
                updatedPageName = pageName;
            }

            const updatedPage = await Axios.put(
                '/api/pages/update',
                {
                    pageId: _id,
                    dbName: dbName,
                    pageData: submitPageData,
                    websiteId: params.websiteObj._id,
                },
                httpHeaders
            );

            const updatedPageData = await Axios.put(
                '/api/pages/data/update',
                {
                    dbName: dbName,
                    pageId: _id,
                    updatedPageContent: pageContentData,
                },
                httpHeaders
            );

            if (params.handleRecordUnlock) {
                await params.handleRecordUnlock(false);
            }

            if (updatedPage) {
                const { status, data } = updatedPage;

                if (status === 200 && data) {
                    const { ops, pageId } = data;

                    if (ops && Array.isArray(ops) && ops.length > 0) {
                        const { pageData } = ops[0];
                        params.updateCurrentPage({ _id: pageId, ...ops[0] });

                        if (
                            updatedPageData &&
                            pageData &&
                            Array.isArray(pageData) &&
                            pageData.length > 0
                        ) {
                            const { status, data } = updatedPageData;

                            if (status === 200 && data && Array.isArray(data) && data.length > 0) {
                                const pageDataItems: any = [];
                                let pageContentResult = {};

                                for (let dataItem of data) {
                                    const { ops, docObjId } = dataItem;

                                    if (ops && Array.isArray(ops) && ops.length > 0) {
                                        pageDataItems.push({ data: ops[0].data, id: docObjId });
                                    }
                                }

                                for (let languageWiseContentData of pageDataItems) {
                                    const { id, ...contentData } = languageWiseContentData;

                                    if (id) {
                                        const langPageData = pageData.find(
                                            (langPageData) => langPageData.id === id
                                        );
                                        pageContentResult[langPageData.lang] = contentData;
                                    }
                                }

                                params.setSelectedPageContentdata(pageContentResult);
                            }
                        }
                    }
                }
            }

            // Refresh the side bar navigator panel only if page path || page name has changed
            if (previousPageObj && submitPageData) {
                if (
                    previousPageObj.path !== submitPageData.path ||
                    previousPageObj.pageName !== submitPageData.pageName
                ) {
                    params.getAllPages();
                }
            }

            dispatch(switchPage(updatedPageName));
        } catch (error) {
            console.error(error);
        }
    }

    function confirmeLayoutDelete(layoutIds: any, layoutName: string) {
        setLayoutDeleteModalConfigs({
            layoutIds: layoutIds,
            layoutName: layoutName,
        });
        setLayoutDeleteConfirmationOpen(true);
    }

    function getLayoutDeleteModalTitle() {
        const { layoutName } = layoutDeleteModalConfigs;
        let title: string = '';

        switch (layoutName) {
            case 'section':
                title = 'Delete Main Section';
                break;
            case 'innerSection':
                title = 'Delete Inner Section';
                break;
            case 'innerColumn':
                title = 'Delete Component';
                break;
        }

        return title;
    }

    function getLayoutDeleteModalBody() {
        const { layoutName } = layoutDeleteModalConfigs;
        let modalBody: string = '';

        switch (layoutName) {
            case 'section':
                modalBody = 'Are you sure you want to delete this main section?';
                break;
            case 'innerSection':
                modalBody = 'Are you sure you want to delete this inner section?';
                break;
            case 'innerColumn':
                modalBody = 'Are you sure you want to delete this preview component?';
                break;
        }

        return modalBody;
    }

    function getLayoutDeleteModalFunction() {
        const { layoutName, layoutIds } = layoutDeleteModalConfigs;
        let modalBody: string = '';

        switch (layoutName) {
            case 'section':
                deleteSection(layoutIds);
                break;
            case 'innerSection':
                deleteInnerSection(layoutIds);
                break;
            case 'innerColumn':
                deleteUiComponent(layoutIds);
                break;
        }
    }

    function openComponentEditer(mainColumn, innerColumn) {
        const componentModelCopy = getComponentModel(
            innerColumn,
            ComponenetModels,
            pageContentData
        );

        setActiveColumn(mainColumn);
        setActiveInnerColumn(innerColumn);
        openEditorComponent(componentModelCopy);
    }

    function closeLayoutChangeSectionsList() {
        setIsLayoutChangeSectionsListOpen(false);
    }

    function changeSelectedSectionLayout(sectionModel) {
        const { columnsCount, equalColumns, columnsSize, device } = sectionModel;
        const updatedPage = { ...page };

        updatedPage.section.forEach((section, sectionIndex) => {
            const { sectionId, columns } = section;

            // Select the current section
            if (sectionId === activeLayoutId) {
                section.equalColumns = equalColumns;
                section.device = device;

                if (equalColumns) {
                    const columnSize = 12 / columnsCount;
                    const currentColumnsCount = page.section[sectionIndex].columns.length;

                    // If section has columns
                    if (currentColumnsCount > 0) {
                        // If current columns count is less than the selected columns count
                        // If user need to increase the columns count
                        if (currentColumnsCount < columnsCount) {
                            // Loop the columns array [For each columns]
                            for (let index = 0; index < columnsCount; index++) {
                                // If selected index exists in the columns array
                                // then change the necessary properties
                                if (page.section[sectionIndex].columns[index]) {
                                    const colClass = `col-${deviceSize[device]}`;
                                    const classesArray =
                                        columns[index].columnStyles.cssClass.split(' ');
                                    let updatedClassList = '';

                                    // Replase the duplicated layout classes [col-md]
                                    classesArray.forEach((clsName, clsNameIndex) => {
                                        if (clsName.length !== 0) {
                                            const colClass = clsName.indexOf(
                                                `col-${deviceSize[device]}`
                                            );

                                            if (colClass === -1) {
                                                updatedClassList += `${clsName} `;
                                            }
                                        }
                                    });

                                    columns[index].columnSize = columnSize;
                                    columns[
                                        index
                                    ].columnStyles.cssClass = `${updatedClassList} ${colClass} `;
                                } else {
                                    // If selected index does not exists in the columns array
                                    // then add new column at end of the columns array
                                    const columnId = 'col-' + uuidv1();
                                    const colClass = `col-${deviceSize[device]}`;

                                    let column = {
                                        columnId: columnId,
                                        columnSize: columnSize,
                                        columnStyles: {
                                            cssClass: colClass,
                                        },
                                        section: [],
                                    };

                                    section.columns.push(column);
                                }
                            }
                        }

                        // If columns count is equal
                        if (currentColumnsCount == columnsCount) {
                            // Loop the columns array [For each columns]
                            for (let index = 0; index < columnsCount; index++) {
                                if (page.section[sectionIndex].columns[index]) {
                                    const colClass = `col-${deviceSize[device]}`;
                                    const classesArray =
                                        columns[index].columnStyles.cssClass.split(' ');
                                    let updatedClassList = '';

                                    // Replase the duplicated layout classes [col-md]
                                    classesArray.forEach((clsName, clsNameIndex) => {
                                        if (clsName.length !== 0) {
                                            const colClass = clsName.indexOf(
                                                `col-${deviceSize[device]}`
                                            );

                                            if (colClass === -1) {
                                                updatedClassList += `${clsName} `;
                                            }
                                        }
                                    });

                                    columns[index].columnSize = columnSize;
                                    columns[
                                        index
                                    ].columnStyles.cssClass = `${updatedClassList} ${colClass} `;
                                }
                            }
                        }

                        // If current columns count is greater than the selected columns count
                        // If user need to decrease the columns count
                        if (currentColumnsCount > columnsCount) {
                            // Columns count which needs to remove from the section
                            const difference = currentColumnsCount - columnsCount;

                            // Loop for the difference then remove columns one by one
                            loop1: for (let index = 1; index <= difference; index++) {
                                let cmpRemoveIndex = currentColumnsCount - index;
                                // Updated columns count after removing a column
                                let finalColCount = page.section[sectionIndex].columns.length;

                                // Looping the updated columns array
                                loop2: for (
                                    let colIndex = 0;
                                    colIndex < finalColCount;
                                    colIndex++
                                ) {
                                    const innerSectionsLength = columns[colIndex].section.length;

                                    // Column has inner sections
                                    if (innerSectionsLength > 0) {
                                        let isCurrentColumnHasComponent = true;

                                        // Looping the inner sections array
                                        loop3: for (
                                            let iSecIndex = 0;
                                            iSecIndex < innerSectionsLength;
                                            iSecIndex++
                                        ) {
                                            const innerColumnsLength =
                                                columns[colIndex].section[iSecIndex].columns.length;

                                            // If inner section has inner columns
                                            if (innerColumnsLength > 0) {
                                                // Looping the inner columns
                                                loop4: for (
                                                    let iColIndex = 0;
                                                    iColIndex < innerColumnsLength;
                                                    iColIndex++
                                                ) {
                                                    const currentInnerColumn =
                                                        columns[colIndex].section[iSecIndex]
                                                            .columns[iColIndex];

                                                    // If current inner column does not have a component
                                                    // then sets the flag and go for next round
                                                    if (
                                                        currentInnerColumn &&
                                                        currentInnerColumn.data == ''
                                                    ) {
                                                        isCurrentColumnHasComponent = false;
                                                    } else {
                                                        // If current main column has atlease one component added then skip this column
                                                        // and look for next column
                                                        isCurrentColumnHasComponent = true;

                                                        break loop3;
                                                    }
                                                }
                                            }
                                        }

                                        // If current column does not have any component
                                        // then remove this main column from columns array
                                        if (!isCurrentColumnHasComponent) {
                                            cmpRemoveIndex = colIndex;

                                            break loop2;
                                        }
                                    } else {
                                        // If current column does not have any component
                                        // then remove this main column from columns array
                                        cmpRemoveIndex = colIndex;
                                        break loop2;
                                    }
                                }

                                section.columns.splice(cmpRemoveIndex, 1);
                            }

                            // Set the new values to the column properties in the final columns array of the section
                            // Loop the columns array [For each columns]
                            for (let index = 0; index < columnsCount; index++) {
                                if (page.section[sectionIndex].columns[index]) {
                                    const colClass = `col-${deviceSize[device]}`;
                                    const classesArray =
                                        columns[index].columnStyles.cssClass.split(' ');
                                    let updatedClassList = '';

                                    // Replase the duplicated layout classes [col-md]
                                    classesArray.forEach((clsName, clsNameIndex) => {
                                        if (clsName.length !== 0) {
                                            const colClass = clsName.indexOf(
                                                `col-${deviceSize[device]}`
                                            );

                                            if (colClass === -1) {
                                                updatedClassList += `${clsName} `;
                                            }
                                        }
                                    });

                                    columns[index].columnSize = columnSize;
                                    columns[
                                        index
                                    ].columnStyles.cssClass = `${updatedClassList} ${colClass} `;
                                }
                            }
                        }
                    } else {
                        // Selected section does not have any columns
                        console.log(
                            'Please add columns to the current section before changing the layout.'
                        );
                    }
                } else {
                    const currentColumnsCount = page.section[sectionIndex].columns.length;

                    // If section has columns
                    if (currentColumnsCount > 0) {
                        // If current columns count is less than the selected columns count
                        // If user need to increase the columns count
                        if (currentColumnsCount < columnsCount) {
                            // Loop the columns array [For each columns]
                            for (let index = 0; index < columnsCount; index++) {
                                const { columnSize } = columnsSize[index];

                                // If selected index exists in the columns array
                                // then change the necessary properties
                                // Otherwise add new empty column to the section
                                if (page.section[sectionIndex].columns[index]) {
                                    const colClass = `col-${deviceSize[device]}-${columnSize}`;
                                    const classesArray =
                                        columns[index].columnStyles.cssClass.split(' ');
                                    let updatedClassList = '';

                                    // Replase the duplicated layout classes [col-md]
                                    classesArray.forEach((clsName, clsNameIndex) => {
                                        if (clsName.length !== 0) {
                                            const colClass = clsName.indexOf(
                                                `col-${deviceSize[device]}`
                                            );

                                            if (colClass === -1) {
                                                updatedClassList += `${clsName} `;
                                            }
                                        }
                                    });

                                    columns[index].columnSize = columnSize;
                                    columns[
                                        index
                                    ].columnStyles.cssClass = `${updatedClassList} ${colClass} `;
                                } else {
                                    const columnId = 'col-' + uuidv1();
                                    const colClass = `col-${deviceSize[device]}-${columnSize}`;

                                    let column = {
                                        columnId: columnId,
                                        columnSize: columnSize,
                                        columnStyles: {
                                            cssClass: colClass,
                                        },
                                        section: [],
                                    };

                                    section.columns.push(column);
                                }
                            }
                        }

                        // If columns count is equal
                        if (currentColumnsCount == columnsCount) {
                            // Loop the columns array [For each columns]
                            for (let index = 0; index < columnsCount; index++) {
                                const { columnSize } = columnsSize[index];

                                // If selected index exists in the columns array
                                // then change the necessary properties
                                if (page.section[sectionIndex].columns[index]) {
                                    const colClass = `col-${deviceSize[device]}-${columnSize}`;
                                    const classesArray =
                                        columns[index].columnStyles.cssClass.split(' ');
                                    let updatedClassList = '';

                                    // Replase the duplicated layout classes [col-md]
                                    classesArray.forEach((clsName, clsNameIndex) => {
                                        if (clsName.length !== 0) {
                                            const colClass = clsName.indexOf(
                                                `col-${deviceSize[device]}`
                                            );

                                            if (colClass === -1) {
                                                updatedClassList += `${clsName} `;
                                            }
                                        }
                                    });

                                    columns[index].columnSize = columnSize;
                                    columns[
                                        index
                                    ].columnStyles.cssClass = `${updatedClassList} ${colClass} `;
                                }
                            }
                        }

                        // If current columns count is greater than the selected columns count
                        // If user need to decrease the columns count
                        if (currentColumnsCount > columnsCount) {
                            // Columns count which needs to remove from the section
                            const difference = currentColumnsCount - columnsCount;

                            // Loop for the difference then remove columns one by one
                            loop1: for (let index = 1; index <= difference; index++) {
                                let cmpRemoveIndex = currentColumnsCount - index;
                                // Updated columns count after removing a column
                                let finalColCount = page.section[sectionIndex].columns.length;

                                // Looping the updated columns array
                                loop2: for (
                                    let colIndex = 0;
                                    colIndex < finalColCount;
                                    colIndex++
                                ) {
                                    const innerSectionsLength = columns[colIndex].section.length;

                                    // Column has inner sections
                                    if (innerSectionsLength > 0) {
                                        let isCurrentColumnHasComponent = true;

                                        // Looping the inner sections array
                                        loop3: for (
                                            let iSecIndex = 0;
                                            iSecIndex < innerSectionsLength;
                                            iSecIndex++
                                        ) {
                                            const innerColumnsLength =
                                                columns[colIndex].section[iSecIndex].columns.length;

                                            // If inner section has inner columns
                                            if (innerColumnsLength > 0) {
                                                // Looping the inner columns
                                                loop4: for (
                                                    let iColIndex = 0;
                                                    iColIndex < innerColumnsLength;
                                                    iColIndex++
                                                ) {
                                                    const currentInnerColumn =
                                                        columns[colIndex].section[iSecIndex]
                                                            .columns[iColIndex];

                                                    // If current inner column does not have a component
                                                    // then sets the flag and go for next round
                                                    if (
                                                        currentInnerColumn &&
                                                        currentInnerColumn.data == ''
                                                    ) {
                                                        isCurrentColumnHasComponent = false;
                                                    } else {
                                                        // If current main column has atlease one component added then skip this column
                                                        // and look for next column
                                                        isCurrentColumnHasComponent = true;

                                                        break loop3;
                                                    }
                                                }
                                            }
                                        }

                                        // If current column does not have any component
                                        // then remove this main column from columns array
                                        if (!isCurrentColumnHasComponent) {
                                            cmpRemoveIndex = colIndex;

                                            break loop2;
                                        }
                                    } else {
                                        // If current column does not have any component
                                        // then remove this main column from columns array
                                        cmpRemoveIndex = colIndex;
                                        break loop2;
                                    }
                                }

                                section.columns.splice(cmpRemoveIndex, 1);
                            }

                            // Set the new values to the column properties in the final columns array of the section
                            // Loop the columns array [For each columns]
                            for (let index = 0; index < columnsCount; index++) {
                                const { columnSize } = columnsSize[index];

                                // If selected index exists in the columns array
                                // then change the necessary properties
                                if (page.section[sectionIndex].columns[index]) {
                                    const colClass = `col-${deviceSize[device]}-${columnSize}`;
                                    const classesArray =
                                        columns[index].columnStyles.cssClass.split(' ');
                                    let updatedClassList = '';

                                    // Replase the duplicated layout classes [col-md]
                                    classesArray.forEach((clsName, clsNameIndex) => {
                                        if (clsName.length !== 0) {
                                            const colClass = clsName.indexOf(
                                                `col-${deviceSize[device]}`
                                            );

                                            if (colClass === -1) {
                                                updatedClassList += `${clsName} `;
                                            }
                                        }
                                    });

                                    columns[index].columnSize = columnSize;
                                    columns[
                                        index
                                    ].columnStyles.cssClass = `${updatedClassList} ${colClass} `;
                                }
                            }
                        }
                    } else {
                        // Selected section does not have any columns
                        console.log(
                            'Please add columns to the current section before changing the layout.'
                        );
                    }
                }
            }
        });
    }

    function changeSelectedInnerSectionLayout(sectionModel) {
        // console.log(sectionModel);
        // console.log('-----------INNER SECTION-------------');
        // const { columnsCount, equalColumns, columnsSize, device } = sectionModel;
        // const updatedPage = { ...page };
        // updatedPage.section.forEach((section, sectionIndex) => {
        //     const { columns } = section;
        //     if (columns.length > 0) {
        //         columns.forEach((column, columnIndex) => {
        //             const { section } = column;
        //             if (section.length > 0) {
        //                 section.forEach((innerSection, innerSectionIndex) => {
        //                     const { sectionId, columns } = innerSection;
        //                     // Select the current section
        //                     if (sectionId === activeLayoutId) {
        //                         section.equalColumns = equalColumns;
        //                         section.device = device;
        //                         if (equalColumns) {
        //                             const columnSize = 12 / columnsCount;
        //                             const currentColumnsCount = columns.length;
        //                             // If section has columns
        //                             if (currentColumnsCount > 0) {
        //                                 // If current inner columns count is less than the selected inner columns count
        //                                 // If user need to increase the inner columns count
        //                                 if (currentColumnsCount < columnsCount) {
        //                                     console.log('---------------CURRENT COUNT IS LOW-------------');
        //                                     // Loop the columns array [For each columns]
        //                                     for (let index = 0; index < columnsCount; index++) {
        //                                         // If selected index exists in the columns array
        //                                         // then change the necessary properties
        //                                         if (columns[index]) {
        //                                             console.log('--------------IF-----------------');
        //                                             const colClass = `col-${deviceSize[device]}`;
        //                                             const classesArray = columns[index].columnStyles.cssClass.split(" ");
        //                                             let updatedClassList = "";
        //                                             // Replase the duplicated layout classes [col-md]
        //                                             classesArray.forEach((clsName, clsNameIndex) => {
        //                                                 if (clsName.length !== 0) {
        //                                                     const colClass = clsName.indexOf(`col-${deviceSize[device]}`);
        //                                                     if (colClass === -1) {
        //                                                         updatedClassList += `${clsName} `;
        //                                                     }
        //                                                 }
        //                                             })
        //                                             columns[index].columnSize = columnSize;
        //                                             columns[index].columnStyles.cssClass = `${updatedClassList} ${colClass} `;
        //                                         } else {
        //                                             console.log('--------------ELSE-----------------');
        //                                             // If selected index does not exists in the columns array
        //                                             // then add new column at end of the columns array
        //                                             const columnId = 'col-' + uuidv1();
        //                                             const colClass = `col-${deviceSize[device]}`;
        //                                             let column = {
        //                                                 columnId: columnId,
        //                                                 columnSize: columnSize,
        //                                                 columnStyles: {
        //                                                     cssClass: colClass,
        //                                                 },
        //                                                 section: [],
        //                                             };
        //                                             columns.push(column);
        //                                         }
        //                                     }
        //                                     // setPage((prevState) => {
        //                                     //     console.log(prevState);
        //                                     //     return prevState;
        //                                     // })
        //                                 }
        //                             } else {
        //                                 // Selected section does not have any columns
        //                                 console.log('Please add inner columns to the current inner section before changing the layout.');
        //                             }
        //                         }
        //                     }
        //                 })
        //             }
        //         })
        //     }
        // })
    }

    function handleChangeLayout(sectionModel) {
        if (activeLayoutType === 'section') {
            changeSelectedSectionLayout(sectionModel);
        }

        if (activeLayoutType === 'innerSection') {
            changeSelectedInnerSectionLayout(sectionModel);
        }
        setIsLayoutChangeSectionsListOpen(false);
    }

    function changeCurrentLayout(layoutName, activeLayoutId) {
        setActiveLayoutType(layoutName);
        setActiveLayoutId(activeLayoutId);
        setIsLayoutChangeSectionsListOpen(true);
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (page) {
        return (
            <>
                <div className="row">
                    <div className="col-md-10 offset-md-2">
                        {isEditorOpen && (
                            <PopupEditorComponent
                                dbName={dbName}
                                baseComponentData={componentState}
                                siteLanguageData={languages}
                                onSubmitHandle={onSubmitHanddle}
                                onClosePopup={closeEditorComponent}
                                show={isEditorOpen}
                                sections={page ? page.section : {}}
                                theme={theme}
                            />
                        )}

                        {isComponentListOpen && (
                            <PopupEditorSelectorComponent
                                onComponentSelected={openEditorComponent}
                                onClosePopup={closeComponentList}
                                show={isComponentListOpen}
                            />
                        )}
                        {isInnerSectionsListOpen && (
                            <PopupEditorInnerSectionsSelectorComponent
                                onColumnSelect={addSelectedEmptyInnerSection}
                                show={isInnerSectionsListOpen}
                                onClosePopup={closeInnerSectionsList}
                            />
                        )}
                        {isLayoutChangeSectionsListOpen && (
                            <PopupEditorInnerSectionsSelectorComponent
                                onColumnSelect={handleChangeLayout}
                                show={isLayoutChangeSectionsListOpen}
                                contentHeader="Change Your Layout Structure"
                                onClosePopup={closeLayoutChangeSectionsList}
                            />
                        )}
                        {isLayoutStylesListOpen && (
                            <PopupEditorLayoutStylesSelectorComponent
                                dbName={dbName}
                                show={isLayoutStylesListOpen}
                                activeLayoutType={activeLayoutType}
                                activeLayoutId={activeLayoutId}
                                activeLayoutStyles={activeLayoutStyles}
                                onSubmitHandle={onSubmitLayoutStylesHanddle}
                                onClosePopup={closeLayoutStylesList}
                                theme={theme}
                            />
                        )}
                    </div>
                </div>
                <div className="row">
                    <div
                        className="col-md-12 page__preview__container reset--parent"
                        style={
                            params.editMode === true
                                ? { paddingLeft: '0px', paddingRight: '0px' }
                                : {}
                        }
                    >
                        <GetPreviewComponent
                            pageContentData={pageContentData}
                            language={selectedLanguage}
                            page={page}
                            themes={themes}
                            editMode={params.editMode}
                            dbName={dbName}
                            openComponentList={openComponentList}
                            openInnerSectionsList={openInnerSectionsList}
                            openLayoutStylesList={openLayoutStylesList}
                            openComponentEditer={openComponentEditer}
                            confirmeLayoutDelete={confirmeLayoutDelete}
                            changeCurrentLayout={changeCurrentLayout}
                        />
                        <ConfirmationModal
                            modalTitle={getLayoutDeleteModalTitle()}
                            show={isLayoutDeleteConfirmationOpen}
                            handleClose={() => {
                                setLayoutDeleteConfirmationOpen(false);
                            }}
                            handleConfirme={() => {
                                getLayoutDeleteModalFunction();
                            }}
                        >
                            <p>{getLayoutDeleteModalBody()}</p>
                        </ConfirmationModal>
                    </div>
                </div>

                {params.editMode && (
                    <div className="row">
                        <div className="col-md-12">
                            <div
                                style={{
                                    border: '2px dashed #d5dadf',
                                    backgroundColor: 'hsla(0,0%,100%,.5)',
                                    textAlign: 'center',
                                    margin: '20px 40px',
                                    padding: '30px 40px',
                                    flexGrow: 1,
                                    boxSizing: 'border-box',
                                    position: 'relative',
                                }}
                            >
                                {!isColumnsListOpen && (
                                    <span
                                        className="d-inline-block"
                                        tabIndex={0}
                                        data-toggle="tooltip"
                                        title="Add New Section"
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={loadColumnSelectionModal}
                                    >
                                        <CircledPlusIcon width="35px" height="35px" />
                                    </span>
                                )}
                                {isColumnsListOpen && (
                                    <>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '0px',
                                                right: '15px',
                                                fontSize: '35px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => {
                                                setIsColumnsListOpen(false);
                                            }}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </div>
                                        <PopupEditorColumnSelectorComponent
                                            onColumnSelect={addSelectedEmptySection}
                                            contentHeader="Select Your Layout Structure"
                                            onClosePopup={undefined}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <Modal size="sm" show={showPreview} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Page Preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div
                            className="list-group list-template-select"
                            id="list-tab"
                            role="tablist"
                        >
                            {languages.map((languageItem: LanguageModel, index) => {
                                return (
                                    <a
                                        className={'btn btn-primary btn-block'}
                                        key={`LanguageSelection${index}`}
                                        data-toggle="list"
                                        role="tab"
                                        onClick={() => {
                                            handleClose();
                                            window.open(
                                                `/preview/${dbName}/${languageItem.langKey.toLowerCase()}/${pageId}`,
                                                '_blank'
                                            );
                                        }}
                                    >
                                        {languageItem.language}
                                    </a>
                                );
                            })}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    size="sm"
                    show={showResponsivePreview}
                    onHide={() => {
                        setShowResponsivePreview(false);
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Responsive Page Preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div
                            className="list-group list-template-select"
                            id="list-tab"
                            role="tablist"
                        >
                            {languages.map((languageItem: LanguageModel, index) => {
                                return (
                                    <a
                                        className={'btn btn-primary btn-block'}
                                        key={`LanguageSelection${index}`}
                                        data-toggle="list"
                                        role="tab"
                                        onClick={() => {
                                            handleClose();
                                            window.open(
                                                `/responsive-preview/${dbName}/${languageItem.langKey.toLowerCase()}/${pageId}`,
                                                '_blank'
                                            );
                                        }}
                                    >
                                        {languageItem.language}
                                    </a>
                                );
                            })}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowResponsivePreview(false);
                            }}
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    } else {
        return <></>;
    }
});

export default PageContentComponent;
