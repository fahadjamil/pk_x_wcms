import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import SortableTree, {
    TreeItem,
    addNodeUnderParent,
    ExtendedNodeData,
    removeNodeAtPath,
    changeNodeAtPath,
} from 'react-sortable-tree';
import { Modal } from 'react-bootstrap';
import { getAuthorizationHeader, getAuthorizationHeaderForDelete, isEnable } from '../../shared/utils/AuthorizationUtils';
import AddTreeNodePopupComponent from './AddTreeNodePopupComponent';
import TreeNodeModel from '../models/TreeNodeModel';
import LanguageModel from '../../shared/models/LanguageModel';
import ConfirmationModal from '../../shared/ui-components/modals/confirmation-modal';
import MasterRepository from '../../shared/repository/MasterRepository';

interface TreeViewComponentModel {
    treeId: string | undefined;
    dbName: string;
    documents: any;
    posts: any;
    forms: any;
    supportLanguages: LanguageModel[];
    onDeleteTree: any;
}

const MAX_TREE_DEPTH = 5;

function TreeViewComponent(props: TreeViewComponentModel) {
    const [treeData, setTreeData] = useState<TreeItem[]>([]);
    const [isAddNodePopupOpen, setIsAddNodePopupOpen] = useState<boolean>(false);
    const [isEditNode, setIsEditNode] = useState<boolean>(false);
    const [selectedRowInfo, setSelectedRowInfo] = useState<ExtendedNodeData>();
    const [allCustomCollections, setAllCustomCollections] = useState<any>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageModel>(
        props.supportLanguages[0]
    );
    const [showMaxTreeDepthExededMessage, setShowMaxTreeDepthExededMessage] =
        useState<boolean>(false);
    const [isDeleteNodeConfirmPopupOpen, setIsDeleteNodeConfirmPopupOpen] =
        useState<boolean>(false);
    const [deletingNodeInfo, setDeletingNodeInfo] = useState<ExtendedNodeData>();
    const [isDeleteTreeConfirmPopupOpen, setIsDeleteTreeConfirmPopupOpen] =
        useState<boolean>(false);

    let documents: any = [];
    let posts: any = [];
    //let forms: any = [];

    useEffect(() => {
        getTreeData();
    }, [props.treeId]);

    useEffect(() => {
        if (props.documents && props.documents.length > 0) {
            documents = [...props.documents];
            documents.shift();
        }

        if (props.posts && props.posts.length > 0) {
            posts = [...props.posts];
            posts.shift();
        }

        /*  if (props.forms && props.forms.length > 0) {
            forms = [...props.forms];
            forms.shift();
        } */
        setAllCustomCollections([...documents, ...posts]);
    }, [props.posts, props.documents]);

    function getTreeData() {
        if (props.treeId) {
            const headerParameter = { id: props.treeId };
            const httpHeaders = getAuthorizationHeader(headerParameter);

            Axios.get('/api/custom-collections/tree', httpHeaders)
                .then((response) => {
                    if (response && response.data && response.data.tree) {
                        setTreeData(response.data.tree);
                    } else {
                        setTreeData([]);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setTreeData([]);
        }
    }

    function updateTreeData() {
        if (props.treeId) {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);

            Axios.post(
                '/api/custom-collections/tree/update',
                {
                    id: props.treeId,
                    dbName: props.dbName,
                    tree: treeData,
                },
                httpHeaders
            )
                .then((response) => {})
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function deleteTree() {
        if (props.treeId) {
            const headerParameter = {
                treeId: props.treeId,
                dbName: props.dbName,
                deletedBy: MasterRepository.getCurrentUser().docId,
            };
            const payload = getAuthorizationHeaderForDelete(headerParameter);

            Axios.delete('/api/custom-collections/tree/delete', payload)
                .then((response) => {
                    if(response && response.data){
                        if(response.data.status === 'success'){
                            if(props.onDeleteTree){
                                props.onDeleteTree();
                            }
                        }else{
                            if(response.data.msg && response.data.msg !== ''){
                                alert(response.data.msg);
                            }
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function addChildNode(rowInfo: ExtendedNodeData, newNode: TreeNodeModel) {
        if (rowInfo && rowInfo.node && rowInfo.lowerSiblingCounts.length < MAX_TREE_DEPTH) {
            const newTree = addNodeUnderParent({
                newNode: newNode,
                parentKey: rowInfo.node.nodeID,
                treeData: treeData,
                expandParent: true,
                getNodeKey: ({ node }) => node.nodeID,
            });
            setTreeData(newTree.treeData);
        }
    }

    function removeChildNode(rowInfo: ExtendedNodeData | undefined) {
        if (rowInfo) {
            const newTree = removeNodeAtPath({
                treeData: treeData,
                path: rowInfo.path,
                getNodeKey: ({ node }) => node.nodeID,
            });
            setTreeData((prev) => newTree);
        }
    }

    function updateExistingNode(rowInfo: ExtendedNodeData, updateNode: TreeNodeModel) {
        const updatedNodeWithChildren = { ...rowInfo.node, ...updateNode };
        const newTree = changeNodeAtPath({
            path: rowInfo.path,
            treeData: treeData,
            newNode: updatedNodeWithChildren,
            getNodeKey: ({ node }) => node.nodeID,
        });
        setTreeData(newTree);
    }

    function onAddNewNode(newNode: TreeNodeModel) {
        if (isEditNode && selectedRowInfo) {
            setIsEditNode(false);
            updateExistingNode(selectedRowInfo, newNode);
            setSelectedRowInfo(undefined);
        } else {
            if (selectedRowInfo) {
                addChildNode(selectedRowInfo, newNode);
                setSelectedRowInfo(undefined);
            } else {
                treeData.push(newNode);
                const nodeCopy = [...treeData];
                setTreeData(nodeCopy);
            }
        }
        setIsAddNodePopupOpen(false);
    }

    function getTitleforTreeNode(rowInfo: ExtendedNodeData): JSX.Element {
        if (rowInfo && rowInfo.node) {
            let titleForDefaultLang = '';
            if (rowInfo.node.localizeTitle) {
                titleForDefaultLang =
                    rowInfo.node.localizeTitle[selectedLanguage.langKey.toLowerCase()];
            }

            return <div>{titleForDefaultLang}</div>;
        } else {
            return <></>;
        }
    }

    function handleDropDownOnchange(event) {
        if (props.supportLanguages && event && event.target && event.target.value) {
            const selectdLanguageItem = props.supportLanguages.find(
                (langItem) => langItem.langKey === event.target.value
            );

            if (selectdLanguageItem) {
                setSelectedLanguage(selectdLanguageItem);
            }
        }
    }

    function getTreeNodefromTreeItem(node: TreeItem | undefined) {
        if (node) {
            const convertedNode: TreeNodeModel = {
                nodeID: node.nodeID,
                localizeTitle: node.localizeTitle,
                customCollection: node.customCollection,
                documentID: node.documentID,
            };

            return convertedNode;
        } else {
            return undefined;
        }
    }

    return (
        <div className="col-12 p-3">
            <div className="row">
                <div className="col-6">
                    <div className="input-group input-group-lg">
                        <select onChange={handleDropDownOnchange} className="form-control-sm">
                            {props.supportLanguages.map((languageItem, index) => {
                                return (
                                    <option key={languageItem.langKey} value={languageItem.langKey}>
                                        {languageItem.language}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div className="col-6 text-right">
                    <button
                        className="btn btn-primary btn-sm mr-2"
                        id="addNode"
                        onClick={() => {
                            setSelectedRowInfo((prev) => undefined);
                            setIsAddNodePopupOpen(true);
                        }}
                    >
                        Add Nodes
                    </button>
                    <button
                        className="btn btn-success btn-sm mr-2"
                        id="saveTree"
                        onClick={() => {
                            updateTreeData();
                        }}
                    >
                        Save
                    </button>
                    <button
                        className="btn btn-secondary btn-sm"
                        id="deleteTree"
                        onClick={() => {
                            setIsDeleteTreeConfirmPopupOpen(true);
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-12" style={{ height: 'calc(100vh - 9rem)' }}>
                    <SortableTree
                        getNodeKey={({ node }) => {
                            return node.nodeID;
                        }}
                        treeData={treeData}
                        onChange={(treeData) => {
                            setTreeData(treeData);
                        }}
                        maxDepth={MAX_TREE_DEPTH}
                        generateNodeProps={(rowInfo) => ({
                            buttons: [
                                <button
                                    className="btn rst__addButton"
                                    onClick={(event) => {
                                        if (rowInfo.lowerSiblingCounts.length < MAX_TREE_DEPTH) {
                                            setIsEditNode(false);
                                            setSelectedRowInfo((prev) => rowInfo);
                                            setIsAddNodePopupOpen(true);
                                        } else {
                                            setShowMaxTreeDepthExededMessage(true);
                                        }
                                    }}
                                ></button>,
                                <button
                                    className="btn rst__editButton"
                                    onClick={(event) => {
                                        setIsEditNode(true);
                                        setSelectedRowInfo((prev) => rowInfo);
                                        setIsAddNodePopupOpen(true);
                                    }}
                                ></button>,
                                <button
                                    className="btn rst__deleteButton"
                                    onClick={(event) => {
                                        setDeletingNodeInfo((prev) => rowInfo);
                                        setIsDeleteNodeConfirmPopupOpen(true);
                                    }}
                                ></button>,
                            ],
                            title: getTitleforTreeNode(rowInfo),
                        })}
                    />
                </div>
            </div>

            <AddTreeNodePopupComponent
                key={selectedRowInfo ? selectedRowInfo.node.nodeID : 'AddNodePopup'}
                onClosePopup={() => {
                    setIsAddNodePopupOpen(false);
                }}
                showPopup={isAddNodePopupOpen}
                allCustomCollection={allCustomCollections}
                onSubmitData={onAddNewNode}
                supportLanguages={props.supportLanguages}
                initialNodeData={getTreeNodefromTreeItem(selectedRowInfo?.node)}
                isEditMode={isEditNode}
            />
            <ConfirmationModal
                modalTitle="Delete Node"
                show={isDeleteNodeConfirmPopupOpen}
                handleClose={() => {
                    setDeletingNodeInfo(undefined);
                    setIsDeleteNodeConfirmPopupOpen(false);
                }}
                handleConfirme={() => {
                    removeChildNode(deletingNodeInfo);
                    setDeletingNodeInfo((prev) => undefined);
                    setIsDeleteNodeConfirmPopupOpen(false);
                }}
            >
                <p>Are you sure you want to delete Node?</p>
            </ConfirmationModal>
            <ConfirmationModal
                modalTitle="Delete Tree"
                show={isDeleteTreeConfirmPopupOpen}
                handleClose={() => {
                    setIsDeleteTreeConfirmPopupOpen(false);
                }}
                handleConfirme={() => {
                    deleteTree();
                    setIsDeleteTreeConfirmPopupOpen(false);
                }}
            >
                <p>Are you sure you want to delete Tree?</p>
            </ConfirmationModal>
            <Modal
                show={showMaxTreeDepthExededMessage}
                onHide={() => {
                    setShowMaxTreeDepthExededMessage(false);
                }}
            >
                <Modal.Header closeButton>
                    <div style={{ textAlign: 'center' }}>
                        Cannot add nodes beyond level {MAX_TREE_DEPTH}
                    </div>
                </Modal.Header>
                {/* <Modal.Body>
                   
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn btn-secondary"
                        onClick={() => {
                            setShowMaxTreeDepthExededMessage(false);
                        }}
                    >
                        Close
                    </Button>
                </Modal.Footer> */}
            </Modal>
        </div>
    );
}

export default TreeViewComponent;
