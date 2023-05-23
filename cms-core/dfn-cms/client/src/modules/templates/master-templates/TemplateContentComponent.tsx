import Axios from 'axios';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { PreviewPageComponent, ComponentsConfiguration as ComponenetModels } from 'ui-components';
import useForceUpdate from 'use-force-update';
import { v1 as uuidv1 } from 'uuid';
import PopupEditorComponent from '../../pages/editor/contents-editor/popup-editor-component';
import PopupEditorSelectorComponent from '../../pages/editor/contents-editor/popup-editor-selector-component';
import PopupEditorColumnSelectorComponent from '../../pages/editor/layouts-editor/popup-editor-column-selector-component';
import PopupEditorInnerSectionsSelectorComponent from '../../pages/editor/layouts-editor/popup-editor-inner-section-selector-component';
import PopupEditorLayoutStylesSelectorComponent from '../../pages/editor/layouts-editor/popup-editor-layout-styles-component';
import { getComponentModel } from '../../pages/preview/PagesPreviewUtils';
import LanguageModel from '../../shared/models/LanguageModel';
import ColumnModel, {
    InnerColumnsModel,
    InnerSectionsModel,
} from '../../shared/models/page-data-models/ColumnModel';
import SectionModel from '../../shared/models/page-data-models/SectionModel';
import TemplateModel from '../../shared/models/TemplateModel';
import CircledPlusIcon from '../../shared/resources/CircledPlusIcon';
import ConfirmationModal from '../../shared/ui-components/modals/confirmation-modal';
import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';
import { getInitialWorkflowState } from '../../shared/utils/WorkflowUtils';

interface ParamsModel {
    key: string;
    data: TemplateModel;
    theme: any;
    editMode: boolean;
    setSelectedTemplateContentdata: any;
    updateCurrentTemplate: any;
    database: any;
    siteLanguages: any;
    setUpdatedTemplate: any;
    getAllTemplateDataFromDB: any;
    getTemplateFromDB: any;
    unLockTheRecord: any;
}

const deviceSize = {
    extraSmall: '',
    small: 'sm',
    medium: 'md',
    large: 'lg',
    extraLarge: 'xl',
};

const GetPreviewComponent = (props: any) => {
    const { templateContentData, language, template, themes, editMode, dbName, section } = props;
    let contentData = templateContentData ? templateContentData[language?.langKey] : {};
    if (template) {
        let previewData = { contentData, template, themes };
        return (
            <PreviewPageComponent
                {...previewData}
                editMode={editMode}
                openComponentList={props.openComponentList}
                openInnerSectionsList={props.openInnerSectionsList}
                openLayoutStylesList={props.openLayoutStylesList}
                openComponentEditer={props.openComponentEditer}
                confirmeLayoutDelete={props.confirmeLayoutDelete}
                dbName={dbName}
                selectedLanguage={language}
                section={section}
                isPreview
            />
        );
    } else {
        return <></>;
    }
};

