import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import ImageComponent from '../../../../custom-collections/collections/media/ImageComponent';

function ExternalMediaComponent(props: any) {
    const { showPopUp, modalTitle } = props;
    return (
        <>
            <Modal show={showPopUp} onHide={props.handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ImageComponent
                        IsPopup={true}
                        onImageSelect={(e) => {
                            props.handleValueChange(e);
                        }}
                    ></ImageComponent>
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

export default ExternalMediaComponent;
