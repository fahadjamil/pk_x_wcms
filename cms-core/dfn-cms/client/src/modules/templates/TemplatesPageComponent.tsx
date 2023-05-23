import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import NavigatorPanelComponent from '../pages/preview/navigator-panel-component';
import { switchPage } from '../redux/action';
import MainMenuModel from '../shared/models/side-bar-menu-models/MainMenuModel';
import SubMenuModel from '../shared/models/side-bar-menu-models/SubMenuModel';
import SideBarComponent from '../shared/ui-components/SideBarComponent';
import SideBarMenuComponent from '../shared/ui-components/SideBarMenuComponent';
import TopPanelComponent from '../shared/ui-components/TopPanelComponent';
import AddTemplateComponent from './master-templates/AddTemplateComponent';
import TemplateContentComponent from './master-templates/TemplateContentComponent';
import ConfirmationModal from '../shared/ui-components/modals/confirmation-modal';
import TemplateInfoComponent from './master-templates/TemplateInfoComponent';
import {
    getAuthorizationHeader,
    getAuthorizationHeaderForDelete,
} from '../shared/utils/AuthorizationUtils';
import WorkflowComponent from '../workflows/WorkflowComponent';
import { getInitialWorkflowState, getUpdatedWorkflowState } from '../shared/utils/WorkflowUtils';
import WorkflowStateModel from '../shared/models/workflow-models/WorkflowStateModel';
import { WorkflowsStatus } from '../shared/config/WorkflowsStatus';
import TemplateHistoryComponent from './master-templates/TemplateHistoryComponent';
import masterRepository from '../shared/repository/MasterRepository';
import NotificationModal from '../shared/ui-components/modals/notification-modal';
import { getUserName } from '../shared/utils/UserUtils';
import { getFormattedDateTimeString } from '../shared/utils/DateTimeUtil';
import MasterRepository from '../shared/repository/MasterRepository';

interface RecordLockedDataModel {
    lockedBy: string;
    lockedDate: Date;
}

interface ResponseDataType {
    status: string;
    msg: string;
    updatedTemplateDoc?: any;
    lockingStatus?: {
        locked: boolean;
        lockedBy: string;
        lockedDate: Date;
    };
}

