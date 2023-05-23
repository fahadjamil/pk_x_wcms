import { getAuthorizationHeader, isEnable } from '../../shared/utils/AuthorizationUtils';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import WorkflowStateModel from '../../shared/models/workflow-models/WorkflowStateModel';
import { getUserName } from '../../shared/utils/UserUtils';
import PopupWorkflowViewComponent from '../../workflows/PopupWorkflowViewComponent';
import DocumentHistoryComponent from '../history/DocumentHistoryComponent';
import CollectionCreation from './CollectionCreation';
import DocumentEdit from './DocumentEdit';
import NewCollectionTypeEdit from './NewCollectionTypeEdit';
import TableStatusComponent from './table-component/TableStatusComponent';
import TableTitleComponent from './table-component/TableTitleComponent';
import { getFormattedDateTimeString } from '../../shared/utils/DateTimeUtil';
import { Modal } from 'react-bootstrap';
import { getUpdatedWorkflowState } from '../../shared/utils/WorkflowUtils';
import { WorkflowsStatus } from '../../shared/config/WorkflowsStatus';
import ConfirmationModal from '../../shared/ui-components/modals/confirmation-modal';
import masterRepository from '../../shared/repository/MasterRepository';
import DocumentView from './DocumentView';

interface ResponseDataType {
    status: string;
    msg: string;
}

