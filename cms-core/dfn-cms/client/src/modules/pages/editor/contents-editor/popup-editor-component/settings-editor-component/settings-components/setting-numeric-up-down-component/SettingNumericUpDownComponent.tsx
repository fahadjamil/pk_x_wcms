import React, { useEffect, useState } from 'react';
import SettingModel from '../../models/SettingModel';
import { NumberComponent } from '../../../../../../../shared/ui-components/input-fields/number-component';

function SettingNumericUpDownComponent(props: SettingModel) {
    const [maxValue, setMaxValue] = useState(Number.MAX_SAFE_INTEGER);
    const [minValue, setMinValue] = useState(Number.MIN_SAFE_INTEGER);
    const [updateValue, setUpdateValue] = useState(0);

    useEffect(() => {
        if (props.settingData) {
            if (props.settingData.maxValue) {
                setMaxValue(props.settingData.maxValue);
            }
            if (props.settingData.minValue) {
                setMinValue(props.settingData.minValue);
            }
            if (props.settingData.defaultValue) {
                setUpdateValue(props.settingData.defaultValue);
                submitOnValueChange(props.settingData.defaultValue);
            }
        }
        if (props.initialSettingsValue && props.initialSettingsValue.value) {
            setUpdateValue(props.initialSettingsValue.value);
            submitOnValueChange(props.initialSettingsValue.value);
        }
    }, [props.settingData]);

    function onValueChange(value: number) {
        setUpdateValue(value);
        submitOnValueChange(value);
    }

    function submitOnValueChange(value: number) {
        if (props.onValueSelected) {
            props.onValueSelected({
                [props.dataKey]: {
                    value: value,
                },
            });
        }
    }

    return (
        <div className="form-group">
            <label htmlFor="numberInput">{props.displayTitle}</label>
            <NumberComponent
                id="numberInput"
                label={props.displayTitle}
                name="quantity"
                defaultValue={updateValue}
                isRequired={false}
                minLength={minValue}
                maxLength={maxValue}
                handleValueChange={(e) => {
                    onValueChange(parseInt(e.target.value));
                }}
            />
        </div>
    );
}

export default SettingNumericUpDownComponent;
