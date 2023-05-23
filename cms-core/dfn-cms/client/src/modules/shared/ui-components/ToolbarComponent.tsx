import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import WorkflowComponent from '../../workflows/WorkflowComponent';
import PageModel from '../models/page-data-models/PageModel';
import MeatBalls from '../resources/MeatBalls';
import ResponsivePreviewIcon from '../resources/ResponsivePreviewIcon';

import WorkflowStateModel from '../models/workflow-models/WorkflowStateModel';
import { getAuthorizationHeader, isEnable } from '../utils/AuthorizationUtils';
import Axios from 'axios';
import masterRepository from '../repository/MasterRepository';
import NotificationModal from './modals/notification-modal';
import { getFormattedDateTimeString } from '../utils/DateTimeUtil';
import { getUserName } from '../utils/UserUtils';
import { ConfirmationDataModel } from '../../shared/models/SharedModels';

interface ToolbarComponentModel {
    page: PageModel;
    pageId: string;
    // template: TemplateModel;
    onSubmitWorkflow: any;
    dbName: string;
    editMode: boolean;
    isPageViewTabActive: boolean;
    isPageInfoTabActive: boolean;
    isFirstTabActive: boolean;
    setEditMode: any;
    saveAsDraftOnclick: any;
    setPageEditMode: any;
    openPreviewMode: any;
    openResponsivePreviewMode: any;
    onPageDuplicateClick: any;
    onPageDeleteClick: any;
    onDiscardClick: any;
    setIsPageViewTabActive: any;
    setIsPageInfoTabActive: any;
    setIsFirstTabActive: any;
    selectedPageWorkflowState: WorkflowStateModel | undefined;
    setSelectedPage: any;
    setPageContentData: any;
    setIsManuallyShowContent: any;
    setConfirmationData: React.Dispatch<React.SetStateAction<ConfirmationDataModel | undefined>>;
}

interface RecordLockedDataModel {
    lockedBy: string;
    lockedDate: Date;
}

interface ResponseDataType {
    status: string;
    msg: string;
    updatedPageDoc?: any;
    lockingStatus?: {
        locked: boolean;
        lockedBy: string;
        lockedDate: Date;
    };
}

