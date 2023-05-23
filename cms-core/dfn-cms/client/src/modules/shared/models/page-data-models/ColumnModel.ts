import PageSettingModel from "./PageSettingModel";

export default interface ColumnModel {
    columnId: string;
    columnStyles: any;
    columnSize: number;
    section: InnerSectionsModel[];
}

export interface InnerSectionsModel {
    sectionId: string;
    sectionStyles: any;
    device: string;
    equalColumns: boolean;
    columns: InnerColumnsModel[];
}

export interface InnerColumnsModel {
    columnId: string;
    columnStyles: any;
    columnSize: number;
    compType: string;
    data: string;
    settings: PageSettingModel | object;
    uiProperties: any;
}
