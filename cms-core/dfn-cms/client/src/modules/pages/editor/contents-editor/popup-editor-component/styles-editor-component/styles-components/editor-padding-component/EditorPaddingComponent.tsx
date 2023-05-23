import React, { useEffect, useState } from 'react'
import { NumberComponent } from '../../../../../../../shared/ui-components/input-fields/number-component';
import DefaultStyleConfigsModel from '../../models/DefaultStyleModel'

interface PropType {
    styleConfigurations: DefaultStyleConfigsModel[];
    styleData: any;
    styleType: string;
    dataKey: string;
    onValueChange: any;
    theme?: any;
}

function EditorPaddingComponent(props: PropType) {
    const { styleConfigurations, styleType, dataKey } = props;
    const [paddingSetting, setPaddingSetting] = useState(props.styleData);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            setPaddingSetting(props.styleData);
            props.onValueChange(
                { [dataKey]: { [styleType]: paddingSetting } },
                dataKey,
                styleType
            );
        }

        return () => {
            isMounted = false;
        };
    }, [props]);
    
    function handlePaddingValueChange(event: any, styleKey: string) {
        if (event && event.target && event.target.value && styleKey) {
            const selectedValue = parseInt(event.target.value);
            let updatedValue = {...paddingSetting, [styleKey]: selectedValue};

            setPaddingSetting((prevState) => {
                updatedValue = { ...prevState, [styleKey]: selectedValue }
                return updatedValue;
            });
            props.onValueChange({ [dataKey]: { [styleType]: updatedValue } }, dataKey, styleType);
        }
    }

    function getDefaultValue(styleKey: string) {
        if (paddingSetting && styleKey && paddingSetting[styleKey]) {
            return paddingSetting[styleKey];
        } else {
            return 0;
        }
    }

    return (
        <div className="accordion mt-3" id="paddingStyleAccordion">
                <div className="card">
                    <div className="card-header" id="paddingStyleAccordionHeading">
                        <h2 className="mb-0">
                            <button
                                className="btn btn-link"
                                type="button"
                                data-toggle="collapse"
                                data-target="#paddingStyleAccordionCollapse"
                                aria-expanded="true"
                                aria-controls="paddingStyleAccordionCollapse"
                            >
                                PADDING
                            </button>
                        </h2>
                    </div>
                    <div
                        id="paddingStyleAccordionCollapse"
                        className="collapse show"
                        aria-labelledby="paddingStyleAccordionHeading"
                        data-parent="#paddingStyleAccordion"
                    >
                        <div className="card-body">
                            <div className="accordion" id="paddingConfig">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="">
                                            Padding Styles in PX
                                        </span>
                                    </div>
                                    {Object.keys(styleConfigurations).map((styleKey, styleIndex) => {
                                            return (
                                                <NumberComponent
                                                    key={`padding-${styleIndex}`}
                                                    id={`padding-${styleIndex}`}
                                                    placeholder={styleConfigurations[styleKey]}
                                                    name={`padding-${styleIndex}`}
                                                    defaultValue={getDefaultValue(styleKey)}
                                                    handleValueChange={(event) => {
                                                        handlePaddingValueChange(event, styleKey);
                                                    }}
                                                />
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default EditorPaddingComponent
