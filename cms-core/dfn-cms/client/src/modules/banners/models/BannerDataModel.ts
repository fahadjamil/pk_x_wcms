import BannerContentModel from './BannerContentModel';

export default interface BannerDataModel {
    id?: string;
    title: string;
    bannerData: { [key: string]: BannerContentModel[] };
    createdBy: string;
    workflowState?: any
    workflowStateId?: any;
    version: number;
}
