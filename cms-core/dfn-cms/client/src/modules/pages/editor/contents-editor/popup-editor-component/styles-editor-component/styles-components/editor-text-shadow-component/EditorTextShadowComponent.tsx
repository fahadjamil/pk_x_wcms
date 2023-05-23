import React, { useState, useEffect } from 'react';
import DefaultStyleConfigsModel from '../../models/DefaultStyleModel';
import TextShadowModel from '../models/TextShadowModel';
import { NumberComponent } from '../../../../../../../shared/ui-components/input-fields/number-component';

interface PropType {
    styleConfigurations: DefaultStyleConfigsModel[];
    styleData: TextShadowModel;
    styleType: string;
    dataKey: string;
    onValueChange: any;
    theme?: any;
}

function EditorTextShadowComponent(props: PropType) {
    const { styleConfigurations, styleType, dataKey } = props;
    const [textShadowSettings, setTextShadowSettings] = useState(props.styleData);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setTextShadowSettings(props.styleData);
            props.onValueChange(
                { [dataKey]: { [styleType]: textShadowSettings } },
                dataKey,
                styleType
            );
        }

        return () => {
            isMounted = false;
        };
    }, [props]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            props.onValueChange(
                { [dataKey]: { [styleType]: textShadowSettings } },
                dataKey,
                styleType
            );
        }

        return () => {
            isMounted = false;
        };
    }, [textShadowSettings]);

    const handleTextShadowValueChange = (event: any) => {
        setTextShadowSettings({
            ...textShadowSettings,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <>
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Text Shadow</label>
                <div className="col-sm-9">
                    {styleConfigurations.map((style, index) => {
                        const { key, value } = style;
                        const stateValue = `${key}value`;

                        return (
                            <div key={index} className="form-group row">
                                <label htmlFor={key} className="col-sm-5 col-form-label">
                                    {value}
                                </label>
                                <div className="col-sm-7">
                                    <NumberComponent
                                        id={key}
                                        name={stateValue}
                                        defaultValue={textShadowSettings[stateValue]}
                                        isRequired={false}
                                        minLength={0}
                                        maxLength={100}
                                        handleValueChange={handleTextShadowValueChange}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default EditorTextShadowComponent;
