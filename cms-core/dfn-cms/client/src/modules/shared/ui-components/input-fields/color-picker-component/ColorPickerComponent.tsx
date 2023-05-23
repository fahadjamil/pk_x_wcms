import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { ChromePicker, CirclePicker } from 'react-color';
import styled from 'styled-components';

export default function ColorPickerComponent(props) {
    let theme = props.theme;
    let colors = props.theme.colors.colors;
    let initial = props.defaultValue ? props.defaultValue : '#000000';
    let section = props.section;
    let colorList: any = [];
    const [background, setBackground] = useState(initial);
    const [showPicker, setShowPicker] = useState(false);
    const [showAddPicker, setShowAddPicker] = useState(props.isAddPicker);
    for (var i = 0; i < colors.length; i++) {
        colorList.push(colors[i].value);
    }

    // added transparent color to the color palette.
    if (colorList.length > 0) {
        colorList.push('FFFFFF00');
    }

    const handleChangeComplete = (event) => {
        props.onChangeComplete(event);
        setBackground(event.hex);
    };

    function handleClose() {
        setShowPicker(false);
    }

    const SelectedColor = styled.button`
        max-width: 50px;
        min-width: 50px;
        background-color: ${(props) => props.color};
    `;

    const handleShowPicker = () => {
        setShowPicker(true);
        if (section === 'colors') {
            setShowAddPicker(true);
        }
    };

    return (
        <>
            <span onClick={handleShowPicker}>
                <SelectedColor className="btn btn-md" color={background}></SelectedColor>
            </span>
            <Modal size="sm" show={showPicker} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Color Picker</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!showAddPicker && (
                        <CirclePicker
                            colors={colorList}
                            data-dismiss="modal"
                            color={background}
                            onChangeComplete={handleChangeComplete}
                        />
                    )}
                    {showAddPicker && (
                        <ChromePicker
                            data-dismiss="modal"
                            color={background}
                            onChangeComplete={handleChangeComplete}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button onClick={handleClose}>Select</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
