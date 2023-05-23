import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { BannerComponent } from './BannerComponent';

export function PopupBannerComponent(params) {
    const [isShowModal, setIsShowModal] = useState(false);
    const { commonConfigs, data } = params;
    const { settings } = data;
    const { displayPopup, banner } = settings;
    const { isEditMode, isPreview } = commonConfigs;
    let isUnmounted = false;

    useEffect(() => {
        if (!isUnmounted && banner && banner.uniqueId) {
            if (displayPopup && displayPopup.value && displayPopup.value === 'showOneTime') {
                const showBanner = localStorage.getItem('showPopup-' + banner.uniqueId);
                if (
                    showBanner === undefined ||
                    showBanner === null ||
                    (showBanner !== 'false' && showBanner !== false)
                ) {
                    setIsShowModal(true);
                    localStorage.setItem('showPopup-' + banner.uniqueId, false);
                }
            } else {
                setIsShowModal(true);
            }
        }

        return () => {
            isUnmounted = true;
        };
    }, []);

    if (isPreview) {
        return (
            <div class="alert alert-primary" role="alert">
                Popup banner, Popup will show after page build
            </div>
        );
    } else {
        return (
            <React.Fragment>
                {!isUnmounted && (
                    <Modal
                        show={isShowModal}
                        onHide={() => {
                            if (!isUnmounted) {
                                setIsShowModal(false);
                            }
                        }}
                        size="xl"
                    >
                        <Modal.Header closeButton></Modal.Header>
                        <Modal.Body>
                            <BannerComponent {...params} />
                        </Modal.Body>
                    </Modal>
                )}
            </React.Fragment>
        );
    }
}
