import {getAuthorizationHeader, getAuthorizationHeaderForDelete} from '../../../shared/utils/AuthorizationUtils';
import React, { useState, useEffect } from 'react';
import MediaFileUpload from '../MediaFileUpload';
import Axios from 'axios';
import { connect } from 'react-redux';
import Gallery from 'react-grid-gallery';
import { Modal } from 'react-bootstrap';
import ImageUpdate from '../ImageUpdate';

function ImageComponent(props) {
    const [showPopUp, setshowPopUp] = useState(false);
    const targetDatabase = props.website;
    const [tableData, settableData] = useState([]);
    const [thumbnailsArray, setthumbnailsArray] = useState([{}]);
    const [IsPopUp, setIsPopUp] = useState(props.IsPopup);
    const [showDeleteBtn, SetShowDeleteBtn] = useState(false);
    const [selectedImage, setSelectedImage] = useState();
    const [categoryState, setCategoryState] = useState(['All']);
    const [showPopUpUpdateImage, setshowPopUpUpdateImage] = useState(false);

    let category: any[] = ['All'];

    interface ImediaRefrence {
        _id: string;
        title: string;
        description: string;
        fileName: string;
        filePath: string;
        fileType: string;
        thumbnailUri: string;
        workFlowState: {
            state: string;
            comment: string;
            createdby: string;
            createddate: string;
            modifiedby: string;
            modifieddate: string;
        };
        active: true;
    }

    interface IthumbnailsArray {
        src: string;
        gridFsFileName: string;
        isSelected: boolean;
        thumbnail: string;
        thumbnailWidth: string;
        thumbnailHeight: string;
        thumbnailCaption: string;
        caption: string;
    }

    useEffect(() => {
        fillImagesTable();
    }, []);

    // no filter
    function fillImagesTable() {
        const headerParameter = { collection: 'media-images'};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/all', httpHeaders)
            .then((response) => {
                settableData(response.data);
                genarateThumbnailsArry(response.data);
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

    function fillImagesTableFilterByTitle(title) {
        const jwt = localStorage.getItem('jwt-token');
        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: {
                dbName: targetDatabase,
                collection: 'media-images',
                searchQuery: title,
            },
        };

        Axios.get('/api/custom-collections/images/title', httpHeaders)
            .then((response) => {
                settableData(response.data);
                genarateThumbnailsArry(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function genarateThumbnailsArry(responseObj) {
        setthumbnailsArray([{}]);

        Object.entries(responseObj).map(([key, value]) => {
            let val1: ImediaRefrence;

            val1 = value as ImediaRefrence;
            if (Object.keys(val1).length !== 0) {
                let thumbnailObj: IthumbnailsArray = {
                    src: val1.filePath,
                    gridFsFileName: val1.fileName,
                    isSelected: false,
                    thumbnail: val1.thumbnailUri,
                    thumbnailWidth: 'auto',
                    thumbnailHeight: 'auto',
                    thumbnailCaption: val1.title,
                    caption: val1.description,
                };
                setthumbnailsArray((e) => [...e, thumbnailObj]);
            }
        });
    }

    function onSaveImage() {
        fillImagesTable();
        setshowPopUp(false);
    }

    function onSelectImage(image) {
        setSelectedImage(image.gridFsFileName);
        if (IsPopUp) {
            props.onImageSelect(image);
        } else {
            SetShowDeleteBtn(true);
        }
    }

    function onDeleteClickHandler(event) {
        SetShowDeleteBtn(false);

        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     data: { dbName: targetDatabase, fileName: selectedImage },
        // };
        const headerParameter = {fileName: selectedImage};
        const httpHeaders = getAuthorizationHeaderForDelete(headerParameter);

        Axios.delete('/api/custom-collections/images/delete', httpHeaders).then((res) => {
            if (res.statusText === 'OK') {
                fillImagesTable();
            }
        });
    }

    function onUpdateClickHandler(event) {
        setshowPopUpUpdateImage(true);
    }

    function onTabClickHandler(CategoryName) {
        if (CategoryName === 'All') {
            genarateThumbnailsArry(tableData);
        } else {
            genarateThumbnailsArry(tableData.filter(({ category }) => category === CategoryName));
        }
    }

    const tabsGalary = () => {
        return Object.keys(categoryState).map((key) => {
            return (
                <li className="nav-item" key={'tab-' + key.toString()}>
                    <a
                        className="nav-link"
                        id={categoryState[key]}
                        data-toggle="tab"
                        href={'#' + categoryState[key]}
                        role="tab"
                        onClick={(e) => {
                            onTabClickHandler(categoryState[key]);
                        }}
                    >
                        {categoryState[key]}
                    </a>
                </li>
            );
        });
    };

    return (
        <div className="col-12">
            <div className="row mb-3">
                <div className="col-10">
                    <form className="">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Search By Title"
                            aria-label="Search"
                            onChange={(e) => {
                                fillImagesTableFilterByTitle(e.target.value);
                            }}
                        />
                    </form>
                </div>

                <div className="col-2 text-right">
                    <div className="row">
                        <div className="col">
                            <button
                                type="button"
                                className="btn btn-primary btn-block"
                                // disabled={!sessionStorage.getItem(props.website)!.includes('/api/custom-collections/image/create')}
                                onClick={(e) => {
                                    setshowPopUp(true);
                                }}
                            >
                                Add New
                            </button>
                        </div>

                        {showDeleteBtn && (
                            <>
                                <div className="col">
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-block"
                                        onClick={(e) => onDeleteClickHandler(e)}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <div className="col">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-block"
                                        onClick={(e) => onUpdateClickHandler(e)}
                                    >
                                        Update
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <ul className="nav nav-tabs" id="document-nav-Tab" role="tablist">
                        {tabsGalary()}
                    </ul>

                    <Gallery
                        images={thumbnailsArray}
                        enableLightbox={true}
                        enableImageSelection={true}
                        onSelectImage={(index, image) => {
                            onSelectImage(image);
                        }}
                    />
                </div>
            </div>

            <Modal
                show={showPopUp}
                onHide={() => {
                    onSaveImage();
                }}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Upload Media Files</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showPopUp && (
                        <MediaFileUpload
                            mediaType="image"
                            onSave={() => {
                                onSaveImage();
                            }}
                        ></MediaFileUpload>
                    )}
                </Modal.Body>
            </Modal>

            <Modal
                show={showPopUpUpdateImage}
                onHide={() => {
                    setshowPopUpUpdateImage(false);
                }}
                size="sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Replace Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showPopUpUpdateImage && (
                        <ImageUpdate
                            onSave={() => {
                                setshowPopUpUpdateImage(false);
                                fillImagesTable();
                            }}
                            selectedImage={selectedImage}
                        ></ImageUpdate>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}
const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
    };
};

export default connect(mapStateToProps)(ImageComponent);
