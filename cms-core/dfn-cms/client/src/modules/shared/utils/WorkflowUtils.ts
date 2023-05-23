import WorkflowStateModel from '../models/workflow-models/WorkflowStateModel';
import MasterRepository from '../repository/MasterRepository';
import { WorkflowsStatus } from '../config/WorkflowsStatus';
import WorkflowModel from '../models/workflow-models/WorkflowModel';

export function getInitialWorkflowState(
    collecName: string,
    fileTitle: string,
    fileType: string,
    initialComment?: string
) {
    const currentUserID = MasterRepository.getCurrentUser().docId;
    const initComment = initialComment ? initialComment : `${fileTitle} is created.`;

    let initialWorkFlowState: WorkflowStateModel = {
        collectionName: collecName,
        fileTitle: fileTitle,
        fileType: fileType,
        state: WorkflowsStatus.initial,
        comment: initComment,
        createdBy: currentUserID,
        modifiedBy: currentUserID,
    };

    return initialWorkFlowState;
}

export function getUpdatedWorkflowState(
    newStateID: string,
    previousFlowState: WorkflowStateModel,
    comment: string,
    collecName: string
) {
    let newWorkFlowState: WorkflowStateModel = { ...previousFlowState };
    newWorkFlowState.state = newStateID;
    newWorkFlowState.modifiedBy = MasterRepository.getCurrentUser().docId;
    newWorkFlowState.comment = comment;
    newWorkFlowState.collectionName = collecName;

    return newWorkFlowState;
}

export function getCurrentWorkflowItem(workflowId: string): WorkflowModel | undefined {
    const allWorkflows = MasterRepository.getWorkFlowList();

    if (allWorkflows) {
        const selectedWorkflow = allWorkflows.find(
            (workflow) => workflow.workflowId === workflowId
        );
        return selectedWorkflow;
    }

    return undefined;
}

export function getAllWorkflowItems(): WorkflowModel[] | undefined {
    return MasterRepository.getWorkFlowList();
}
