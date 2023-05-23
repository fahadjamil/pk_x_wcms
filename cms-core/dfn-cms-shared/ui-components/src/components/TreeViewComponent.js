import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { emitCustomEvent } from 'react-custom-events';

function TreeViewComponent(params) {
    const [treeData, settreeData] = useState();
    const { commonConfigs } = params;
    const { data, styles, settings } = params.data;
    const selectedLanguage = params.lang;
    const { tree } = settings;
    const { uniqueId, value } = tree;
    const { isEditMode, isPreview } = commonConfigs;
    let currentLocationHash = undefined;
    const [selectedNodeId, setSelectedNodeId] = useState('');
    const [selectedParentNodeIndex, setSelectedParentNodeIndex] = useState(0);
    const [isExpandAll, setIsExpandAll] = useState();

    useEffect(() => {
        let isUnmounted = false;

        if (!isUnmounted && value && value !== '') {
            getDataFromSource(isUnmounted);
        }

        return () => {
            isUnmounted = true;
        };
    }, []);

    useEffect(() => {
        let isUnmounted = false;

        if (!isUnmounted) {
            updateSelecetdNodeFromHash();
        }

        return () => {
            isUnmounted = true;
        };
    }, [getLocationHashValue()]);

    function getLocationHashValue() {
        if (typeof location !== 'undefined') {
            currentLocationHash = location.hash;
        }

        return currentLocationHash;
    }

    function getDataFromSource(isUnmounted) {
        const jwt = localStorage.getItem('jwt-token');

        let requestUrl = '/api/tree';
        let requestParams = { id: value, nameSpace: params.dbName };

        if (isPreview) {
            requestUrl = '/api/custom-collections/tree';
            requestParams = { id: value, dbName: params.dbName };
        }

        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: requestParams,
        };

        Axios.get(requestUrl, httpHeaders)
            .then((result) => {
                if (!isUnmounted && result && result.data) {
                    settreeData(result.data);
                    setInitialChildHashValue(result.data.tree, result.data._id);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getHashParams(node, nodeIndexArray, treeId) {
        let paramString = '';
        if (treeId && node && node.nodeID && node.nodeID !== '') {
            const nodeId = node.nodeID;

            paramString = `${treeId}/${nodeId}`;

            if (nodeIndexArray && nodeIndexArray.length > 0) {
                const modifiedIndexArray = nodeIndexArray.map((nodeIndex) => {
                    return nodeIndex + 1;
                });

                const nodeIndexPath = modifiedIndexArray.join('-');
                paramString = `${paramString}/${nodeIndexPath}`;
            }
        }

        return paramString;
    }

    function setInitialChildHashValue(tree, treeId) {
        if (typeof location !== 'undefined' && location.hash === '') {
            if (tree && tree.length > 0) {
                const levelOneNode = tree[0];
                if (levelOneNode && levelOneNode.children && levelOneNode.children.length > 0) {
                    const levelTwoNode = levelOneNode.children[0];
                    const hashVlaue = getHashParams(levelTwoNode, [0, 0], treeId);
                    location.hash = hashVlaue;
                }
            }
        }
    }

    function updateSelecetdNodeFromHash() {
        if (currentLocationHash && currentLocationHash !== '') {
            const treeSelectionHash = currentLocationHash.substr(1);
            setSelectedNodeIdFromHash(treeSelectionHash);
        }
    }

    function setSelectedNodeIdFromHash(urlHashValue) {
        if (urlHashValue && urlHashValue !== '') {
            const selecetdParams = urlHashValue.split('/');

            if (selecetdParams) {
                if (selecetdParams.length >= 2) {
                    //const treeId = selecetdParams[0];
                    const nodeId = selecetdParams[1];
                    let nodePath = '';
                    if (selecetdParams.length >= 3) {
                        nodePath = selecetdParams[2];
                    }

                    const treePath = nodePath.split('-');
                    if (treePath && treePath.length > 0) {
                        try {
                            const parentNodeIndex = Number(treePath[0]);
                            setSelectedParentNodeIndex(parentNodeIndex - 1);
                        } catch (error) {
                            console.log(error);
                        }
                    }

                    setSelectedNodeId(nodeId);
                }
            }
        }
    }

    function getExpandCollapseText() {
        if (isExpandAll) {
            if (selectedLanguage.langKey.toLowerCase() === 'ar') {
                return 'طي الكل';
            } else {
                return 'Collapse All';
            }
        } else {
            if (selectedLanguage.langKey.toLowerCase() === 'ar') {
                return 'اظهار الكل';
            } else {
                return 'Expand All';
            }
        }
    }

    function getTreeNodes(node, treeLevels) {
        if (node && node.children && node.children.length > 0) {
            return (
                <ul>
                    {node.children.map((childNode, childIndex) => {
                        const currentTreeLevel = [...treeLevels, childIndex];
                        //const treeLevelKey = currentTreeLevel.join('');
                        const isLastParent = isLastPrentNode(childNode);
                        const displayTreeLevels = currentTreeLevel.map((element) => element + 1);
                        const displayTreeValue = displayTreeLevels.join('-');

                        if (isLastParent) {
                            const treeId = treeData._id ? treeData._id : undefined;
                            const hashVlaue = getHashParams(childNode, currentTreeLevel, treeId);

                            let selectionColor = '#000000';
                            if (selectedNodeId !== '' && selectedNodeId === childNode.nodeID) {
                                selectionColor = '#C6974B';
                            }

                            return (
                                <li key={childNode.nodeID}>
                                    <a
                                        href={`#${hashVlaue}`}
                                        style={{ color: selectionColor }}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            updateUrlHashValue(hashVlaue);
                                        }}
                                    >
                                        {`${displayTreeValue} ${
                                            childNode.localizeTitle[
                                                selectedLanguage.langKey.toLowerCase()
                                            ]
                                        }`}
                                    </a>
                                </li>
                            );
                        } else {
                            return (
                                <li key={childNode.nodeID}>
                                    {`${displayTreeValue} ${
                                        childNode.localizeTitle[
                                            selectedLanguage.langKey.toLowerCase()
                                        ]
                                    }`}
                                    {getTreeNodes(childNode, currentTreeLevel)}
                                </li>
                            );
                        }
                    })}
                </ul>
            );
        } else {
            return <React.Fragment></React.Fragment>;
        }
    }

    function isLastPrentNode(node) {
        if (node) {
            if (node.children && node.children.length > 0) {
                let isLastPrentNode = true;
                for (let index = 0; index < node.children.length; index++) {
                    const element = node.children[index];
                    if (element.children && element.children.length > 0) {
                        isLastPrentNode = false;
                        break;
                    }
                }
                return isLastPrentNode;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    function setExpanedCardFirstElementHashValue(node, treeLevels) {
        if (node && node.children && node.children.length > 0) {
            const childNode = node.children[0];
            const treeId = treeData._id ? treeData._id : undefined;
            const currentTreeLevel = [...treeLevels, 0];
            const hashValue = getHashParams(childNode, currentTreeLevel, treeId);

            /* if(typeof location !== 'undefined'){
                location.hash = hashValue;
                scrollToTop();
            } */
            updateUrlHashValue(hashValue);
        }
    }

    function updateUrlHashValue(hashValue) {
        if (typeof history !== 'undefined' && history.pushState && hashValue && hashValue !== '') {
            history.pushState(null, null, `#${hashValue}`);
            emitCustomEvent('treeItemClicked', hashValue);
            setSelectedNodeIdFromHash(hashValue);
            scrollToTop();
        }
    }

    function scrollToTop() {
        if (typeof location !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    return (
        <React.Fragment>
            <div className="tree-view-toolbar mb-3">
                <button
                    className="toolbar-button expand"
                    onClick={() => {
                        setIsExpandAll((preState) => {
                            if (preState === undefined) {
                                return true;
                            } else {
                                return !preState;
                            }
                        });
                    }}
                >
                    {getExpandCollapseText()}
                </button>
            </div>
            {treeData && treeData.tree && treeData.tree.length > 0 && (
                <div id="treeViewAccordion" className="scrollbar-02">
                    {treeData.tree.map((node, index) => {
                        let collapseClass = 'collapse';
                        if (isExpandAll === undefined) {
                            collapseClass =
                                index === selectedParentNodeIndex ? 'collapse show' : 'collapse';
                        } else if (isExpandAll) {
                            collapseClass = 'collapse show';
                        } else {
                            collapseClass = 'collapse';
                        }
                        return (
                            <div key={node.nodeID} className="card">
                                <div
                                    className="card-header btn"
                                    data-toggle="collapse"
                                    data-target={`#collapseTreeCard${index}`}
                                    aria-expanded="true"
                                    aria-controls={`collapseTreeCard${index}`}
                                    id={`treeViewCard${index}`}
                                    onClick={(e) => {
                                        setExpanedCardFirstElementHashValue(node, [index]);
                                    }}
                                >
                                    {`${index + 1} ${
                                        node.localizeTitle[selectedLanguage.langKey.toLowerCase()]
                                    }`}
                                </div>

                                <div
                                    id={`collapseTreeCard${index}`}
                                    className={collapseClass}
                                    aria-labelledby={`treeViewCard${index}`}
                                    data-parent={`#treeViewCard${index}`}
                                >
                                    <div className="card-body">
                                        {getTreeNodes(node, [index])}
                                        {/*  <ul>
                                            {node.children &&
                                                node.children.length > 0 &&
                                                node.children.map((childNode, childIndex) => {
                                                    const treeId = treeData._id
                                                        ? treeData._id
                                                        : undefined;
                                                    const hashVlaue = getHashParams(
                                                        childNode,
                                                        [index, childIndex],
                                                        treeId
                                                    );

                                                    let selectionColor = '#000000';
                                                    if (
                                                        selectedNodeId !== '' &&
                                                        selectedNodeId === childNode.nodeID
                                                    ) {
                                                        selectionColor = '#C6974B';
                                                    }

                                                    return (
                                                        <li key={`ChildNodesKey${childIndex}`}>
                                                            <a
                                                                href={`#${hashVlaue}`}
                                                                style={{ color: selectionColor }}
                                                            >
                                                                {`${index + 1}-${childIndex + 1} ${
                                                                    childNode.localizeTitle[
                                                                        selectedLanguage.langKey.toLowerCase()
                                                                    ]
                                                                }`}
                                                            </a>
                                                        </li>
                                                    );
                                                })}
                                        </ul> */}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </React.Fragment>
    );
}

export default TreeViewComponent;
