import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import { switchPage } from '../redux/action';
import SideBarComponent from '../shared/ui-components/SideBarComponent';
import TopPanelComponent from '../shared/ui-components/TopPanelComponent';
import { getUserName } from '../shared/utils/UserUtils';
import MasterRepository from '../shared/repository/MasterRepository';
import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';
import { getFormattedDateTimeString } from '../shared/utils/DateTimeUtil';
import { WorkflowsStatus } from '../shared/config/WorkflowsStatus';
import NotificationAlertsComponent from '../shared/ui-components/alerts/NotificationAlertsComponent';

function PublishPageComponent(props) {
    const targetDatabase = props.website;
    const dispatch = useDispatch();
    const [pagesToPublish, setPagesToPublish] = useState([{}]);
    const [show, setShow] = useState(false);
    const [Releases, setReleases] = useState([{}]);
    const [publishBtn, setPublishBtn] = useState(false);
    const [showReleaseComplete, setShowReleaseComplete] = useState(false);
    const [showCustTypes, setShowCustTypes] = useState(false);
    const [showRefreshWebsiteCache, setShowRefreshWebsiteCache] = useState(false);
    const [responseData, setResponseData] = useState<any>(undefined);

    useEffect(() => {
        dispatch(switchPage('Pages and Custom Types Ready to Publish'));
        getWorkflowsByStatus('approved');
        getReleases();
    }, [targetDatabase]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (publishBtn) {
                console.log('This will run every 5 second!');
                getReleaseProgress();
            }
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, [publishBtn]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseRelease = () => {
        setShowReleaseComplete(false);
        setPublishBtn(false);
    };
    const handleShowRelease = () => setShowReleaseComplete(true);

    const handleCloseCustTypes = () => setShowCustTypes(false);
    const handleShowCustTypes = () => setShowCustTypes(true);

    const handleCloseRefreshWebsiteCache = () => setShowRefreshWebsiteCache(false);
    const handleShowRefreshWebsiteCache = () => setShowRefreshWebsiteCache(true);

    function getWorkflowsByStatus(workflowId: string) {
        const headerParameter = {
            query: JSON.stringify({ state: workflowId }),
            sorter: JSON.stringify({ modifiedDate: 1 }),
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/workflow/filter', httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    setPagesToPublish(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function publishPages(publishLevel) {
        let releaseData = {
            ...{ version: new Date().getTime() },
            ...{ publishedBy: MasterRepository.getCurrentUser().docId },
            ...{ PublishedDate: new Date() },
            ...{ releaseData: pagesToPublish },
        };

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.post(
            '/api/publish/post-release',
            {
                dbName: targetDatabase,
                pageData: releaseData,
                publishLevel: publishLevel,
            },
            httpHeaders
        )
            .then((response) => {
                const { status, data } = response;

                if (status === 200) {
                    const { cacheData, releaseData } = data;

                    if (releaseData) {
                        const { status, msg } = releaseData;

                        if (status === 'success') {
                            handleShow();
                            setPublishBtn(true);
                        }

                        if (status === 'inprogress') {
                            handleShow();
                            setPublishBtn(true);

                            setResponseData({
                                status: 'inprogress',
                                msg: msg,
                            });

                            setTimeout(function () {
                                setResponseData(undefined);
                            }, 5000);
                        }

                        if (status === 'failed') {
                            handleClose();
                            setResponseData({
                                status: status,
                                msg: msg,
                            });

                            setTimeout(function () {
                                setResponseData(undefined);
                            }, 5000);
                        }
                    }
                }
            })
            .catch((err) => {});
    }

    function updateCustomTypes() {
        handleShowCustTypes();
        let releaseData = {
            ...{ version: new Date().getTime() },
            ...{ publishedBy: MasterRepository.getCurrentUser().docId },
            ...{ PublishedDate: new Date() },
            ...{ releaseData: pagesToPublish },
        };

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.put(
            '/api/publish/update-Custom-Types',
            {
                dbName: targetDatabase,
                pageData: releaseData,
            },
            httpHeaders
        )
            .then((response) => {
                if (response.status === 200) {
                    handleCloseCustTypes();
                    getWorkflowsByStatus('approved');
                    getReleases();
                }
            })
            .catch((err) => {});
    }

    function refreshWebsiteCache() {
        handleShowRefreshWebsiteCache();
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.post(
            '/api/publish/refresh-website-cache',
            {
                dbName: targetDatabase,
            },
            httpHeaders
        )
            .then((response) => {
                if (response.status === 200) {
                    handleCloseRefreshWebsiteCache();
                    getWorkflowsByStatus('approved');
                    getReleases();
                }
            })
            .catch((err) => {});
    }

    function getReleaseProgress() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/publish/get-release-progress', httpHeaders)
            .then((response) => {
                const { status, data } = response;

                if (status === 200 && data) {
                    if (data.status === 'published') {
                        handleClose();
                        setPublishBtn(false);
                        handleShowRelease();
                        getWorkflowsByStatus('approved');
                        getReleases();

                        setResponseData({
                            status: 'success',
                            msg: 'Page build completed',
                        });

                        setTimeout(function () {
                            setResponseData(undefined);
                        }, 5000);
                    }

                    if (data.status === 'failed') {
                        handleClose();
                        setPublishBtn(false);
                        handleShowRelease();
                        getWorkflowsByStatus('approved');
                        getReleases();

                        setResponseData({
                            status: 'failed',
                            msg: 'Page build failed',
                        });

                        setTimeout(function () {
                            setResponseData(undefined);
                        }, 5000);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getReleases() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/publish/get-release', httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    setReleases(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function PublishClickHandler(publishLevel) {
        publishPages(publishLevel);
    }

    const tblData = () => {
        return Object.keys(pagesToPublish).map((key, index) => {
            return (
                <tr key={`${pagesToPublish[key].fileType}-${pagesToPublish[key]._id}`}>
                    <td>{pagesToPublish[key].fileTitle}</td>
                    <td>{pagesToPublish[key].fileType}</td>
                    <td>{pagesToPublish[key].comment}</td>
                    <td>{getUserName(pagesToPublish[key].createdBy)}</td>
                    <td>{getFormattedDateTimeString(pagesToPublish[key].createdDate)}</td>
                    <td>{getUserName(pagesToPublish[key].modifiedBy)}</td>
                    <td>{getFormattedDateTimeString(pagesToPublish[key].modifiedDate)}</td>
                </tr>
            );
        });
    };

    const tblReleaseData = () => {
        return Object.keys(Releases).map((key) => {
            return (
                <tr key={`release-${Releases[key]._id}`}>
                    <td>{Releases[key].version}</td>
                    <td>{getUserName(Releases[key].publishedBy)}</td>
                    <td>{getFormattedDateTimeString(Releases[key].PublishedDate)}</td>
                </tr>
            );
        });
    };

    return (
        <>
            <aside className="main__sidebar">
                <div className="main__sidebar__content">
                    <SideBarComponent>{/* <div>Menu</div> */}</SideBarComponent>
                </div>
            </aside>

            <main className="main__content">
                <TopPanelComponent />

                <div className="page__content__container mt-0">
                    <div className="page__toolbar__container">
                        <div className="row">
                            <div className="col-4">
                                <ul className="nav nav-tabs" id="document-nav-Tab" role="tablist">
                                    <li className="nav-item">
                                        <a
                                            className="nav-link active"
                                            id="publish-nav-publish-tab"
                                            data-toggle="tab"
                                            href="#publish-nav-publish"
                                            role="tab"
                                            aria-controls="publish-nav-publish"
                                            aria-selected="true"
                                        >
                                            Publish Pages
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className="nav-link"
                                            id="publish-nav-release-tab"
                                            data-toggle="tab"
                                            href="#publish-nav-release"
                                            role="tab"
                                            aria-controls="publish-nav-release"
                                            aria-selected="true"
                                        >
                                            Releases
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-8 text-right">
                                <span>Current Release Version : {props.releaseVersion}</span>
                                <Button className="mr-2 btn-sm" onClick={() => PublishClickHandler(WorkflowsStatus.approved)}>
                                    Publish Approved
                                </Button>
                                <Button className="mr-2 btn-sm" onClick={() => refreshWebsiteCache()}>
                                    {' '}
                                    Refresh Website Cache
                                </Button>
                                {/* <Button className="mr-2 btn-sm" onClick={() => updateCustomTypes()}>
                                    {' '}
                                    Update Types Only
                                </Button> */}
                                <Button className="mr-2 btn-sm" variant="secondary" onClick={() => PublishClickHandler(WorkflowsStatus.published)}>
                                    Republish All
                                </Button>
                            </div>

                        </div>
                    </div>
                    <NotificationAlertsComponent responseData={responseData} />
                    {show && (
                        <div className="alert alert-primary" role="alert">
                            Pages Sent For Publish ...
                        </div>
                    )}
                    <div className="row">
                        <div className="col-12 tab-content">
                            <div
                                className="tab-pane fade show active"
                                id="publish-nav-publish"
                                key="publish-nav-publish"
                                role="tabpanel"
                                aria-labelledby="publish-nav-publish-tab"
                            >
                                <div className="row">
                                    <div className="col-12">
                                        <Table className="table-borderless table-hover tbl-thm-01">
                                            <thead className="">
                                                <tr>
                                                    <th>Page Title</th>
                                                    <th>Collection Name</th>
                                                    <th>Comment</th>
                                                    <th>Created By</th>
                                                    <th>Created Date</th>
                                                    <th>Modified By</th>
                                                    <th>Modified Date</th>
                                                </tr>
                                            </thead>

                                            <tbody>{tblData()}</tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="publish-nav-release"
                                key="publish-nav-release"
                                role="tabpanel"
                                aria-labelledby="publish-nav-release-tab"
                            >
                                <div className="row">
                                    <div className="col-12">
                                        <Table className="table-borderless table-hover tbl-thm-01">
                                            <thead className="">
                                                <tr>
                                                    <th>Version</th>
                                                    <th>Published By</th>
                                                    <th>Published Date</th>
                                                </tr>
                                            </thead>

                                            <tbody>{tblReleaseData()}</tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* <Modal show={show} onHide={handleClose}>
                <Modal.Body>Pages Sent For Publish ...</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal> */}
            {/* <Modal show={showReleaseComplete} onHide={handleCloseRelease}>
                <Modal.Body>Release Process Complete!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRelease}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal> */}
            <Modal show={showCustTypes} onHide={handleCloseCustTypes}>
                <Modal.Body>Custom Types updating</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCustTypes}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showRefreshWebsiteCache} onHide={handleCloseRefreshWebsiteCache}>
                <Modal.Body>Website Cache Refreshing</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRefreshWebsiteCache}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
        releaseVersion: state.websiteReducer.website?.version,
    };
};

export default connect(mapStateToProps)(PublishPageComponent);
