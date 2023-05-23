import React from 'react';
import { WorkflowsStatus } from '../shared/config/WorkflowsStatus';
import WorkflowModel from '../shared/models/workflow-models/WorkflowModel';
import WorkflowStateModel from '../shared/models/workflow-models/WorkflowStateModel';
import MasterRepository from '../shared/repository/MasterRepository';
import {
    getAllWorkflowItems,
    getCurrentWorkflowItem,
    getUpdatedWorkflowState,
} from '../shared/utils/WorkflowUtils';

interface PopupWorkflowViewComponentModel {
    onSubmit: any;
    selectedWorkState: WorkflowStateModel | undefined;
    modalId: string;
    dbName: string;
    collecName: string;
}

function PopupWorkflowViewComponent(props: PopupWorkflowViewComponentModel) {
    let comment: string = '';

    function getAllStatesUptoCurrentState(allWorkflows: WorkflowModel[]) {
        let workflowItems: any[] = [];
        let flowColor = '#ffffff';
        let textColor = '#000000';
        let flowItemFound = false;

        if (allWorkflows) {
            for (let index = 0; index < allWorkflows.length; index++) {
                const workflowItem = allWorkflows[index];

                if (!flowItemFound) {
                    flowColor = workflowItem.backColor;
                    textColor = workflowItem.textColor;
                } else {
                    flowColor = '#35393d';
                    textColor = '#ffffff';
                }

                if (workflowItem.workflowId === props.selectedWorkState?.state) {
                    flowItemFound = true;
                }

                if (
                    workflowItem.workflowId === WorkflowsStatus.approved &&
                    props.selectedWorkState?.state === WorkflowsStatus.rejected
                ) {
                    continue;
                }

                if (
                    workflowItem.workflowId === WorkflowsStatus.rejected &&
                    props.selectedWorkState?.state !== WorkflowsStatus.rejected
                ) {
                    continue;
                }

                workflowItems.push(
                    <div
                        key={workflowItem.workflowId}
                        className="d-flex col-md align-items-center justify-content-center"
                        style={{ zIndex: 2 }}
                    >
                        <h5>
                            <span
                                className="badge"
                                style={{
                                    backgroundColor: flowColor,
                                    border: '2px solid',
                                    borderColor: workflowItem.backColor,
                                    color: textColor,
                                }}
                            >
                                {workflowItem.workflowName.toUpperCase()}
                            </span>
                        </h5>
                    </div>
                );
            }
        }

        return workflowItems;
    }

    function handleValueChange(event) {
        comment = event.target.value;
    }

    function onSubmitWorkflow(nextWorkflowId: string) {
        if (props.onSubmit && props.selectedWorkState) {
            const nextWorkFlowStatus: WorkflowStateModel = getUpdatedWorkflowState(
                nextWorkflowId,
                props.selectedWorkState,
                comment,
                props.collecName
            );
            props.onSubmit(nextWorkFlowStatus);
        }
    }

    function generateSubmitButtons(currentWorkflowItem: WorkflowModel) {
        let workflowSubmits: any[] = [];
        let isSubmitEnabledCurrentUser = true;

        if (
            props.selectedWorkState?.state !== WorkflowsStatus.initial &&
            props.selectedWorkState?.modifiedBy === MasterRepository.getCurrentUser().docId
        ) {
            isSubmitEnabledCurrentUser = false;
        }

        if (currentWorkflowItem && currentWorkflowItem.nextflows) {
            currentWorkflowItem.nextflows.forEach((nextflow) => {
                const nextFlowItem = getCurrentWorkflowItem(nextflow.flowId);

                if (nextFlowItem && currentWorkflowItem.enableCommentSubmit) {
                    let url = props.selectedWorkState?.fileType + '/' + nextFlowItem.workflowId;
                    workflowSubmits.push(
                        <button
                            key={nextFlowItem.workflowId}
                            type="button"
                            className="btn btn-primary"
                            data-dismiss="modal"
                            style={{
                                borderColor: nextFlowItem.backColor,
                                backgroundColor: nextFlowItem.backColor,
                                color: nextFlowItem.textColor,
                            }}
                            disabled={
                                !(
                                    isSubmitEnabledCurrentUser /* &&
                                    sessionStorage.getItem(props.dbName)?.includes(url) */
                                )
                            }
                            onClick={(event) => {
                                event.preventDefault();
                                if (isSubmitEnabledCurrentUser) {
                                    onSubmitWorkflow(nextFlowItem.workflowId);
                                }
                            }}
                        >
                            Submit {nextFlowItem.workflowName}
                        </button>
                    );
                }
            });
        }

        return workflowSubmits;
    }

    if (props.selectedWorkState) {
        const AllWorkflowItems = getAllWorkflowItems();
        const selectedWorkflow = getCurrentWorkflowItem(props.selectedWorkState.state);

        if (selectedWorkflow && AllWorkflowItems) {
            return (
                <div
                    className="modal fade"
                    id={props.modalId}
                    tabIndex={-1}
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg" role="document">
                        <div
                            className="modal-content"
                            style={{ backgroundColor: '#35393d', opacity: 0.9 }}
                        >
                            <div className="modal-body">
                                <div className="row">
                                    {getAllStatesUptoCurrentState(AllWorkflowItems)}
                                    <div
                                        style={{
                                            width: '100%',
                                            paddingLeft: '100px',
                                            paddingRight: '100px',
                                            position: 'absolute',
                                            top: '12px',
                                        }}
                                    >
                                        <hr
                                            style={{
                                                width: '100%',
                                                borderWidth: '3px',
                                                backgroundColor: '#949494',
                                            }}
                                        />
                                    </div>
                                </div>
                                {selectedWorkflow.enableCommentSubmit && (
                                    <div className="row" style={{ padding: '12px' }}>
                                        <textarea
                                            key={props.selectedWorkState.state}
                                            style={{ width: '100%' }}
                                            placeholder="Comment"
                                            onChange={handleValueChange}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                {generateSubmitButtons(selectedWorkflow)}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
    } else {
        return <></>;
    }
}

export default PopupWorkflowViewComponent;
