export interface TableComponentSettingsModel {
    menuName: string;
    collectionType: string;
    dataSourceUrl: string;
    params: any;
    columns: TableColumnSettingsModel[];
}

export interface TableColumnSettingsModel {
    columnName: string;
    mappingField: string;
    dataType: string;
    formatting: any;
    defaultValue: string;
}
