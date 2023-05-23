import { getAuthorizationHeader, isEnable } from '../../../shared/utils/AuthorizationUtils';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import './PermissionComponent.css';
import { Modal, Button } from 'react-bootstrap';
import PESectionDelete from '../../../shared/resources/PageEditor-Section-Delete';

export default function PermissionComponent(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const history = useHistory();
    const [features, setFeature] = useState([]);
    const [operationTypes, setOperation] = useState([]);
    const [roleId, setRoleId] = useState(0);
    const [roles, setRoles] = useState([]);
    const [customPosts, setCustomPosts] = useState();
    const [customDocs, setcustomDocs] = useState();
    const [customForms, setcustomForms] = useState();
    const [customTrees, setcustomTrees] = useState();
    const [isShowModal, setIsShowModal] = useState(false);
    let includedPostResults = [];
    let includedDocsResults = [];
    let includedTreesResults = [];
    let includedFormsResults = [];

    const [allowedPostCollections, setAllowedPostCollections] = useState([]);
    const [allowedDocsCollections, setAllowedDocsCollections] = useState([]);
    const [allowedTreesCollections, setAllowedTreesCollections] = useState([]);
    const [allowedFormsCollections, setAllowedFormsCollections] = useState([]);

    useEffect(() => {
        getInitComponent();
    }, [props.website]);

    useEffect(() => {
        if (roleId !== 0) {
            getAllowedCollections();
        }
    }, [roleId]);

    function getInitComponent() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');

        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.website,
        //     },
        // };

        Axios.get('/api/cms/permissions', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setFeature(result.data);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });

        Axios.get('/api/cms/feature-operations', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setOperation(result.data);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });

        Axios.get('/api/cms/roles/approved', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setRoles(result.data);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });

        const customTypesPostsHeaderParameter = {
            collection: 'custome-types',
            searchQuery: 'Posts',
        };
        const customTypesPostsHttpHeaders = getAuthorizationHeader(customTypesPostsHeaderParameter);

        Axios.get('/api/custom-collections/types', customTypesPostsHttpHeaders)
            .then((response) => {
                setCustomPosts(response.data);
            })
            .catch((err) => {
                console.log(err);
            });

        const customTypesDocsHeaderParameter = {
            collection: 'custome-types',
            searchQuery: 'Documents',
        };
        const customTypesDocssHttpHeaders = getAuthorizationHeader(customTypesDocsHeaderParameter);

        Axios.get('/api/custom-collections/types', customTypesDocssHttpHeaders)
            .then((response) => {
                setcustomDocs(response.data);
            })
            .catch((err) => {
                console.log(err);
            });

        const customTypesFormsHeaderParameter = {
            collection: 'custome-types',
            searchQuery: 'Forms',
        };
        const customTypesFormsHttpHeaders = getAuthorizationHeader(customTypesFormsHeaderParameter);

        Axios.get('/api/custom-collections/types', customTypesFormsHttpHeaders)
            .then((response) => {
                setcustomForms(response.data);
            })
            .catch((err) => {
                console.log(err);
            });

        const customTypesTreesHeaderParameter = { collection: 'custom-trees' };
        const customTypesTreesHttpHeaders = getAuthorizationHeader(customTypesTreesHeaderParameter);

        Axios.get('/api/collection/data/all', customTypesTreesHttpHeaders)
            .then((response) => {
                setcustomTrees(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getAllowedCollections() {
        const headerParameter = { dbName: props.website, roleId: roleId.toString() };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/cms/roles/allowedDocuments', httpHeaders)
            .then((result) => {
                const allowedDocuments = result.data;
                if (allowedDocuments) {
                    if (allowedDocuments.documents && allowedDocuments.documents.length > 0) {
                        includedDocsResults = allowedDocuments.documents.map((doc) => {
                            return doc._id;
                        });

                        setAllowedDocsCollections(allowedDocuments.documents);
                    }

                    if (allowedDocuments.posts && allowedDocuments.posts.length > 0) {
                        includedPostResults = allowedDocuments.posts.map((post) => {
                            return post._id;
                        });

                        setAllowedPostCollections(allowedDocuments.posts);
                    }

                    if (allowedDocuments.forms && allowedDocuments.forms.length > 0) {
                        includedFormsResults = allowedDocuments.forms
                            .map((form) => {
                                return form._id;
                            })
                            .filter((x) => x !== null);

                        setAllowedFormsCollections(allowedDocuments.forms);
                    }

                    if (allowedDocuments.trees && allowedDocuments.trees.length > 0) {
                        includedTreesResults = allowedDocuments.trees
                            .map((tree) => {
                                return tree._id;
                            })
                            .filter((x) => x !== null);

                        setAllowedTreesCollections(allowedDocuments.trees);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const updateFeature = (featureTypeIndex, featureIndex, operationId, roleId) => {
        let newFeatures = [...features];

        let indexOfRoleId = features[0].types[featureTypeIndex].features[featureIndex].operation
            .find((x) => x.id === operationId)
            .roles.indexOf(roleId);

        if (indexOfRoleId !== -1) {
            newFeatures[0].types[featureTypeIndex].features[featureIndex].operation
                .find((x) => x.id === operationId)
                .roles.splice(indexOfRoleId, 1);
        } else {
            newFeatures[0].types[featureTypeIndex].features[featureIndex].operation
                .find((x) => x.id === operationId)
                .roles.push(roleId);
        }
        setFeature(newFeatures);
    };

    function saveFeature() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');

        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: props.website,
        //     },
        // };

        Axios.post('/api/cms/features/save', features[0], httpHeaders)
            .then((result) => {
                setIsLoaded(true);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });

        if (roleId !== 0) {
            const allAllowedDocs = [
                ...allowedPostCollections,
                ...allowedDocsCollections,
                ...allowedFormsCollections,
            ];
            const docsIdList = allAllowedDocs.map((documnet) => documnet._id);
            const treesIdList = allowedTreesCollections
                .map((documnet) => documnet._id)
                .filter((x) => x !== null);

            Axios.post(
                '/api/cms/roles/allowedDocuments/save',
                {
                    dbName: props.website,
                    roleId: roleId.toString(),
                    allowedList: docsIdList,
                    allowedTreeList: treesIdList,
                },
                httpHeaders
            )
                .then((result) => {
                    setIsLoaded(true);
                })
                .catch((err) => {
                    setIsLoaded(false);
                    setError(err);
                    console.log(err);
                });
        }
    }

    const roleDropdown = () => {
        return (
            <React.Fragment key="dropDown">
                <span class="dropdown">
                    <a
                        class="btn btn-secondary dropdown-toggle btn-sm"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        Roles
                    </a>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        {Array.isArray(roles) &&
                            roles.map((role, roleIndex) => {
                                return (
                                    <button
                                        className="dropdown-item"
                                        type="button"
                                        id={role.id}
                                        key={role.id}
                                        onClick={(event) => {
                                            setRoleId(roles[roleIndex]._id);
                                        }}
                                    >
                                        {role.name}
                                    </button>
                                );
                            })}
                    </div>
                </span>
            </React.Fragment>
        );
    };

    const featureCategory = (featureTypes, featureTypeIndex) => {
        return (
            <React.Fragment key={featureTypeIndex + 'heading'}>
                <tr className="">
                    <th>
                        <span className="mainHeader">
                            {operationTypes[0] &&
                                operationTypes[0].operationsType
                                    .find((x) => x.id === featureTypes.id)
                                    .name.toUpperCase()}
                        </span>
                    </th>

                    {operationTypes[0] &&
                        operationTypes[0].operationsType
                            .find((x) => x.id === featureTypes.id)
                            .operations.map((operation, operationIndex) => {
                                return (
                                    <React.Fragment key={featureTypeIndex + '-' + operationIndex}>
                                        <th scope="col">
                                            <span>{operation.name.toUpperCase()}</span>
                                        </th>
                                    </React.Fragment>
                                );
                            })}
                </tr>
            </React.Fragment>
        );
    };

    function getCustomCollections() {
        return (
            <React.Fragment>
                {customPosts && customPosts.length > 0 && (
                    <React.Fragment>
                        <div>Posts</div>
                        <ul className="list-group-cms list-group-flush">
                            {customPosts.map((post) => {
                                const includedPost = allowedPostCollections.find(
                                    (allowedPost) => allowedPost._id === post._id
                                );

                                if (includedPost === undefined) {
                                    return (
                                        <li key={post._id} className="list-group-item ml-3">
                                            <label className="form-check-label">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="exampleCheck1"
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            includedPostResults.push(post._id);
                                                        } else {
                                                            const index =
                                                                includedPostResults.indexOf(
                                                                    post._id
                                                                );
                                                            if (index > -1) {
                                                                includedPostResults.splice(
                                                                    index,
                                                                    1
                                                                );
                                                            }
                                                        }
                                                    }}
                                                ></input>
                                                {post.menuName}
                                            </label>
                                        </li>
                                    );
                                } else {
                                    return <React.Fragment></React.Fragment>;
                                }
                            })}
                        </ul>
                    </React.Fragment>
                )}
                {customDocs && customDocs.length > 0 && (
                    <React.Fragment>
                        <div>Documents</div>
                        <ul className="list-group-cms list-group-flush">
                            {customDocs.map((doc) => {
                                const includedDoc = allowedDocsCollections.find(
                                    (allowedDoc) => allowedDoc._id === doc._id
                                );
                                if (includedDoc === undefined) {
                                    return (
                                        <li key={doc._id} className="list-group-item ml-3">
                                            <label className="form-check-label">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="exampleCheck2"
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            includedDocsResults.push(doc._id);
                                                        } else {
                                                            const index =
                                                                includedDocsResults.indexOf(
                                                                    doc._id
                                                                );
                                                            if (index > -1) {
                                                                includedDocsResults.splice(
                                                                    index,
                                                                    1
                                                                );
                                                            }
                                                        }
                                                    }}
                                                ></input>
                                                {doc.menuName}
                                            </label>
                                        </li>
                                    );
                                } else {
                                    return <React.Fragment></React.Fragment>;
                                }
                            })}
                        </ul>
                    </React.Fragment>
                )}
                {customForms && customForms.length > 0 && (
                    <React.Fragment>
                        <div>Forms</div>
                        <ul className="list-group-cms list-group-flush">
                            {customForms.map((doc) => {
                                const includedDoc = allowedFormsCollections.find(
                                    (allowedDoc) => allowedDoc._id === doc._id
                                );
                                if (includedDoc === undefined) {
                                    return (
                                        <li key={doc._id} className="list-group-item ml-3">
                                            <label className="form-check-label">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="exampleCheck2"
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            includedFormsResults.push(doc._id);
                                                        } else {
                                                            const index =
                                                                includedFormsResults.indexOf(
                                                                    doc._id
                                                                );
                                                            if (index > -1) {
                                                                includedFormsResults.splice(
                                                                    index,
                                                                    1
                                                                );
                                                            }
                                                        }
                                                    }}
                                                ></input>
                                                {doc.menuName}
                                            </label>
                                        </li>
                                    );
                                } else {
                                    return <React.Fragment></React.Fragment>;
                                }
                            })}
                        </ul>
                    </React.Fragment>
                )}
                {customTrees && customTrees.length > 0 && (
                    <React.Fragment>
                        <div>Trees</div>
                        <ul className="list-group-cms list-group-flush">
                            {customTrees.map((doc) => {
                                const includedDoc = allowedTreesCollections.find(
                                    (allowedDoc) => allowedDoc._id === doc._id
                                );
                                if (includedDoc === undefined) {
                                    return (
                                        <li key={doc._id} className="list-group-item ml-3">
                                            <label className="form-check-label">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="exampleCheck2"
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            includedTreesResults.push(doc._id);
                                                        } else {
                                                            const index =
                                                                includedTreesResults.indexOf(
                                                                    doc._id
                                                                );
                                                            if (index > -1) {
                                                                includedTreesResults.splice(
                                                                    index,
                                                                    1
                                                                );
                                                            }
                                                        }
                                                    }}
                                                ></input>
                                                {doc.title}
                                            </label>
                                        </li>
                                    );
                                } else {
                                    return <React.Fragment></React.Fragment>;
                                }
                            })}
                        </ul>
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }

    function getAllowedCustomCollections() {
        if (
            (allowedPostCollections && allowedPostCollections.length > 0) ||
            (allowedDocsCollections && allowedDocsCollections.length > 0) ||
            (allowedFormsCollections && allowedFormsCollections.length > 0) ||
            (allowedTreesCollections && allowedTreesCollections.length > 0)
        ) {
            return (
                <table className="table-borderless table-hover tbl-thm-01 table">
                    {allowedPostCollections && allowedPostCollections.length > 0 && (
                        <React.Fragment>
                            <thead>
                                <tr className="">
                                    <th>
                                        <span className="mainHeader">Posts</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {allowedPostCollections.map((elemet) => {
                                    return (
                                        <tr key={elemet._id}>
                                            <td>{elemet.menuName}</td>
                                            <td className="text-right">
                                                <span
                                                    onClick={() => {
                                                        const itemIndex =
                                                            allowedPostCollections.indexOf(elemet);

                                                        if (itemIndex > -1) {
                                                            allowedPostCollections.splice(
                                                                itemIndex,
                                                                1
                                                            );
                                                            setAllowedPostCollections([
                                                                ...allowedPostCollections,
                                                            ]);
                                                        }
                                                    }}
                                                >
                                                    <PESectionDelete width="20px" height="20px" />
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </React.Fragment>
                    )}
                    {allowedDocsCollections && allowedDocsCollections.length > 0 && (
                        <React.Fragment>
                            <thead>
                                <tr className="">
                                    <th>
                                        <span className="mainHeader">Documents</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {allowedDocsCollections.map((elemet) => {
                                    return (
                                        <tr key={elemet._id}>
                                            <td>{elemet.menuName}</td>
                                            <td className="text-right">
                                                <span
                                                    onClick={() => {
                                                        const itemIndex =
                                                            allowedDocsCollections.indexOf(elemet);

                                                        if (itemIndex > -1) {
                                                            allowedDocsCollections.splice(
                                                                itemIndex,
                                                                1
                                                            );
                                                            setAllowedDocsCollections([
                                                                ...allowedDocsCollections,
                                                            ]);
                                                        }
                                                    }}
                                                >
                                                    <PESectionDelete width="20px" height="20px" />
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </React.Fragment>
                    )}
                    {allowedFormsCollections && allowedFormsCollections.length > 0 && (
                        <React.Fragment>
                            <thead>
                                <tr className="">
                                    <th>
                                        <span className="mainHeader">Forms</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {allowedFormsCollections.map((elemet) => {
                                    return (
                                        <tr key={elemet._id}>
                                            <td>{elemet.menuName}</td>
                                            <td className="text-right">
                                                <span
                                                    onClick={() => {
                                                        const itemIndex =
                                                            allowedFormsCollections.indexOf(elemet);

                                                        if (itemIndex > -1) {
                                                            allowedFormsCollections.splice(
                                                                itemIndex,
                                                                1
                                                            );
                                                            setAllowedFormsCollections([
                                                                ...allowedFormsCollections,
                                                            ]);
                                                        }
                                                    }}
                                                >
                                                    <PESectionDelete width="20px" height="20px" />
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </React.Fragment>
                    )}
                    {allowedTreesCollections && allowedTreesCollections.length > 0 && (
                        <React.Fragment>
                            <thead>
                                <tr className="">
                                    <th>
                                        <span className="mainHeader">Trees</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {allowedTreesCollections.map((elemet) => {
                                    return (
                                        <tr key={elemet._id}>
                                            <td>{elemet.title}</td>
                                            <td className="text-right">
                                                <span
                                                    onClick={() => {
                                                        const itemIndex =
                                                            allowedTreesCollections.indexOf(elemet);

                                                        if (itemIndex > -1) {
                                                            allowedTreesCollections.splice(
                                                                itemIndex,
                                                                1
                                                            );
                                                            setAllowedTreesCollections([
                                                                ...allowedTreesCollections,
                                                            ]);
                                                        }
                                                    }}
                                                >
                                                    <PESectionDelete width="20px" height="20px" />
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </React.Fragment>
                    )}
                </table>
            );
        } else {
            return <React.Fragment></React.Fragment>;
        }
    }

    return (
        <>
            <div className={('container', 'table-responsive')} key="0">
                <table className="table-borderless table-hover tbl-thm-01 table">
                    <tbody>
                        <tr>
                            <td>
                                Select user role to cofigure permisions{' '}
                                <span>{roleDropdown()}</span>
                            </td>
                            <td className="text-right">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    disabled={isEnable('/api/cms/features/save')}
                                    onClick={() => saveFeature()}
                                >
                                    Save Permesions
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table className="table-borderless table-hover tbl-thm-01 table">
                    {roleId != 0 &&
                        features[0] &&
                        features[0].types.map((featureTypes, featureTypeIndex) => {
                            return (
                                <React.Fragment key={featureTypeIndex}>
                                    <thead>{featureCategory(featureTypes, featureTypeIndex)}</thead>
                                    <tbody>
                                        {featureTypes &&
                                            featureTypes.features.map((feature, featureIndex) => {
                                                return (
                                                    <React.Fragment
                                                        key={featureTypeIndex + '-' + featureIndex}
                                                    >
                                                        <tr>
                                                            <td>
                                                                <span>{feature.name}</span>
                                                            </td>
                                                            {operationTypes[0] &&
                                                                operationTypes[0].operationsType
                                                                    .find(
                                                                        (x) =>
                                                                            x.id === featureTypes.id
                                                                    )
                                                                    .operations.map(
                                                                        (
                                                                            operation,
                                                                            operationIndex
                                                                        ) => {
                                                                            const isOperationAvailable =
                                                                                feature.operation.some(
                                                                                    (o) =>
                                                                                        o.id ===
                                                                                        operation.id
                                                                                );

                                                                            if (
                                                                                isOperationAvailable
                                                                            ) {
                                                                                let currentOperation =
                                                                                    feature.operation.find(
                                                                                        (x) =>
                                                                                            x.id ===
                                                                                            operation.id
                                                                                    );

                                                                                return (
                                                                                    <React.Fragment
                                                                                        key={
                                                                                            featureTypeIndex +
                                                                                            '-' +
                                                                                            featureIndex +
                                                                                            '-' +
                                                                                            operationIndex
                                                                                        }
                                                                                    >
                                                                                        <td scope="col">
                                                                                            <div className="custom-control custom-switch">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="custom-control-input"
                                                                                                    id={
                                                                                                        featureTypeIndex +
                                                                                                        '-' +
                                                                                                        featureIndex +
                                                                                                        '-' +
                                                                                                        operationIndex
                                                                                                    }
                                                                                                    defaultChecked
                                                                                                    checked={currentOperation.roles.includes(
                                                                                                        roleId
                                                                                                    )}
                                                                                                    onChange={(
                                                                                                        event
                                                                                                    ) => {
                                                                                                        updateFeature(
                                                                                                            featureTypeIndex,
                                                                                                            featureIndex,
                                                                                                            operation.id,
                                                                                                            roleId
                                                                                                        );
                                                                                                    }}
                                                                                                ></input>
                                                                                                <label
                                                                                                    className="custom-control-label"
                                                                                                    htmlFor={
                                                                                                        featureTypeIndex +
                                                                                                        '-' +
                                                                                                        featureIndex +
                                                                                                        '-' +
                                                                                                        operationIndex
                                                                                                    }
                                                                                                ></label>
                                                                                            </div>
                                                                                        </td>
                                                                                    </React.Fragment>
                                                                                );
                                                                            } else {
                                                                                return (
                                                                                    <React.Fragment
                                                                                        key={
                                                                                            featureTypeIndex +
                                                                                            '-' +
                                                                                            featureIndex +
                                                                                            '-' +
                                                                                            operationIndex
                                                                                        }
                                                                                    >
                                                                                        <td scope="col">
                                                                                            <div className="custom-control custom-switch">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="custom-control-input"
                                                                                                    id={
                                                                                                        featureTypeIndex +
                                                                                                        '-' +
                                                                                                        featureIndex +
                                                                                                        '-' +
                                                                                                        operationIndex
                                                                                                    }
                                                                                                    disabled
                                                                                                ></input>
                                                                                                <label
                                                                                                    className="custom-control-label"
                                                                                                    htmlFor={
                                                                                                        featureTypeIndex +
                                                                                                        '-' +
                                                                                                        featureIndex +
                                                                                                        '-' +
                                                                                                        operationIndex
                                                                                                    }
                                                                                                ></label>
                                                                                            </div>
                                                                                        </td>
                                                                                    </React.Fragment>
                                                                                );
                                                                            }
                                                                        }
                                                                    )}
                                                        </tr>
                                                    </React.Fragment>
                                                );
                                            })}
                                    </tbody>
                                </React.Fragment>
                            );
                        })}
                    <tr>
                        <td></td>
                    </tr>
                </table>
                {roleId != 0 && (
                    <div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setIsShowModal(true);
                            }}
                        >
                            Add Allowed Documents
                        </button>
                        {getAllowedCustomCollections()}
                    </div>
                )}
                <Modal
                    show={isShowModal}
                    onHide={() => {
                        setIsShowModal(false);
                    }}
                    size="xl"
                    scrollable={true}
                >
                    <Modal.Header closeButton>Select allowed content</Modal.Header>
                    <Modal.Body>{getCustomCollections()}</Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn btn-secondary"
                            onClick={() => {
                                setIsShowModal(false);
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                const selectedPostResults = [];
                                if (customPosts && customPosts.length > 0) {
                                    includedPostResults.forEach((id) => {
                                        const selectedPost = customPosts.find(
                                            (post) => post._id === id
                                        );

                                        if (selectedPost) {
                                            selectedPostResults.push(selectedPost);
                                        }
                                    });
                                }

                                const selectedDocsResults = [];
                                if (customDocs && customDocs.length > 0) {
                                    includedDocsResults.forEach((id) => {
                                        const selectedDoc = customDocs.find(
                                            (post) => post._id === id
                                        );

                                        if (selectedDoc) {
                                            selectedDocsResults.push(selectedDoc);
                                        }
                                    });
                                }

                                const selectedFormsResults = [];
                                if (customForms && customForms.length > 0) {
                                    includedFormsResults.forEach((id) => {
                                        const selectedDoc = customForms.find(
                                            (form) => form._id === id
                                        );

                                        if (selectedDoc) {
                                            selectedFormsResults.push(selectedDoc);
                                        }
                                    });
                                }

                                const selectedTreesResults = [];

                                if (customTrees && customTrees.length > 0) {
                                    includedTreesResults.forEach((id) => {
                                        const selectedDoc = customTrees.find(
                                            (tree) => tree._id === id
                                        );

                                        if (selectedDoc) {
                                            selectedTreesResults.push(selectedDoc);
                                        }
                                    });
                                }

                                setAllowedPostCollections((prev) => {
                                    return [...prev, ...selectedPostResults];
                                });

                                setAllowedDocsCollections((prev) => {
                                    return [...prev, ...selectedDocsResults];
                                });

                                setAllowedFormsCollections((prev) => {
                                    return [...prev, ...selectedFormsResults];
                                });

                                setAllowedTreesCollections((prev) => {
                                    return [...prev, ...selectedTreesResults];
                                });

                                setIsShowModal(false);
                            }}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}
