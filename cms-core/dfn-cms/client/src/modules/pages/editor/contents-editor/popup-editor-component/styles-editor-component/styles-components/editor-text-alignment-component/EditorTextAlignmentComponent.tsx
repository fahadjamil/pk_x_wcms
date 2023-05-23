import React, { useState, useEffect } from 'react';
import DefaultStyleConfigsModel from '../../models/DefaultStyleModel';
import { DropDownComponent } from '../../../../../../../shared/ui-components/input-fields/drop-down-component';

interface PropType {
    styleConfigurations: DefaultStyleConfigsModel[];
    styleData: string;
    styleType: string;
    dataKey: string;
    onValueChange: any;
    theme?: any;
}

function EditorTextAlignmentComponent(props: PropType) {
    const { styleConfigurations, styleType, dataKey } = props;
    const [textAlignmentSettings, setTextAlignmentSettings] = useState(props.styleData);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setTextAlignmentSettings(props.styleData);
            props.onValueChange(
                { [dataKey]: { [styleType]: textAlignmentSettings } },
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
                { [dataKey]: { [styleType]: textAlignmentSettings } },
                dataKey,
                styleType
            );
        }

        return () => {
            isMounted = false;
        };
    }, [textAlignmentSettings]);

    const handleTextAlignmentValueChange = (event: any) => {
        setTextAlignmentSettings(event.target.value);
    };

    return (
        <>
            <div className="form-group row">
                <label htmlFor="textAlignmentComponent" className="col-sm-3 col-form-label">
                    Text Alignment
                </label>
                <div className="col-sm-9">
                    <DropDownComponent
                        id="textAlignmentComponent"
                        name="textAlignment"
                        type="string"
                        isRequired={false}
                        value={textAlignmentSettings}
                        dropDownListContent={styleConfigurations}
                        onValueChange={handleTextAlignmentValueChange}
                    />
                </div>
            </div>
        </>
    );
}

export default EditorTextAlignmentComponent;
