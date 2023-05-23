import LanguageModel from '../../../../../../shared/models/LanguageModel';
import SectionModel from '../../../../../../shared/models/page-data-models/SectionModel';

export default interface FieldComponetModel {
    fieldType: string;
    dataKey: string;
    initialValue: any;
    initialStyleConfigs: any;
    initialSettingConfigs: any;
    onValueChange: any;
    validations: any; // Component configs
    style: any; // Component configs
    setting: any; // Component configs
    dbName: string;
    language: LanguageModel;
    isLanguageWiseContentPresent: boolean; // Component configs
    componentKey: string;
    languageData: LanguageModel[];
    contentUiSettings: any;
    componentSettings: any;
    sections: SectionModel[];
    fieldIndex?: number;
}
