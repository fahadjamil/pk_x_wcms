import TypographyModel from '../styles-components/models/TypographyModel';
import TextShadowModel from '../styles-components/models/TextShadowModel';
import InitialStyleModel from './InitialStyleModel';

export default interface FieldComponentStyleModel {
    fieldType: string;
    dataKey: string;
    style: any;
    initialStyleConfigs: InitialStyleModel;
}
