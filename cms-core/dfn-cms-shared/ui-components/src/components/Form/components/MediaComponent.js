import React, { useState } from 'react';
import Axios from 'axios';

function MediaComponent({
    id,
    label,
    dbName,
    value,
    uiProperties,
    commonConfigs,
    validationErrors,
    handleFileUpload,
}) {
    const [thumbnailUri, setThumbnailUri] = useState(undefined);

    function handleFileUploadChanges(event) {
        uploadFile(event);
    }

    function uploadFile(event) {
        if (event && event.target.files[0]) {
            const formData = new FormData();
            formData.append('file', event.target.files[0]);
            setThumbnailUri(URL.createObjectURL(event.target.files[0]));

            if (commonConfigs) {
                if (commonConfigs.isPreview) {
                    formData.set('dbName', dbName);
                } else {
                    formData.set('nameSpace', dbName);
                }
            } else {
                formData.set('dbName', dbName);
            }

            const httpHeaders = {};

            Axios.post('/api/custom-collections/documents/upload', formData, httpHeaders)
                .then((response) => {
                    const { status, data } = response;

                    if (status === 200 && data) {
                        handleFileUpload(data, id);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    if (id && label) {
        return (
            <React.Fragment>
                <label>{label}</label>
                <div className={`custom-file ${uiProperties.field.classes || ''}`}>
                    <input
                        id={id}
                        type="file"
                        className="custom-file-input"
                        name={id}
                        onChange={handleFileUploadChanges}
                        onClick={(event) => {
                            event.target.value = null;
                        }}
                    />
                    <label
                        htmlFor={id}
                        className={`custom-file-label ${uiProperties.label.classes || ''}`}
                    >
                        {label}
                    </label>
                </div>
                {validationErrors && (
                    <div className="invalid-feedback d-block">
                        {validationErrors.message || 'Invalid field data'}
                    </div>
                )}
                {value && thumbnailUri && (
                    <div>
                        <img src={thumbnailUri} alt="Image" className="img-fluid" />
                    </div>
                )}
            </React.Fragment>
        );
    }

    return <React.Fragment></React.Fragment>;
}

export default MediaComponent;
