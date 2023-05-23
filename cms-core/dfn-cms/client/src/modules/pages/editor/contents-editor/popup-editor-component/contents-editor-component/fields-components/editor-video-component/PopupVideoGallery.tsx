import React from 'react';
import VideoComponent from '../../../../../../../custom-collections/collections/media/VideoComponent';
import NotificationModal from '../../../../../../../shared/ui-components/modals/notification-modal';

interface PropType {
    isShowPopupVideoGallery: boolean;
    handleClosePopupVideoGallery: any;
    onVideoSelect: any;
}

function PopupVideoGallery(props: PropType) {
    return (
        <>
            <NotificationModal
                modalTitle="Select a video"
                show={props.isShowPopupVideoGallery}
                handleClose={props.handleClosePopupVideoGallery}
                size="lg"
            >
                <VideoComponent IsPopup={true} onVideoSelect={props.onVideoSelect}/>
            </NotificationModal>
        </>
    );
}

export default PopupVideoGallery;
