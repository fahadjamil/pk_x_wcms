import { getAuthorizationHeader, isEnable } from '../../../shared/utils/AuthorizationUtils';
import React, { useState, useEffect } from 'react';
import MediaFileUpload from '../MediaFileUpload';
import Axios from 'axios';
import { connect } from 'react-redux';
import Gallery from 'react-grid-gallery';
import { Modal } from 'react-bootstrap';
import LightBoxModal from '../../../shared/ui-components/modals/lightbox-modal';
import VideoPlayerComponent from '../../../shared/ui-components/preview-components/VideoPlayerComponent';

interface ThumbnailsType {
    src: string;
    filePath: string;
    fileName: string;
    isSelected: boolean;
    thumbnail: string;
    thumbFileName: string;
    thumbFilePath: string;
    thumbnailWidth: number;
    thumbnailHeight: number;
    thumbnailCaption: string;
    caption: string;
}

function VideoComponent(props) {
    const [showPopUp, setshowPopUp] = useState(false);
    const targetDatabase = props.website;
    const [tableData, settableData] = useState([]);
    const [showDeleteBtn, SetShowDeleteBtn] = useState(false);
    const [showLightBox, SetShowLightBox] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState();
    const [selectedVideoDataObj, setSelectedVideoDataObj] = useState<any>(undefined);
    const [thumbnailsArray, setthumbnailsArray] = useState<ThumbnailsType[]>([]);
    const [IsPopUp, setIsPopUp] = useState(props.IsPopup);

    interface ImediaRefrence {
        _id: '';
        title: '';
        description: '';
        fileName: '';
        filePath: '';
        fileType: '';
        thumbFileName: '';
        thumbFilePath: '';
        workFlowState: {
            state: '';
            comment: '';
            createdby: '';
            createddate: '';
            modifiedby: '';
            modifieddate: '';
        };
        active: true;
    }

    useEffect(() => {
        fillVideosTable();
    }, []);

    function fillVideosTable() {
        const headerParameter = { collection: 'media-videos' };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/all', httpHeaders)
            .then((response) => {
                settableData(response.data);
                genarateThumbnailsArry(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function onSaveVideo() {
        fillVideosTable();
        setshowPopUp(false);
    }

    function onVideoClickHandler(data) {
        setSelectedVideo(data.fileName);
        if (IsPopUp) {
            props.onVideoSelect(data);
        } else {
            SetShowDeleteBtn(true);
        }
    }

    function fillVediosTableFilterByTitle(title) {
        const headerParameter = { collection: 'media-videos', searchQuery: title };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/videos/title', httpHeaders)
            .then((response) => {
                settableData(response.data);
                genarateThumbnailsArry(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function genarateThumbnailsArry(responseObj) {
        if (responseObj && Array.isArray(responseObj)) {
            let thumbnails: ThumbnailsType[] = [];

            responseObj.forEach((value, index) => {
                let thumbnailObj: ThumbnailsType = {
                    src: '',
                    filePath: value.filePath,
                    fileName: value.fileName,
                    isSelected: false,
                    thumbnail: value.thumbFilePath,
                    thumbFileName: value.thumbFileName,
                    thumbFilePath: value.thumbFilePath,
                    thumbnailWidth: 320,
                    thumbnailHeight: 212,
                    thumbnailCaption: value.title,
                    caption: value.description,
                };

                thumbnails.push(thumbnailObj);
            });

            setthumbnailsArray(thumbnails);
        }
    }

    function onDeleteClickHandler(event) {
        SetShowDeleteBtn(false);

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.post(
            '/api/custom-collections/videos/delete',
            { dbName: targetDatabase, fileName: selectedVideo },
            httpHeaders
        ).then((res) => {
            if (res.statusText === 'OK') {
                fillVideosTable();
            }
        });
    }

    const tbldata = () => {
        return Object.entries(tableData).map(([key, value]) => {
            let val1 = value as ImediaRefrence;
            if (Object.keys(val1).length !== 0) {
                return (
                    <figure
                        className="col-4"
                        key={val1.fileName + '-' + val1._id}
                        onClick={() => onVideoClickHandler(val1)}
                    >
                        <img
                            src={val1.thumbFilePath}
                            height="180"
                            style={{ pointerEvents: 'none' }}
                            title={val1.title}
                            alt={val1.title}
                        ></img>
                        <figcaption>{val1.title}</figcaption>
                    </figure>
                );
            }
        });
    };

    function onClickThumbnail(this: any, index: number) {
        if (this?.props?.item) {
            const data = {
                ...this.props.item,
                selectedIndex: index,
                footerCounter: `${(index + 1).toString()} of ${thumbnailsArray.length}`,
                isLastVideoItem: index === thumbnailsArray.length - 1 ? true : false,
                IsFirstVideoItem: index === 0 ? true : false,
            };

            setSelectedVideoDataObj(data);
            SetShowLightBox(true);
        }
    }

    function handleCloseLightBox() {
        SetShowLightBox(false);
        setSelectedVideoDataObj(undefined);
    }

    function loadNextVideoItem() {
        const selectedVideo = { ...selectedVideoDataObj };
        const thumbnails = [...thumbnailsArray];
        const { selectedIndex } = selectedVideo;
        const nextItem = thumbnails[selectedIndex + 1];
        const nextVideoItem = { ...selectedVideo, ...nextItem };

        const data = {
            ...nextVideoItem,
            selectedIndex: selectedIndex + 1,
            footerCounter: `${(selectedIndex + 2).toString()} of ${thumbnailsArray.length}`,
            isLastVideoItem: selectedIndex + 1 === thumbnailsArray.length - 1 ? true : false,
            IsFirstVideoItem: selectedIndex + 1 === 0 ? true : false,
        };

        setSelectedVideoDataObj(data);
    }

    function loadPreviousVideoItem() {
        const selectedVideo = { ...selectedVideoDataObj };
        const thumbnails = [...thumbnailsArray];
        const { selectedIndex } = selectedVideo;
        const prevItem = thumbnails[selectedIndex - 1];
        const prevVideoItem = { ...selectedVideo, ...prevItem };

        const data = {
            ...prevVideoItem,
            selectedIndex: selectedIndex - 1,
            footerCounter: `${selectedIndex.toString()} of ${thumbnailsArray.length}`,
            isLastVideoItem: selectedIndex - 1 === thumbnailsArray.length - 1 ? true : false,
            IsFirstVideoItem: selectedIndex - 1 === 0 ? true : false,
        };

        setSelectedVideoDataObj(data);
    }

    return (
        <div className="col-sm-12">
            <div className="row">
                <div className="col-sm-2">
                    <h4>Videos</h4>
                </div>
                <div className="col-sm-2"></div>
                <div className="col-sm-4">
                    <form className="form-inline md-form mr-auto mb-4">
                        <input
                            className="form-control mr-sm-2"
                            type="text"
                            placeholder="Search By Title"
                            aria-label="Search"
                            onChange={(e) => {
                                fillVediosTableFilterByTitle(e.target.value);
                            }}
                        />
                    </form>
                </div>
                <div className="col-sm-2">
                    <div style={{ textAlign: 'right', padding: '' }}>
                        <button
                            type="button"
                            className="btn btn-primary btn-block"
                            data-toggle="modal"
                            data-target="#VideoUpload"
                            onClick={(e) => {
                                setshowPopUp(true);
                            }}
                            disabled={isEnable('/api/custom-collections/video/create')}
                        >
                            Add New
                        </button>
                    </div>
                </div>
                <div className="col-md-2">
                    {showDeleteBtn && (
                        <button
                            type="button"
                            className="btn btn-danger btn-block"
                            onClick={(e) => onDeleteClickHandler(e)}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
            {/* <div className="row">{tbldata()} </div> */}
            <div className="row">
                <div className="col-sm-12">
                    {thumbnailsArray && thumbnailsArray.length > 0 && (
                        <>
                            <Gallery
                                images={thumbnailsArray}
                                enableLightbox={false}
                                enableImageSelection={true}
                                onSelectImage={(index, image) => {
                                    onVideoClickHandler(image);
                                }}
                                onClickThumbnail={onClickThumbnail}
                            />
                        </>
                    )}
                </div>
            </div>
            <Modal
                show={showPopUp}
                onHide={() => {
                    onSaveVideo();
                }}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Upload Media Files</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MediaFileUpload
                        mediaType="video"
                        onSave={() => {
                            onSaveVideo();
                        }}
                    ></MediaFileUpload>
                </Modal.Body>
            </Modal>
            {showLightBox && selectedVideoDataObj && (
                <LightBoxModal
                    figCaption={selectedVideoDataObj.caption}
                    footerCounter={selectedVideoDataObj.footerCounter}
                    isFirstItem={selectedVideoDataObj.IsFirstVideoItem}
                    isLastItem={selectedVideoDataObj.isLastVideoItem}
                    handleClose={handleCloseLightBox}
                    loadNextItem={loadNextVideoItem}
                    loadPreviousItem={loadPreviousVideoItem}
                >
                    <div>
                        <VideoPlayerComponent
                            path={selectedVideoDataObj.filePath || ''}
                            controls={true}
                            playing={false}
                            config={{}}
                        />
                    </div>
                </LightBoxModal>
            )}
        </div>
    );
}
const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
    };
};

export default connect(mapStateToProps)(VideoComponent);
