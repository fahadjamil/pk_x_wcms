import React, { useEffect, useState } from 'react';
import ToggleSwitchComponent from '../../../../../../../shared/ui-components/input-fields/toggle-switch-component';
import SettingModel from '../../models/SettingModel';

function SettingSwitchComponent(props: SettingModel) {
    const [initialValue, setInitialValue] = useState<boolean>(false);

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
        setInitialValue(event.target.checked);

        if (props.onValueSelected) {
            props.onValueSelected({
                [props.dataKey]: {
                    value: event.target.checked,
                },
            });
        }
    };

    return (
        <>
            <div className="form-group">
                <ToggleSwitchComponent
                    id={props.dataKey}
                    name={props.dataKey}
                    checked={initialValue}
                    label={props.displayTitle}
                    handleValueChange={handleValueChange}
                />
            </div>
        </>
    );
}

export default SettingSwitchComponent;
