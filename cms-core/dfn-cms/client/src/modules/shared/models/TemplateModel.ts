import SectionModel from './page-data-models/SectionModel';
import WorkflowStateModel from './workflow-models/WorkflowStateModel';

export default interface TemplateModel {
    _id: string;
    title: string;
    path: string;
    dbName: string;
    workflowstate: WorkflowStateModel;
    data: string;
    pagedata: [
        {
            id: string;
            lang: string;
        }
    ];
    header: { section: SectionModel[]; };
    footer: { section: SectionModel[]; };
}