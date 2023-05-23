import {
    getAuthorizationHeader,
    isEnable,
    getAuthorizationHeaderForDelete,
} from '../../../shared/utils/AuthorizationUtils';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { Modal, Table } from 'react-bootstrap';
import IconUpdate from '../IconUpdate';

function IconsComponent(props) {
    const [selectedFile, setSelectedFile] = useState([]);
    const targetDatabase = props.website;
    const [smShow, setSmShow] = useState(false);
    const [tableData, settableData] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState();
    const [showDeleteBtn, SetShowDeleteBtn] = useState(false);
    const [IsPopUp, setIsPopUp] = useState(props.IsPopup);
    const [showPopUpUpdateIcon, setShowPopUpUpdateIcon] = useState(false);
    const [showPopUpAddIcon, setShowPopUpAddIcon] = useState(false);
    interface ImediaRefrence {
        _id: string;
        fileName: string;
        filePath: string;
    }

    useEffect(() => {
        fillIconsTable();
    }, []);

    function fillIconsTable() {
        const headerParameter = { collection: 'media-icons' };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/all', httpHeaders)
            .then((response) => {
                settableData(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function onClickHandler(event) {
        const data = new FormData();
        if (selectedFile.length != 0) {
            for (var x = 0; x < selectedFile.length; x++) {
                data.append('file', selectedFile[x]);
            }
            data.set('dbName', targetDatabase);

            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);
            // const jwt = localStorage.getItem('jwt-token');
            // const httpHeaders = {
            //     headers: {
            //         Authorization: jwt,
            //     },
            // };
            Axios.post('/api/custom-collections/icons/upload', data, httpHeaders).then((res) => {
                if (res.statusText === 'OK') {
                    setSmShow(true);
                    setShowPopUpAddIcon(false);
                    fillIconsTable();
                }
            });
        }
    }

    function onAddClickHandler() {
        setShowPopUpAddIcon(true);
    }

    function onChangeHandler(event) {
        setSelectedFile(event.target.files);
    }

    function onIconClickHandler(icon) {
        setSelectedIcon(icon.fileName);
        if (IsPopUp) {
            props.onIconSelect(icon);
        } else {
            SetShowDeleteBtn(true);
        }
    }

    function onUpdateClickHandler() {
        setShowPopUpUpdateIcon(true);
    }

    function onDeleteClickHandler() {
        SetShowDeleteBtn(false);

        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     data: { dbName: targetDatabase, fileName: selectedIcon },
        // };

        const headerParameter = { fileName: selectedIcon };
        const httpHeaders = getAuthorizationHeaderForDelete(headerParameter);

        Axios.delete('/api/custom-collections/icons/delete', httpHeaders).then((res) => {
            if (res.statusText === 'OK') {
                setSmShow(true);
                fillIconsTable();
                setSelectedIcon(undefined);
            }
        });
    }

    function fillIconsTableFilterByTitle(title) {
        const headerParameter = { collection: 'media-icons', searchQuery: title };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/icons/name', httpHeaders)
            .then((response) => {
                settableData(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const tbldata = () => {
        return Object.entries(tableData).map(([key, value]) => {
            let val1 = value as ImediaRefrence;
            if (Object.keys(val1).length !== 0) {
                return (
                    <div
                        className="col-sm-2"
                        key={val1.fileName}
                        onClick={() => onIconClickHandler(val1)}
                    >
                        <object
                            type="image/svg+xml"
                            data={'/api/page-data/getImage/' + targetDatabase + '/' + val1.fileName}
                            /* data={val1.filePath} */
                            width="50"
                            height="50"
                            style={{ pointerEvents: 'none' }}
                        ></object>
                        <caption>{val1.fileName}</caption>
                    </div>
                );
            }
        });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-9">
                    <form>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Search By Title"
                            aria-label="Search"
                            onChange={(e) => {
                                fillIconsTableFilterByTitle(e.target.value);
                            }}
                        />
                    </form>
                </div>
                <div className="col-md-3">
                    <button
                        type="button"
                        className="btn btn-primary btn-block"
                        onClick={onAddClickHandler}
                        disabled={isEnable('/api/custom-collections/icons/upload')}
                    >
                        Add New
                    </button>
                </div>
            </div>
            <br />
            {selectedIcon && (
                <>
                    <div className="row">
                        <div className="col-md-6">Selected Icon : {selectedIcon}</div>
                        <div className="col-md-3">
                            <button
                                type="button"
                                className="btn btn-danger btn-block"
                                onClick={onDeleteClickHandler}
                            >
                                Delete
                            </button>
                        </div>
                        <div className="col-md-3">
                            <button
                                type="button"
                                className="btn btn-success btn-block"
                                onClick={onUpdateClickHandler}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                    <br />
                </>
            )}

            <div className="row">{tbldata()}</div>
            <Modal
                size="sm"
                show={smShow}
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>Icons Updated</Modal.Body>
            </Modal>

            <Modal
                show={showPopUpUpdateIcon}
                onHide={() => {
                    setShowPopUpUpdateIcon(false);
                }}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Replace Icon : {selectedIcon}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showPopUpUpdateIcon && (
                        <IconUpdate
                            onSave={() => {
                                setShowPopUpUpdateIcon(false);
                                fillIconsTable();
                            }}
                            selectedIcon={selectedIcon}
                        ></IconUpdate>
                    )}
                </Modal.Body>
            </Modal>
            <Modal
                show={showPopUpAddIcon}
                onHide={() => {
                    setShowPopUpAddIcon(false);
                }}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Icon</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showPopUpAddIcon && (
                        <form>
                            <div className="form-group files row">
                                <div className="col-md-9">
                                    <input
                                        type="file"
                                        className="form-control"
                                        multiple={true}
                                        onChange={(e) => onChangeHandler(e)}
                                        onClick={(event: any) => {
                                            event.target.value = null;
                                        }}
                                        required
                                        accept=".svg"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <button
                                        type="button"
                                        className="btn btn-success btn-block"
                                        onClick={onClickHandler}
                                        disabled={isEnable('/api/custom-collections/icons/upload')}
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </form>
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

export default connect(mapStateToProps)(IconsComponent);
