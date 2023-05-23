import SettingExternalDataSourceModel from "./SettingExternalDataSourceModel";

export default interface SettingModel {
    displayTitle: string;
    settingType: string;
    dataKey: string;
    initialSettingsValue: any;
    externalDataSource: SettingExternalDataSourceModel;
    settingData: any;
    dbName: string;
    onValueSelected: any;
    theme?: any
}
