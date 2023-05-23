import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { v1 as uuidv1 } from 'uuid';
import { switchPage } from '../redux/action';
import MainMenuModel from '../shared/models/side-bar-menu-models/MainMenuModel';
import SubMenuModel from '../shared/models/side-bar-menu-models/SubMenuModel';
import masterRepository from '../shared/repository/MasterRepository';
import SideBarComponent from '../shared/ui-components/SideBarComponent';
import TopPanelComponent from '../shared/ui-components/TopPanelComponent';
import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';
import FormContentsWrapperComponent from './shared/FormContentsWrapperComponent';
import { formColumnModel, FormModel } from './shared/models/editorModels';
import {
    AllFormsModel,
    ConfirmationDataModel,
    InformationDataModel,
    ResponseDataModel,
} from './shared/models/sharedModels';
import SideBarContentComponent from './shared/SideBarContentComponent';
import NotificationAlertsComponent from './../shared/ui-components/alerts/NotificationAlertsComponent';
import ConfirmationModal from './../shared/ui-components/modals/confirmation-modal';
import WorkflowStateModel from '../shared/models/workflow-models/WorkflowStateModel';
import LanguageModel from '../shared/models/LanguageModel';
import InformationModal from '../shared/ui-components/modals/information-modal';

function FormsPageComponent(props) {
    const database = props.website;
    const websiteLanguages: LanguageModel[] = props.lang;
    const dispatch = useDispatch();
    const [menuData, setMenuData] = useState<MainMenuModel[]>([]);
    const [allForms, setAllForms] = useState<AllFormsModel | undefined>(undefined);
    const [selectedForm, setSelectedForm] = useState<FormModel | undefined>(undefined);
    const [activeComponent, setActiveComponent] = useState<string>('editForm');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [activeMenuItemID, setActiveMenuItemID] = useState<string>('');
    const [customCollectionsListForms, setCustomCollectionsListForms] = useState<any>([]);
    const [unMappedCustomCollectionsListForms, setunMappedCustomCollectionsListForms] =
        useState<any>([]);
    const [responseData, setResponseData] = useState<ResponseDataModel | undefined>(undefined);
    const [confirmationData, setConfirmationData] = useState<ConfirmationDataModel | undefined>(
        undefined
    );
    const [informationData, setInformationData] = useState<InformationDataModel | undefined>(
        undefined
    );
    const [selectedFormWorkflowState, setSelectedFormWorkflowState] = useState<
        WorkflowStateModel | undefined
    >(undefined);

    useEffect(() => {
        dispatch(switchPage('Forms'));
    }, [database]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getCustomCollectionTypeForms();
            getAllFormDrafts();
        }
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            // Update selected form object from latest changes
            if (selectedForm) {
                if (customCollectionsListForms && Array.isArray(customCollectionsListForms)) {
                    const { customCollection } = selectedForm;

                    let selectedCollection = customCollectionsListForms.find(
                        (collection) => collection.customeCollectionName === customCollection
                    );

                    updateFormFields(selectedForm, selectedCollection);
                }
            }
        }
        return () => {
            isMounted = false;
        };
    }, [customCollectionsListForms]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted && allForms) {
            const { action, allFromsData } = allForms;

            if (action && allFromsData && Array.isArray(allFromsData)) {
                if (allFromsData.length > 0) {
                    setSelectedMenuItem(action, allFromsData);
                }
            }
        } else {
            setMenuData([]);
            dispatch(switchPage('Forms'));
            setSelectedFormWorkflowState(undefined);
            setSelectedForm(undefined);
        }

        return () => {
            isMounted = false;
        };
    }, [allForms, activeComponent]);

    function getCustomCollectionTypeForms() {
        const headerParameter = {
            collection: 'custome-types',
            searchQuery: 'Forms',
            user: masterRepository.getCurrentUser().userName,
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/types', httpHeaders)
            .then((response) => {
                const { status, data } = response;

                if (status === 200 && data && data.length > 0) {
                    // Get custom collections list which are not associated with any form
                    const unMappedList = data
                        .map((collection, index) => {
                            const { mappedDynamicForm } = collection;

                            if (
                                !mappedDynamicForm ||
                                (mappedDynamicForm && mappedDynamicForm == '')
                            ) {
                                return collection;
                            }
                        })
                        .filter((element) => {
                            return element !== undefined;
                        });

                    setCustomCollectionsListForms(data);
                    setunMappedCustomCollectionsListForms(unMappedList);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getAllFormDrafts() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/forms', httpHeaders)
            .then((results) => {
                const { status, data } = results;

                if (status === 200 && data) {
                    const { allForms, workflow } = data;

                    if (allForms && Array.isArray(allForms) && allForms.length > 0) {
                        setAllForms({
                            action: 'initial',
                            allFromsData: allForms,
                        });
                    }

                    if (workflow) {
                        const { _id, ...workFlowStateData } = workflow;
                        const workflowState: WorkflowStateModel = { id: _id, ...workFlowStateData };
                        setSelectedFormWorkflowState(workflowState);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function generateLanguageWiseLabels(name) {
        let labels = {};

        for (const lang of websiteLanguages) {
            const { language, langKey } = lang;

            labels[langKey] = name;
        }

        return labels;
    }

    function updateFormFields(formObj, selectedCollection) {
        const updatedForm: FormModel = { ...formObj };
        const { sections } = updatedForm;
        const formContent: formColumnModel[] = [];

        if (selectedCollection) {
            const { fieldsList } = selectedCollection;

            if (fieldsList && sections && sections.length > 0) {
                const { columns } = sections[0];

                if (columns && columns.length > 0) {
                    for (const column of columns) {
                        const { mappingField } = column;
                        const mappingKeys = Object.keys(fieldsList);
                        const mappingKey = mappingKeys.find((key) => key === mappingField);

                        if (mappingKey) {
                            let updatedColumn = { ...column };
                            let fieldData = fieldsList[mappingKey];

                            if (fieldData) {
                                const { type, name, ...rest } = fieldData;

                                updatedColumn.compType = type;
                                // updatedColumn.label = name; // Priority to overidden properties
                                // updatedColumn.settings.validations = rest; // Priority to overidden properties
                            }

                            formContent.push(updatedColumn);
                        }

                        // Add google recaptcha widget
                        if (mappingField === 'recaptcha') {
                            formContent.push(column);
                        }

                        // Add Submit button
                        if (mappingField === 'submit') {
                            formContent.push(column);
                        }

                        // Add reset button
                        if (mappingField === 'reset') {
                            formContent.push(column);
                        }
                    }

                    for (let field in fieldsList) {
                        let fieldData = fieldsList[field];
                        const { type, name, ...rest } = fieldData;

                        let selectedCollumn = columns.find(
                            (column) => column.mappingField === field
                        );

                        if (!selectedCollumn) {
                            // Add new field to the form
                            let column: formColumnModel = {
                                columnId: `col-${uuidv1()}`,
                                columnSize: 12,
                                activeStatus: true,
                                columnStyles: {
                                    classes: 'form-group col-md-12',
                                },
                                compType: type,
                                mappingField: field,
                                label: generateLanguageWiseLabels(name),
                                settings: {
                                    validations: rest,
                                },
                                uiProperties: {
                                    field: { classes: 'form-control' },
                                    label: {},
                                },
                            };

                            formContent.push(column);
                        }
                    }
                }
            }
        }

        updatedForm.sections[0].columns = formContent;
        setSelectedForm(updatedForm);
    }

    function setSelectedMenuItem(action, allFromsData) {
        switch (action) {
            case 'initial':
                generateMenuItems(allFromsData, 0);
                break;
            case 'create':
                generateMenuItems(allFromsData, allFromsData.length - 1);
                break;
            default:
                break;
        }
    }

    function generateMenuItems(data, itemIndex) {
        let topMenuObject: MainMenuModel = {
            topMenuText: 'Forms',
            topMenuID: 'Forms',
            subMenus: [],
        };

        let initialForm = data[itemIndex];
        let topMenuIndex = 0;
        let subMenuIndex = itemIndex;
        const uniqueMenuName = initialForm.title.replace(/[^A-Z0-9]+/gi, '_');
        const subMenuId = `${uniqueMenuName}_${topMenuIndex}_${subMenuIndex}`;
        setActiveMenuItemID(subMenuId);

        if (initialForm) {
            dispatch(switchPage(initialForm.title));
            setSelectedForm(initialForm);
        }

        for (const formItem of data) {
            let subMenuObject: SubMenuModel = {
                menuText: formItem.title,
                menuID: formItem._id,
                dataObject: formItem,
                notifiIcon: {},
            };

            topMenuObject.subMenus.push(subMenuObject);
        }

        setMenuData([topMenuObject]);
    }

    function onMenuItemClicked(
        topMenuModel: MainMenuModel,
        subMenuModel: SubMenuModel,
        dataObject: any
    ) {
        setActiveComponent('editForm');
        getSelectedFormItem(dataObject);
        getCustomCollectionTypeForms();

        if (editMode) {
            setEditMode(false);
        }
    }

    // Get the latest changes of selected form item from DB
    function getSelectedFormItem(dataObject: FormModel | undefined) {
        if (dataObject) {
            const headerParameter = {
                formId: dataObject._id,
                user: masterRepository.getCurrentUser().userName,
            };
            const httpHeaders = getAuthorizationHeader(headerParameter);

            Axios.get('/api/forms/get-item-data', httpHeaders)
                .then((results) => {
                    const { status, data } = results;

                    if (status === 200 && data) {
                        const { formItem, workflow, collection } = data;

                        if (formItem && collection) {
                            updateFormFields(formItem, collection);
                        }

                        if (workflow) {
                            const { _id, ...workFlowStateData } = workflow;
                            const workflowState: WorkflowStateModel = {
                                id: _id,
                                ...workFlowStateData,
                            };
                            setSelectedFormWorkflowState(workflowState);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setSelectedForm(undefined);
        }
    }

    return (
        <>
            <aside className="main__sidebar">
                <div className="main__sidebar__content">
                    <SideBarComponent>
                        <SideBarContentComponent
                            menuData={menuData}
                            selectedForm={selectedForm}
                            activeMenuItemID={activeMenuItemID}
                            editMode={editMode}
                            selectedFormWorkflowState={selectedFormWorkflowState}
                            languages={websiteLanguages}
                            onMenuItemClicked={onMenuItemClicked}
                            setActiveMenuItemID={setActiveMenuItemID}
                            setActiveComponent={setActiveComponent}
                            setSelectedForm={setSelectedForm}
                            setConfirmationData={setConfirmationData}
                            getSelectedFormItem={getSelectedFormItem}
                            setEditMode={setEditMode}
                        />
                    </SideBarComponent>
                </div>
            </aside>
            <main className="main__content">
                <TopPanelComponent />
                <div className="page__content__container pt-0">
                    <NotificationAlertsComponent responseData={responseData} />
                    <FormContentsWrapperComponent
                        activeComponent={activeComponent}
                        editMode={editMode}
                        database={database}
                        unMappedCustomCollectionsListForms={unMappedCustomCollectionsListForms}
                        selectedForm={selectedForm}
                        selectedFormWorkflowState={selectedFormWorkflowState}
                        languages={websiteLanguages}
                        setActiveComponent={setActiveComponent}
                        setSelectedForm={setSelectedForm}
                        setEditMode={setEditMode}
                        setAllForms={setAllForms}
                        setResponseData={setResponseData}
                        setConfirmationData={setConfirmationData}
                        setSelectedFormWorkflowState={setSelectedFormWorkflowState}
                        getSelectedFormItem={getSelectedFormItem}
                        setInformationData={setInformationData}
                        getCustomCollectionTypeForms={getCustomCollectionTypeForms}
                    />
                    {confirmationData && (
                        <ConfirmationModal
                            modalTitle={confirmationData.modalTitle}
                            show={confirmationData.show}
                            size={confirmationData.size}
                            handleClose={confirmationData.handleClose}
                            handleConfirme={confirmationData.handleConfirme}
                        >
                            {confirmationData.body}
                        </ConfirmationModal>
                    )}
                    {informationData && (
                        <InformationModal
                            modalTitle={informationData.modalTitle}
                            show={informationData.show}
                            size={informationData.size}
                            submitBtnText={informationData.submitBtnText}
                            handleClose={informationData.handleClose}
                            handleConfirme={informationData.handleConfirme}
                        >
                            {informationData.body}
                        </InformationModal>
                    )}
                </div>
            </main>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
        lang: state.websiteReducer.website?.languages,
    };
};

export default connect(mapStateToProps)(FormsPageComponent);
