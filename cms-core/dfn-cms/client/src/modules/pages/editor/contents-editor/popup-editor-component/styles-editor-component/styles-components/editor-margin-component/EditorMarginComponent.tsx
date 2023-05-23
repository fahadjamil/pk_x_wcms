import React, { useEffect, useState } from 'react';
import { NumberComponent } from '../../../../../../../shared/ui-components/input-fields/number-component';
import DefaultStyleConfigsModel from '../../models/DefaultStyleModel';

interface PropType {
    styleConfigurations: DefaultStyleConfigsModel[];
    styleData: any;
    styleType: string;
    dataKey: string;
    onValueChange: any;
    theme?: any;
}

function EditorMarginComponent(props: PropType) {
    const { styleConfigurations, styleType, dataKey } = props;
    const [marginSetting, setMarginSetting] = useState(props.styleData);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setMarginSetting(props.styleData);
            props.onValueChange({ [dataKey]: { [styleType]: marginSetting } }, dataKey, styleType);
        }

        return () => {
            isMounted = false;
        };
    }, [props]);

    function handleMarginValueChange(event: any, styleKey: string) {
        if (event && event.target && event.target.value && styleKey) {
            const selectedValue = parseInt(event.target.value);
            let updatedValue = {...marginSetting, [styleKey]: selectedValue};

            setMarginSetting((prevState) => {
                updatedValue = { ...prevState, [styleKey]: selectedValue }
                return updatedValue;
            });
            props.onValueChange({ [dataKey]: { [styleType]: updatedValue } }, dataKey, styleType);
        }
    }

    function getDefaultValue(styleKey: string) {
        if (marginSetting && styleKey && marginSetting[styleKey]) {
            return marginSetting[styleKey];
        } else {
            return 0;
        }
    }

    return (
        <div className="accordion mt-3" id="marginStyleAccordion">
            <div className="card">
                <div className="card-header" id="marginStyleAccordionHeading">
                    <h2 className="mb-0">
                        <button
                            className="btn btn-link"
                            type="button"
                            data-toggle="collapse"
                            data-target="#marginStyleAccordionCollapse"
                            aria-expanded="true"
                            aria-controls="marginStyleAccordionCollapse"
                        >
                            MARGIN
                        </button>
                    </h2>
                </div>
                <div
                    id="marginStyleAccordionCollapse"
                    className="collapse show"
                    aria-labelledby="marginStyleAccordionHeading"
                    data-parent="#marginStyleAccordion"
                >
                    <div className="card-body">
                        <div className="accordion" id="marginConfig">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="">
                                        Margin Styles in PX
                                    </span>
                                </div>
                                {Object.keys(styleConfigurations).map((styleKey, styleIndex) => {
                                    return (
                                        <NumberComponent
                                            key={`margin-${styleIndex}`}
                                            id={`margin-${styleIndex}`}
                                            placeholder={styleConfigurations[styleKey]}
                                            name={`margin-${styleIndex}`}
                                            defaultValue={getDefaultValue(styleKey)}
                                            handleValueChange={(event) => {
                                                handleMarginValueChange(event, styleKey);
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditorMarginComponent;
