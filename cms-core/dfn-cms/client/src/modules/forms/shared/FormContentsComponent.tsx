import Axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import masterRepository from '../../shared/repository/MasterRepository';
import {
    getAuthorizationHeader,
    getAuthorizationHeaderForDelete,
} from '../../shared/utils/AuthorizationUtils';
import FormEditorComponent from '../editor/FormEditorComponent';
import FormHistoryComponent from '../history/FormHistoryComponent';
import WorkflowComponent from '../../workflows/WorkflowComponent';
import WorkflowStateModel from '../../shared/models/workflow-models/WorkflowStateModel';
import { getInitialWorkflowState, getUpdatedWorkflowState } from '../../shared/utils/WorkflowUtils';
import { WorkflowsStatus } from '../../shared/config/WorkflowsStatus';
import { FormModel } from './models/editorModels';

const NavTabs = styled.ul``;
const NavItem = styled.li``;
const NavLink = styled.a``;

function FormContentsComponent(props) {
    function handleFirstTabClick() {
        props.setEditMode(true);
    }

    function handleFormDelete() {
        props.setConfirmationData({
            modalTitle: 'Delete Form',
            show: true,
            body: (
                <div className="alert alert-danger" role="alert">
                    Are you sure you want to delete this form?
                </div>
            ),
            handleClose: () => {
                props.setConfirmationData(undefined);
            },
            handleConfirme: deleteCurrentForm,
        });
    }

    function deleteCurrentForm() {
        props.setConfirmationData(undefined);

        const { _id, workflowStateId } = props.selectedForm;

        if (_id && workflowStateId) {
            const headerParameter = {
                formId: _id,
                workflowId: workflowStateId,
                deletedBy: masterRepository.getCurrentUser().docId,
            };
            const payload = getAuthorizationHeaderForDelete(headerParameter);

            Axios.delete('/api/forms/delete', payload)
                .then((response) => {
                    const { status, data } = response;

                    if (status === 200 && data) {
                        const { allForms, workflow, ...rest } = data;

                        if (allForms && Array.isArray(allForms)) {
                            if (allForms.length > 0) {
                                props.setAllForms({
                                    action: 'initial',
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
                        props.getCustomCollectionTypeForms();

                        if (props.editMode) {
                            props.setEditMode(false);
                        }

                        setTimeout(function () {
                            props.setResponseData(undefined);
                            // setActiveComponent('editForm');
                        }, 2000);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    function onWorkflowSubmited(updatedWorkflowState: WorkflowStateModel) {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.post(
            '/api/workflow/forms/update',
            {
                formId: props.selectedForm._id,
                dbName: props.database,
                formWorkflow: updatedWorkflowState,
            },
            httpHeaders
        )
            .then((response) => {
                const { status, data } = response;

                if (status === 200) {
                    props.setSelectedFormWorkflowState(updatedWorkflowState);
                }
            })
            .catch((err) => {
                console.log('error', err);
            });
    }

    function handleDiscard() {
        if (props.editMode) {
            props.setConfirmationData({
                modalTitle: 'Discard Changes',
                show: true,
                body: (
                    <div className="alert alert-warning" role="alert">
                        Are you sure you want to discard the changes?
                    </div>
                ),
                handleClose: () => {
                    props.setConfirmationData(undefined);
                },
                handleConfirme: discardChanges,
            });
        }
    }

    function discardChanges() {
        props.setConfirmationData(undefined);
        props.getSelectedFormItem(props.selectedForm);
        props.setEditMode(false);
    }

    function handleSaveAsDrafts() {
        if (props.editMode) {
            props.setConfirmationData({
                modalTitle: 'Save Changes',
                show: true,
                body: (
                    <div className="alert alert-success" role="alert">
                        Are you sure you want to save changes?
                    </div>
                ),
                handleClose: () => {
                    props.setConfirmationData(undefined);
                },
                handleConfirme: saveChanges,
            });
        }
    }

    function saveChanges() {
        props.setConfirmationData(undefined);

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        let updatedForm: FormModel = { ...props.selectedForm };

        if (props.selectedFormWorkflowState && props.selectedFormWorkflowState.id) {
            const resetWorkflow: WorkflowStateModel = getUpdatedWorkflowState(
                WorkflowsStatus.initial,
                props.selectedFormWorkflowState,
                'Form edit & save as darft',
                'forms'
            );

            onWorkflowSubmited(resetWorkflow);
        }

        updatedForm.workflowState = getInitialWorkflowState('forms', updatedForm.title, 'Form');

        Axios.put(
            '/api/forms/update',
            {
                id: props.selectedForm._id,
                updatedForm: updatedForm,
                dbName: props.database,
            },
            httpHeaders
        )
            .then((response) => {
                const { status, data } = response;

                if (status === 200 && data) {
                    props.setResponseData(data);
                    props.setEditMode(false);

                    setTimeout(function () {
                        props.setResponseData(undefined);
                    }, 3000);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <div className="page__toolbar__container">
                <div className="row">
                    <div className="col-md-4">
                        <NavTabs
                            className="nav nav-tabs btn-toolbar btn-group"
                            id="formEitorTab"
                            role="tablist"
                        >
                            <NavItem className="nav-item">
                                <NavLink
                                    className="nav-link active btn btn-primary form-tabs"
                                    id="form-editor-tab"
                                    data-toggle="tab"
                                    href="#form-editor"
                                    role="tab"
                                    aria-controls="form-editor"
                                    aria-selected="true"
                                    onClick={handleFirstTabClick}
                                >
                                    {props.editMode ? 'Form View' : 'Edit'}
                                </NavLink>
                            </NavItem>
                            <NavItem className="nav-item">
                                <NavLink
                                    className="nav-link btn btn-primary form-tabs"
                                    id="form-history-tab"
                                    data-toggle="tab"
                                    href="#form-history"
                                    role="tab"
                                    aria-controls="form-history"
                                    aria-selected="false"
                                >
                                    History
                                </NavLink>
                            </NavItem>
                        </NavTabs>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <WorkflowComponent
                                selectedWorkflowState={props.selectedFormWorkflowState}
                                onSubmitWorkflow={onWorkflowSubmited}
                                dbName={props.database}
                                currentPageId={props.selectedForm._id}
                                isShowCurrentFlow
                                collectionName="forms"
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="float-right d-flex flex-row align-items-center">
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={handleSaveAsDrafts}
                                disabled={!props.editMode}
                            >
                                Save As Drafts
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary mr-2"
                                onClick={handleDiscard}
                                disabled={!props.editMode}
                            >
                                Discard
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary "
                                onClick={handleFormDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tab-content" id="formEitorTab">
                <div
                    className="tab-pane fade show active"
                    id="form-editor"
                    role="tabpanel"
                    aria-labelledby="form-editor-tab"
                >
                    <FormEditorComponent
                        editMode={props.editMode}
                        selectedForm={props.selectedForm}
                        languages={props.languages}
                        setResponseData={props.setResponseData}
                        setConfirmationData={props.setConfirmationData}
                        setInformationData={props.setInformationData}
                        setSelectedForm={props.setSelectedForm}
                    />
                </div>
                <div
                    className="tab-pane fade"
                    id="form-history"
                    role="tabpanel"
                    aria-labelledby="form-history-tab"
                >
                    <FormHistoryComponent />
                </div>
            </div>
        </>
    );
}

export default React.memo(FormContentsComponent);
