import React, { useState, useEffect } from 'react';
import DefaultStyleConfigsModel from '../../models/DefaultStyleModel';
import ColorPickerContainerComponent from '../../../../../../../shared/ui-components/input-fields/color-picker-component';

interface PropType {
    styleConfigurations: DefaultStyleConfigsModel[];
    styleData: string;
    styleType: string;
    dataKey: string;
    onValueChange: any;
    theme?: any;
}

function EditorTextColourComponent(props: PropType) {
    const { styleType, dataKey } = props;
    const [textColorSettings, setTextColorSettings] = useState(props.styleData);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setTextColorSettings(props.styleData);
            props.onValueChange(
                { [dataKey]: { [styleType]: textColorSettings } },
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
                { [dataKey]: { [styleType]: textColorSettings } },
                dataKey,
                styleType
            );
        }

        return () => {
            isMounted = false;
        };
    }, [textColorSettings]);

    const handleTextColorValueChange = (event: any) => {
        setTextColorSettings(event.hex);
    };

    return (
        <>
            <ColorPickerContainerComponent
                id="textColorComponent"
                label="Text Color"
                name="textAlignment"
                defaultValue={textColorSettings}
                theme={props.theme}
                isAddPicker={false}
                onChangeComplete={handleTextColorValueChange}
            />
        </>
    );
}

export default EditorTextColourComponent;
