export default interface WorkflowStateModel{
    id?:string;
    collectionName : string;
    fileTitle: string;
    fileType: string;
    state: string;
    comment: string;
    createdBy: string;
    modifiedBy: string;
    createdDate?: Date;
    modifiedDate?: Date;
}