function DocumentList(props) {
    // const targetDatabase = 'boursa2';
    const targetDatabase = props.website;
    const DefaultLanguage = props.lang[0];
    const SecondnaryLanguage = props.lang[1] ? props.lang[1] : '';
    const [DocumentList, setDocumentList] = useState<any>([]);
    const [showDocumentEdit, setshowDocumentEdit] = useState(false);
    const [showCollCreation, setshowCollCreation] = useState(false);
    const [showCollectionDeleteModal, setShowCollectionDeleteModal] = useState(false);
    const [fieldDataToEdit, setfieldDataToEdit] = useState({});
    const [editId, seteditId] = useState();
    const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number>(0);
    const [documentsWorkflowStatusList, setDocumentsWorkflowStatusList] = useState<{
        [key: string]: WorkflowStateModel;
    }>();
    const [isVisibleAddNewTypeEdit, setisVisibleAddNewTypeEdit] = useState(false);
    const [isVisbleDocList, setisVisbleDocList] = useState(true);
    const [selectedEditWorkflow, setSelectedEditWorkflow] = useState<WorkflowStateModel>();
    const [responseData, setResponseData] = useState<ResponseDataType>({ status: '', msg: '' });

    const [showDocumentPreview, setshowDocumentPreview] = useState(false);
    const [fieldDataToPreview, setfieldDataToPreview] = useState({});
    const [documentMetaData, setDocumentMetaData] = useState({});

    let val1: valType;
    interface valType {
        _id: string;
        fieldData: any;
        workflowStateId: string;
        active: boolean;
    }

    useEffect(() => {
        getCollDocList();
        setisVisbleDocList(true);
        setisVisibleAddNewTypeEdit(false);
    }, [props.collName]);

    function getCollDocList() {
        const headerParameter = {
            collection: props.collName + '-drafts',
            sorter: JSON.stringify({ _id: -1 }),
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/types', httpHeaders)
            .then((response) => {
                let tempObjArry: [] = response.data;
                setDocumentList(tempObjArry);
                getAllDocumentsWorkflowStatus();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getAllDocumentsWorkflowStatus() {
        const headerParameter = { collectionName: props.collName + '-drafts' };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/workflow/customCollections', httpHeaders)
            .then((response) => {
                if (response && response.data) {
                    let workflowList = {};
                    response.data.forEach((workflow) => {
                        const { _id, ...workFlowStateData } = workflow;
                        const workflowState: WorkflowStateModel = {
                            id: _id,
                            ...workFlowStateData,
                        };
                        workflowList[workflow._id] = workflowState;
                    });
                    setDocumentsWorkflowStatusList(workflowList);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function docEditClose() {
        setshowDocumentEdit(false);
    }

    function colCreationClose() {
        setshowCollCreation(false);
        setshowDocumentEdit(false);
    }

    const getDocument = () => {};

    function onWorkflowSubmited(
        updatedWorkflowState: WorkflowStateModel,
        updatingDocumentIndex: number
    ) {
        if (documentsWorkflowStatusList && updatedWorkflowState.id) {
            documentsWorkflowStatusList[updatedWorkflowState.id] = updatedWorkflowState;
            setDocumentsWorkflowStatusList({ ...documentsWorkflowStatusList });
        }
        updateDocumentWorkflow(updatedWorkflowState, updatingDocumentIndex);
    }

    function workflowClicked(documentIndex) {
        setSelectedDocumentIndex(documentIndex);
    }

    function updateDocumentWorkflow(
        updatedWorkflowState: WorkflowStateModel,
        updatingDocumentIndex: number
    ) {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        Axios.post(
            '/api/workflow/documents/update',
            {
                dbName: targetDatabase,
                draftCollectionName: props.collName + '-drafts',
                collectionName: props.collName,
                workflow: updatedWorkflowState,
                docId: DocumentList[updatingDocumentIndex]._id,
            },
            httpHeaders
        )
            .then((res) => {
                getCollDocList();
            })
            .catch((err) => {
                console.log('error', err);
            });
    }

    function ActivateDocument(collecObj: valType, currentWorkflowStatus, documentIndex) {
        let updateWorkflowState = getUpdatedWorkflowState(
            WorkflowsStatus.initial,
            currentWorkflowStatus,
            'Document Active',
            props.collName + '-drafts'
        );
        if (onWorkflowSubmited) {
            onWorkflowSubmited(updateWorkflowState, documentIndex);
        }

        let fieldData = collecObj.fieldData;
        let FieldsListData = {
            ...{ fieldData },
            ...{ workflowStateId: updateWorkflowState.id },
            ...{ active: !collecObj.active },
        };

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.put(
            '/api/custom-collections/documents/update',
            {
                dbName: targetDatabase,
                collectionName: props.collName + '-drafts',
                _id: collecObj._id,
                updated_data: FieldsListData,
            },
            httpHeaders
        )
            .then((res) => {
                getCollDocList();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function deleteRecord(documentIndex, workflowStatus) {
        setSelectedEditWorkflow(workflowStatus);
        setSelectedDocumentIndex(documentIndex);
        setShowCollectionDeleteModal(true);
    }

    function handleDeleteRecord() {
        setShowCollectionDeleteModal(false);

        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.post(
            '/api/custom-collections/document/delete',
            {
                dbName: targetDatabase,
                draftCollectionName: props.collName + '-drafts',
                collectionName: props.collName,
                workflow: selectedEditWorkflow,
                docId: DocumentList[selectedDocumentIndex]._id,
                deletedBy: masterRepository.getCurrentUser().docId,
            },
            httpHeaders
        )
            .then((response) => {
                const { status, data }: { status: number; data: ResponseDataType } = response;

                if (status == 200) {
                    setResponseData(data);
                    setTimeout(function () {
                        setResponseData({ status: '', msg: '' });
                    }, 3000);
                    getCollDocList();
                }
            })
            .catch((err) => {
                console.log('error', err);
            });
    }

    const tbldata = () => {
        return Object.entries(DocumentList).map(([key, value]) => {
            val1 = value as valType;
            let currentWorkflowStatus: WorkflowStateModel | undefined = undefined;

            if (
                documentsWorkflowStatusList &&
                documentsWorkflowStatusList[DocumentList[key].workflowStateId]
            ) {
                currentWorkflowStatus =
                    documentsWorkflowStatusList[DocumentList[key].workflowStateId];
            }

            if (Object.keys(val1).length !== 0) {
                return (
                    <tr key={`DocList${key}`}>
                        <td>{key} </td>
                        <td>
                            <TableTitleComponent
                                title={
                                    val1.fieldData
                                        ? val1.fieldData[DefaultLanguage.langKey]
                                            ? val1.fieldData[DefaultLanguage.langKey].entry_name
                                                ? val1.fieldData[DefaultLanguage.langKey].entry_name
                                                : val1.fieldData[SecondnaryLanguage.langKey]
                                                ? val1.fieldData[SecondnaryLanguage.langKey]
                                                      .entry_name
                                                : ''
                                            : ''
                                        : val1.fieldData[SecondnaryLanguage.langKey]
                                        ? val1.fieldData[SecondnaryLanguage.langKey].entry_name
                                        : ''
                                }
                                createdUser={
                                    currentWorkflowStatus &&
                                    getUserName(currentWorkflowStatus.createdBy)
                                }
                                createdDate={
                                    currentWorkflowStatus &&
                                    getFormattedDateTimeString(currentWorkflowStatus.createdDate)
                                }
                            />
                        </td>
                        <td>
                            <TableStatusComponent currentWorkflowStatus={currentWorkflowStatus} />
                        </td>
                        <td>
                            <div className="custom-control custom-switch">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={DocumentList[key]._id}
                                    data-onstyle="success"
                                    onChange={() => {
                                        ActivateDocument(
                                            DocumentList[key],
                                            currentWorkflowStatus,
                                            key
                                        );
                                    }}
                                    checked={DocumentList[key].active}
                                    key={`Active${key}`}
                                ></input>
                                <label
                                    className="custom-control-label"
                                    htmlFor={DocumentList[key]._id}
                                ></label>
                            </div>
                        </td>
                        <td>
                            <div style={{ textAlign: 'right' }}>
                                <div className="ml-1 mr-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary mr-2"
                                        data-toggle="modal"
                                        data-target={'#PopupWorkflowModal' + key}
                                        onClick={() => {
                                            workflowClicked(key);
                                        }}
                                    >
                                        Workflow
                                    </button>
                                </div>
                            </div>
                            <PopupWorkflowViewComponent
                                modalId={'PopupWorkflowModal' + key}
                                key={`PopupWorkflow${key}`}
                                onSubmit={(workflowState) =>
                                    onWorkflowSubmited(workflowState, selectedDocumentIndex)
                                }
                                selectedWorkState={currentWorkflowStatus}
                                dbName={targetDatabase}
                                collecName={props.collName}
                            />
                        </td>
                        <td>
                            <button
                                type="button"
                                className="btn btn-outline-primary mr-2"
                                data-toggle="modal"
                                data-target="#documentEdit"
                                disabled={isEnable('/api/custom-collections/new/update')}
                                onClick={(e) => {
                                    setfieldDataToPreview(DocumentList[key].fieldData);
                                    setshowDocumentPreview(true);
                                }}
                            >
                                Preview
                            </button>
                        </td>
                        {props.collectionTypes?.collectionType !== 'Forms' && (
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary mr-2"
                                    data-toggle="modal"
                                    data-target="#documentEdit"
                                    disabled={isEnable('/api/custom-collections/new/update')}
                                    onClick={(e) => {
                                        setSelectedEditWorkflow(currentWorkflowStatus);
                                        setshowDocumentEdit(true);
                                        setfieldDataToEdit(DocumentList[key].fieldData);
                                        seteditId(DocumentList[key]._id);
                                        setDocumentMetaData(DocumentList[key]);
                                    }}
                                >
                                    Edit
                                </button>
                            </td>
                        )}
                        <td>
                            <button
                                className="btn btn-outline-danger mr-2"
                                // disabled={isEnable('/api/custom-collections/new/update')}
                                onClick={() => {
                                    deleteRecord(key, currentWorkflowStatus);
                                }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                );
            }
        });
    };

    function handleDiscardClick() {
        setisVisibleAddNewTypeEdit(false);
        setisVisbleDocList(true);
    }

    return (
        <div className="col-sm-12">
            <div className="page__toolbar__container">
                <div className="row">
                    <div className="col-sm-6">
                        <ul className="nav nav-tabs" id="document-nav-Tab" role="tablist">
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    id="document-nav-edit-tab"
                                    data-toggle="tab"
                                    href="#document-nav-edit"
                                    role="tab"
                                    aria-controls="document-nav-edit"
                                    aria-selected="true"
                                >
                                    Edit
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    id="document-nav-history-tab"
                                    data-toggle="tab"
                                    href="#document-nav-history"
                                    role="tab"
                                    aria-controls="document-nav-history"
                                    aria-selected="true"
                                >
                                    History
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-sm-6 text-right">
                        <div style={{ textAlign: 'right', padding: '' }}>
                            {isVisibleAddNewTypeEdit && (
                                <button
                                    className="btn btn-secondary mr-3"
                                    onClick={handleDiscardClick}
                                >
                                    Discard
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn-thm-01 mr-3"
                                disabled={isEnable('/api/custom-collections/new/update')}
                                onClick={() => {
                                    setisVisibleAddNewTypeEdit(true);
                                    setisVisbleDocList(false);
                                }}
                            >
                                Edit Collection Type
                            </button>
                            {props.collectionTypes?.collectionType !== 'Forms' && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-toggle="modal"
                                    data-target="#exampleModalCenter"
                                    disabled={isEnable('/api/custom-collections/new/create')}
                                    onClick={() => {
                                        setshowCollCreation(true);
                                    }}
                                >
                                    Add New
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {responseData && responseData.status === 'success' && (
                <div className="row">
                    <div className="col-md-12">
                        <div
                            className="alert alert-success alert-dismissible fade show mt-2"
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
            <div className="row">
                <div className="col-12 tab-content" id="document-nav-tabContent">
                    <div
                        className="tab-pane fade show active mt-5"
                        id="document-nav-edit"
                        key="document-nav-edit"
                        role="tabpanel"
                        aria-labelledby="document-nav-edit-tab"
                    >
                        <Modal
                            show={showCollCreation}
                            onHide={() => {
                                colCreationClose();
                            }}
                            size="lg"
                            backdrop="static"
                            keyboard={false}
                            autoFocus={false}
                            enforceFocus={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title> {props.collectionTypes.menuname}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <CollectionCreation
                                    menuName={props.collName}
                                    collectionTypes={props.collectionTypes}
                                    callback={() => {
                                        getCollDocList();
                                        colCreationClose();
                                    }}
                                    onCloseCallBack={() => {
                                        colCreationClose();
                                    }}
                                ></CollectionCreation>
                            </Modal.Body>
                        </Modal>

                        <div>
                            {isVisbleDocList ? (
                                <Table className="table-borderless table-hover tbl-thm-01 table">
                                    <thead className="">
                                        <tr>
                                            <th>ID</th>
                                            <th>ENTRY NAME</th>
                                            <th>STATUS</th>
                                            <th>ACTIVE</th>
                                            <th style={{ textAlign: 'center' }}>ACTION</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>{tbldata()}</tbody>
                                    <Modal
                                        show={showDocumentEdit}
                                        onHide={() => {
                                            colCreationClose();
                                        }}
                                        size="lg"
                                        backdrop="static"
                                        keyboard={false}
                                        autoFocus={false}
                                        enforceFocus={false}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>
                                                {' '}
                                                {props.collectionTypes.menuname}
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <DocumentEdit
                                                //key={`DocEdit${key}`}
                                                collectionTypes={props.collectionTypes}
                                                fieldObj={fieldDataToEdit}
                                                _id={editId}
                                                workflowState={selectedEditWorkflow}
                                                metaData={documentMetaData}
                                                onWorkflowEditSubmit={(workflowState) =>
                                                    onWorkflowSubmited(
                                                        workflowState,
                                                        selectedDocumentIndex
                                                    )
                                                }
                                                callback={() => {
                                                    getCollDocList();
                                                    setshowDocumentEdit(false);
                                                }}
                                                onCloseCallBack={() => {
                                                    docEditClose();
                                                }}
                                            ></DocumentEdit>
                                        </Modal.Body>
                                    </Modal>
                                </Table>
                            ) : (
                                ''
                            )}

                            {isVisibleAddNewTypeEdit ? (
                                <NewCollectionTypeEdit
                                    collectionTypes={props.collectionTypes}
                                    selectedType="Posts"
                                    postCategories={props.postCategories}
                                    documentCategories={props.documentCategories}
                                    formCategories={props.formCategories}
                                    collectionTypesPost={props.collectionTypesPost}
                                    collectionTypesDocs={props.collectionTypesDocs}
                                    callback={() => {
                                        props.callback();
                                        setisVisibleAddNewTypeEdit(false);
                                        setisVisbleDocList(true);
                                    }}
                                ></NewCollectionTypeEdit>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <div
                        className="row tab-pane fade mt-5"
                        id="document-nav-history"
                        role="tabpanel"
                        key="document-nav-history"
                        aria-labelledby="document-nav-history-tab"
                    >
                        <div>
                            <DocumentHistoryComponent
                                database_name={targetDatabase}
                                lang={DefaultLanguage}
                                collectionTypes={props.collectionTypes}
                                menuName={props.collName
                                    .slice(props.collName.search('-') + 1)
                                    .replaceAll('-', ' ')
                                    .replaceAll('_', ' ')}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {showCollectionDeleteModal && (
                <ConfirmationModal
                    modalTitle="Delete Record"
                    show={showCollectionDeleteModal}
                    handleClose={() => {
                        setShowCollectionDeleteModal(false);
                    }}
                    handleConfirme={handleDeleteRecord}
                >
                    <p>"Are you sure you want to delete this record?"</p>
                </ConfirmationModal>
            )}
            <>
                <Modal
                    show={showDocumentPreview}
                    onHide={() => {
                        setshowDocumentPreview(false);
                    }}
                    size="lg"
                    keyboard={false}
                    autoFocus={false}
                    enforceFocus={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title> {props.collectionTypes.menuname}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <DocumentView
                            collectionTypes={props.collectionTypes}
                            fieldObj={fieldDataToPreview}
                            lang={props.lang}
                            website={targetDatabase}
                        ></DocumentView>
                    </Modal.Body>
                </Modal>
            </>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
        lang: state.websiteReducer.website?.languages,
    };
};

export default connect(mapStateToProps)(DocumentList);
