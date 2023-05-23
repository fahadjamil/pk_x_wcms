import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import PopupEditorColumnSelectorComponent from '../popup-editor-column-selector-component';
import { modalBodyStyles } from './PopupEditorInnerSectionsSelectorComponentStyles';

interface PropType {
    show: boolean;
    title?: string;
    contentHeader?: string;
    onColumnSelect: any;
    onClosePopup: any;
}

function PopupEditorInnerSectionsSelectorComponent(props: PropType) {
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
                    <Modal.Title className="text-center">
                        {props.title ? props.title : `Inner Sections`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={modalBodyStyles}>
                        <PopupEditorColumnSelectorComponent
                            onColumnSelect={props.onColumnSelect}
                            onClosePopup={props.onClosePopup}
                            contentHeader={
                                props.contentHeader
                                    ? props.contentHeader
                                    : `Select Your Layout Structure`
                            }
                        />
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

export default PopupEditorInnerSectionsSelectorComponent;
