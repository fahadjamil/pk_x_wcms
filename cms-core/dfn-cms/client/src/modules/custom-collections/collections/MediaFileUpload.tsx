import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Resizer from 'react-image-file-resizer';
import { connect } from 'react-redux';
import { getInitialWorkflowState } from '../../shared/utils/WorkflowUtils';

function MediaFileUpload(props) {
    const [selectedFile, setSelectedFile] = useState('');
    const [validated, setValidated] = useState(false);
    const targetDatabase = props.website;
    const [isDisableSaveBtn, setisDisableSaveBtn] = useState(true);
    const [fileName, setfileName] = useState('');
    const [filePath, setfilePath] = useState('');
    const [thumFileName, setThumFileName] = useState('');
    const [thumFilePath, setThumFilePath] = useState('');
    const [descriptionData, setdescriptionData] = useState('');
    const [thumbnailUri, setThumbnailUri] = useState<any>();
    const [titleData, setTitleData] = useState('');
    const [categoryState, setCategoryState] = useState(['Add New Category']);
    const [selectedCategory, setselectedCategory] = useState('');
    const [showCategory, setShowCategory] = useState(false);
    const [uploadedFile, setUploadedFile] = useState();

    let category: any[] = ['Add New Category'];
    let collectionName;

    useEffect(() => {
        if (props.mediaType === 'image') {
            fillImagesTable();
        }
        return () => {
            setSelectedFile('');
            setValidated(false);
            setisDisableSaveBtn(true);
            setdescriptionData('');
            setTitleData('');
            setfileName('');
            setfilePath('');
            setThumFileName('');
            setThumFilePath('');
            setThumbnailUri(false);
        };
    }, []);

    function clearData() {
        setSelectedFile('');
        setValidated(false);
        setisDisableSaveBtn(true);
        setdescriptionData('');
        setTitleData('');
        setfileName('');
        setfilePath('');
        setThumFileName('');
        setThumFilePath('');
        setThumbnailUri(false);
    }

    function fillImagesTable() {
        const headerParameter = { collection: 'media-images' };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/all', httpHeaders)
            .then((response) => {
                Object.keys(response.data).map((key) => {
                    category.push(response.data[key].category);
                });
                category = removeDuplicates(category);
                setCategoryState(category);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function removeDuplicates(data) {
        return [...Array.from(new Set(data))];
    }

    // form data submit handler
    function handleSubmitMedia(event) {
        event.preventDefault();
        let FieldsListData: any;

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        if (props.mediaType === 'image') {
            collectionName = 'media-images';
            FieldsListData = {
                ...{ title: titleData },
                ...{ description: descriptionData },
                ...{ fileName: fileName },
                ...{ filePath: filePath },
                ...{ category: selectedCategory },
                ...{ thumbnailUri: thumbnailUri },
                ...{ workFlowState: getInitialWorkflowState(collectionName, fileName, 'Media') },
                ...{ active: true },
            };

            Axios.post(
                '/api/custom-collections/image/create',
                {
                    collection: collectionName,
                    dbName: targetDatabase,
                    pageData: FieldsListData,
                },
                httpHeaders
            )
                .then((response) => {
                    props.onSave();
                    setisDisableSaveBtn(true);
                    clearData();
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (props.mediaType === 'video') {
            collectionName = 'media-videos';
            FieldsListData = {
                ...{ title: titleData },
                ...{ description: descriptionData },
                ...{ fileName: fileName },
                ...{ filePath: filePath },
                ...{ thumbFileName: thumFileName },
                ...{ thumbFilePath: thumFilePath },
                ...{ workFlowState: getInitialWorkflowState(collectionName, fileName, 'Media') },
                ...{ active: true },
            };
            Axios.post(
                '/api/custom-collections/video/create',
                {
                    collection: collectionName,
                    dbName: targetDatabase,
                    pageData: FieldsListData,
                },
                httpHeaders
            )
                .then((response) => {
                    props.onSave();
                    setisDisableSaveBtn(true);
                    clearData();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    // fiel upload handler
    const handleValueChange = (event: any) => {
        event.preventDefault();
        const file = event.target.files[0];
        setUploadedFile(file.name);
        setSelectedFile(URL.createObjectURL(file));

        var fileInput = false;
        if (event.target.files[0]) {
            fileInput = true;
        }
        if (fileInput && props.mediaType === 'image') {
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

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');

        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        formData.set('dbName', targetDatabase);

        if (props.mediaType === 'image') {
            Axios.post('/api/pages/data/images/upload', formData, httpHeaders)
                .then((uploadedFile) => {
                    setfileName(uploadedFile.data.fileName);
                    setfilePath(uploadedFile.data.filePath);
                    setisDisableSaveBtn(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (props.mediaType === 'video') {
            Axios.post('/api/custom-collections/videos/upload', formData, httpHeaders)
                .then((uploadedFile) => {
                    setfileName(uploadedFile.data[0].fileName);
                    setfilePath(uploadedFile.data[0].filePath);
                    setThumFileName(uploadedFile.data[1].fileName);
                    setThumFilePath(uploadedFile.data[1].filePath);
                    setisDisableSaveBtn(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else if (form.checkValidity() === true) {
            handleSubmitMedia(event);
        }
        setValidated(true);
    };

    const ddlOptions = () => {
        return Object.keys(categoryState).map((key) => {
            return (
                <option key={'ddlOptions-' + key.toString()} id={categoryState[key]}>
                    {categoryState[key]}
                </option>
            );
        });
    };

    return (
        <div className="col-sm-12">
            <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                <div className="row">
                    <div className="col-sm-12">
                        <Form.Group controlId="Form.Title">
                            <Form.Label>Add a Title Here.. </Form.Label>
                            <Form.Control
                                type="text"
                                required
                                onChange={(e) => {
                                    setTitleData(e.target.value);
                                }}
                                value={titleData}
                            />
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <Form.Group controlId="Form.Description">
                            <Form.Label>Add a Description Here.. </Form.Label>
                            <Form.Control
                                as="textarea"
                                required
                                onChange={(e) => {
                                    setdescriptionData(e.target.value);
                                }}
                                value={descriptionData}
                            />
                        </Form.Group>
                    </div>
                </div>
                {props.mediaType === 'image' && (
                    <div className="row">
                        <div className="col-sm-6">
                            {showCategory && (
                                <Form.Group controlId="Form.Image">
                                    <Form.Label>Create a New Category </Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={selectedCategory}
                                        onChange={(e) => {
                                            setselectedCategory(e.target.value);
                                        }}
                                    />
                                </Form.Group>
                            )}
                        </div>
                        <div className="col-sm-6">
                            <Form.Group controlId="Form.ddl">
                                <Form.Label>Select an Existing Category </Form.Label>
                                <Form.Control
                                    as="select"
                                    onClick={(e) => {
                                        setselectedCategory(e.target.value);
                                        if (e.target.value === 'Add New Category') {
                                            setShowCategory(true);
                                        } else {
                                            setShowCategory(false);
                                        }
                                    }}
                                >
                                    {ddlOptions()}
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </div>
                )}
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
                                accept={
                                    props.mediaType === 'image'
                                        ? '.tiff, .jpeg, .gif, .png, .jpg'
                                        : '.mp4, .mov, .wmv, .flv, .avi'
                                }
                            />
                            <label htmlFor="MediaFileUpload" className="custom-file-label">
                                {uploadedFile ? uploadedFile : 'Choose a File'}
                            </label>
                        </div>
                        <div>
                            {thumbnailUri && (
                                <img src={thumbnailUri} alt="Image" className="img-fluid" />
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <Button type="submit" className="btn btn-primary" disabled={isDisableSaveBtn}>
                        Save Image
                    </Button>
                </div>
                {/*               <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        data-dismiss="modal"
                        onClick={(e) => {
                            clearData();
                        }}
                    >
                        Close
                    </button>
                    <Button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isDisableSaveBtn}
                    >
                        Save Image
                    </Button>
                </div> */}
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
