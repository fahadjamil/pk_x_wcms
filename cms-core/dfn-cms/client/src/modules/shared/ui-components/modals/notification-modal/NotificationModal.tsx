import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface PropType {
    modalTitle: string;
    show: boolean;
    size?: any;
    titleTextClass?: string;
    children?: any;
    handleClose: any;
}

function NotificationModal(props: PropType) {
    const { modalTitle, children, show, size, titleTextClass, handleClose } = props;

    return (
        <>
            <Modal show={show} onHide={handleClose} size={size ? size : 'md'}>
                <Modal.Header closeButton>
                    <Modal.Title className={titleTextClass ? titleTextClass : ''}>
                        {modalTitle}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>{children}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NotificationModal;