const ToolbarComponent = forwardRef((props: ToolbarComponentModel, ref) => {
    const [isRecordLocked, setIsRecordLocked] = useState<boolean>(false);
    const [isRecordLockedByThisUser, setIsRecordLockedByThisUser] = useState<boolean>(false);
    const [isRecordLockedModalShow, setIsRecordLockedModalShow] = useState<boolean>(false);
    const [isEditModeRecordUnLockModalShow, setIsEditModeRecordUnLockModalShow] =
        useState<boolean>(false);
    const [recordLockedData, setRecordLockedData] = useState<RecordLockedDataModel | undefined>(
        undefined
    );
    const [responseData, setResponseData] = useState<ResponseDataType>({ status: '', msg: '' });
    const activeUserId = masterRepository.getCurrentUser().docId;

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            const { page } = props;
            const { recordLocked } = page;

            setIsRecordLocked(() => {
                if (recordLocked) {
                    return true;
                }

                return false;
            });

            setIsRecordLockedByThisUser(() => {
                if (recordLocked) {
                    const { lockedBy, lockedDate } = recordLocked;

                    if (lockedBy === activeUserId) {
                        return true;
                    }
                }

                return false;
            });

            setRecordLockedData(() => {
                if (recordLocked) {
                    return { ...recordLocked };
                }

                return undefined;
            });
        }

        return () => {
            isMounted = false;
        };
    }, [props.page]);

    useImperativeHandle(ref, () => ({
        async handleUnlockRecordForRef(isSetUpdatedPage = true) {
            const response: any = await unLockTheRecord();
            const { status, data } = response;

            if (isSetUpdatedPage) {
                if (status === 200) {
                    props.setSelectedPage((prevState) => {
                        let state = { ...prevState };

                        if (data && data.updatedPageDoc) {
                            state.page = data.updatedPageDoc;
                            return state;
                        }
                        return state;
                    });

                    props.setPageContentData((prevState) => {
                        let state = { ...prevState };

                        if (data && data.updatedPageDataDocs) {
                            state = data.updatedPageDataDocs;
                            return state;
                        }
                        return state;
                    });
                }
            }
        },
    }));

    async function lockTheRecord() {
        try {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);
            const { page, dbName } = props;

            if (page && dbName) {
                const recordLocked = {
                    lockedBy: masterRepository.getCurrentUser().docId,
                    lockedDate: new Date(),
                };

                const { _id, ...pageObj } = page;

                const response = await Axios.post(
                    '/api/pages/record-lock',
                    {
                        pageId: _id,
                        dbName: dbName,
                        query: JSON.stringify({
                            $set: {
                                recordLocked: recordLocked,
                            },
                        }),
                        activeUserId: activeUserId,
                    },
                    httpHeaders
                );

                return response;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function unLockTheRecord() {
        try {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);
            const { page, dbName } = props;

            if (page && dbName) {
                const { _id, ...pageObj } = page;

                const response = await Axios.post(
                    '/api/pages/record-unlock',
                    {
                        pageId: _id,
                        dbName: dbName,
                        query: JSON.stringify({
                            $unset: { recordLocked: '' },
                        }),
                        activeUserId: activeUserId,
                    },
                    httpHeaders
                );

                return response;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleEditClick() {
        const response: any = await lockTheRecord();
        const { status, data } = response;

        if (status === 200) {
            props.setSelectedPage((prevState) => {
                let state = { ...prevState };

                if (data && data.updatedPageDoc) {
                    state.page = data.updatedPageDoc;
                    return state;
                }
                return state;
            });

            props.setPageContentData((prevState) => {
                let state = { ...prevState };

                if (data && data.updatedPageDataDocs) {
                    state = data.updatedPageDataDocs;
                    return state;
                }
                return state;
            });

            if (
                data &&
                data.lockingStatus &&
                data.lockingStatus.locked &&
                data.lockingStatus.lockedBy !== activeUserId
            ) {
                setIsRecordLockedModalShow(true);
                return false;
            }

            props.setEditMode && props.setEditMode(true);
            props.setPageEditMode && props.setPageEditMode();
            props.setIsPageViewTabActive && props.setIsPageViewTabActive(true);
            props.setIsPageInfoTabActive && props.setIsPageInfoTabActive(false);
            props.setIsManuallyShowContent && props.setIsManuallyShowContent(false);
        }
    }

    async function handleRecordUnlock() {
        if (!props.editMode) {
            const response: any = await unLockTheRecord();
            const { status, data } = response;

            if (status === 200) {
                props.setSelectedPage((prevState) => {
                    let state = { ...prevState };

                    if (data && data.updatedPageDoc) {
                        state.page = data.updatedPageDoc;
                        return state;
                    }
                    return state;
                });

                props.setPageContentData((prevState) => {
                    let state = { ...prevState };

                    if (data && data.updatedPageDataDocs) {
                        state = data.updatedPageDataDocs;
                        return state;
                    }
                    return state;
                });

                setResponseData(data);
                setTimeout(function () {
                    setResponseData({ status: '', msg: '' });
                }, 3000);
            }

            return false;
        }

        setIsEditModeRecordUnLockModalShow(true);
    }

    async function handleRecordLock() {
        const response: any = await lockTheRecord();

        const { status, data } = response;

        if (status === 200) {
            props.setSelectedPage((prevState) => {
                let state = { ...prevState };

                if (data && data.updatedPageDoc) {
                    state.page = data.updatedPageDoc;
                    return state;
                }
                return state;
            });

            props.setPageContentData((prevState) => {
                let state = { ...prevState };

                if (data && data.updatedPageDataDocs) {
                    state = data.updatedPageDataDocs;
                    return state;
                }
                return state;
            });

            setResponseData(data);
            setTimeout(function () {
                setResponseData({ status: '', msg: '' });
            }, 3000);
        }
    }

    function handleRecordLockStatus() {
        const { page, dbName } = props;

        if (page && dbName) {
            const { _id, ...pageObj } = page;
            const headerParameter = { id: _id };
            const httpHeaders = getAuthorizationHeader(headerParameter);

            Axios.get('/api/pages/locking-status', httpHeaders)
                .then((res) => {
                    const { status, data } = res;

                    if (status === 200) {
                        setIsRecordLocked(() => {
                            if (data && data.locked === true) {
                                return true;
                            }
                            return false;
                        });

                        setIsRecordLockedByThisUser(() => {
                            if (data && data.locked === true) {
                                if (data.lockedBy === activeUserId) {
                                    return true;
                                }
                            }
                            return false;
                        });

                        setRecordLockedData(() => {
                            if (data) {
                                const { locked, ...rest } = data;
                                return { ...rest };
                            }

                            return undefined;
                        });

                        if (data && data.locked === true && data.lockedBy !== activeUserId) {
                            setIsRecordLockedModalShow(true);
                            return false;
                        }
                    }
                })
                .catch((err) => {
                    console.log('error', err);
                });
        }
    }

    function handleDiscardClick() {
        props.setConfirmationData({
            modalTitle: 'Discard Changes',
            show: true,
            body: (
                <div className="alert alert-warning" role="alert">
                    Are you sure you want to discard the changes?
                </div>
            ),
            handleClose: () => {
                props.setConfirmationData(undefined);
            },
            handleConfirme: discardChanges,
        });
    }

    async function discardChanges() {
        props.onDiscardClick && props.onDiscardClick();
        props.setConfirmationData(undefined);

        const response: any = await unLockTheRecord();
        const { status, data } = response;

        if (status === 200) {
            props.setSelectedPage((prevState) => {
                let state = { ...prevState };

                if (data && data.updatedPageDoc) {
                    state.page = data.updatedPageDoc;
                    return state;
                }
                return state;
            });

            props.setPageContentData((prevState) => {
                let state = { ...prevState };

                if (data && data.updatedPageDataDocs) {
                    state = data.updatedPageDataDocs;
                    return state;
                }
                return state;
            });
        }
    }

    return (
        <>
            {responseData && responseData.status === 'success' && (
                <div className="row">
                    <div className="col-md-12">
                        <div
                            className="alert-float alert alert-success alert-dismissible fade show mt-2"
                            role="alert"
                        >
                            <strong>Success!</strong> {responseData.msg}
                            <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {responseData && responseData.status === 'failed' && (
                <div className="row">
                    <div className="col-md-12">
                        <div
                            className="alert alert-danger alert-dismissible fade show mt-2"
                            role="alert"
                        >
                            <strong>Failed!</strong> {responseData.msg}
                            <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="page__toolbar__container">
                <div className="row">
                    <div className="col-md-4">
                        <div
                            className="nav btn-toolbar btn-group"
                            aria-label="edit-panel"
                            id="site-page-nav-tab"
                            role="tablist"
                        >
                            {!props.editMode && props.isFirstTabActive && (
                                <a className="btn btn-primary" onClick={handleEditClick}>
                                    Edit Page
                                </a>
                            )}
                            {props &&
                                props.selectedPageWorkflowState &&
                                props.selectedPageWorkflowState.state == 'pendingapproval' &&
                                !isRecordLocked && (
                                    <button className="btn btn-primary" onClick={handleRecordLock}>
                                        <i className="btn-icon unlocked"></i>
                                    </button>
                                )}
                            {isRecordLocked && isRecordLockedByThisUser && (
                                <button className="btn btn-primary" onClick={handleRecordUnlock}>
                                    <i className="btn-icon unlockable"></i>
                                </button>
                            )}
                            {isRecordLocked && !isRecordLockedByThisUser && (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleRecordLockStatus}
                                >
                                    <i className="btn-icon locked"></i>
                                </button>
                            )}
                            {(props.editMode || !props.isFirstTabActive) && (
                                <a
                                    className={`btn btn-primary ${
                                        props.isPageViewTabActive ? 'active' : ''
                                    }`}
                                    id="site-page-nav-edit-tab"
                                    data-toggle="tab"
                                    href="#site-page-nav-edit"
                                    role="tab"
                                    aria-controls="site-page-nav-edit"
                                    aria-selected="true"
                                    onClick={() => {
                                        props.setIsFirstTabActive(true);
                                        props.setIsPageInfoTabActive(false);
                                        props.setIsManuallyShowContent(false);
                                    }}
                                >
                                    Page View
                                </a>
                            )}
                            {props.editMode && (
                                <a
                                    className={`btn btn-primary ${
                                        props.isPageInfoTabActive ? 'active' : ''
                                    }`}
                                    id="site-page-nav-info-tab"
                                    data-toggle="tab"
                                    href="#site-page-nav-info"
                                    role="tab"
                                    aria-controls="site-page-nav-info"
                                    aria-selected="false"
                                    onClick={() => {
                                        props.setIsFirstTabActive(false);
                                        props.setIsPageViewTabActive(false);
                                        props.setIsPageInfoTabActive(true);
                                        props.setIsManuallyShowContent(false);
                                    }}
                                >
                                    Page Info
                                </a>
                            )}
                            <a
                                className="btn btn-primary"
                                id="site-page-nav-history-tab"
                                data-toggle="tab"
                                href="#site-page-nav-history"
                                role="tab"
                                aria-controls="site-page-nav-history"
                                aria-selected="false"
                                onClick={() => {
                                    props.setIsFirstTabActive(false);
                                    props.setIsPageViewTabActive(false);
                                    props.setIsPageInfoTabActive(false);
                                    props.setIsManuallyShowContent(false);
                                }}
                            >
                                History
                            </a>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <WorkflowComponent
                                selectedWorkflowState={props.selectedPageWorkflowState}
                                onSubmitWorkflow={props.onSubmitWorkflow}
                                dbName={props.dbName}
                                currentPageId={props.pageId}
                                isShowCurrentFlow
                                collectionName="pages"
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="float-right d-flex flex-row align-items-center">
                            <div className="ml-1 mr-1">
                                <span
                                    className="d-inline-block"
                                    tabIndex={0}
                                    data-toggle="tooltip"
                                    title="Responsive Preview"
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                >
                                    {/*<button
                                className="btn btn-outline-primary"
                                onClick={() => {
                                    props.openPreviewMode && props.openPreviewMode();
                                }}
                            >
                            </button>*/}
                                </span>
                            </div>
                            <div className="ml-1 mr-1">
                                {props.editMode && (
                                    <div className="btn-toolbar">
                                        <button
                                            className="btn btn-tertiary"
                                            onClick={handleDiscardClick}
                                        >
                                            Discard
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            disabled={isEnable('/api/pages/update')}
                                            onClick={() => {
                                                props.saveAsDraftOnclick &&
                                                    props.saveAsDraftOnclick();
                                            }}
                                        >
                                            Save as Draft
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="ml-1 mr-2">
                                {!props.editMode && props.isFirstTabActive && (
                                    <div className="btn-toolbar">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                props.openResponsivePreviewMode &&
                                                    props.openResponsivePreviewMode();
                                            }}
                                        >
                                            <ResponsivePreviewIcon width="25px" height="25px" />
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            // data-toggle="modal"
                                            // data-target="#previewModal"
                                            onClick={() => {
                                                props.openPreviewMode && props.openPreviewMode();
                                            }}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="ml-1 mr-2">
                                {/* <span
                                    className="d-inline-block"
                                    tabIndex={0}
                                    data-toggle="tooltip"
                                    title="More Info"
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                >
                                    <MeatBalls width="25px" height="25px" />
                                </span> */}
                                {!props.editMode && (
                                    <div className="btn-group dropleft">
                                        <button
                                            className="btn btn-primary dropdown-toggle d-inline-block"
                                            type="button"
                                            id="dropdownMenuButton"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                            tabIndex={0}
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <MeatBalls width="25px" height="25px" />
                                        </button>
                                        <div
                                            className="dropdown-menu"
                                            aria-labelledby="dropdownMenuButton"
                                        >
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                                onClick={() => {
                                                    if (props.onPageDuplicateClick) {
                                                        props.onPageDuplicateClick();
                                                    }
                                                }}
                                            >
                                                Duplicate Page
                                            </a>
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                                onClick={() => {
                                                    if (props.onPageDeleteClick) {
                                                        props.onPageDeleteClick(props.pageId);
                                                    }
                                                }}
                                            >
                                                Delete Page
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12"></div>
                </div>
            </div>
            {isRecordLockedModalShow && (
                <NotificationModal
                    modalTitle="Record Already Locked"
                    show={isRecordLockedModalShow}
                    titleTextClass="text-info"
                    handleClose={() => {
                        setIsRecordLockedModalShow(false);
                    }}
                >
                    <div className="alert alert-info" role="alert">
                        <strong>This record has already been locked.</strong>
                        <hr />
                        {recordLockedData && recordLockedData.lockedBy && (
                            <p>Record locked by - {getUserName(recordLockedData.lockedBy)}</p>
                        )}
                        {recordLockedData && recordLockedData.lockedDate && (
                            <p>
                                Record locked date -{' '}
                                {getFormattedDateTimeString(recordLockedData.lockedDate)}
                            </p>
                        )}
                    </div>
                </NotificationModal>
            )}
            {isEditModeRecordUnLockModalShow && (
                <NotificationModal
                    modalTitle="Failed To Unlock"
                    show={isEditModeRecordUnLockModalShow}
                    titleTextClass="text-danger"
                    handleClose={() => {
                        setIsEditModeRecordUnLockModalShow(false);
                    }}
                >
                    <div className="alert alert-danger" role="alert">
                        <strong>
                            You can not unlock a record in the edit mode. Please save the record in
                            order to unlock it.
                        </strong>
                    </div>
                </NotificationModal>
            )}
        </>
    );
});

export default ToolbarComponent;
