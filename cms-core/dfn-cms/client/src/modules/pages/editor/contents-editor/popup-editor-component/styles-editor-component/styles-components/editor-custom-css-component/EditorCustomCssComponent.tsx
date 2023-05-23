import React, { useState, useEffect } from 'react';
import DefaultStyleConfigsModel from '../../models/DefaultStyleModel';
import { LongTextComponent } from '../../../../../../../shared/ui-components/input-fields/long-text-component';

interface PropType {
    styleConfigurations: DefaultStyleConfigsModel[];
    styleData: string;
    styleType: string;
    dataKey: string;
    onValueChange: any;
    theme?: any;
}

function EditorCustomCssComponent(props: PropType) {
    const { styleType, dataKey } = props;
    const [customCss, setCustomCss] = useState(props.styleData);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setCustomCss(props.styleData);
            props.onValueChange({ [dataKey]: { [styleType]: customCss } }, dataKey, styleType);
        }

        return () => {
            isMounted = false;
        };
    }, [props]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            props.onValueChange({ [dataKey]: { [styleType]: customCss } }, dataKey, styleType);
        }

        return () => {
            isMounted = false;
        };
    }, [customCss]);

    const handleCustomCssValueChange = (event: any) => {
        setCustomCss(event.target.value);
    };

    return (
        <>
            <div className="form-group row">
                <label htmlFor="customCss" className="col-sm-3 col-form-label">
                    Custom CSS
                </label>
                <div className="col-sm-9">
                    <LongTextComponent
                        id="customCss"
                        name="customCss"
                        defaultValue={customCss}
                        handleValueChange={handleCustomCssValueChange}
                    />
                </div>
            </div>
        </>
    );
}

export default EditorCustomCssComponent;
