import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface PropType {
    modalTitle: string;
    submitBtnText: string;
    show: boolean;
    disabled?: boolean;
    centered?: boolean;
    size?: any;
    children?: any;
    handleClose: any;
    handleConfirme: any;
}
function InformationModal(props: PropType) {
    const {
        modalTitle,
        children,
        show,
        handleClose,
        handleConfirme,
        submitBtnText,
        size,
        disabled,
        centered,
    } = props;

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                size={size ? size : 'md'}
                centered={centered || false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{children}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirme}
                        disabled={disabled ? disabled : false}
                    >
                        {submitBtnText}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default InformationModal;
