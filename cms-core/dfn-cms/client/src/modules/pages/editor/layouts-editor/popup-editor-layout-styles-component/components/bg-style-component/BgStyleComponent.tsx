import React, { useEffect, useState } from 'react';
import BackgroundStyleModel from '../../models/BackgroundStyleModel';
import BackgroundStyleComponentMapping from './components/BackgroundStyleComponentMapping';

interface PropType {
    styleConfigurations: any;
    onValueChange: any;
    styleData: BackgroundStyleModel;
    theme: any;
}

function BgStyleComponent(props: PropType) {
    const { styleConfigurations, styleData } = props;
    const styleConfigurationsList: string[] = Object.keys(styleConfigurations);
    const [backgroundStyles, setBackgroundStyles] = useState(styleData);
    const theme = props.theme;

    useEffect(() => {
        props.onValueChange(backgroundStyles, 'background');
    }, [backgroundStyles]);

    const handleBackgroundStyleState = (
        state: any,
        dataKey: string,
        styleType: string,
        style: string
    ) => {
        const dataKeys = Object.keys(backgroundStyles);
        let backgroundStylesChanges = { ...backgroundStyles };

        backgroundStylesChanges[dataKey][styleType][style] = state;
        setBackgroundStyles(backgroundStylesChanges);
    };

    return (
        <>
            <div className="accordion" id="backgroundStyleAccordion">
                <div className="">
                    <div className="card-header" id="backgroundStyleAccordionHeading">
                        <h2 className="mb-0">
                            <button
                                className="btn btn-link"
                                type="button"
                                data-toggle="collapse"
                                data-target="#backgroundStyleAccordionCollapse"
                                aria-expanded="true"
                                aria-controls="backgroundStyleAccordionCollapse"
                            >
                                BACKGROUND STYLES
                            </button>
                        </h2>
                    </div>
                    <div
                        id="backgroundStyleAccordionCollapse"
                        className="collapse show"
                        aria-labelledby="backgroundStyleAccordionHeading"
                        data-parent="#backgroundStyleAccordion"
                    >
                        <div className="card-body">
                            <div className="accordion" id="backgroundConfig">
                                {styleConfigurationsList &&
                                    styleConfigurationsList.map(
                                        (styleConfiguration, styleConfigurationIndex) => {
                                            const backgroundStyleConfig =
                                                styleConfigurations[styleConfiguration];
                                            const backgroundStyleConfigList: string[] = Object.keys(
                                                backgroundStyleConfig
                                            );

                                            return (
                                                <div className="card" key={styleConfigurationIndex}>
                                                    <div
                                                        className="card-header"
                                                        id={`${styleConfiguration}-heading`}
                                                    >
                                                        <h2 className="mb-0">
                                                            <button
                                                                className="btn btn-link"
                                                                type="button"
                                                                data-toggle="collapse"
                                                                data-target={`#${styleConfiguration}-collapse`}
                                                                aria-expanded="true"
                                                                aria-controls={`${styleConfiguration}-collapse`}
                                                            >
                                                                {styleConfiguration.toUpperCase()}
                                                            </button>
                                                        </h2>
                                                    </div>
                                                    <div
                                                        id={`${styleConfiguration}-collapse`}
                                                        className="collapse show"
                                                        aria-labelledby={`${styleConfiguration}-heading`}
                                                        data-parent="#backgroundConfig"
                                                    >
                                                        <div className="card-body">
                                                            <ul
                                                                className="nav nav-tabs"
                                                                id="myTab"
                                                                role="tablist"
                                                            >
                                                                {backgroundStyleConfigList &&
                                                                    backgroundStyleConfigList.map(
                                                                        (
                                                                            bgStyleConfig,
                                                                            bgStyleConfigIndex
                                                                        ) => {
                                                                            let active =
                                                                                bgStyleConfigIndex ===
                                                                                0
                                                                                    ? ' active'
                                                                                    : '';

                                                                            return (
                                                                                <li
                                                                                    key={
                                                                                        bgStyleConfigIndex
                                                                                    }
                                                                                    className="nav-item"
                                                                                >
                                                                                    <a
                                                                                        className={
                                                                                            'nav-link' +
                                                                                            active
                                                                                        }
                                                                                        id={
                                                                                            bgStyleConfig +
                                                                                            '-tab'
                                                                                        }
                                                                                        data-toggle="tab"
                                                                                        href={
                                                                                            '#' +
                                                                                            bgStyleConfig
                                                                                        }
                                                                                        role="tab"
                                                                                        aria-controls={
                                                                                            bgStyleConfig
                                                                                        }
                                                                                        aria-selected="true"
                                                                                    >
                                                                                        {bgStyleConfig.toUpperCase()}
                                                                                    </a>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    )}
                                                            </ul>
                                                            <div
                                                                className="tab-content"
                                                                id="myTabContent"
                                                            >
                                                                {backgroundStyleConfigList &&
                                                                    backgroundStyleConfigList.map(
                                                                        (
                                                                            bgStyleConfig,
                                                                            bgStyleConfigIndex
                                                                        ) => {
                                                                            const basicStyles =
                                                                                backgroundStyleConfig[
                                                                                    bgStyleConfig
                                                                                ];
                                                                            const basicStylesList: string[] = Object.keys(
                                                                                basicStyles
                                                                            );
                                                                            let active =
                                                                                bgStyleConfigIndex ===
                                                                                0
                                                                                    ? ' show active'
                                                                                    : '';

                                                                            return (
                                                                                <div
                                                                                    key={
                                                                                        bgStyleConfigIndex
                                                                                    }
                                                                                    className={
                                                                                        'tab-pane fade pt-2' +
                                                                                        active
                                                                                    }
                                                                                    id={
                                                                                        bgStyleConfig
                                                                                    }
                                                                                    role="tabpanel"
                                                                                    aria-labelledby={
                                                                                        bgStyleConfig +
                                                                                        '-tab'
                                                                                    }
                                                                                >
                                                                                    {basicStylesList &&
                                                                                        basicStylesList.map(
                                                                                            (
                                                                                                basicStyle,
                                                                                                basicStyleIndex
                                                                                            ) => {
                                                                                                const BasicBackgroundStyleComponent =
                                                                                                    BackgroundStyleComponentMapping[
                                                                                                        basicStyle
                                                                                                    ];

                                                                                                if (
                                                                                                    BasicBackgroundStyleComponent
                                                                                                ) {
                                                                                                    let basicBackgroundStyleData =
                                                                                                        styleData[
                                                                                                            styleConfiguration
                                                                                                        ][
                                                                                                            bgStyleConfig
                                                                                                        ][
                                                                                                            basicStyle
                                                                                                        ];

                                                                                                    return (
                                                                                                        <BasicBackgroundStyleComponent
                                                                                                            key={
                                                                                                                basicStyleIndex
                                                                                                            }
                                                                                                            styleType={
                                                                                                                bgStyleConfig
                                                                                                            }
                                                                                                            dataKey={
                                                                                                                styleConfiguration
                                                                                                            }
                                                                                                            styleData={
                                                                                                                basicBackgroundStyleData
                                                                                                            }
                                                                                                            onValueChange={
                                                                                                                handleBackgroundStyleState
                                                                                                            }
                                                                                                            theme={
                                                                                                                theme
                                                                                                            }
                                                                                                        />
                                                                                                    );
                                                                                                } else {
                                                                                                    return (
                                                                                                        <React.Fragment
                                                                                                            key={
                                                                                                                basicStyleIndex
                                                                                                            }
                                                                                                        ></React.Fragment>
                                                                                                    );
                                                                                                }
                                                                                            }
                                                                                        )}
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BgStyleComponent;
