import React, { useEffect, useState } from 'react';
import ColorPickerContainerComponent from '../../../../../../../shared/ui-components/input-fields/color-picker-component';
import SettingModel from '../../models/SettingModel';

function SettingColorPickerComponent(props: SettingModel) {
    const [initialValue, setInitialValue] = useState<String>(
        props.initialSettingsValue ? props.initialSettingsValue.value : ''
    );

    useEffect(() => {
        if (props.initialSettingsValue && props.initialSettingsValue.value) {
            setInitialValue(props.initialSettingsValue.value);

            if (props.onValueSelected) {
                props.onValueSelected({
                    [props.dataKey]: {
                        value: props.initialSettingsValue.value,
                    },
                });
            }
        }
    }, [props.settingData]);

    const handleValueChange = (event) => {
        setInitialValue(event.hex);

        if (props.onValueSelected) {
            props.onValueSelected({
                [props.dataKey]: {
                    value: event.hex,
                },
            });
        }
    };

    return (
        <>
            <div className="form-group">
                <ColorPickerContainerComponent
                    id="iconColorComponent"
                    label="Icon Color"
                    name="iconColor"
                    defaultValue={initialValue}
                    theme={props.theme}
                    onChangeComplete={handleValueChange}
                />
            </div>
        </>
    );
}

export default SettingColorPickerComponent;
