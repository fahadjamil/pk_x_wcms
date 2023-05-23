import React, { useState } from 'react';
import ImageComponent from '../../../../../../../../custom-collections/collections/media/ImageComponent';
import { Modal, Button } from 'react-bootstrap';
import ExternalMediaComponent from '../../../../../../../../shared/ui-components/input-fields/external-media-component';

interface PropType {
    styleData: any;
    styleType: string;
    dataKey: string;
    onValueChange: any;
}

function BgImageComponent(props: PropType) {
    const { styleData, dataKey, styleType } = props;
    const [showPopUp, setshowPopUp] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');

    const handleValueChange = (event: any) => {
        let fileObj = {
            fileName: event.gridFsFileName,
            filePath: event.src,
        };

        props.onValueChange(fileObj, dataKey, styleType, 'image');
        setSelectedFile(event.thumbnail);
    };

    function handleClose() {
        setshowPopUp(false);
    }

    return (
        <>
            <div className="form-group row">
                <div className="col-sm-3">
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={(e) => {
                            setshowPopUp(true);
                        }}
                    >
                        Add Background Image
                    </button>
                </div>
            </div>
            <div className="col-sm-9">
                {selectedFile !== '' && <img src={selectedFile} alt="Image" />}
            </div>

            <ExternalMediaComponent
                showPopUp={showPopUp}
                modalTitle="Select an image"
                handleClose={handleClose}
                handleValueChange={handleValueChange}
            />
        </>
    );
}

export default BgImageComponent;
