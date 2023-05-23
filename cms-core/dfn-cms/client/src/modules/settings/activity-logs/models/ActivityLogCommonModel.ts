export default interface ActivityLogCommonModel {
    type: string;
    pageId: string;
    docId: string;
    title: string;
    version: string;
    state: string;
    comment: string;
    createdBy: string;
    modifiedBy: string;
    createdDate: Date;
    modifiedDate: Date;
    deleted?: {
        deletedDate: Date;
        deletedBy: string;
        comment: string;
    }
    restored?: {
        restoredDate: Date;
        comment: string;
    }
}
