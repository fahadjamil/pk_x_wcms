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

function EditorCssClassComponent(props: PropType) {
    const { styleType, dataKey } = props;
    const [cssClass, setCssClass] = useState(props.styleData);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setCssClass(props.styleData);
            props.onValueChange({ [dataKey]: { [styleType]: cssClass } }, dataKey, styleType);
        }

        return () => {
            isMounted = false;
        };
    }, [props]);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            props.onValueChange({ [dataKey]: { [styleType]: cssClass } }, dataKey, styleType);
        }

        return () => {
            isMounted = false;
        };
    }, [cssClass]);

    const handleCssClassValueChange = (event: any) => {
        setCssClass(event.target.value);
    };

    return (
        <>
            <div className="form-group row">
                <label htmlFor="cssClass" className="col-sm-3 col-form-label">
                    CSS Classes
                </label>
                <div className="col-sm-9">
                    <LongTextComponent
                        id="cssClass"
                        name="cssClass"
                        defaultValue={cssClass}
                        handleValueChange={handleCssClassValueChange}
                    />
                </div>
            </div>
        </>
    );
}

export default EditorCssClassComponent;