function TemplatesPageComponent(props) {
    const templatePageComponentRef: any = useRef();
    const templateInfoComponentRef: any = useRef();
    const dispatch = useDispatch();
    const [isVisibleAddTemplate, setIsVisibleAddTemplate] = useState<boolean>(false);
    const [isDuplicateTemplate, setIsDuplicateTemplate] = useState<boolean>(false);
    const [menuData, setMenuData] = useState<MainMenuModel[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(undefined);
    const [selectedTemplateId, setSelectedTemplateId] = useState<any>(undefined);
    const [selectedTemplateName, setSelectedTemplateName] = useState<any>(undefined);
    const [templateContentData, setTemplateContentData] = useState({});
    const [editMode, setEditMode] = useState<boolean>(false);
    const [isTemplateDeleteConfirmationModalOpen, setTemplateDeleteConfirmationModalOpen] =
        useState<boolean>(false);
    const [deletedTemplateId, setDeletedTemplateId] = useState<string>('');
    const [themes, setThemes] = useState([]);
    const [isNewTemplateAdded, setIsNewTemplateAdded] = useState<boolean>(false);
    const [isShowTemplateInfo, setIsShowTemplateInfo] = useState<boolean>(false);
    const [selectedTemplateWorkflowState, setSelectedTemplateWorkflowState] =
        useState<WorkflowStateModel>();
    const [isEmptyWorkflow, setIsEmptyWorkflow] = useState<boolean>(false);
    const [isShowHistory, setIsShowHistory] = useState<boolean>(false);
    const [isTemplateViewTabActive, setIsTemplateViewTabActive] = useState<boolean>(false);
    const [isRecordLocked, setIsRecordLocked] = useState<boolean>(false);
    const [isRecordLockedByThisUser, setIsRecordLockedByThisUser] = useState<boolean>(false);
    const [isRecordLockedModalShow, setIsRecordLockedModalShow] = useState<boolean>(false);
    const [isEditModeRecordUnLockModalShow, setIsEditModeRecordUnLockModalShow] =
        useState<boolean>(false);
    const [recordLockedData, setRecordLockedData] = useState<RecordLockedDataModel | undefined>(
        undefined
    );
    const [isManuallyShowContent, setIsManuallyShowContent] = useState<boolean>(false);
    const [responseData, setResponseData] = useState<ResponseDataType>({ status: '', msg: '' });
    const [activeMenuItemID, setActiveMenuItemID] = useState('');
    const activeUserId = masterRepository.getCurrentUser().docId;
    const database = props.website;
    const languages = props.lang;
    let isInitialLoad = true;

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setMenuData([]);
            setThemes([]);
            getAllThemes();
            getAllTemplates();
            setSelectedTemplate(undefined);
            dispatch(switchPage('Templates'));
        }

        return () => {
            isMounted = false;
        };
    }, [database]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            if (isInitialLoad) {
                if (selectedTemplate === undefined && !isNewTemplateAdded) {
                    if (themes.length > 0) {
                        if (menuData.length > 0 && menuData[0].subMenus.length > 0) {
                            if (menuData[0].subMenus.length > 0) {
                                let initialTemplate = menuData[0].subMenus[0].dataObject;
                                let menuText = menuData[0].subMenus[0].menuText;
                                let topMenuIndex = 0;
                                let subMenuIndex = 0;
                                const uniqueMenuName = menuText.replace(/[^A-Z0-9]+/gi, '_');
                                const subMenuId = `${uniqueMenuName}_${topMenuIndex}_${subMenuIndex}`;

                                setInitialTemplate(initialTemplate, menuText);
                                setActiveMenuItemID(subMenuId);
                            }
                        }
                    } else if (menuData.length > 0) {
                        getAllThemes();
                    }
                }
                isInitialLoad = false;
            }
        }

        return () => {
            isMounted = false;
        };
    }, [menuData, themes]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted && isNewTemplateAdded) {
            let initialTemplate = menuData[0].subMenus[menuData[0].subMenus.length - 1].dataObject;
            let menuText = menuData[0].subMenus[menuData[0].subMenus.length - 1].menuText;
            let topMenuIndex = 0;
            let subMenuIndex = menuData[0].subMenus.length - 1;
            const uniqueMenuName = menuText.replace(/[^A-Z0-9]+/gi, '_');
            const subMenuId = `${uniqueMenuName}_${topMenuIndex}_${subMenuIndex}`;

            setInitialTemplate(initialTemplate, menuText);
            setIsNewTemplateAdded(false);
            setActiveMenuItemID(subMenuId);
        }

        return () => {
            isMounted = false;
        };
    }, [menuData]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted && selectedTemplate) {
            const { template } = selectedTemplate;
            const { recordLocked } = template;

            setIsRecordLocked(() => {
                if (recordLocked) {
                    return true;
                }

                return false;
            });

            setIsRecordLockedByThisUser(() => {
                if (recordLocked) {
                    const { lockedBy, lockedDate } = recordLocked;

                    if (lockedBy === activeUserId) {
                        return true;
                    }
                }

                return false;
            });

            setRecordLockedData(() => {
                if (recordLocked) {
                    return { ...recordLocked };
                }

                return undefined;
            });
        }

        return () => {
            isMounted = false;
        };
    }, [selectedTemplate]);

    async function getAllTemplateDataFromDB(templateDataIds) {
        try {
            const headerParameter = { idList: templateDataIds };
            const httpHeaders = getAuthorizationHeader(headerParameter);

            const results = await Axios.get('/api/templates/content', httpHeaders);
            return results;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    async function getTemplateFromDB(templateId) {
        try {
            const headerParameter = { id: templateId };
            const httpHeaders = getAuthorizationHeader(headerParameter);

            const results = await Axios.get('/api/templates/data', httpHeaders);
            return results;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    function displayTemplateContent() {
        // setEditMode(false);
        // setIsVisiblePageContent(true);
        setIsVisibleAddTemplate(false);
        setIsDuplicateTemplate(false);
        getAllTemplates();
        setIsNewTemplateAdded(true);
    }

    function onCancel() {
        getAllTemplates();
    }

    function getAllTemplates() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: database,
        //     },
        // };

        Axios.get('/api/templates', httpHeaders)
            .then((result) => {
                let allMenuData: MainMenuModel[] = [];
                // TODO - Need to get menues and liked pages list forEach
                let topMenuObject: MainMenuModel = {
                    topMenuText: 'Templates',
                    topMenuID: 'TemplateComponent',
                    subMenus: [],
                };

                result.data.forEach((template) => {
                    let subMenuObject: SubMenuModel = {
                        menuText: template.title,
                        menuID: template._id,
                        dataObject: template,
                        notifiIcon: {},
                    };
                    topMenuObject.subMenus.push(subMenuObject);
                });

                allMenuData.push(topMenuObject);

                const cloneMenu = [...allMenuData];
                setMenuData(cloneMenu);

                // setIsLoaded(true);
            })
            .catch((err) => {
                // setIsLoaded(false);
                // setError(err);
                console.log(err);
            });
    }

    function setSelectedTemplateContentdata(selectedTemplateContentdata) {
        setTemplateContentData(selectedTemplateContentdata);
    }

    function updateCurrentTemplate(template) {
        if (selectedTemplate && selectedTemplate.template) {
            selectedTemplate.template = template;
            setSelectedTemplate({ ...selectedTemplate });
        }
    }

    function setUpdatedTemplate(template) {
        updateCurrentTemplate(template);
        getAllTemplates();
    }

    function setInitialTemplate(dataObject: any, title: string) {
        if (dataObject) {
            const templateDocument = {
                template: dataObject,
                id: dataObject._id,
                databasename: database,
                languages: languages,
            };
            setSelectedTemplate(templateDocument);
            dispatch(switchPage(title));
            setIsVisibleAddTemplate(false);
            setIsDuplicateTemplate(false);
            getSelectedTemplateWorkflowState(dataObject.workflowStateId);
        }
    }

    async function onMenuItemClicked(
        topMenuModel: MainMenuModel,
        subMenuModel: SubMenuModel,
        dataObject: any
    ) {
        const { _id } = dataObject;
        const templateObj: any = await getTemplateFromDB(_id);

        if (templateObj && templateObj.data) {
            const templateDocument = {
                template: templateObj.data,
                id: templateObj.data._id,
                databaseName: database,
                languages: languages,
            };

            setSelectedTemplate(templateDocument);
        }

        setSelectedTemplateWorkflowState(undefined);
        getSelectedTemplateWorkflowState(dataObject.workflowStateId);
        setIsVisibleAddTemplate(false);
        setIsDuplicateTemplate(false);
    }

    function getAllThemes() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: database,
        //     },
        // };

        Axios.get('/api/themes', httpHeaders)
            .then((result) => {
                setThemes(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function saveAsDraft() {
        if (
            templatePageComponentRef &&
            templatePageComponentRef.current &&
            templatePageComponentRef.current.submitTemplateToDrafts
        ) {
            if (selectedTemplateWorkflowState && selectedTemplateWorkflowState.id) {
                const resetWorkflow = getUpdatedWorkflowState(
                    WorkflowsStatus.initial,
                    selectedTemplateWorkflowState,
                    'Page edit & save as darft',
                    'templates'
                );
                onWorkflowSubmited(resetWorkflow);
            }

            let templateInfoData = undefined;

            if (
                templateInfoComponentRef &&
                templateInfoComponentRef.current &&
                templateInfoComponentRef.current.handleTemplateInfoSubmit
            ) {
                templateInfoData = templateInfoComponentRef.current.handleTemplateInfoSubmit();

                if (templateInfoData === undefined) {
                    return false;
                }
            }

            templatePageComponentRef.current.submitTemplateToDrafts(templateInfoData);

            setEditMode(false);

            if (isShowTemplateInfo) {
                setIsShowTemplateInfo(false);
                setIsShowHistory(false);
                setIsTemplateViewTabActive(false);
                setIsManuallyShowContent(true);
            }

            if (selectedTemplateWorkflowState === undefined) {
                getTemplate(selectedTemplate.id, database);
            }

            return true;
        }

        return false;
    }

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        // If user drops outside of the droppable zone
        if (!destination) {
            return;
        }

        // If user drops the item back into the the start position
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const typeStrArray = result.type ? result.type.split('_') : [];
        const draggableIdStrArray = draggableId ? draggableId.split('_') : [];

        // Get the last element from Array
        let templateSectionType = typeStrArray ? typeStrArray[typeStrArray.length - 1] : ''; // header | footer
        let type = typeStrArray ? typeStrArray[0] : ''; // sectionItem | innerSectionItem
        let draggableElementId = draggableIdStrArray ? draggableIdStrArray[0] : '';

        const newHeaderSections: any = Array.from(selectedTemplate.template.header?.section);
        const newFooterSections: any = Array.from(selectedTemplate.template.footer?.section);

        // If header section drag and drop occured
        if (templateSectionType === 'header') {
            // Main section darg and drop
            if (type === 'sectionItem') {
                // Source and destination both are same

                const newSection: any =
                    newHeaderSections &&
                    newHeaderSections.find((section, index) => {
                        return section.sectionId === draggableElementId;
                    });

                newHeaderSections.splice(source.index, 1);
                newHeaderSections.splice(destination.index, 0, newSection);

                const newSelectedTemplate = { ...selectedTemplate };
                newSelectedTemplate.template.header.section = newHeaderSections;

                setSelectedTemplate(newSelectedTemplate);
                return;
            }

            const destinationId = destination ? destination.droppableId.split('_')[0] : '';
            const innerSectionId = draggableId ? draggableId.split('_')[0] : '';
            let newColumn: any;

            // Get source column
            newHeaderSections &&
                newHeaderSections
                    .map((section, index) => {
                        const { columns } = section;
                        return (
                            columns &&
                            columns.find((column, columnIndex) => {
                                return column?.columnId === destinationId;
                            })
                        );
                    })
                    .filter((element) => {
                        // Filter for null | undefined values
                        return !!element;
                    })
                    .forEach((element) => (newColumn = element));

            const innerSectionsArray: any = Array.from(newColumn?.section);

            let newInnerSection = innerSectionsArray.find((section, index) => {
                return section.sectionId === innerSectionId;
            });

            innerSectionsArray.splice(source.index, 1);
            innerSectionsArray.splice(destination.index, 0, newInnerSection);

            newHeaderSections &&
                newHeaderSections.forEach((section) => {
                    section &&
                        section.columns.forEach((column) => {
                            if (column && column.columnId === newColumn.columnId) {
                                column.section = innerSectionsArray;
                            }
                        });
                });

            const newSelectedTemplate = { ...selectedTemplate };
            newSelectedTemplate.template.header.section = newHeaderSections;

            setSelectedTemplate(newSelectedTemplate);

            return;
        }

        // Otherwise footer change
        if (type === 'sectionItem') {
            // Source and destination both are same
            const newSection: any =
                newFooterSections &&
                newFooterSections.find((section, index) => {
                    return section.sectionId === draggableElementId;
                });

            newFooterSections.splice(source.index, 1);
            newFooterSections.splice(destination.index, 0, newSection);

            const newSelectedTemplate = { ...selectedTemplate };
            newSelectedTemplate.template.footer.section = newFooterSections;

            setSelectedTemplate(newSelectedTemplate);

            return;
        }

        const destinationId = destination ? destination.droppableId.split('_')[0] : '';
        const innerSectionId = draggableId ? draggableId.split('_')[0] : '';
        let newSection: any;

        // Get source column
        newFooterSections &&
            newFooterSections
                .map((section, index) => {
                    const { columns } = section;
                    return (
                        columns &&
                        columns.find((column, columnIndex) => {
                            return column?.columnId === destinationId;
                        })
                    );
                })
                .filter((element) => {
                    return !!element;
                })
                .forEach((element) => (newSection = element));

        const innerSectionsArray: any = Array.from(newSection?.section);

        let newInnerSection = innerSectionsArray.find((section, index) => {
            return section.sectionId === innerSectionId;
        });

        innerSectionsArray.splice(source.index, 1);
        innerSectionsArray.splice(destination.index, 0, newInnerSection);

        newFooterSections &&
            newFooterSections.forEach((section) => {
                section &&
                    section.columns.forEach((column) => {
                        if (column && column.columnId === newSection.columnId) {
                            column.section = innerSectionsArray;
                        }
                    });
            });

        const newSelectedTemplate = { ...selectedTemplate };
        setSelectedTemplate(newSelectedTemplate);

        return;
    };

    function deleteCurrentTemplate() {
        setTemplateDeleteConfirmationModalOpen(true);
        setDeletedTemplateId(selectedTemplate?.id);
    }

    function getTemplateDeleteModalTitle() {
        let title: string = '';

        if (deletedTemplateId && deletedTemplateId !== '') {
            if (deletedTemplateId === selectedTemplate?.id) {
                title = `Delete Template - ${selectedTemplate?.template?.title}`;
            }
        }

        return title;
    }

    async function handleTemplateDeteleConfimation() {
        if (selectedTemplate && deletedTemplateId === selectedTemplate.id) {
            // const jwt = localStorage.getItem('jwt-token');

            // const payload = {
            //     headers: {
            //         Authorization: jwt,
            //     },
            //     data: {
            //         dbName: database,
            //         templateId: deletedTemplateId,
            //         templateData: selectedTemplate.template?.templateData,
            //     },
            // };

            const headerParameter = {
                templateId: deletedTemplateId,
                templateData: selectedTemplate.template?.templateData,
                deletedBy: MasterRepository.getCurrentUser().docId,
            };
            const payload = getAuthorizationHeaderForDelete(headerParameter);

            // Delete template from templates drafts
            // Delete language wise template contents from template contents drafts
            await Axios.delete('/api/templates/delete', payload)
                .then((result) => {
                    const successState = result.data;
                    // Success message goes here
                })
                .catch((err) => {
                    console.log(err);
                });

            dispatch(switchPage('Templates'));
        }

        setTemplateDeleteConfirmationModalOpen(false);
        getAllTemplates();
        setSelectedTemplate(undefined);
    }

    function onWorkflowSubmited(updatedWorkflowState: WorkflowStateModel) {
        setSelectedTemplateWorkflowState(updatedWorkflowState);
        updateTemplateWorkflow(updatedWorkflowState);
    }

    function updateTemplateWorkflow(updatedWorkflowState) {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.post(
            '/api/workflow/templates/update',
            {
                pageId: selectedTemplate?.id,
                dbName: database,
                pageWorkflow: updatedWorkflowState,
            },
            httpHeaders
        )
            .then((res) => {})
            .catch((err) => {
                console.log('error', err);
            });
    }

    function getSelectedTemplateWorkflowState(templateWorkflowDocId) {
        if (templateWorkflowDocId) {
            const headerParameter = { id: templateWorkflowDocId };
            const httpHeaders = getAuthorizationHeader(headerParameter);

            setIsEmptyWorkflow(false);

            Axios.get('/api/workflow/state', httpHeaders)
                .then((result) => {
                    if (result && result.data) {
                        const { _id, ...workFlowStateData } = result.data;
                        const workflowState: WorkflowStateModel = { id: _id, ...workFlowStateData };
                        setSelectedTemplateWorkflowState(workflowState);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setIsEmptyWorkflow(true);
            setSelectedTemplateWorkflowState(undefined);
        }
    }

    function getTemplate(templateId, dbName) {
        const headerParameter = { id: templateId };
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
                getSelectedTemplateWorkflowState(result.data.workflowStateId);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function templateCheckedOut() {
        getAllTemplates();
        dispatch(switchPage('Templates'));
        setSelectedTemplate(undefined);
    }

    async function lockTheRecord() {
        try {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);
            const { template } = selectedTemplate;

            if (template && database) {
                const recordLocked = {
                    lockedBy: masterRepository.getCurrentUser().docId,
                    lockedDate: new Date(),
                };

                const { _id, ...pageObj } = template;

                const response = await Axios.post(
                    '/api/templates/record-lock',
                    {
                        templateId: _id,
                        dbName: database,
                        query: JSON.stringify({
                            $set: {
                                recordLocked: recordLocked,
                            },
                        }),
                        activeUserId: activeUserId,
                    },
                    httpHeaders
                );

                return response;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function unLockTheRecord() {
        try {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);
            const { template } = selectedTemplate;

            if (template && database) {
                const { _id, ...pageObj } = template;

                const response = await Axios.post(
                    '/api/templates/record-unlock',
                    {
                        templateId: _id,
                        dbName: database,
                        query: JSON.stringify({
                            $unset: { recordLocked: '' },
                        }),
                        activeUserId: activeUserId,
                    },
                    httpHeaders
                );

                return response;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleRecordUnlock() {
        if (!editMode) {
            const response: any = await unLockTheRecord();
            const { status, data } = response;

            if (status === 200) {
                setSelectedTemplate((prevState) => {
                    let state = { ...prevState };

                    if (data && data.updatedTemplateDoc) {
                        state.template = data.updatedTemplateDoc;

                        return state;
                    }
                    return state;
                });

                setResponseData(data);
                setTimeout(function () {
                    setResponseData({ status: '', msg: '' });
                }, 3000);
            }

            return false;
        }

        setIsEditModeRecordUnLockModalShow(true);
    }

    async function handleRecordLock() {
        const response: any = await lockTheRecord();
        const { status, data } = response;

        if (status === 200) {
            setSelectedTemplate((prevState) => {
                let state = { ...prevState };

                if (data && data.updatedTemplateDoc) {
                    state.template = data.updatedTemplateDoc;

                    return state;
                }
                return state;
            });

            setResponseData(data);
            setTimeout(function () {
                setResponseData({ status: '', msg: '' });
            }, 3000);
        }
    }

    function handleRecordLockStatus() {
        const { template } = selectedTemplate;

        if (template && database) {
            const { _id, ...pageObj } = template;
            const headerParameter = { id: _id };
            const httpHeaders = getAuthorizationHeader(headerParameter);

            Axios.get('/api/templates/locking-status', httpHeaders)
                .then((res) => {
                    const { status, data } = res;

                    if (status === 200) {
                        setIsRecordLocked(() => {
                            if (data && data.locked === true) {
                                return true;
                            }
                            return false;
                        });

                        setIsRecordLockedByThisUser(() => {
                            if (data && data.locked === true) {
                                if (data.lockedBy === activeUserId) {
                                    return true;
                                }
                            }
                            return false;
                        });

                        setRecordLockedData(() => {
                            if (data) {
                                const { locked, ...rest } = data;
                                return { ...rest };
                            }

                            return undefined;
                        });

                        if (data && data.locked === true && data.lockedBy !== activeUserId) {
                            setIsRecordLockedModalShow(true);
                            return false;
                        }
                    }
                })
                .catch((err) => {
                    console.log('error', err);
                });
        }
    }

    async function handleEditClick() {
        const response: any = await lockTheRecord();
        const { status, data } = response;

        if (status === 200) {
            setSelectedTemplate((prevState) => {
                let state = { ...prevState };

                if (data && data.updatedTemplateDoc) {
                    state.template = data.updatedTemplateDoc;

                    return state;
                }
                return state;
            });

            if (
                data &&
                data.lockingStatus &&
                data.lockingStatus.locked &&
                data.lockingStatus.lockedBy !== activeUserId
            ) {
                setIsRecordLockedModalShow(true);
                return false;
            }

            setIsShowTemplateInfo(false);
            setEditMode(true);
            setIsShowHistory(false);
            setIsTemplateViewTabActive(true);
            setIsManuallyShowContent(false);
        }
    }

    async function handleBackToTemplatesClick() {
        setEditMode(false);

        if (isShowTemplateInfo) {
            setIsShowTemplateInfo(false);
            setIsShowHistory(false);
            setIsTemplateViewTabActive(false);
            setIsManuallyShowContent(true);
        }

        const response: any = await unLockTheRecord();
        const { status, data } = response;

        if (status === 200) {
            setSelectedTemplate((prevState) => {
                let state = { ...prevState };

                if (data && data.updatedTemplateDoc) {
                    state.template = data.updatedTemplateDoc;

                    return state;
                }
                return state;
            });
        }
    }

    async function handleDiscardClick() {
        setEditMode(false);

        if (isShowTemplateInfo) {
            setIsShowTemplateInfo(false);
            setIsShowHistory(false);
            setIsTemplateViewTabActive(false);
            setIsManuallyShowContent(true);
        }

        const response: any = await unLockTheRecord();
        const { status, data } = response;

        if (status === 200) {
            setSelectedTemplate((prevState) => {
                let state = { ...prevState };

                if (data && data.updatedTemplateDoc) {
                    state.template = data.updatedTemplateDoc;

                    return state;
                }
                return state;
            });
        }
    }

    function duplicateCurrentTemplate() {
        const template = { ...selectedTemplate };

        setIsVisibleAddTemplate(true);
        setSelectedTemplateId(template?.id);
        setSelectedTemplateName(template?.template?.title);
        setSelectedTemplate(undefined);
        setIsNewTemplateAdded(false);
        setIsDuplicateTemplate(true);
        dispatch(switchPage('Duplicate Template'));
    }

    return (
        <>
            <aside className="main__sidebar">
                <div className="main__sidebar__content">
                    <SideBarComponent>
                        {editMode && (
                            <div>
                                <button
                                    className="btn float-left"
                                    style={{ color: '#42a5f5', height: '50px' }}
                                    onClick={handleBackToTemplatesClick}
                                >
                                    Back To Templates
                                </button>
                            </div>
                        )}

                        <div>
                            <button
                                className="btn btn-block"
                                style={{
                                    color: '#42a5f5',
                                    border: 'solid 1px #42a5f5',
                                    width: '95%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                                onClick={() => {
                                    setIsVisibleAddTemplate(true);
                                    setIsDuplicateTemplate(false);
                                    setSelectedTemplate(undefined);
                                    setIsNewTemplateAdded(false);
                                    dispatch(switchPage('Create New Template'));
                                }}
                            >
                                Add New Template
                            </button>
                        </div>

                        {editMode && (
                            <>
                                <NavigatorPanelComponent
                                    template={selectedTemplate.template}
                                    contentData={templateContentData}
                                    onDragEnd={onDragEnd}
                                    onComponentClick={
                                        templatePageComponentRef &&
                                        templatePageComponentRef.current &&
                                        templatePageComponentRef.current.onComponentClick
                                    }
                                />
                            </>
                        )}

                        {!editMode && (
                            <div>
                                <SideBarMenuComponent
                                    menuData={menuData}
                                    activeMenuItemID={activeMenuItemID}
                                    onMenuClicked={onMenuItemClicked}
                                    setActiveMenuItemID={setActiveMenuItemID}
                                />
                            </div>
                        )}
                    </SideBarComponent>
                </div>
            </aside>
            <main className="main__content ">
                <TopPanelComponent />
                <div className="page__content__container pt-0">
                    {responseData && responseData.status === 'success' && (
                        <div className="row">
                            <div className="col-md-12">
                                <div
                                    className="alert-float alert alert-success alert-dismissible fade show mt-2"
                                    role="alert"
                                >
                                    <strong>Success!</strong> {responseData.msg}
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="alert"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {responseData && responseData.status === 'failed' && (
                        <div className="row">
                            <div className="col-md-12">
                                <div
                                    className="alert-float alert alert-danger alert-dismissible fade show mt-2"
                                    role="alert"
                                >
                                    <strong>Failed!</strong> {responseData.msg}
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="alert"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="page__toolbar__container">
                        <div className="row">
                            <div className="col-md-4">
                                {selectedTemplate && (
                                    <div
                                        className="nav btn-toolbar btn-group"
                                        id="template-nav-tab"
                                        role="tablist"
                                    >
                                        {!editMode && !isShowHistory && (
                                            <a
                                                className="btn btn-primary nav-item nav-link active"
                                                onClick={handleEditClick}
                                            >
                                                Edit
                                            </a>
                                        )}
                                        {selectedTemplateWorkflowState &&
                                            selectedTemplateWorkflowState.state ==
                                                'pendingapproval' &&
                                            !isRecordLocked && (
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={handleRecordLock}
                                                >
                                                    <i className="btn-icon unlocked"></i>
                                                </button>
                                            )}
                                        {isRecordLocked && isRecordLockedByThisUser && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleRecordUnlock}
                                            >
                                                <i className="btn-icon unlockable"></i>
                                            </button>
                                        )}
                                        {isRecordLocked && !isRecordLockedByThisUser && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleRecordLockStatus}
                                            >
                                                <i className="btn-icon locked"></i>
                                            </button>
                                        )}
                                        {(editMode || isShowHistory) && (
                                            <a
                                                className={`btn btn-primary nav-item nav-link ${
                                                    isTemplateViewTabActive ? 'active' : ''
                                                }`}
                                                id="template-nav-edit-tab"
                                                data-toggle="tab"
                                                href="#template-nav-edit"
                                                role="tab"
                                                aria-controls="template-nav-edit"
                                                aria-selected="true"
                                                onClick={() => {
                                                    setEditMode(false);
                                                    setIsShowTemplateInfo(false);
                                                    setIsShowHistory(false);
                                                    setIsTemplateViewTabActive(true);
                                                    setIsManuallyShowContent(false);
                                                }}
                                            >
                                                Template View
                                            </a>
                                        )}
                                        {editMode && (
                                            <>
                                                <a
                                                    className={`btn btn-primary nav-item nav-link ${
                                                        isShowTemplateInfo ? 'active' : ''
                                                    }`}
                                                    id="template-nav-info-tab"
                                                    data-toggle="tab"
                                                    href="#template-nav-info"
                                                    role="tab"
                                                    aria-controls="template-nav-info"
                                                    aria-selected="true"
                                                    onClick={() => {
                                                        setIsShowTemplateInfo(true);
                                                        setIsShowHistory(false);
                                                        setIsTemplateViewTabActive(false);
                                                        setIsManuallyShowContent(false);
                                                    }}
                                                >
                                                    Template Info
                                                </a>
                                            </>
                                        )}
                                        <a
                                            className={`btn btn-primary nav-item nav-link ${
                                                isShowHistory ? 'active' : ''
                                            }`}
                                            id="template-nav-history-tab"
                                            data-toggle="tab"
                                            href="#template-nav-history"
                                            role="tab"
                                            aria-controls="template-nav-history"
                                            aria-selected="false"
                                            onClick={() => {
                                                setIsShowTemplateInfo(false);
                                                setIsShowHistory(true);
                                                setIsTemplateViewTabActive(false);
                                                setIsManuallyShowContent(false);
                                            }}
                                        >
                                            History
                                        </a>
                                    </div>
                                )}

                                {isVisibleAddTemplate && (
                                    <AddTemplateComponent
                                        isDuplicateTemplate={isDuplicateTemplate}
                                        selectedTemplateId={selectedTemplateId}
                                        selectedTemplateName={selectedTemplateName}
                                        onSubmitSuccess={displayTemplateContent}
                                        onCancel={onCancel}
                                        setResponseData={setResponseData}
                                    />
                                )}
                            </div>
                            {!isVisibleAddTemplate && !isEmptyWorkflow && (
                                <div className="col-md-4">
                                    <div className="d-flex flex-row align-items-center justify-content-center">
                                        <WorkflowComponent
                                            selectedWorkflowState={selectedTemplateWorkflowState}
                                            onSubmitWorkflow={onWorkflowSubmited}
                                            dbName={props.dbName}
                                            currentPageId={props.templateId}
                                            isShowCurrentFlow
                                            collectionName="templates"
                                        />
                                    </div>
                                </div>
                            )}
                            {!isVisibleAddTemplate && isEmptyWorkflow && (
                                <div className="col-md-4">
                                    <div className="d-flex flex-row align-items-center justify-content-center">
                                        <div className="btn-toolbar ml-1 mr-2">
                                            <button
                                                type="button"
                                                className="btn btn-tertiary mr-2"
                                                data-toggle="modal"
                                                data-target="#PopupWorkflowModal"
                                            >
                                                Workflow
                                                <span className="ml-1 mr-2">
                                                    <span
                                                        className="badge"
                                                        style={{
                                                            backgroundColor: '#28a745',
                                                            color: '#ffffff',
                                                        }}
                                                    >
                                                        Approved
                                                    </span>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {selectedTemplate && (
                                <div className="col-md-4">
                                    {editMode && (
                                        <>
                                            <button
                                                className="btn btn-outline-primary mr-2"
                                                onClick={saveAsDraft}
                                                disabled={!editMode}
                                            >
                                                Save as Draft
                                            </button>
                                            <button
                                                className="btn btn-secondary mr-2"
                                                onClick={handleDiscardClick}
                                                disabled={!editMode}
                                            >
                                                Discard
                                            </button>
                                        </>
                                    )}
                                    {selectedTemplate && !editMode && (
                                        <button
                                            className="btn btn-outline-primary mr-2 float-right"
                                            onClick={duplicateCurrentTemplate}
                                        >
                                            Duplicate
                                        </button>
                                    )}
                                    {selectedTemplate && !editMode && (
                                        <button
                                            className="btn btn-outline-primary mr-2 float-right"
                                            onClick={deleteCurrentTemplate}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {!isVisibleAddTemplate && selectedTemplate && (
                        <>
                            <div className="tab-content" id="template-nav-tabContent">
                                <div
                                    className={`tab-pane fade active show ${
                                        isManuallyShowContent ? 'active show' : ''
                                    }`}
                                    id="template-nav-edit"
                                    role="tabpanel"
                                    aria-labelledby="template-nav-edit-tab"
                                >
                                    <TemplateContentComponent
                                        key={selectedTemplate.id}
                                        data={selectedTemplate.template}
                                        setSelectedTemplateContentdata={
                                            setSelectedTemplateContentdata
                                        }
                                        updateCurrentTemplate={updateCurrentTemplate}
                                        siteLanguages={selectedTemplate.languages}
                                        editMode={editMode}
                                        theme={themes}
                                        database={database}
                                        ref={templatePageComponentRef}
                                        setUpdatedTemplate={setUpdatedTemplate}
                                        getAllTemplateDataFromDB={getAllTemplateDataFromDB}
                                        getTemplateFromDB={getTemplateFromDB}
                                        unLockTheRecord={unLockTheRecord}
                                    />
                                </div>
                                {editMode && (
                                    <div
                                        className="tab-pane fade"
                                        id="template-nav-info"
                                        role="tabpanel"
                                        aria-labelledby="template-nav-info-tab"
                                    >
                                        <TemplateInfoComponent
                                            key={selectedTemplate.id}
                                            ref={templateInfoComponentRef}
                                            currentTemplate={selectedTemplate}
                                        />
                                    </div>
                                )}
                                <div
                                    className="tab-pane fade"
                                    id="template-nav-history"
                                    role="tabpanel"
                                    aria-labelledby="template-nav-history-tab"
                                >
                                    <div className="mt-4">
                                        <TemplateHistoryComponent
                                            database_name={database}
                                            templateId={selectedTemplate.id}
                                            workflowStatus={selectedTemplateWorkflowState?.state}
                                            checkOutHandlder={templateCheckedOut}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <ConfirmationModal
                    modalTitle={getTemplateDeleteModalTitle()}
                    show={isTemplateDeleteConfirmationModalOpen}
                    handleClose={() => {
                        setTemplateDeleteConfirmationModalOpen(false);
                    }}
                    handleConfirme={handleTemplateDeteleConfimation}
                >
                    <p>"Are you sure you want to delete this template?"</p>
                </ConfirmationModal>
                {isRecordLockedModalShow && (
                    <NotificationModal
                        modalTitle="Record Already Locked"
                        show={isRecordLockedModalShow}
                        titleTextClass="text-info"
                        handleClose={() => {
                            setIsRecordLockedModalShow(false);
                        }}
                    >
                        <div className="alert alert-info" role="alert">
                            <strong>This record has already been locked.</strong>
                            <hr />
                            {recordLockedData && recordLockedData.lockedBy && (
                                <p>Record locked by - {getUserName(recordLockedData.lockedBy)}</p>
                            )}
                            {recordLockedData && recordLockedData.lockedDate && (
                                <p>
                                    Record locked date -{' '}
                                    {getFormattedDateTimeString(recordLockedData.lockedDate)}
                                </p>
                            )}
                        </div>
                    </NotificationModal>
                )}
                {isEditModeRecordUnLockModalShow && (
                    <NotificationModal
                        modalTitle="Failed To Unlock"
                        show={isEditModeRecordUnLockModalShow}
                        titleTextClass="text-danger"
                        handleClose={() => {
                            setIsEditModeRecordUnLockModalShow(false);
                        }}
                    >
                        <div className="alert alert-danger" role="alert">
                            <strong>
                                You can not unlock a record in the edit mode. Please save the record
                                in order to unlock it.
                            </strong>
                        </div>
                    </NotificationModal>
                )}
            </main>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
        lang: state.websiteReducer.website?.languages,
        page: state.pageName.page,
    };
};

export default connect(mapStateToProps)(TemplatesPageComponent);
