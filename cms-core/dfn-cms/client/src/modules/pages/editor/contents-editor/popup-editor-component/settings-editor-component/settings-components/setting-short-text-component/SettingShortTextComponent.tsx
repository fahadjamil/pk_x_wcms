import React, { useEffect, useState } from 'react';
import { ShortTextComponent } from '../../../../../../../shared/ui-components/input-fields/short-text-component';
import SettingModel from '../../models/SettingModel';

function SettingShortTextComponent(props: SettingModel) {
    const [initialValue, setInitialValue] = useState('');

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
        setInitialValue(event.target.value);

        if (props.onValueSelected) {
            props.onValueSelected({
                [props.dataKey]: {
                    value: event.target.value,
                },
            });
        }
    };

    return (
        <>
            <div className="form-group">
                <label htmlFor="textInput">{props.displayTitle}</label>
                <ShortTextComponent
                    id="textInput"
                    label={props.displayTitle}
                    name="textInput"
                    defaultValue={initialValue}
                    isRequired={false}
                    isAutofocus={true}
                    handleValueChange={handleValueChange}
                />
            </div>
        </>
    );
}

export default SettingShortTextComponent;
