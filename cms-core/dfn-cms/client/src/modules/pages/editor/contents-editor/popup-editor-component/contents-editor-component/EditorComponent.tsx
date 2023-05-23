import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { SettingsConfigMappingModels, SettingsConfigModels } from 'ui-components';
import LanguageModel from '../../../../../shared/models/LanguageModel';
import SectionModel from '../../../../../shared/models/page-data-models/SectionModel';
import { createFieldComponentSettings } from '../../../../../shared/utils/EditorUtils';
import BaseComponentModel from '../../models/BaseComponentModel';
import FiledComponentMapping from './fields-components/FieldComponentMapping';
import FieldComponetModel from './models/FieldComponentModel';

interface EditorComponentModel {
    baseComponentData: BaseComponentModel;
    dbName: string;
    componentSettings: string;
    languageData: LanguageModel[];
    setComponentSettings: any;
    sections: SectionModel[];
}

const EditorComponent = forwardRef((props: EditorComponentModel, ref) => {
    const [editorFieldsData, setEditorFieldsData] = useState({});
    const { settings } = SettingsConfigModels;
    const { fieldsSettings } = SettingsConfigMappingModels;
    const settingsList = Object.keys(settings);
    // let editorFieldsData = {};
    let componentSettingsState = createFieldComponentSettings(
        props.baseComponentData,
        settings,
        fieldsSettings,
        settingsList
    );

    const setBaseComponentState = (state: any, languageKey: string) => {
        editorFieldsData[languageKey] = { ...editorFieldsData[languageKey], ...state };
    };

    const setBaseComponentUiState = (uiState) => {
        props.setComponentSettings((prevState) => {
            return { ...prevState, ...uiState };
        });
    };

    useImperativeHandle(ref, () => ({
        onSubmitClicked() {
            if (props.baseComponentData.initialDataKey) {
                setEditorFieldsData({
                    ...editorFieldsData,
                    id: props.baseComponentData.initialDataKey,
                });
            }

            const data = editorFieldsData;
            setEditorFieldsData({});
            return data;
        },
    }));

    const getComponentLanguageWise = (fieldModel: FieldComponetModel, settingsFieldModel: any) => {
        const FieldComponent = FiledComponentMapping[fieldModel.fieldType];

        return (
            <React.Fragment key={fieldModel.fieldType + '-' + fieldModel.dataKey}>
                {props.languageData.map((languageItem, languageItemIndex) => {
                    let compId = '';
                    if (props.baseComponentData.initialDataKey) {
                        compId = props.baseComponentData.initialDataKey;
                    }

                    let modelData: FieldComponetModel = {
                        ...fieldModel,
                        language: languageItem,
                        componentKey: compId,
                        componentSettings: props.componentSettings,
                        contentUiSettings: settingsFieldModel,
                    };

                    return (
                        <div
                            key={fieldModel.fieldType + languageItem.langKey}
                            className="container mt-3"
                        >
                            <FieldComponent
                                {...modelData}
                                dbName={props.dbName}
                                onValueChange={
                                    settingsFieldModel
                                        ? setBaseComponentUiState
                                        : setBaseComponentState
                                }
                                sections={props.sections}
                                fieldIndex={languageItemIndex}
                            />
                        </div>
                    );
                })}
            </React.Fragment>
        );
    };

    function getParentComponent(
        fieldModel: FieldComponetModel,
        settingsFieldModel: any,
        settingsFieldModelIndex: number
    ) {
        const FieldComponent = FiledComponentMapping[fieldModel.fieldType];
        let compId = '';

        if (props.baseComponentData.initialDataKey) {
            compId = props.baseComponentData.initialDataKey;
        }

        let modelData: FieldComponetModel = {
            ...fieldModel,
            componentKey: compId,
            componentSettings: props.componentSettings,
            languageData: props.languageData,
            contentUiSettings: settingsFieldModel,
        };

        return (
            <div className="container mt-3" key={fieldModel.fieldType + '-' + fieldModel.dataKey}>
                <FieldComponent
                    {...modelData}
                    dbName={props.dbName}
                    onValueChange={
                        settingsFieldModel ? setBaseComponentUiState : setBaseComponentState
                    }
                    fieldIndex={settingsFieldModelIndex}
                />
            </div>
        );
    }

    const getComponentFromLangConfig = (
        fieldModel: FieldComponetModel,
        settingsFieldModel: any,
        settingsFieldModelIndex: number
    ) => {
        if (fieldModel.isLanguageWiseContentPresent) {
            return getComponentLanguageWise(fieldModel, settingsFieldModel);
        } else {
            return getParentComponent(fieldModel, settingsFieldModel, settingsFieldModelIndex);
        }
    };

    return (
        <>
            {props.baseComponentData &&
                props.baseComponentData.compFields &&
                props.baseComponentData.compFields.map((fieldModel) => {
                    if (componentSettingsState) {
                        return (
                            componentSettingsState.compFields &&
                            componentSettingsState.compFields.map(
                                (settingsFieldModel: any, settingsFieldModelIndex: number) => {
                                    if (settingsFieldModel.fieldType === fieldModel.fieldType) {
                                        return getComponentFromLangConfig(
                                            fieldModel,
                                            settingsFieldModel,
                                            settingsFieldModelIndex
                                        );
                                    } else {
                                        return <></>;
                                    }
                                }
                            )
                        );
                    } else {
                        return getComponentFromLangConfig(fieldModel, undefined, -1);
                    }
                })}
        </>
    );
});

export default EditorComponent;
