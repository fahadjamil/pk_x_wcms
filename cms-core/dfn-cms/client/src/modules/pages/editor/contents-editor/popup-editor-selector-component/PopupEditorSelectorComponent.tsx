import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import BaseComponentModel from '../models/BaseComponentModel';
import EditorSelectorComponent from './editor-selector-component';

interface PopupEditorSelectorComponentModel {
    onComponentSelected: any;
    onClosePopup: any;
    show: boolean;
}

function PopupEditorSelectorComponent(props: PopupEditorSelectorComponentModel) {
    return (
        <>
            <Modal
                show={props.show}
                onHide={() => {
                    props.onClosePopup && props.onClosePopup();
                }}
                size="xl"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">Component List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a
                                className="nav-link active"
                                id="core-tab"
                                data-toggle="tab"
                                href="#core"
                                role="tab"
                                aria-controls="core"
                                aria-selected="true"
                            >
                                Core
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                id="bk-tab"
                                data-toggle="tab"
                                href="#bk"
                                role="tab"
                                aria-controls="bk"
                                aria-selected="false"
                            >
                                BK Specific
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                            className="nav-link"
                            id="eop-tab"
                            data-toggle="tab"
                            href="#eop"
                            role="tab"
                            aria-controls="eop"
                            aria-selected="false"
                            >
                                EOP Specific

                            </a>

                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div
                            className="tab-pane fade show active"
                            id="core"
                            role="tabpanel"
                            aria-labelledby="core-tab"
                        >
                            <EditorSelectorComponent
                                onComponentClicked={(model: BaseComponentModel) => {
                                    props.onComponentSelected && props.onComponentSelected(model);
                                    props.onClosePopup && props.onClosePopup();
                                }}
                                selectorType="core"
                            />
                        </div>
                        <div
                            className="tab-pane fade"
                            id="bk"
                            role="tabpanel"
                            aria-labelledby="bk-tab"
                        >
                            <EditorSelectorComponent
                                onComponentClicked={(model: BaseComponentModel) => {
                                    props.onComponentSelected && props.onComponentSelected(model);
                                    props.onClosePopup && props.onClosePopup();
                                }}
                                selectorType="bk"
                            />
                        </div>
                        <div
                            className="tab-pane fade"
                            id="eop"
                            role="tabpanel"
                            aria-labelledby="eop-tab"
                        >
                            <EditorSelectorComponent
                                onComponentClicked={(model: BaseComponentModel) => {
                                    props.onComponentSelected && props.onComponentSelected(model);
                                    props.onClosePopup && props.onClosePopup();
                                }}
                                selectorType="eop"
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            props.onClosePopup && props.onClosePopup();
                        }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PopupEditorSelectorComponent;
