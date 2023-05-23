import React, { useEffect, useState } from 'react';
import ExternalMediaComponent from '../../../../../../../shared/ui-components/input-fields/external-media-component';

function ImageGalleryComponent(props) {
    const [isOpenImageGallery, setIsOpenImageGallery] = useState(false);
    const [mediaData, setMediaData] = useState<any>({});
    const [selectedFile, setSelectedFile] = useState('');

    useEffect(() => {
        if (props.initialSettingsValue && props.initialSettingsValue.value) {
            setMediaData(props.initialSettingsValue.value);

            if (props.initialSettingsValue.value.thumbnailUri) {
                setSelectedFile(props.initialSettingsValue.value.thumbnailUri);
            }

            if (props.onValueSelected) {
                props.onValueSelected({
                    [props.dataKey]: {
                        value: props.initialSettingsValue.value,
                    },
                });
            }
        }
    }, [props.settingData]);

    function openImageGallery() {
        setIsOpenImageGallery(true);
    }

    function closeImageGallery() {
        setIsOpenImageGallery(false);
    }

    const handleValueChange = (data) => {
        let fileObj = {
            fileName: data.gridFsFileName,
            filePath: data.src,
            thumbnailUri: data.thumbnail,
        };

        setMediaData(fileObj);
        setSelectedFile(data.thumbnail);
        setIsOpenImageGallery(false);

        if (props.onValueSelected) {
            props.onValueSelected({
                [props.dataKey]: {
                    value: fileObj,
                },
            });
        }
    };

    return (
        <>
            <div className="form-group">
                <button className="btn btn-primary" onClick={openImageGallery} type="button">
                    Choose Logo
                </button>
            </div>
            <div>
                {selectedFile && selectedFile !== '' && (
                    <img src={selectedFile} alt="Image" className="img-fluid" />
                )}
            </div>
            <ExternalMediaComponent
                showPopUp={isOpenImageGallery}
                modalTitle="Select an image"
                handleClose={closeImageGallery}
                handleValueChange={handleValueChange}
            />
        </>
    );
}

export default ImageGalleryComponent;
