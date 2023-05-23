import FieldComponentStyleModel from './FieldComponentStyleModel';

export default interface BaseComponentStyleModel {
    compId: string;
    compFields: FieldComponentStyleModel[];
    componentStyles: any[];
}
