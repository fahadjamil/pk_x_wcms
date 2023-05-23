import { cloneDeep } from 'lodash';
import BaseComponentModel from '../../pages/editor/contents-editor/models/BaseComponentModel';
import BaseComponentStyleModel from '../../pages/editor/contents-editor/popup-editor-component/styles-editor-component/models/BaseComponentStyleModel';
import FieldComponentStyleModel from '../../pages/editor/contents-editor/popup-editor-component/styles-editor-component/models/FieldComponentStyleModel';

export const createComponentStyleState = (
    baseComponentData: BaseComponentModel,
    styles: any,
    fieldStyles: any,
    stylesList: any,
    styledFields: any,
    componentStyles: any
) => {
    let styleState: BaseComponentStyleModel = {
        compId: baseComponentData.compId,
        compFields: [],
        componentStyles: [],
    };

    if (baseComponentData.compFields) {
        // For each field, generate fieldStyle
        baseComponentData.compFields.map((field, index) => {
            let fieldStyle: FieldComponentStyleModel = {
                fieldType: field.fieldType,
                dataKey: field.dataKey,
                style: {},
                initialStyleConfigs: {
                    customCSS: '',
                    cssClass: '',
                    textAlignment: '',
                    textColor: '',
                    textShadow: {
                        blurValue: '',
                        horizontalValue: '',
                        verticalValue: '',
                    },
                    typography: {
                        selectedFontFamily: '',
                        selectedFontSize: '',
                        selectedFontStyle: '',
                        selectedTextDecoration: '',
                        selectedTextTransform: '',
                        selectedFontWeight: '',
                        selectedLineHeight: '',
                        selectedLetterSpacing: '',
                    },
                },
            };

            if (field.hasOwnProperty('initialStyleConfigs')) {
                fieldStyle.initialStyleConfigs = cloneDeep({
                    ...fieldStyle.initialStyleConfigs,
                    ...field.initialStyleConfigs,
                });
            }

            const { fieldType } = field;

            // If style override exists. Currently expects as an Object
            if (field.hasOwnProperty('style')) {
                const styleOverride = Object.keys(field.style);

                // If FieldStylesConfigurations exists
                if (styledFields.includes(fieldType)) {
                    const merged = [...fieldStyles[fieldType], ...styleOverride];
                    const uniqueArray = Array.from(new Set(merged));

                    uniqueArray.forEach((style, index) => {
                        // If override style property matched, merge it with global style config.
                        if (
                            styleOverride.includes(style) &&
                            fieldStyles[fieldType].includes(style)
                        ) {
                            // If it is a style config group
                            if (stylesList.includes(style)) {
                                // Get global styles
                                const gStyle = styles[style];

                                if (gStyle instanceof Array) {
                                    // Get the override style only
                                    fieldStyle.style[style] = field.style[style];
                                } else {
                                    // Override the FieldStylesConfigurations
                                    const finalStyles = {
                                        ...gStyle,
                                        ...field.style[style],
                                    };

                                    fieldStyle.style[style] = finalStyles;
                                }
                            }
                        } else if (
                            styleOverride.includes(style) &&
                            !fieldStyles[fieldType].includes(style)
                        ) {
                            // Get the override style only
                            fieldStyle.style[style] = field.style[style];
                        } else if (
                            !styleOverride.includes(style) &&
                            fieldStyles[fieldType].includes(style)
                        ) {
                            if (stylesList.includes(style)) {
                                // Select from global style config.
                                const gStyle = styles[style];

                                fieldStyle.style[style] = gStyle;
                            }
                        }
                    });
                } else {
                    // Get the override style only
                    fieldStyle.style = field.style;
                }
            } else {
                // If FieldStylesConfigurations exists
                if (styledFields.includes(fieldType)) {
                    fieldStyles[fieldType].forEach((style, index) => {
                        if (stylesList.includes(style)) {
                            // Select from global style config.
                            const gStyle = styles[style];

                            fieldStyle.style[style] = gStyle;
                        }
                    });
                } else {
                    // No any styles for the current field
                    console.log('No any style configurations for the current field..');
                }
            }

            styleState.compFields.push(fieldStyle);
        });
    }

    if (baseComponentData.styles && baseComponentData.styles.length > 0) {
        baseComponentData.styles.forEach((styleKey) => {
            let compStyle: FieldComponentStyleModel = {
                fieldType: styleKey,
                dataKey: styleKey,
                style: {},
                initialStyleConfigs: {
                    customCSS: '',
                    cssClass: '',
                    textAlignment: '',
                    textColor: '',
                    textShadow: {
                        blurValue: '',
                        horizontalValue: '',
                        verticalValue: '',
                    },
                    typography: {
                        selectedFontFamily: '',
                        selectedFontSize: '',
                        selectedFontStyle: '',
                        selectedTextDecoration: '',
                        selectedTextTransform: '',
                        selectedFontWeight: '',
                        selectedLineHeight: '',
                        selectedLetterSpacing: '',
                    },
                },
            };

            if (baseComponentData.initialCmpStyles) {
                const initialCmpStyle = baseComponentData.initialCmpStyles[styleKey];

                if (initialCmpStyle) {
                    compStyle.initialStyleConfigs = cloneDeep({
                        ...compStyle.initialStyleConfigs,
                        ...initialCmpStyle,
                    });
                }
            }

            const selectStyle = componentStyles[styleKey];

            if (selectStyle && selectStyle.length > 0) {
                selectStyle.forEach((styleElementKey) => {
                    // Select from global style config.
                    const gStyle = styles[styleElementKey];
                    compStyle.style[styleElementKey] = gStyle;
                });
            }

            styleState.componentStyles.push(compStyle);
        });
    }

    return styleState;
};

