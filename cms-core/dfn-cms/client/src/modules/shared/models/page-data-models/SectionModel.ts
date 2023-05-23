import ColumnModel from './ColumnModel';

export default interface SectionModel {
    sectionId: string;
    sectionStyles: any;
    device: string;
    equalColumns: boolean;
    columns: ColumnModel[];
}
