import React, { useEffect, useState } from 'react';
import { NumberComponent } from '../../../../../../shared/ui-components/input-fields/number-component';
import { PaddingStyleModel } from '../../models/PaddingStyleModel';

interface PropType {
    styleConfigurations: any;
    onValueChange: any;
    styleData: PaddingStyleModel;
}

function PaddingComponent(props: PropType) {
    const { styleConfigurations, styleData } = props;
    const styleConfigurationsList: string[] = Object.keys(styleConfigurations);
    const [paddingStyles, setPaddingStyles] = useState(styleData);

    useEffect(() => {
        props.onValueChange(paddingStyles, 'padding');
    }, [paddingStyles]);

    const handlePaddingStyleState = (event: any, styleConfig: string) => {
        let styles = { ...paddingStyles };

        styles[styleConfig] = event.target.value;
        setPaddingStyles(styles);
    };

    return (
        <>
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
                                            Padding Styles
                                        </span>
                                    </div>
                                    {styleConfigurationsList.map(
                                        (styleConfig, styleConfigIndex) => {
                                            return (
                                                <NumberComponent
                                                    key={`padding-${styleConfigIndex}`}
                                                    id={`padding-${styleConfigIndex}`}
                                                    placeholder={styleConfigurations[styleConfig]}
                                                    name={`padding-${styleConfigIndex}`}
                                                    defaultValue={paddingStyles[styleConfig]}
                                                    handleValueChange={(event) => {
                                                        handlePaddingStyleState(event, styleConfig);
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

export default PaddingComponent;
