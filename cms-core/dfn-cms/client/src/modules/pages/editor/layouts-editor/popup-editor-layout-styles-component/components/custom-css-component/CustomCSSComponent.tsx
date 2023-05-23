import React, { useEffect, useState } from 'react';
import { LongTextComponent } from '../../../../../../shared/ui-components/input-fields/long-text-component';

interface PropType {
    styleConfigurations: any;
    onValueChange: any;
    styleData: string;
}

function CustomCSSComponent(props: PropType) {
    const { styleData } = props;
    const [customStyles, setCustomStyles] = useState(styleData);

    useEffect(() => {
        props.onValueChange(customStyles, 'customCSS');
    }, [customStyles]);

    const handleCustomStylestate = (event: any) => {
        let styles = customStyles;

        styles = event.target.value;
        setCustomStyles(styles);
    };

    return (
        <>
            <div className="accordion mt-3" id="customCssStyleAccordion">
                <div className="card">
                    <div className="card-header" id="customCssStyleAccordionHeading">
                        <h2 className="mb-0">
                            <button
                                className="btn btn-link"
                                type="button"
                                data-toggle="collapse"
                                data-target="#customCssStyleAccordionCollapse"
                                aria-expanded="true"
                                aria-controls="customCssStyleAccordionCollapse"
                            >
                                Custom CSS
                            </button>
                        </h2>
                    </div>
                    <div
                        id="customCssStyleAccordionCollapse"
                        className="collapse show"
                        aria-labelledby="customCssStyleAccordionHeading"
                        data-parent="#customCssStyleAccordion"
                    >
                        <div className="card-body">
                            <div className="accordion" id="customCssConfig">
                                <label htmlFor="customCss" className="col-sm-3 col-form-label">
                                    Custom CSS
                                </label>
                                <div className="col-sm-12">
                                    <LongTextComponent
                                        id="customCss"
                                        name="customCss"
                                        defaultValue={customStyles}
                                        handleValueChange={handleCustomStylestate}
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

export default CustomCSSComponent;
