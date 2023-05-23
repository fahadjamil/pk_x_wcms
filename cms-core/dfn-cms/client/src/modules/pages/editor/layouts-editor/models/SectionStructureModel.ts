import ColumnsSizeModel from "./ColumnsSizeModel";

export interface SectionStructureModel {
    sectionTypeId: string;
    displayImage: string;
    columnsCount: number;
    equalColumns: boolean;
    device: string;
    columnsSize: ColumnsSizeModel[];
}
