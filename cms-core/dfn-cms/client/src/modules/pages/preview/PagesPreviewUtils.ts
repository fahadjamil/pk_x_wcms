import { cloneDeep } from 'lodash';
import BaseComponentModel from '../editor/contents-editor/models/BaseComponentModel';
import {
    BkSpecificComponentsConfiguration
} from 'ui-components';

export const getComponentModel = (innerColumn, ComponenetModels, pageContentData) => {

    let componetModel: BaseComponentModel;
    componetModel = ComponenetModels.components.find(
        (item) => item.compId === innerColumn.compType
    ) as BaseComponentModel;

    if (componetModel === undefined) {
        componetModel = BkSpecificComponentsConfiguration.components.find(
            (item) => item.compId === innerColumn.compType
        ) as BaseComponentModel;
    }

    const componentModelCopy: BaseComponentModel = cloneDeep(componetModel) as BaseComponentModel; // get shallow copy of original object

    if (componentModelCopy) {
        let languageWiseComponentData = {};

        Object.keys(pageContentData).map((languageKey) => {
            const languageComponentContent = pageContentData[languageKey].data.find(
                (dataItem) => dataItem.id === innerColumn.data
            );
            if (languageComponentContent) {
                languageWiseComponentData[languageKey] = languageComponentContent;
            }
        });

        componentModelCopy.compFields.map((fieldElement) => {
            let elementInitialValues = {};

            Object.keys(languageWiseComponentData).map((languageKey) => {
                const componentData = languageWiseComponentData[languageKey];
                const value = componentData[fieldElement.dataKey];
                elementInitialValues[languageKey] = value;
            });

            fieldElement.initialValue = elementInitialValues;
            fieldElement.initialStyleConfigs = innerColumn.uiProperties[fieldElement.dataKey];
            fieldElement.initialSettingConfigs = innerColumn.settings;
        });

        componentModelCopy.initialDataKey = innerColumn.data;
        componentModelCopy.initialStyleConfigKey = true;
        componentModelCopy.initialSettingConfigKey = true;

        //set common styles
        if (componentModelCopy.styles && componentModelCopy.styles.length > 0) {
            componentModelCopy.styles.forEach((styleKey) => {
                const styleData = innerColumn.uiProperties[styleKey];

                if (styleData) {
                    if (componentModelCopy.initialCmpStyles === undefined) {
                        componentModelCopy.initialCmpStyles = {};
                    }
                    componentModelCopy.initialCmpStyles[styleKey] = styleData;
                }
            });
        }

        //set initial settings values
        if (
            componentModelCopy.settings &&
            componentModelCopy.settings.length !== 0 &&
            innerColumn.settings
        ) {
            componentModelCopy.settings.map((setting) => {
                setting.initialSettingsValue = innerColumn.settings[setting.dataKey];
            });
        }
    }

    return componentModelCopy;
};