// Create field settings for generate the UI in the editor content tab
export const createFieldComponentSettings = (
    baseComponentData: BaseComponentModel,
    settings: any,
    fieldsSettings: any,
    settingsList: any
) => {
    let settingState: any = undefined;
    const { compId, parentId } = baseComponentData;
    const topLevelId: string = parentId !== '' ? parentId : compId;
    const componentHasSettingConfigs: boolean = settingsList.includes(topLevelId);

    // If component has settings
    if (componentHasSettingConfigs) {
        const fieldsList = Object.keys(fieldsSettings);
        const cmpSettingsList = Object.keys(settings[topLevelId]);
        let fieldSettings: any = {
            setting: {},
        };

        settingState = {
            compId: baseComponentData.compId,
            compFields: [],
        };

        if (baseComponentData.compFields) {
            // For each field, generate fieldSettings
            baseComponentData.compFields.forEach((field, index) => {
                const { fieldType, dataKey } = field;

                // If field level settings override exists. Currently expects as an Object
                if (field.hasOwnProperty('setting')) {
                    const settingOverride = Object.keys(field.setting);

                    // If component has cmpSettings
                    if (fieldsList.includes(fieldType)) {
                        const fieldSettingConfig = fieldsSettings[fieldType];

                        // If fieldSettingConfig is an Array
                        if (fieldSettingConfig instanceof Array) {
                            const merged = [...fieldsSettings[fieldType], ...settingOverride];
                            const uniqueArray = Array.from(new Set(merged));

                            uniqueArray.forEach((setting, index) => {
                                // If both have same property
                                if (
                                    settingOverride.includes(setting) &&
                                    fieldsSettings[fieldType].includes(setting)
                                ) {
                                    // Get the override settings only
                                    // TODO: Currently consider the component level settings only
                                    fieldSettings['setting'][setting] = field.setting[setting];
                                } else if (
                                    settingOverride.includes(setting) &&
                                    !fieldsSettings[fieldType].includes(setting)
                                ) {
                                    // Get the override settings only
                                    fieldSettings['setting'][setting] = field.setting[setting];
                                } else if (
                                    !settingOverride.includes(setting) &&
                                    fieldsSettings[fieldType].includes(setting)
                                ) {
                                    if (cmpSettingsList.includes(setting)) {
                                        // Select from global setting config.
                                        const gSetting = settings[topLevelId][setting];

                                        fieldSettings['setting'][setting] = gSetting;
                                    }
                                }
                            });

                            fieldSettings['fieldType'] = fieldType;
                            fieldSettings['dataKey'] = dataKey;
                            settingState.compFields.push(fieldSettings);
                            return settingState;
                        } else {
                            // If cmpSettingConfig is an Object
                            const gSetting = fieldSettingConfig;

                            fieldSettings['setting'] = gSetting;
                            fieldSettings['dataKey'] = dataKey;
                            fieldSettings['fieldType'] = fieldType;
                            settingState.compFields.push(fieldSettings);
                            return settingState;
                        }
                    } else {
                        // Get the override settings only
                        fieldSettings['setting'] = field.setting;
                        fieldSettings['fieldType'] = fieldType;
                        fieldSettings['dataKey'] = dataKey;
                        settingState.compFields.push(fieldSettings);

                        return settingState;
                    }
                } else {
                    // If component has fieldSettigs
                    if (fieldsList.includes(fieldType)) {
                        const fieldSettingConfig = fieldsSettings[fieldType];

                        // If fieldSettingConfig is an Array
                        if (fieldSettingConfig instanceof Array) {
                            fieldSettingConfig.forEach((setting, index) => {
                                if (cmpSettingsList.includes(setting)) {
                                    // Select from global setting config.
                                    const gSetting = settings[topLevelId][setting];

                                    fieldSettings['setting'][setting] = gSetting;
                                }
                            });

                            fieldSettings['fieldType'] = fieldType;
                            fieldSettings['dataKey'] = dataKey;
                            settingState.compFields.push(fieldSettings);

                            return settingState;
                        } else {
                            // If fieldSettingConfig is an Object
                            const gSetting = fieldSettingConfig;

                            fieldSettings['setting'] = gSetting;
                            fieldSettings['fieldType'] = fieldType;
                            fieldSettings['dataKey'] = dataKey;
                            settingState.compFields.push(fieldSettings);
                            return settingState;
                        }
                    } else {
                        // No any settings for the current field
                        console.log('No any setting configurations for the current field..');
                        return settingState;
                    }
                }
            });

            return settingState;
        }
    } else {
        return settingState;
    }
};
