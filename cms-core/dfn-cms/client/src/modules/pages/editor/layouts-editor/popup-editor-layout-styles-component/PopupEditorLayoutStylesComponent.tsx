import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { StyleConfigMappingModels, StyleConfigModels } from 'ui-components';
import LayoutStyleComponentMapping from './components/LayoutStyleComponentMapping';
import BackgroundStyleModel from './models/BackgroundStyleModel';
import LayoutStyleModel from './models/LayoutStyleModel';
import { MarginStyleModel } from './models/MarginStyleModel';
import { PaddingStyleModel } from './models/PaddingStyleModel';

interface PropTypeModel {
    dbName: string;
    activeLayoutType: string;
    activeLayoutId: string;
    activeLayoutStyles: any;
    show: boolean;
    onClosePopup: any;
    onSubmitHandle: any;
    theme: any;
}

function PopupEditorLayoutStylesComponent(props: PropTypeModel) {
    const { styles } = StyleConfigModels;
    const { layoutStyles } = StyleConfigMappingModels;
    const stylesList: string[] = Object.keys(styles);
    const styledLayouts: string[] = Object.keys(layoutStyles);
    const { activeLayoutType, activeLayoutId, activeLayoutStyles } = props;
    const [layoutStyleState, setLayoutStyleState] = useState<LayoutStyleModel>(
        createLayoutStyleState(activeLayoutType, activeLayoutId)
    );
    const theme = props.theme;
    let layoutComponentStyle = {};

    const layoutNameMapping: any = {
        section: 'Section',
        column: 'Column',
        innerSection: 'Inner Section',
        innerColumn: 'Inner Column',
    };

    function createLayoutStyleState(activeLayoutType: string, activeLayoutId: string) {
        let styleState: LayoutStyleModel = {
            sectionId: activeLayoutId,
            style: {},
            initialStyleConfigs: {},
        };

        let background: BackgroundStyleModel = {
            normal: {
                classic: {
                    color: '',
                    image: {
                        fileName: '',
                        filePath: '',
                    },
                },
                gradient: {},
                video: {},
                slideShow: {},
            },
            hover: {},
        };

        let margin: MarginStyleModel = {
            top: '',
            bottom: '',
            left: '',
            right: '',
        };

        let padding: PaddingStyleModel = {
            top: '',
            bottom: '',
            left: '',
            right: '',
        };

        let customCSS: string = '';
        let cssClass: string = '';

        // If background styles exists in the db
        if (activeLayoutStyles && activeLayoutStyles.hasOwnProperty('background')) {
            background = cloneDeep({
                ...background,
                ...activeLayoutStyles.background,
            });
        }

        // If margin styles exists in the db
        if (activeLayoutStyles && activeLayoutStyles.hasOwnProperty('margin')) {
            margin = cloneDeep({
                ...margin,
                ...activeLayoutStyles.margin,
            });
        }

        // If padding styles exists in the db
        if (activeLayoutStyles && activeLayoutStyles.hasOwnProperty('padding')) {
            padding = cloneDeep({
                ...padding,
                ...activeLayoutStyles.padding,
            });
        }

        // If customCSS exists in the db
        if (activeLayoutStyles && activeLayoutStyles.hasOwnProperty('customCSS')) {
            customCSS = activeLayoutStyles.customCSS;
        }

        // If cssClass exists in the db
        if (activeLayoutStyles && activeLayoutStyles.hasOwnProperty('cssClass')) {
            cssClass = activeLayoutStyles.cssClass;
        }

        // Set initial style configs
        styleState.initialStyleConfigs['background'] = background;
        styleState.initialStyleConfigs['margin'] = margin;
        styleState.initialStyleConfigs['padding'] = padding;
        styleState.initialStyleConfigs['customCSS'] = customCSS;
        styleState.initialStyleConfigs['cssClass'] = cssClass;

        // If LayoutStylesConfigurations exists
        if (styledLayouts.includes(activeLayoutType)) {
            // If layout style config is an array
            if (layoutStyles[activeLayoutType] instanceof Array) {
                layoutStyles[activeLayoutType].forEach(
                    (layoutStyle: string, layoutStyleIndex: number) => {
                        if (stylesList.includes(layoutStyle)) {
                            // Get styles from global config
                            const gStyle = styles[layoutStyle];
                            styleState.style[layoutStyle] = gStyle;
                        }
                    }
                );
            } else {
                // If layout style config is an object (similar to style config) - get that object
                const gStyle = layoutStyles[activeLayoutType];
                styleState.style = { ...gStyle };
            }
        }

        return styleState;
    }

    function setLayoutStyles(style, key) {
        layoutComponentStyle[key] = style;
    }

    if (layoutStyleState) {
        const { style, initialStyleConfigs } = layoutStyleState;
        const styleProps: string[] = Object.keys(style);

        return (
            <>
                <Modal show={props.show} onHide={props.onClosePopup} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>{layoutNameMapping[activeLayoutType]} Settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul className="nav nav-tabs" id="layoutStylesSelectorTab" role="tablist">
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    id="layoutStylesSelector-tab"
                                    data-toggle="tab"
                                    href="#layoutStylesSelector"
                                    role="tab"
                                    aria-controls="layoutStylesSelector"
                                    aria-selected="true"
                                >
                                    Styles
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    id="layoutGeneralSelector-tab"
                                    data-toggle="tab"
                                    href="#layoutGeneralSelector"
                                    role="tab"
                                    aria-controls="layoutGeneralSelector"
                                    aria-selected="true"
                                >
                                    General
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    id="layoutActionsSelector-tab"
                                    data-toggle="tab"
                                    href="#layoutActionsSelector"
                                    role="tab"
                                    aria-controls="layoutActionsSelector"
                                    aria-selected="true"
                                >
                                    Actions
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    id="layoutTriggersSelector-tab"
                                    data-toggle="tab"
                                    href="#layoutTriggersSelector"
                                    role="tab"
                                    aria-controls="layoutTriggersSelector"
                                    aria-selected="true"
                                >
                                    Triggers
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    id="layoutResponsiveSelector-tab"
                                    data-toggle="tab"
                                    href="#layoutResponsiveSelector"
                                    role="tab"
                                    aria-controls="layoutResponsiveSelector"
                                    aria-selected="true"
                                >
                                    Responsive
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content" id="layoutStylesSelectorTabContent">
                            <div
                                className="tab-pane fade show active"
                                id="layoutStylesSelector"
                                role="tabpanel"
                                aria-labelledby="layoutStylesSelector-tab"
                            >
                                {styleProps &&
                                    styleProps.map((styleProp, stylePropIndex) => {
                                        const styleVal = style[styleProp];
                                        const FieldStyleComponent =
                                            LayoutStyleComponentMapping[styleProp];

                                        if (FieldStyleComponent) {
                                            return (
                                                <div key={styleProp} className="">
                                                    <FieldStyleComponent
                                                        styleConfigurations={styleVal}
                                                        onValueChange={setLayoutStyles}
                                                        styleData={initialStyleConfigs[styleProp]}
                                                        theme={theme}
                                                        activeLayoutType={activeLayoutType}
                                                    />
                                                </div>
                                            );
                                        } else {
                                            return <></>;
                                        }
                                    })}
                            </div>
                            <div
                                className="tab-pane fade "
                                id="layoutGeneralSelector"
                                role="tabpanel"
                                aria-labelledby="layoutGeneralSelector-tab"
                            >
                                <br />
                                <div className="row">
                                    <div className="col-md">
                                        <h5>CSS Box </h5>
                                        <div className="object__properties">
                                            <div className="margin__container">
                                                <span className="object__property__label">
                                                    Margin
                                                </span>

                                                <input
                                                    type="text"
                                                    className="margin top"
                                                    placeholder="px"
                                                />
                                                <input
                                                    type="text"
                                                    className="margin right"
                                                    placeholder="px"
                                                />
                                                <input
                                                    type="text"
                                                    className="margin left"
                                                    placeholder="px"
                                                />
                                                <input
                                                    type="text"
                                                    className="margin bottom"
                                                    placeholder="px"
                                                />

                                                <div className="boarder__container">
                                                    <span className="object__property__label">
                                                        Boarder
                                                    </span>

                                                    <input
                                                        type="text"
                                                        className="boarder top"
                                                        placeholder="px"
                                                    />
                                                    <input
                                                        type="text"
                                                        className="boarder right"
                                                        placeholder="px"
                                                    />
                                                    <input
                                                        type="text"
                                                        className="boarder left"
                                                        placeholder="px"
                                                    />
                                                    <input
                                                        type="text"
                                                        className="boarder bottom"
                                                        placeholder="px"
                                                    />

                                                    <div className="padding__container">
                                                        <span className="object__property__label">
                                                            Padding
                                                        </span>

                                                        <input
                                                            type="text"
                                                            className="padding top"
                                                            placeholder="px"
                                                        />
                                                        <input
                                                            type="text"
                                                            className="padding right"
                                                            placeholder="px"
                                                        />
                                                        <input
                                                            type="text"
                                                            className="padding left"
                                                            placeholder="px"
                                                        />
                                                        <input
                                                            type="text"
                                                            className="padding bottom"
                                                            placeholder="px"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md">
                                        <h5>Design Options </h5>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Boarder Color</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Boarder Style</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Boarder Radius (Uniform)</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Background Color</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Background Image</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Background Repeat</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Background Size</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Fixed Background Style</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="None"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Background Position</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Box Shadow Color</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="None"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Box Shadow X</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Box Shadow Y</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Box Shadow Blur</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md">
                                        <h5>Custom CSS Code</h5>
                                        <div className="input-group">
                                            <label> Custom Styles</label>
                                            <textarea className="form-control css__textarea" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() => {
                                props.onClosePopup && props.onClosePopup();
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                props.onSubmitHandle && props.onSubmitHandle(layoutComponentStyle);
                            }}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    } else {
        return <></>;
    }
}

export default PopupEditorLayoutStylesComponent;
