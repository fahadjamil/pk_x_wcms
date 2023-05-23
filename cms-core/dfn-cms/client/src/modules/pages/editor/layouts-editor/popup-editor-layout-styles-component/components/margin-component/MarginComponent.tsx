import React, { useEffect, useState } from 'react';
import { NumberComponent } from '../../../../../../shared/ui-components/input-fields/number-component';
import { MarginStyleModel } from '../../models/MarginStyleModel';

interface PropType {
    styleConfigurations: any;
    onValueChange: any;
    styleData: MarginStyleModel;
}

function MarginComponent(props: PropType) {
    const { styleConfigurations, styleData } = props;
    const styleConfigurationsList: string[] = Object.keys(styleConfigurations);
    const [marginStyles, setMarginStyles] = useState(styleData);

    useEffect(() => {
        props.onValueChange(marginStyles, 'margin');
    }, [marginStyles]);

    const handleMarginStyleState = (event: any, styleConfig: string) => {
        let styles = { ...marginStyles };

        styles[styleConfig] = event.target.value;
        setMarginStyles(styles);
    };

    return (
        <>
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
                                    {styleConfigurationsList.map(
                                        (styleConfig, styleConfigIndex) => {
                                            return (
                                                <NumberComponent
                                                    key={`margin-${styleConfigIndex}`}
                                                    id={`margin-${styleConfigIndex}`}
                                                    placeholder={styleConfigurations[styleConfig]}
                                                    name={`margin-${styleConfigIndex}`}
                                                    defaultValue={marginStyles[styleConfig]}
                                                    handleValueChange={(event) => {
                                                        handleMarginStyleState(event, styleConfig);
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
        </>
    );
}

export default MarginComponent;
