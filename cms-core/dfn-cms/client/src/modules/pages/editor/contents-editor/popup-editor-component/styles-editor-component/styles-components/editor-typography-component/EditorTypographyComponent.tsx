import React, { useState, useEffect } from 'react';
import TypographyConfigsModel from '../models/TypographyConfigsModel';
import TypographyModel from '../models/TypographyModel';
import { DropDownComponent } from '../../../../../../../shared/ui-components/input-fields/drop-down-component';

interface PropType {
    styleConfigurations: TypographyConfigsModel;
    styleData: TypographyModel;
    styleType: string;
    dataKey: string;
    onValueChange: any;
    theme?: any;
}

function EditorTypographyComponent(props: PropType) {
    const { styleConfigurations, styleType, dataKey } = props;
    const { fontFamily } = styleConfigurations;
    const [typographySettings, setTypographySettings] = useState(props.styleData);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setTypographySettings(props.styleData);
            props.onValueChange(
                { [dataKey]: { [styleType]: typographySettings } },
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
                { [dataKey]: { [styleType]: typographySettings } },
                dataKey,
                styleType
            );
        }

        return () => {
            isMounted = false;
        };
    }, [typographySettings]);

    const handleFontFamilyValueChange = (event: any) => {
        setTypographySettings({
            ...typographySettings,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <>
            <div id="accordion-typography" className="mb-3">
                <div className="card">
                    <div className="card-header" id="headingOne">
                        <button
                            className="btn btn-link"
                            data-toggle="collapse"
                            data-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                        >
                            Typography
                        </button>
                    </div>
                    <div
                        id="collapseOne"
                        className="collapse show"
                        aria-labelledby="headingOne"
                        data-parent="#accordion-typography"
                    >
                        <div className="card-body">
                            <div className="form-group row">
                                <label
                                    htmlFor="fontPickerComponent"
                                    className="col-sm-3 col-form-label"
                                >
                                    Family
                                </label>
                                <div className="col-sm-9">
                                    <DropDownComponent
                                        id="fontPickerComponent"
                                        name="selectedFontFamily"
                                        type="string"
                                        isRequired={false}
                                        value={typographySettings.selectedFontFamily}
                                        dropDownListContent={fontFamily}
                                        onValueChange={handleFontFamilyValueChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditorTypographyComponent;
