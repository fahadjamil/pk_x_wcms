import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Resizer from 'react-image-file-resizer';
import { connect } from 'react-redux';

function MediaFileUpload(props) {
    const targetDatabase = props.website;
    const [selectedFile, setSelectedFile] = useState('');
    const [isDisableSaveBtn, setisDisableSaveBtn] = useState(true);
    const [fileName, setfileName] = useState('');
    const [filePath, setfilePath] = useState('');
    const [thumbnailUri, setThumbnailUri] = useState<any>();
    const [uploadedFile, setUploadedFile] = useState();
    const [selectedImage, setselectedImage] = useState(props.selectedImage);
    const [enableButton, setenableButton] = useState(false);

    let category: any[] = ['Add New Category'];
    let collectionName;

    useEffect(() => {
        return () => {};
    }, []);

    const handleValueChange = (event: any) => {
        var fileInput = false;
        if (event.target.files[0]) {
            fileInput = true;
        }
        const file = event.target.files[0];
        setUploadedFile(file.name);
        setSelectedFile(URL.createObjectURL(file));

        if (fileInput) {
            Resizer.imageFileResizer(
                event.target.files[0],
                5000,
                500,
                'JPEG',
                18,
                0,
                (uri) => {
                    setThumbnailUri(uri);
                },
                'base64'
            );
        }

        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
        };

        const formData = new FormData();
        formData.append('file', file);
        formData.set('dbName', targetDatabase);
        formData.set('fileName', selectedImage);

        Axios.post('/api/pages/data/image/replce', formData, httpHeaders)
            .then((data) => {
                console.log('data ---/api/pages/data/image/replce ', data);
                setenableButton(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleButtonSave = () => {
        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
        };

        Axios.post(
            '/api/pages/data/image/replceThumbnail',
            {
                dbName: targetDatabase,
                fileName: selectedImage,
                thumbnailUri: thumbnailUri,
            },
            httpHeaders
        )
            .then((data) => {
                props.onSave();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="col-sm-12">
            <Form noValidate>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="custom-file mb-3">
                            <input
                                key="MediaFileUpload"
                                type="file"
                                name="MediaFileUpload"
                                id="MediaFileUpload"
                                className="custom-file-input"
                                onChange={handleValueChange}
                                onClick={(event: any) => {
                                    event.target.value = null;
                                }}
                                required
                                accept={'.tiff, .jpeg, .gif, .png, .jpg'}
                            />
                            <label htmlFor="MediaFileUpload" className="custom-file-label">
                                {uploadedFile ? uploadedFile : 'Replace Image'}
                            </label>
                            {enableButton && (
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block"
                                    onClick={(e) => {
                                        handleButtonSave();
                                    }}
                                >
                                    Replace
                                </button>
                            )}
                        </div>
                        <div>
                            {thumbnailUri && (
                                <img src={thumbnailUri} alt="Image" className="img-fluid" />
                            )}
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
    };
};

export default connect(mapStateToProps)(MediaFileUpload);
