export default interface SettingExternalDataSourceModel {
    uniqueKeyMapping: string;
    request: { url: string; params: any };
    externalParams: any;
    displayNameMapping: string;
    valueMapping: string;
}
