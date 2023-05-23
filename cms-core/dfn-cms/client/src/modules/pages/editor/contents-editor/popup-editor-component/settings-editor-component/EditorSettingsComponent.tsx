import React, { forwardRef, useImperativeHandle } from 'react';
import BaseComponentModel from '../../models/BaseComponentModel';
import SettingModel from './models/SettingModel';
import settingComponentMapping from './settings-components/SettingComponentMapping';

interface EditorSettingsComponentModel {
    baseComponentData: BaseComponentModel;
    dbName: string;
    setComponentSettings: any;
    componentSettings: any;
    theme?: any;
}

const EditorSettingsComponent = forwardRef((props: EditorSettingsComponentModel, ref) => {
    let settingsData = props.componentSettings;

    function onSettingsValueChange(state: any) {
        settingsData = { ...settingsData, ...state };
        props.setComponentSettings((prevState) => {
            return { ...prevState, ...settingsData };
        });
    }

    useImperativeHandle(ref, () => ({
        onSubmitClicked() {
            const data = settingsData;
            settingsData = {};

            return data;
        },
    }));

    function getSettingComponent(settingModel: SettingModel, settingModelIndex: number) {
        const SettingComponent = settingComponentMapping[settingModel.settingType];

        return (
            <div
                key={`${settingModel.settingType}-${settingModelIndex}`}
                className="container mt-3"
            >
                <SettingComponent
                    {...settingModel}
                    dbName={props.dbName}
                    onValueSelected={onSettingsValueChange}
                    theme={props.theme}
                />
            </div>
        );
    }

    return (
        <>
            {props.dbName &&
                props.baseComponentData &&
                props.baseComponentData.settings &&
                props.baseComponentData.settings.length !== 0 &&
                props.baseComponentData.settings.map((setting, index) => {
                    return getSettingComponent(setting, index);
                })}
        </>
    );
});

export default EditorSettingsComponent;
