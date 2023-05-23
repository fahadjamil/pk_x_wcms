import React, { useEffect, useState } from 'react';
import ColorPickerContainerComponent from '../../../../../../../../shared/ui-components/input-fields/color-picker-component';

interface PropType {
    styleData: any;
    styleType: string;
    dataKey: string;
    onValueChange: any;
    theme: any;
}

function BgColorComponent(props: PropType) {
    const { styleData, dataKey, styleType } = props;
    const [backgroundColor, setBackgroundColor] = useState(styleData);

    useEffect(() => {
        props.onValueChange(backgroundColor, dataKey, styleType, 'color');
    }, [backgroundColor]);

    const handleBackgroundColorChange = (event: any) => {
        setBackgroundColor(event.hex);
    };

    return (
        <>
            <ColorPickerContainerComponent
                id="backgroundColorComponent"
                label="Background Color"
                name="backgroundColor"
                defaultValue={backgroundColor}
                theme={props.theme}
                onChangeComplete={handleBackgroundColorChange}
            />
        </>
    );
}

export default BgColorComponent;
