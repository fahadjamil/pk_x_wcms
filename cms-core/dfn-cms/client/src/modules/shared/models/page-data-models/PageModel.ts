import SectionModel from './SectionModel';

export default interface PageModel {
    _id: string;
    pageName: string;
    isHomePage?: boolean;
    path: string;
    dbName: string;
    workflowStateId: string;
    data: string;
    pageData: [
        {
            id: string;
            lang: string;
        }
    ];
    pageInfo: any;
    masterTemplate?: string;
    section: SectionModel[];
    recordLocked?: {
        lockedBy: string;
        lockedDate: Date;
    };
    isSearchDisabled?: boolean;
}
