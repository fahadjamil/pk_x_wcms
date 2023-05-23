import React, { useState, useEffect } from 'react';
import { DropDownComponent } from '../../../../../../../shared/ui-components/input-fields/drop-down-component';
import DefaultStyleConfigsModel from '../../models/DefaultStyleModel';

interface PropType {
    styleConfigurations: DefaultStyleConfigsModel[];
    styleData: string;
    styleType: string;
    dataKey: string;
    onValueChange: any;
    theme?: any;
}

function EditorContentPositionComponent(props: PropType) {
    const { styleConfigurations, styleType, dataKey } = props;
    const [contentPositionSetting, setcontentPositionSetting] = useState<string>(props.styleData);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setcontentPositionSetting(props.styleData);
            props.onValueChange(
                { [dataKey]: { [styleType]: contentPositionSetting } },
                dataKey,
                styleType
            );
        }

        return () => {
            isMounted = false;
        };
    }, [props]);

    function handleContentPositionValueChange(event) {
        if (event && event.target && event.target.value) {
            const selectedSetting = event.target.value;

            setcontentPositionSetting(selectedSetting);
            props.onValueChange(
                { [dataKey]: { [styleType]: selectedSetting } },
                dataKey,
                styleType
            );
        }
    }

    return (
        <div className="form-group row">
            <label htmlFor="contentPositionComponent" className="col-sm-3 col-form-label">
                Content Position
            </label>
            <div className="col-sm-9">
                <DropDownComponent
                    id="contentPositionComponent"
                    name="contentPosition"
                    type="string"
                    isRequired={false}
                    dropDownListContent={styleConfigurations}
                    value={contentPositionSetting}
                    onValueChange={handleContentPositionValueChange}
                />
            </div>
        </div>
    );
}

export default EditorContentPositionComponent;