const TemplateContentComponent = forwardRef((params: ParamsModel, ref) => {
    const [isColumnsListOpen, setIsColumnsListOpen] = useState<boolean>(false);
    const [isFooterColumnsListOpen, setIsFooterColumnsListOpen] = useState<boolean>(false);

    const [template, setTemplate] = useState<any>(params.data);
    const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
    const [isComponentListOpen, setIsComponentListOpen] = useState<boolean>(false);
    const [isHeaderAdded, setIsHeaderAdded] = useState<boolean>(false);
    const [isFooterAdded, setIsFooterAdded] = useState<boolean>(false);
    const [activeColumn, setActiveColumn] = useState<any>({});
    const [activeInnerColumn, setActiveInnerColumn] = useState<any>({});
    const [templateContentData, setTemplateContentData] = useState<any>({});
    const [languages, setLanguages] = useState<LanguageModel[]>(params.siteLanguages);
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageModel>(
        params.siteLanguages[0]
    );
    const [editMode, setEditMode] = useState<boolean>(params.editMode);
    const [componentState, setComponentState] = useState<any>(ComponenetModels.components[0]);
    const [isInnerSectionsListOpen, setIsInnerSectionsListOpen] = useState<boolean>(false);
    const [layoutDeleteModalConfigs, setLayoutDeleteModalConfigs] = useState<any>({});
    const [isLayoutDeleteConfirmationOpen, setLayoutDeleteConfirmationOpen] = useState<boolean>(
        false
    );
    const [isLayoutStylesListOpen, setIsLayoutStylesListOpen] = useState<boolean>(false);
    const [activeLayoutType, setActiveLayoutType] = useState<string>('');
    const [activeLayoutId, setActiveLayoutId] = useState<string>('');
    const [activeLayoutCategory, setActiveLayoutCategory] = useState<string>('');
    const [addNewComponentBtnParams, setAddNewComponentBtnParams] = useState<any>({ type: '' });
    const [activeLayoutStyles, setActiveLayoutStyles] = useState<any>({});
    const [addedInnerSectionIndex, setAddedInnerSectionIndex] = useState<number>(0);
    const themes = params.theme;
    const database = params.database;
    const forceUpdate = useForceUpdate();
    const [type, setType] = useState<any>('header');
    const [error, setError] = useState<any>(null);
    const templateId = template._id;
    const theme = themes[0];

    useEffect(() => {
        let isMounted = true;

        if (isMounted && template) {
            getAllTemplateData(database, template);
        }

        return () => {
            isMounted = false;
        };
    }, [template]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setEditMode(params.editMode);
        }

        return () => {
            isMounted = false;
        };
    }, [params]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted && params && params.data) {
            setTemplate(params.data);
        }

        return () => {
            isMounted = false;
        };
    }, [params.data]);

    async function getAllTemplateData(dbName, templateData) {
        if (JSON.stringify(templateData.header.section) != '[]') {
            setIsHeaderAdded(true);
        }
        if (JSON.stringify(templateData.footer.section) != '[]') {
            setIsFooterAdded(true);
        }

        let templateDataIds = templateData.templateData.map((templateDataItem) => {
            return templateDataItem.id;
        });

        let templateContentResult = {};
        const result = await params.getAllTemplateDataFromDB(templateDataIds);

        if (result && result.data) {
            result.data.forEach((languageWiseContentData) => {
                const { _id, ...contentData } = languageWiseContentData;
                const langTemplateData = templateData.templateData.find(
                    (langTemplateData) => langTemplateData.id === _id
                );
                templateContentResult[langTemplateData.lang] = contentData;
            });
        }

        setTemplateContentData(templateContentResult);
        params.setSelectedTemplateContentdata(templateContentResult);
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

        template[type].section.push(section);
        params.updateCurrentTemplate(template);
        params.setSelectedTemplateContentdata(templateContentData);
        setEditMode(true);
        if (type == 'header') {
            setIsColumnsListOpen(false);
            setIsHeaderAdded(true);
        } else {
            setIsFooterColumnsListOpen(false);
            setIsFooterAdded(true);
        }
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

        template[type].section.forEach((section: SectionModel, sectionIndex: number) => {
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

                    return template[type].section[sectionIndex]['columns'][columnIndex][
                        'section'
                    ].splice(addedInnerSectionIndex, 0, innerSection);
                }
            });
        });

        setIsColumnsListOpen(false);
        params.updateCurrentTemplate(template);
        params.setSelectedTemplateContentdata(templateContentData);
    }

    function addSelectedFooterEmptySection(sectionModel) {
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

        template.footer.section.push(section);
        setIsFooterColumnsListOpen(false);
        params.updateCurrentTemplate(template);
        params.setSelectedTemplateContentdata(templateContentData);
        setEditMode(true);
        setIsFooterAdded(true);
    }

    function loadColumnSelectionModal() {
        setIsColumnsListOpen(true);
        setType('header');
    }

    function loadFooterColumnSelectionModal() {
        setIsFooterColumnsListOpen(true);
        setType('footer');
    }

    function openComponentList(
        column: ColumnModel,
        innerColumn: InnerColumnsModel,
        btnParams: any = {}
    ) {
        setIsEditorOpen(false);
        setIsComponentListOpen(true);
        setActiveColumn(column);

        if (Object.keys(innerColumn).length !== 0) {
            setActiveInnerColumn(innerColumn);
        }

        if (Object.keys(btnParams).length !== 0) {
            setAddNewComponentBtnParams(btnParams);
        }
    }

    function openInnerSectionsList(column, type) {
        setType(type);
        setIsEditorOpen(false);
        setIsComponentListOpen(false);
        setIsInnerSectionsListOpen(true);
        setActiveColumn(column);
    }

    function closeComponentList() {
        setIsComponentListOpen(false);
    }

    function closeInnerSectionsList() {
        setIsInnerSectionsListOpen(false);
    }

    function openEditorComponent(componentModel) {
        setIsComponentListOpen(false);
        setComponentState(componentModel);
        setIsEditorOpen(true);
    }

    function closeEditorComponent() {
        setIsEditorOpen(false);
    }

    function onSubmitHanddle(data) {
        const { editorContentData, editorStyleData, editorSettingsData } = data;
        setIsEditorOpen(false);
        if (editorContentData?.id) {
            updateComponentData(editorContentData, editorStyleData, editorSettingsData);
        } else {
            addNewComponentData(editorContentData, editorStyleData, editorSettingsData);
        }
    }

    function updateComponentData(data, editorStyleData, editorSettingsData) {
        updateTemplateData(data, data.id, editorStyleData, editorSettingsData);
    }

    function updateTemplateData(data, dataId, editorStyleData, editorSettingsData) {
        const { id, ...uploadedFile } = data;

        Object.keys(uploadedFile).map((languageKey) => {
            let contentData = templateContentData[languageKey];
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
                let newTemplateComponentData = {
                    data: [uploadComponentData],
                };
                templateContentData[languageKey] = newTemplateComponentData;
            }
        });

        // Update ui-properties
        template[type].section.forEach((section: SectionModel, sectionIndex: number) => {
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
                                                    template[type].section[sectionIndex].columns[
                                                        columnIndex
                                                    ].section[innerSectionIndex].columns[
                                                        innerColumnIndex
                                                    ]['uiProperties'] = editorStyleData;
                                                    template[type].section[sectionIndex].columns[
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
        params.updateCurrentTemplate(template);
        params.setSelectedTemplateContentdata(templateContentData);
    }

    function addNewComponentData(data, editorStyleData, editorSettingsData) {
        const dataId = 'cmp-' + uuidv1();
        template[type].section.forEach((section: SectionModel, sectionIndex: number) => {
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
                            template[type].section[sectionIndex]['columns'][columnIndex][
                                'section'
                            ].splice(addNewComponentBtnParams.innerSectionIndex, 0, innerSection);

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
                                                        template[type].section[
                                                            sectionIndex
                                                        ].columns[columnIndex].section[
                                                            innerSectionIndex
                                                        ].columns[innerColumnIndex]['compType'] =
                                                            componentState.compId;
                                                        template[type].section[
                                                            sectionIndex
                                                        ].columns[columnIndex].section[
                                                            innerSectionIndex
                                                        ].columns[innerColumnIndex][
                                                            'data'
                                                        ] = dataId;
                                                        template[type].section[
                                                            sectionIndex
                                                        ].columns[columnIndex].section[
                                                            innerSectionIndex
                                                        ].columns[innerColumnIndex][
                                                            'uiProperties'
                                                        ] = editorStyleData;
                                                        template[type].section[
                                                            sectionIndex
                                                        ].columns[columnIndex].section[
                                                            innerSectionIndex
                                                        ].columns[innerColumnIndex][
                                                            'settings'
                                                        ] = editorSettingsData;
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
                                return template[type].section[sectionIndex]['columns'][columnIndex][
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

        params.updateCurrentTemplate(template);
        addTemplateData(data, dataId);
    }

    function addTemplateData(uploadedFile, dataId) {
        if (uploadedFile) {
            Object.keys(uploadedFile).map((languageKey) => {
                let contentData = templateContentData[languageKey];
                const uploadComponentData = { id: dataId, ...uploadedFile[languageKey] };

                if (contentData) {
                    contentData.data.push(uploadComponentData);
                } else {
                    const newTemplateComponentData = {
                        data: [uploadComponentData],
                    };
                    templateContentData[languageKey] = newTemplateComponentData;
                }
            });

            params.setSelectedTemplateContentdata(templateContentData);
        }
    }

    useImperativeHandle(ref, () => ({
        onComponentClick(innerColumn, componentModel, columnData) {
            if (componentModel) {
                setActiveColumn(columnData);
                setActiveInnerColumn(innerColumn);
                openEditorComponent(componentModel);
            } else {
                openComponentList(columnData, innerColumn);
            }
        },

        submitTemplateToDrafts(templateInfo = undefined) {
            submitTemplateData(templateInfo);
        },
    }));

    async function getTemplate(templateId, dbName) {
        const result = await params.getTemplateFromDB(templateId);

        if (result && result.data) {
            params.setUpdatedTemplate(result.data);
            params.setSelectedTemplateContentdata(templateContentData);
        }
    }

    async function submitTemplateData(templateInfo) {
        try {
            const { _id, ...submitTemplateData } = template;

            if (templateInfo && Object.keys(templateInfo).length > 0) {
                const { title } = templateInfo;
                submitTemplateData.title = title;
                submitTemplateData.workflowState = getInitialWorkflowState(
                    'templates',
                    templateInfo.title,
                    'Template'
                );
            }

            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);

            await Axios.put(
                '/api/templates/update',
                {
                    templateId: _id,
                    dbName: database,
                    templateData: submitTemplateData,
                },
                httpHeaders
            );

            await Axios.post(
                '/api/template/content/update',
                {
                    dbName: database,
                    templateId: _id,
                    updatedTemplateContent: templateContentData,
                },
                httpHeaders
            );

            await params.unLockTheRecord();

            getTemplate(templateId, database);
            setEditMode(false);
        } catch (error) {
            console.error(error);
        }
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

    function deleteSection(layoutIds: any) {
        const { sectionId, masterTemplatesSection } = layoutIds;
        const updatedTemplate: any = { ...template };
        const updatedTemplateContentData: any = { ...templateContentData };
        const results =
            updatedTemplate &&
            updatedTemplate[masterTemplatesSection]?.section.find(
                (section) => section.sectionId === sectionId
            );

        results?.columns.forEach((column) => {
            column &&
                column.section.forEach((innerSection) => {
                    innerSection &&
                        innerSection.columns.forEach((innerColumn) => {
                            const { data } = innerColumn;

                            if (data && data != '') {
                                if (updatedTemplateContentData) {
                                    const contentDataIndex = updatedTemplateContentData[
                                        selectedLanguage?.langKey
                                    ]?.data.findIndex((element) => element.id === data);

                                    if (contentDataIndex !== -1) {
                                        updatedTemplateContentData[
                                            selectedLanguage?.langKey
                                        ]?.data.splice(contentDataIndex, 1);
                                    }
                                }
                            }
                        });
                });
        });

        if (updatedTemplate) {
            updatedTemplate[masterTemplatesSection]?.section.splice(
                updatedTemplate[masterTemplatesSection]?.section.findIndex(
                    (section) => section.sectionId === sectionId
                ),
                1
            );
        }

        params.updateCurrentTemplate(updatedTemplate);
        params.setSelectedTemplateContentdata(updatedTemplateContentData);
        setLayoutDeleteConfirmationOpen(false);
    }

    function deleteInnerSection(layoutIds: any) {
        const { sectionId, columnId, innerSectionId, masterTemplatesSection } = layoutIds;
        const updatedTemplate: any = { ...template };
        const updatedTemplateContentData: any = { ...templateContentData };

        const innerSectionArray =
            updatedTemplate &&
            updatedTemplate[masterTemplatesSection]?.section
                .find((section) => section?.sectionId === sectionId)
                ?.columns?.find((column) => column?.columnId === columnId)?.section;

        const results =
            innerSectionArray &&
            innerSectionArray.find((innerSection) => innerSection.sectionId === innerSectionId);

        results &&
            results.columns.forEach((innerColumn) => {
                const { data } = innerColumn;

                if (data && data != '') {
                    if (updatedTemplateContentData) {
                        const contentDataIndex = updatedTemplateContentData[
                            selectedLanguage?.langKey
                        ]?.data.findIndex((element) => element.id === data);

                        if (contentDataIndex !== -1) {
                            updatedTemplateContentData[selectedLanguage?.langKey]?.data.splice(
                                contentDataIndex,
                                1
                            );
                        }
                    }
                }
            });

        innerSectionArray &&
            innerSectionArray.splice(
                innerSectionArray.findIndex((section) => section.sectionId === innerSectionId),
                1
            );

        params.updateCurrentTemplate(updatedTemplate);
        params.setSelectedTemplateContentdata(updatedTemplateContentData);
        setLayoutDeleteConfirmationOpen(false);
    }

    function deleteUiComponent(layoutIds: any) {
        const {
            sectionId,
            columnId,
            innerSectionId,
            innerColumnId,
            masterTemplatesSection,
        } = layoutIds;
        const updatedTemplate: any = { ...template };
        const updatedTemplateContentData: any = { ...templateContentData };

        const results =
            updatedTemplate &&
            updatedTemplate[masterTemplatesSection]?.section
                .find((section) => section?.sectionId === sectionId)
                ?.columns?.find((column) => column?.columnId === columnId)
                ?.section.find((section) => section?.sectionId === innerSectionId)
                ?.columns?.find((column) => column?.columnId === innerColumnId);

        if (results) {
            const innerColumn = { ...results };
            const { data } = innerColumn;

            if (data && data != '') {
                if (updatedTemplateContentData) {
                    const contentDataIndex = updatedTemplateContentData[
                        selectedLanguage?.langKey
                    ]?.data.findIndex((element) => element.id === data);

                    if (contentDataIndex !== -1) {
                        updatedTemplateContentData[selectedLanguage?.langKey]?.data.splice(
                            contentDataIndex,
                            1
                        );
                    }
                }
            }

            results.compType = '';
            results.data = '';
            results.settings = {};
            results.uiProperties = {};
        }

        params.updateCurrentTemplate(updatedTemplate);
        params.setSelectedTemplateContentdata(updatedTemplateContentData);
        setLayoutDeleteConfirmationOpen(false);
    }

    function openLayoutStylesList(
        type: string,
        layoutId: string,
        layoutStyles: any,
        layoutCategory: string
    ) {
        setIsLayoutStylesListOpen(true);
        setActiveLayoutType(type);
        setActiveLayoutId(layoutId);
        setActiveLayoutStyles(layoutStyles);
        setActiveLayoutCategory(layoutCategory);
    }

    function openComponentEditer(mainColumn, innerColumn) {
        const componentModelCopy = getComponentModel(
            innerColumn,
            ComponenetModels,
            templateContentData
        );

        setActiveColumn(mainColumn);
        setActiveInnerColumn(innerColumn);
        openEditorComponent(componentModelCopy);
    }

    function confirmeLayoutDelete(layoutIds: any, layoutName: string) {
        setLayoutDeleteModalConfigs({
            layoutIds: layoutIds,
            layoutName: layoutName,
        });
        setLayoutDeleteConfirmationOpen(true);
    }

    function closeLayoutStylesList() {
        setIsLayoutStylesListOpen(false);
    }

    function setCurrentLayoutStyles(layoutComponentStyle) {
        if (activeLayoutType === 'section' && activeLayoutCategory.length !== 0) {
            template &&
                template[activeLayoutCategory].section.forEach(
                    (section: SectionModel, sectionIndex: number) => {
                        if (section.sectionId === activeLayoutId) {
                            template[activeLayoutCategory].section[
                                sectionIndex
                            ].sectionStyles = layoutComponentStyle;
                        }
                    }
                );
        }

        if (activeLayoutType === 'column' && activeLayoutCategory.length !== 0) {
            template &&
                template[activeLayoutCategory].section.forEach(
                    (section: SectionModel, sectionIndex: number) => {
                        section.columns.forEach((column: ColumnModel, columnIndex: number) => {
                            if (column.columnId === activeLayoutId) {
                                template[activeLayoutCategory].section[sectionIndex]['columns'][
                                    columnIndex
                                ].columnStyles = layoutComponentStyle;
                            }
                        });
                    }
                );
        }

        if (activeLayoutType === 'innerSection' && activeLayoutCategory.length !== 0) {
            template &&
                template[activeLayoutCategory].section.forEach(
                    (section: SectionModel, sectionIndex: number) => {
                        section.columns.forEach((column: ColumnModel, columnIndex: number) => {
                            column.section.forEach(
                                (innerSection: InnerSectionsModel, innerSectionIndex: number) => {
                                    if (innerSection.sectionId === activeLayoutId) {
                                        template[activeLayoutCategory].section[sectionIndex][
                                            'columns'
                                        ][columnIndex]['section'][
                                            innerSectionIndex
                                        ].sectionStyles = layoutComponentStyle;
                                    }
                                }
                            );
                        });
                    }
                );
        }

        if (activeLayoutType === 'innerColumn' && activeLayoutCategory.length !== 0) {
            template &&
                template[activeLayoutCategory].section.forEach(
                    (section: SectionModel, sectionIndex: number) => {
                        section.columns.forEach((column: ColumnModel, columnIndex: number) => {
                            column.section.forEach(
                                (innerSection: InnerSectionsModel, innerSectionIndex: number) => {
                                    innerSection.columns.forEach(
                                        (
                                            innerColumn: InnerColumnsModel,
                                            innerColumnIndex: number
                                        ) => {
                                            if (innerColumn.columnId === activeLayoutId) {
                                                template[activeLayoutCategory].section[
                                                    sectionIndex
                                                ]['columns'][columnIndex]['section'][
                                                    innerSectionIndex
                                                ]['columns'][
                                                    innerColumnIndex
                                                ].columnStyles = layoutComponentStyle;
                                            }
                                        }
                                    );
                                }
                            );
                        });
                    }
                );
        }
    }

    function onSubmitLayoutStylesHanddle(layoutComponentStyle) {
        setIsLayoutStylesListOpen(false);
        setCurrentLayoutStyles(layoutComponentStyle);
    }

    return (
        <>
            {/* <div className="text-right">
                <button className="btn btn-primary " onClick={submitTemplateData}>
                    Save
                </button>
            </div> */}
            <div className="row">
                <div className="col-md-10 offset-md-2">
                    {isEditorOpen && (
                        <PopupEditorComponent
                            dbName={database}
                            baseComponentData={componentState}
                            onSubmitHandle={onSubmitHanddle}
                            onClosePopup={closeEditorComponent}
                            siteLanguageData={languages}
                            show={isEditorOpen}
                            sections={[]}
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
                    {isLayoutStylesListOpen && (
                        <PopupEditorLayoutStylesSelectorComponent
                            dbName={database}
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

            {(isHeaderAdded || params.editMode) && <h5>Header Section</h5>}

            {isHeaderAdded && (
                <>
                    <div className="row">
                        <div className="col-md-12 page__preview__container reset--parent">
                            <GetPreviewComponent
                                templateContentData={templateContentData}
                                language={selectedLanguage}
                                template={template}
                                themes={themes}
                                editMode={params.editMode}
                                dbName={database}
                                section="header"
                                isPreview
                                openComponentList={(column, innerColumn, btnParams) => {
                                    setType('header');
                                    openComponentList(column, innerColumn, btnParams);
                                }}
                                openInnerSectionsList={(col) =>
                                    openInnerSectionsList(col, 'header')
                                }
                                openLayoutStylesList={(
                                    type,
                                    layoutId,
                                    layoutStyles,
                                    layoutCategory
                                ) => {
                                    setType('header');
                                    openLayoutStylesList(
                                        type,
                                        layoutId,
                                        layoutStyles,
                                        layoutCategory
                                    );
                                }}
                                openComponentEditer={(mainColumn, innerColumn) => {
                                    setType('header');
                                    openComponentEditer(mainColumn, innerColumn);
                                }}
                                confirmeLayoutDelete={(layoutIds, layoutName) => {
                                    setType('header');
                                    confirmeLayoutDelete(layoutIds, layoutName);
                                }}
                            />
                        </div>
                    </div>
                </>
            )}

            <div className="row">
                {params.editMode && (
                    <div className="col-md-12">
                        <div
                            style={{
                                border: '2px dashed #d5dadf',
                                backgroundColor: 'hsla(0,0%,100%,.5)',
                                textAlign: 'center',
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
                )}
            </div>

            {(params.editMode || isHeaderAdded || isFooterAdded) && (
                <div className="row" style={{ padding: '100px 0px' }}>
                    <div className="col-md-12 text-center">Page Body</div>
                </div>
            )}

            {(isFooterAdded || params.editMode) && <h5>Footer Section</h5>}
            {isFooterAdded && (
                <>
                    <div className="row">
                        <div className="col-md-12 page__preview__container reset--parent">
                            <GetPreviewComponent
                                templateContentData={templateContentData}
                                language={selectedLanguage}
                                template={template}
                                themes={themes}
                                editMode={params.editMode}
                                dbName={database}
                                section="footer"
                                isPreview
                                openComponentList={(column, innerColumn, btnParams) => {
                                    setType('footer');
                                    openComponentList(column, innerColumn, btnParams);
                                }}
                                openInnerSectionsList={(col) =>
                                    openInnerSectionsList(col, 'footer')
                                }
                                openLayoutStylesList={(
                                    type,
                                    layoutId,
                                    layoutStyles,
                                    layoutCategory
                                ) => {
                                    setType('footer');
                                    openLayoutStylesList(
                                        type,
                                        layoutId,
                                        layoutStyles,
                                        layoutCategory
                                    );
                                }}
                                openComponentEditer={(mainColumn, innerColumn) => {
                                    setType('footer');
                                    openComponentEditer(mainColumn, innerColumn);
                                }}
                                confirmeLayoutDelete={(layoutIds, layoutName) => {
                                    setType('footer');
                                    confirmeLayoutDelete(layoutIds, layoutName);
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
            <div className="row">
                {params.editMode && (
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
                            {!isFooterColumnsListOpen && (
                                <span
                                    className="d-inline-block"
                                    tabIndex={0}
                                    data-toggle="tooltip"
                                    title="Add New Section"
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                    onClick={loadFooterColumnSelectionModal}
                                >
                                    <CircledPlusIcon width="35px" height="35px" />
                                </span>
                            )}
                            {isFooterColumnsListOpen && (
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
                                            setIsFooterColumnsListOpen(false);
                                        }}
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </div>

                                    {/* need to set type to use generic function */}
                                    <PopupEditorColumnSelectorComponent
                                        onColumnSelect={addSelectedFooterEmptySection}
                                        contentHeader="Select Your Layout Structure"
                                        onClosePopup={undefined}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

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
        </>
    );
});

export default TemplateContentComponent;
