export default interface WorkflowModel {
    workflowName: string;
    workflowId: string;
    nextflows: [{ flowId: string }];
    textColor:string;
    backColor:string;
    enableCommentSubmit:boolean;
}
