import Axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { ColorPickerComponent } from '../../../shared/ui-components/input-fields/color-picker-component';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';

export default function AddColorComponent(props) {
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [colorName, setColorName] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    let theme = props.theme;
    const pageId = props.theme._id;
    let db = props.theme.website;

    function handleClose() {
        setShowPreview(false);
    }

    function submitColor() {
        theme.colors.colors.push({
            value: selectedColor,
            porpType: 'colorPicker',
            propertyName: colorName,
        });

        const { _id, ...themeData } = theme;
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        Axios.post(
            '/api/theme/update',
            {
                collection: 'themes',
                dbName: db,
                pageId: pageId,
                themeData: themeData,
            },
            httpHeaders
        )
            .then((response) => {})
            .catch((err) => {
                console.log(err);
            });

        handleClose();
        props.onUpdate(theme.colors);
    }

    function handleChangeComplete(color) {
        setSelectedColor(color.hex);
    }

    return (
        <>
            <button
                className="btn btn-primary"
                onClick={() => {
                    setShowPreview(true);
                }}
            >
                Add
            </button>

            <Modal size="sm" show={showPreview} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Color</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col">
                        <label htmlFor="AddColorName">Color Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="AddColorName"
                            onChange={(e) => setColorName(e.target.value)}
                            minLength={2}
                        />
                        <br />
                        <div>
                            <span>Select Color : </span>
                            <ColorPickerComponent
                                theme={theme}
                                isAddPicker={props.isAddPicker}
                                onChangeComplete={handleChangeComplete}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button onClick={submitColor}>Add</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
