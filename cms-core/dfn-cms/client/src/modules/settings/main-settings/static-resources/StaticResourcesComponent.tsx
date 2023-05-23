import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';
import {
    getAuthorizationHeader,
    getAuthorizationHeaderForDelete,
} from '../../../shared/utils/AuthorizationUtils';
import { getFormattedDateTimeString } from '../../../shared/utils/DateTimeUtil';
import AddResourceComponent from './add-resource';
import TopPanelComponent from './top-panel';

interface PropType {
    website: string;
}

function StaticResourcesComponent(props: PropType) {
    // Section name must match with property [ headerLinks, bodyLinks ]
    let initialStaticResourceLinksState = {
        headerLinks: {
            section: 'headerLinks',
            links: '',
        },
        bodyLinks: {
            section: 'bodyLinks',
            links: '',
        },
    };
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showResourceDeleteConfirmModal, setShowResourceDeleteConfirmModal] =
        useState<boolean>(false);
    const [allStaticResources, setAllStaticResources] = useState<[]>([]);
    const [staticResourceLinks, setStaticResourceLinks] = useState<any>(
        initialStaticResourceLinksState
    );
    const [addResourceHttpResponse, setAddResourceHttpResponse] = useState<any>(undefined);
    const [activeStaticResourceId, setActiveStaticResourceId] = useState<string>('');

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getAllResources();
            getAllResourcesLinks();
        }
        return () => {
            isMounted = false;
        };
    }, []);

    const addResource = (data) => {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.post('/api/websites/static-resources/create', data, httpHeaders)
            .then((result) => {
                if (result && result.status === 200) {
                    const { data, ...rest } = result.data;

                    setAddResourceHttpResponse(rest);
                    setAllStaticResources(data);
                    setShowModal(false);

                    setTimeout(function () {
                        setAddResourceHttpResponse(undefined);
                    }, 3000);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getAllResources = () => {
        const headerParameter = { collection: 'static-resources' };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/collection/data/all', httpHeaders)
            .then((result) => {
                if (result && result.status === 200) {
                    setAllStaticResources(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getAllResourcesLinks = () => {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        httpHeaders.params.collection = 'static-resources-links';

        Axios.get('/api/collection/data/all', httpHeaders)
            .then((result) => {
                if (result && result.status === 200 && result.data.length > 0) {
                    const updatedLinks = {};

                    result.data.forEach((data, dataIndex) => {
                        const { section } = data;
                        updatedLinks[section] = data;
                    });

                    setStaticResourceLinks(updatedLinks);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const openAddResourceModal = () => {
        setShowModal(true);
    };

    const handleStaticResourceLinksValueChanges = (event) => {
        const results: any = { ...staticResourceLinks };
        const { name, value } = event.target;

        const data = {
            ...results,
            [name]: {
                ...results[name],
                links: value,
            },
        };

        setStaticResourceLinks(data);
    };

    const handleSave = () => {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.put(
            '/api/websites/static-resources-links/update',
            {
                staticResourceLinks: staticResourceLinks,
                dbName: props.website,
            },
            httpHeaders
        )
            .then((result) => {
                if (result && result.status === 200) {
                    const { resourceLinks, error, ...rest } = result.data;

                    if (error) {
                        let finalResults = {
                            status: 'failed',
                            msg: 'Something unexpected has occured. Please try again later.',
                        };

                        setAddResourceHttpResponse(finalResults);
                    } else {
                        setAddResourceHttpResponse(rest);
                    }

                    setTimeout(function () {
                        setAddResourceHttpResponse(undefined);
                    }, 3000);

                    if (resourceLinks && resourceLinks.length > 0) {
                        const updatedLinks = {};

                        resourceLinks.forEach((data, dataIndex) => {
                            const { section } = data;
                            updatedLinks[section] = data;
                        });

                        setStaticResourceLinks(updatedLinks);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteStaticResource = (id) => {
        setActiveStaticResourceId(id);
        setShowResourceDeleteConfirmModal(true);
    };

    const deleteStaticResourceHandle = () => {
        const headerParameter = { id: activeStaticResourceId, collectionName: 'static-resources' };
        const httpHeaders = getAuthorizationHeaderForDelete(headerParameter);

        Axios.delete('/api/websites/static-resources/delete', httpHeaders).then((res) => {
            if (res && res.statusText === 'OK' && res.status === 200) {
                const { data, ...rest } = res.data;

                setShowResourceDeleteConfirmModal(false);
                setAddResourceHttpResponse(rest);
                setAllStaticResources(data);

                setTimeout(function () {
                    setAddResourceHttpResponse(undefined);
                }, 3000);
            }
        });
    };

    return (
        <React.Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <TopPanelComponent
                            openAddResourceModal={openAddResourceModal}
                            handleSave={handleSave}
                        />
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        {addResourceHttpResponse && addResourceHttpResponse.status === 'success' && (
                            <div
                                className="alert alert-success alert-dismissible fade show mt-2"
                                role="alert"
                            >
                                <strong>Success!</strong> {addResourceHttpResponse.msg}
                            </div>
                        )}
                        {addResourceHttpResponse && addResourceHttpResponse.status === 'failed' && (
                            <div
                                className="alert alert-danger alert-dismissible fade show mt-2"
                                role="alert"
                            >
                                <strong>Failed!</strong> {addResourceHttpResponse.msg}
                            </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {allStaticResources && allStaticResources.length > 0 && (
                            <table className="table table-borderless table-hover tbl-thm-01">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">File Name</th>
                                        <th scope="col">File Type</th>
                                        <th scope="col">File Size</th>
                                        <th scope="col">Uploaded Date</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allStaticResources.map((resource: any, resourceIndex) => {
                                        const {
                                            _id,
                                            fileSize,
                                            fileType,
                                            uploadDate,
                                            uploadFileName,
                                            gridFsFileName,
                                        } = resource;

                                        return (
                                            <tr key={_id}>
                                                <th scope="row">{resourceIndex + 1}</th>
                                                <td>{uploadFileName}</td>
                                                <td>{fileType}</td>
                                                <td>{fileSize}</td>
                                                <td>{getFormattedDateTimeString(uploadDate)}</td>
                                                <td>
                                                    <a
                                                        className="btn btn-outline-info btn-sm mr-1"
                                                        download={uploadFileName || ''}
                                                        href={`/api/file/${props.website}/resources/${gridFsFileName}`}
                                                    >
                                                        Download
                                                    </a>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => {
                                                            deleteStaticResource(_id);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h5>Static Resources Links</h5>
                        <div className="form-group">
                            <label htmlFor="headerLinks">Header Section Links</label>
                            <textarea
                                className="form-control"
                                id="headerLinks"
                                name="headerLinks"
                                rows={6}
                                value={
                                    staticResourceLinks?.headerLinks?.links
                                        ? staticResourceLinks.headerLinks.links
                                        : ''
                                }
                                onChange={handleStaticResourceLinksValueChanges}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bodyLinks">Body Section Links</label>
                            <textarea
                                className="form-control"
                                id="bodyLinks"
                                name="bodyLinks"
                                rows={6}
                                value={
                                    staticResourceLinks?.bodyLinks?.links
                                        ? staticResourceLinks.bodyLinks.links
                                        : ''
                                }
                                onChange={handleStaticResourceLinksValueChanges}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <AddResourceComponent
                    show={showModal}
                    handleConfirme={addResource}
                    handleClose={handleClose}
                    website={props.website}
                />
            )}
            {showResourceDeleteConfirmModal && (
                <ConfirmationModal
                    modalTitle="Delete Static Resource"
                    show={showResourceDeleteConfirmModal}
                    handleClose={() => {
                        setShowResourceDeleteConfirmModal(false);
                    }}
                    handleConfirme={deleteStaticResourceHandle}
                >
                    <p>"Are you sure you want to delete this resource?"</p>
                </ConfirmationModal>
            )}
        </React.Fragment>
    );
}

export default StaticResourcesComponent;
