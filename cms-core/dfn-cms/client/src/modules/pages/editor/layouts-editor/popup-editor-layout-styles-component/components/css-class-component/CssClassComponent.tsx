import React, { useEffect, useState } from 'react';
import { LongTextComponent } from '../../../../../../shared/ui-components/input-fields/long-text-component';
import ToggleSwitchComponent from '../../../../../../shared/ui-components/input-fields/toggle-switch-component';

interface PropType {
    styleConfigurations: any;
    onValueChange: any;
    styleData: string;
    activeLayoutType: string;
}

function CssClassComponent(props: PropType) {
    const { styleData, activeLayoutType } = props;
    const [customStyles, setCustomStyles] = useState<string>('');
    const [isContainer, setIsContainer] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            setCustomStyles(styleData);
        }
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        props.onValueChange(customStyles, 'cssClass');

        if (activeLayoutType && activeLayoutType === 'section' && customStyles.length > 0) {
            let styles = customStyles;

            if (styles.search('container-fluid') !== -1) {
                setIsContainer(false);
                return;
            }

            if (styles.search('container') === -1) {
                styles = 'container ' + styles;
                setCustomStyles(styles);
            }
        }
    }, [customStyles]);

    const handleCustomStylestate = (event: any) => {
        let styles = customStyles;

        styles = event.target.value;
        setCustomStyles(styles);
    };

    const handleContainerValueChange = (event) => {
        let isChecked = event.target.checked;
        let styles = customStyles;

        if (isChecked) {
            const classesArray = styles.split(' ');
            let updatedClassList = '';

            classesArray.forEach((clsName, clsNameIndex) => {
                if (clsName.length !== 0) {
                    const containerClass = clsName.indexOf('container');
                    const containerFluidClass = clsName.indexOf('container-fluid');

                    // If container class and container-fluid class not exists
                    if (containerClass === -1 && containerFluidClass === -1) {
                        updatedClassList += `${clsName} `;
                    }
                }
            });

            // Remove container-fluid class and add container class
            updatedClassList = 'container ' + updatedClassList;

            setCustomStyles(updatedClassList);
            setIsContainer(true);
            return;
        }

        const classesArray = styles.split(' ');
        let updatedClassList = '';

        classesArray.forEach((clsName, clsNameIndex) => {
            if (clsName.length !== 0) {
                const containerClass = clsName.indexOf('container');
                const containerFluidClass = clsName.indexOf('container-fluid');

                // If container class and container-fluid class not exists
                if (containerClass === -1 && containerFluidClass === -1) {
                    updatedClassList += `${clsName} `;
                }
            }
        });

        // Remove container class and add container-fluid class
        updatedClassList = 'container-fluid ' + updatedClassList;

        setCustomStyles(updatedClassList);
        setIsContainer(false);
        return;
    };

    return (
        <>
            <div className="accordion mt-3" id="cssClassStyleAccordion">
                <div className="card">
                    <div className="card-header" id="cssClassStyleAccordionHeading">
                        <h2 className="mb-0">
                            <button
                                className="btn btn-link"
                                type="button"
                                data-toggle="collapse"
                                data-target="#cssClassStyleAccordionCollapse"
                                aria-expanded="true"
                                aria-controls="cssClassStyleAccordionCollapse"
                            >
                                CSS Classes
                            </button>
                        </h2>
                    </div>
                    <div
                        id="cssClassStyleAccordionCollapse"
                        className="collapse show"
                        aria-labelledby="cssClassStyleAccordionHeading"
                        data-parent="#cssClassStyleAccordion"
                    >
                        <div className="card-body">
                            <div className="accordion" id="cssClassConfig">
                                {activeLayoutType && activeLayoutType === 'section' && (
                                    <div className="form-group">
                                        <label htmlFor="cssClass">
                                            Container / Container Fluid
                                        </label>
                                        <ToggleSwitchComponent
                                            id="isContainer"
                                            name="isContainer"
                                            checked={isContainer}
                                            label="Container"
                                            handleValueChange={handleContainerValueChange}
                                        />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label htmlFor="cssClass">CSS Classes</label>
                                    <LongTextComponent
                                        id="cssClass"
                                        name="cssClass"
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

export default CssClassComponent;
