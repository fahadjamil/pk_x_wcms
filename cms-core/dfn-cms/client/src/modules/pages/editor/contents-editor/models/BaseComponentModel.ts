import FieldComponetModel from '../popup-editor-component/contents-editor-component/models/FieldComponentModel';
import SettingModel from '../popup-editor-component/settings-editor-component/models/SettingModel';

export default interface BaseComponentModel {
    compId: string;
    parentId: string;
    displayNameTag: string;
    displayImage: string;
    styles: string[];
    settings: SettingModel[];
    initialDataKey: string;
    initialStyleConfigKey: boolean;
    initialSettingConfigKey: boolean;
    initialCmpStyles: any;
    compFields: FieldComponetModel[];
    reportType: string;
}
