export default interface ArchiveCommonModel {
    type: string;
    pageId: string;
    docId: string;
    title: string;
    pageName: string;
    version: string;
    state: string;
    comment: string;
    createdBy: string;
    modifiedBy: string;
    createdDate: Date;
    modifiedDate: Date;
    workflowState: any;
    deleted: {
        deletedDate: Date;
        deletedBy: string;
        comment: string;
    }
}
