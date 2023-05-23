import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface PropType {
    modalTitle: string;
    show: boolean;
    size?: any;
    children?: any;
    handleClose: any;
    handleConfirme: any;
}

function ConfirmationModal(props: PropType) {
    const { modalTitle, children, show, size, handleClose, handleConfirme } = props;

    return (
        <>
            <Modal show={show} onHide={handleClose} size={size ? size : 'md'}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{children}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleConfirme}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ConfirmationModal;
