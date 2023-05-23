import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import IconsComponent from '../../../../custom-collections/collections/media/IconsComponent';

function ExternalIconComponent(props: any) {
    const { showPopUp, modalTitle } = props;
    return (
        <>
            <Modal show={showPopUp} onHide={props.handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <IconsComponent
                        IsPopup={true}
                        onIconSelect={(e) => {
                            props.handleValueChange(e);
                        }}
                    ></IconsComponent>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ExternalIconComponent;
