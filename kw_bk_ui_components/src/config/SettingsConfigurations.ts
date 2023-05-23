export const SettingsConfigModels = {
    settings: {
        table: {
            columnName: {
                configs: {
                    field: 'shortText',
                    isLanguageWiseContentPresent: true,
                    labelName: 'Column Name',
                    dataSource: '',
                    dependentFieldName: '',
                }
            },
            mappingField: {
                configs: {
                    field: 'dropDown',
                    isLanguageWiseContentPresent: false,
                    labelName: 'Mapping Field',
                    // If datasource from componentSettings, split the string by dot character
                    dataSource: 'componentSettings.fieldsList',
                    dependentFieldName: '',
                }
            },
            dataType: {
                values: {
                    text: 'Text',
                    boolean: 'Boolean',
                    date: 'Date',
                    number: 'Number',
                    image: 'Image',
                    icon: 'Icon',
                    link: 'Link',
                    button: 'Button',
                },
                configs: {
                    field: 'dropDown',
                    isLanguageWiseContentPresent: false,
                    labelName: 'Data Type',
                    dataSource: '',
                    dependentFieldName: 'formatting',
                }
            },
            formatting: {
                values: {
                    text: {},
                    boolean: {},
                    date: {
                        'yyyy-mm-dd': 'YYYY-MM-DD',
                        'yyyy-mm': 'YYYY-MM',
                        yyyy: 'YYYY',
                        'yyyy-mm-ddthh:mm:ssz': 'YYYY-MM-DDHH:MM:SS',
                        'mm/dd/yyyy': 'MM/DD/YYYY',
                        'yyyy/mm/dd': 'YYYY/MM/DD',
                        'mm-dd-yyyy': 'MM-DD-YYYY',
                    },
                    number: {
                        integer: 'Integer',
                        decimal: 'Decimal',
                        exponent: 'Exponential',
                        fixed: 'Fixed',
                        precision: 'Precision',
                    },
                    image: {},
                    link: {},
                    button: {},
                    icon: {
                        imageFileIcon: 'Image Viewer',
                        pdfFileIcon: 'PDF Viewer',
                        docFileIcon: 'DOC File Viewer',
                        audioFileIcon: 'Audio Viewer',
                        videoFileIcon: 'Video Viewer',
                        downloadFileIcon: 'File Downloader',
                    }
                },
                configs: {
                    field: 'dropDown',
                    isLanguageWiseContentPresent: false,
                    labelName: 'Formatting',
                    dataSource: '',
                    dependentFieldName: '',
                }
            },
            addNewColumn: {
                configs: {
                    field: 'button',
                    isLanguageWiseContentPresent: false,
                    labelName: 'Add New Column',
                    dataSource: '',
                    dependentFieldName: '',
                }
            },
        },
    },
};
