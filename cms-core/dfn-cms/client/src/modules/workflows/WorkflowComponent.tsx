import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import WorkflowStateModel from '../shared/models/workflow-models/WorkflowStateModel';
import PopupWorkflowViewComponent from './PopupWorkflowViewComponent';
import WorkflowBadgeComponent from './WorkflowBadgeComponent';

interface WorkflowComponentModel {
    isShowCurrentFlow: boolean;
    selectedWorkflowState: WorkflowStateModel | undefined;
    onSubmitWorkflow: any;
    dbName: string;
    currentPageId: string;
    collectionName: string;
}

function WorkflowComponent(props: WorkflowComponentModel) {
    const [currentWorkflowState, setCurrentWorkflowState] = useState<WorkflowStateModel>();

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setCurrentWorkflowState(props.selectedWorkflowState);
        }

        return () => {
            isMounted = false;
        };
    }, [props.currentPageId, props.selectedWorkflowState]);

    function onSubmitWorkflow(nextWorkflowState: WorkflowStateModel) {
        if (props.onSubmitWorkflow) {
            setCurrentWorkflowState(nextWorkflowState);
            props.onSubmitWorkflow(nextWorkflowState);
        }
    }

    return (
        <>
            <div className="btn-toolbar ml-1 mr-2">
                <button
                    type="button"
                    className="btn btn-tertiary mr-2"
                    data-toggle="modal"
                    data-target="#PopupWorkflowModal"
                >
                    Workflow
                    <span className="ml-1 mr-2">
                        {props.isShowCurrentFlow && (
                            <WorkflowBadgeComponent
                                currentworkflowId={
                                    currentWorkflowState && currentWorkflowState.state
                                }
                            />
                        )}
                    </span>
                </button>
            </div>
            <PopupWorkflowViewComponent
                modalId="PopupWorkflowModal"
                onSubmit={onSubmitWorkflow}
                selectedWorkState={currentWorkflowState}
                dbName={props.dbName}
                collecName={props.collectionName}
            />
        </>
    );
}

export default WorkflowComponent;
