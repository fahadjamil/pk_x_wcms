import React, { useEffect, useState } from 'react';
import SearchIcon from '../../resources/SearchIcon';
import { Button, Modal } from 'react-bootstrap';
import { SearchInputComponent } from './SearchInputComponent';

export function SiteSearchComponent(props) {
    const [showModal, setShowModal] = useState(false);
    const { commonConfigs, data } = props;
    const { settings } = data;

    let isFullWidth = false;

    if (settings) {
        isFullWidth = settings.componentType ? settings.componentType.value : false;
    }

    function handleClose() {
        setShowModal(false);
    }

    return (
        <React.Fragment>
            {!showModal && !isFullWidth && (
                <span onClick={() => setShowModal(true)}>
                    <SearchIcon width="24" height="24" />
                </span>
            )}

            {isFullWidth && <SearchInputComponent />}
            {showModal && (
                <Modal className="search-modal" size="lg" show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Search</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SearchInputComponent />
                    </Modal.Body>
                </Modal>
            )}
        </React.Fragment>
    );
}
