import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { v1 as uuidv1 } from 'uuid';
import validator from '../../shared/utils/Validator';
import ValidationMessageComponent from '../../shared/ui-components/validation/ValidationMessageComponent';
import { addFormValidationSchema } from '../shared/validations/schemas';
import {
    formColumnModel,
    FormDataObjTypes,
    FormModel,
    FormSectionModel,
} from '../shared/models/editorModels';
import { ValidationErrorTypes } from '../../shared/models/FastestValidatorModel';
import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';
import { getInitialWorkflowState } from '../../shared/utils/WorkflowUtils';
import masterRepository from '../../shared/repository/MasterRepository';
import WorkflowStateModel from '../../shared/models/workflow-models/WorkflowStateModel';

function AddNewFormComponent(props) {
    const [formDataObj, setFormDataObj] = useState<FormDataObjTypes>({
        formTitle: '',
        customCollection: '',
    });
    const [validationErrors, setValidationErrors] = useState<ValidationErrorTypes[]>([]);
    const addFormValidatorKey = 'addFormValidator';

    useEffect(() => {
        validator.setValidatorSchema(addFormValidatorKey, addFormValidationSchema);
    }, []);

    function generateLanguageWiseLabels(name) {
        let labels = {};

        for (const lang of props.languages) {
            const { language, langKey } = lang;

            labels[langKey] = name;
        }

        return labels;
    }

    function generateDefaultFormContent() {
        let formContent: formColumnModel[] = [];

        if (
            props.unMappedCustomCollectionsListForms &&
            Array.isArray(props.unMappedCustomCollectionsListForms)
        ) {
            let selectedCollection = props.unMappedCustomCollectionsListForms.find(
                (collection) => collection.customeCollectionName === formDataObj.customCollection
            );

            if (selectedCollection) {
                const { fieldsList } = selectedCollection;

                if (fieldsList && props.languages && Array.isArray(props.languages)) {
                    for (let field in fieldsList) {
                        let fieldData = fieldsList[field];
                        const { type, name, ...rest } = fieldData;

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
                                field: { classes: `${type == 'media' ? '' : 'form-control'}` },
                                label: {},
                            },
                        };

                        formContent.push(column);
                    }

                    // Add google recaptcha widget
                    formContent.push({
                        columnId: `col-${uuidv1()}`,
                        columnSize: 12,
                        activeStatus: true,
                        columnStyles: {
                            classes: 'form-group col-md-12',
                        },
                        compType: 'recaptcha',
                        mappingField: 'recaptcha',
                        label: generateLanguageWiseLabels('Recaptcha'),
                        settings: {
                            validations: undefined,
                        },
                        uiProperties: {
                            field: { classes: 'form-control' },
                            label: {},
                        },
                    });

                    // Add submit button
                    formContent.push({
                        columnId: `col-${uuidv1()}`,
                        columnSize: 6,
                        activeStatus: true,
                        columnStyles: {
                            classes: 'form-group col-md-6',
                        },
                        compType: 'submit',
                        mappingField: 'submit',
                        label: generateLanguageWiseLabels('SUBMIT'),
                        settings: {
                            validations: undefined,
                        },
                        uiProperties: {
                            field: { classes: 'form-control btn btn-primary btn-block' },
                            label: {},
                        },
                    });

                    // Add reset button
                    formContent.push({
                        columnId: `col-${uuidv1()}`,
                        columnSize: 6,
                        activeStatus: true,
                        columnStyles: {
                            classes: 'form-group col-md-6',
                        },
                        compType: 'reset',
                        mappingField: 'reset',
                        label: generateLanguageWiseLabels('RESET'),
                        settings: {
                            validations: undefined,
                        },
                        uiProperties: {
                            field: { classes: 'form-control btn btn-warning btn-block' },
                            label: {},
                        },
                    });
                }
            }
        }

        return formContent;
    }

    function createForm() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        const customCollectionName = props.unMappedCustomCollectionsListForms.find((collection) => {
            return collection.customeCollectionName == formDataObj.customCollection;
        });

        let newForm: FormModel = {
            title: formDataObj.formTitle,
            customCollection: formDataObj.customCollection,
            customCollectionName: customCollectionName ? customCollectionName.menuName : '',
            sections: [],
            version: 1,
            userPermissons: '',
            workflowState: getInitialWorkflowState('forms', formDataObj.formTitle, 'Form'),
            createdBy: masterRepository.getCurrentUser().docId,
            modifiedBy: masterRepository.getCurrentUser().docId,
        };

        let formContent = generateDefaultFormContent();

        if (formContent.length > 0) {
            let section: FormSectionModel = {
                sectionId: `sec-${uuidv1()}`,
                sectionStyles: {
                    classes: 'form-row',
                },
                device: 'medium',
                columns: formContent,
            };

            newForm.sections.push(section);

            Axios.post(
                '/api/forms/create',
                {
                    formData: newForm,
                    dbName: props.database,
                },
                httpHeaders
            )
                .then((response) => {
                    const { status, data } = response;

                    if (status === 200 && data) {
                        const { allForms, workflow, ...rest } = data;

                        if (allForms && Array.isArray(allForms)) {
                            if (allForms.length > 0) {
                                props.setAllForms({
                                    action: 'create',
                                    allFromsData: allForms,
                                });
                            } else {
                                props.setAllForms(undefined);
                            }
                        }

                        if (workflow) {
                            const { _id, ...workFlowStateData } = workflow;
                            const workflowState: WorkflowStateModel = {
                                id: _id,
                                ...workFlowStateData,
                            };
                            props.setSelectedFormWorkflowState(workflowState);
                        }

                        props.setResponseData(rest);

                        if (props.editMode) {
                            props.setEditMode(false);
                        }

                        setTimeout(function () {
                            props.setResponseData(undefined);
                            props.setActiveComponent('editForm');
                            props.getCustomCollectionTypeForms();
                        }, 2000);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        const [isValid, error] = validator.validateData(addFormValidatorKey, formDataObj);

        if (isValid) {
            createForm();
        } else {
            setValidationErrors(error);
        }
    }

    function handleValueChanges(event) {
        const value = event.target.value;
        const name = event.target.name;

        if (value && name) {
            setFormDataObj({
                ...formDataObj,
                [name]: value,
            });
        }
    }

    function findMatchingValidationErrorMsg(field) {
        let err: ValidationErrorTypes[] = [];

        if (validationErrors) {
            let selectedMsg: ValidationErrorTypes | undefined = validationErrors.find(
                (msg: ValidationErrorTypes) => msg.field === field
            );

            if (selectedMsg) {
                err.push(selectedMsg);
            }
        }

        return err;
    }

    return (
        <>
            <div className="row">
                <div
                    style={{
                        width: '600px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: '50px',
                    }}
                >
                    <h2>Create new form</h2>
                    {props.unMappedCustomCollectionsListForms &&
                    Array.isArray(props.unMappedCustomCollectionsListForms) &&
                    props.unMappedCustomCollectionsListForms.length > 0 ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="formTitle">Add form title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="formTitle"
                                    name="formTitle"
                                    placeholder="Enter Form Title"
                                    value={formDataObj.formTitle}
                                    // disabled={isEnable('/api/banners/create')} TODO: Permissions handling
                                    onChange={handleValueChanges}
                                />
                                <ValidationMessageComponent
                                    validationErrors={findMatchingValidationErrorMsg('formTitle')}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="customCollection">Select custom collection</label>
                                <select
                                    className="form-control"
                                    id="customCollection"
                                    value={formDataObj.customCollection}
                                    name="customCollection"
                                    onChange={handleValueChanges}
                                    // disabled={!isUnlinkedPage || pageMetaInfo.isHomePage === true}
                                >
                                    <option value="">---- Select custom collection ----</option>
                                    {props.unMappedCustomCollectionsListForms.map(
                                        (collection, index) => {
                                            const { menuName, customeCollectionName, _id } =
                                                collection;
                                            return (
                                                <option
                                                    key={`collection-${_id}`}
                                                    value={customeCollectionName}
                                                >
                                                    {menuName}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                                <ValidationMessageComponent
                                    validationErrors={findMatchingValidationErrorMsg(
                                        'customCollection'
                                    )}
                                />
                            </div>
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-block"
                                        onClick={() => {
                                            props.setActiveComponent('editForm');
                                        }}
                                    >
                                        Back
                                    </button>
                                </div>
                                <div className="col-md-6">
                                    <button type="submit" className="btn btn-primary btn-block">
                                        Create
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="alert alert-warning" role="alert">
                                To proceed, please create a form custom collection
                            </div>
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-block"
                                        onClick={() => {
                                            props.setActiveComponent('editForm');
                                        }}
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default AddNewFormComponent;
