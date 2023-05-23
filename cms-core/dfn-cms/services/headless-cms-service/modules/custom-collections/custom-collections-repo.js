const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');
const sharedRepo = require('../shared/shared-repo');
const siteSearchRepo = require('../site-search/site-search-repo');
const activityLogsRepo = require('../activity-logs/activity-logs-repo');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

async function createCustomCollection(dbName, query, collectionName) {
    console.log('query ======: ' + JSON.stringify(query));
    let { workflowState, ...document } = query;
    let prefxColName = '';

    if (workflowState) {
        const workflowDocumentId = new ObjectID();
        workflowState._id = workflowDocumentId;
        document.workflowStateId = workflowDocumentId.toString();

        await sharedRepo.insertInitialWorkflow(workflowState, dbName);
        /*  const response = await dbDriver.insertOne(
            workflowState,
            collectionsList.workflows,
            dbName
        ); */
    }
    //insert to collection-types
    const data = await dbDriver.insertOne(document, collectionName, dbName);

    if (data.result.ok === 1) {
        let colNameNoSpace = document.menuName.replace(/\s/g, '-');
        if (document.collectionType === 'Posts') {
            prefxColName = 'posts-' + colNameNoSpace.toLowerCase();
        } else if (document.collectionType === 'Documents') {
            prefxColName = 'docs-' + colNameNoSpace.toLowerCase();
        }
        //Create original collection
        await dbDriver.createCollection({}, prefxColName, dbName);
        //Create draft
        await dbDriver.createCollection({}, prefxColName + '-drafts', dbName);
        //Create history
        await dbDriver.createCollection({}, prefxColName + '-history', dbName);
    }

    // if (query.menuName != null) {
    //     try {
    //         // await addCustomCollectionToFeature(dbName, query.menuName, '');
    //         await addCustomCollectionToFeature(dbName, query.menuName, prefxColName, '');
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    return data;
}

async function insertNewCollection(dbName, query, collectionName) {
    let { workflowState, ...document } = query;

    if (workflowState) {
        const workflowDocumentId = new ObjectID();
        workflowState._id = workflowDocumentId;
        document.workflowStateId = workflowDocumentId.toString();

        await sharedRepo.insertInitialWorkflow(workflowState, dbName);
        /*  const response = await dbDriver.insertOne(
            workflowState,
            collectionsList.workflows,
            dbName
        ); */
    }

    const data = await dbDriver.insertOne(document, collectionName, dbName);

    if (query.menuName != null) {
        try {
            await addCustomCollectionToFeature(dbName, document.menuName, query.menuName, '');
        } catch (error) {
            console.log(error);
        }
    }

    return data;
}

async function insertDynamicFormData(dbName, query, collectionName) {
    let { workflowState, ...document } = query;

    if (workflowState) {
        const workflowDocumentId = new ObjectID();
        workflowState._id = workflowDocumentId;
        document.workflowStateId = workflowDocumentId.toString();

        await sharedRepo.insertInitialWorkflow(workflowState, dbName);
        /*  const response = await dbDriver.insertOne(
            workflowState,
            collectionsList.workflows,
            dbName
        ); */
    }

    if (document) {
        const { fieldData } = document;

        // Sanitize use inputs
        if (fieldData) {
            for (const LangKey in fieldData) {
                if (Object.hasOwnProperty.call(fieldData, LangKey)) {
                    const langObj = fieldData[LangKey];

                    for (const key in langObj) {
                        if (Object.hasOwnProperty.call(langObj, key)) {
                            const element = langObj[key];
                            const clean = DOMPurify.sanitize(element);

                            langObj[key] = clean;
                        }
                    }
                }
            }

            const data = await dbDriver.insertOne(document, collectionName, dbName);

            if (query.menuName != null) {
                try {
                    await addCustomCollectionToFeature(
                        dbName,
                        document.menuName,
                        query.menuName,
                        ''
                    );
                } catch (error) {
                    console.log(error);
                }
            }

            return data;
        }

        return null;
    }

    return null;
}

// async function addCustomCollectionToFeature(
//     dbName,
//     customCollectionName,
//     customCollectionDBName,
//     customCollectionDescription
// ) {
//     console.log('addCustomCollectionToFeature', dbName, ' ', customCollectionName);
//     const data = await dbDriver.findAll(
//         {},
//         '',
//         collectionsList.cmsContentOperation,
//         dbName
//     );
//     let operations = {
//         name: customCollectionName,
//         collectionName: customCollectionDBName,
//         description: customCollectionDescription,
//         operation: [],
//     };

//     //operations type[3] custom collection master data
//     const operationsData = data[0].operationsType.find(
//         (x) => x.id === cmsPermissionIds.customCollectionId
//     ).operations;

//     for (let i = 0; i < operationsData.length; i++) {
//         let operationData = operationsData[i];
//         let opr = { id: operationData.id, roles: [] };
//         if (
//             operationData.hasOwnProperty('type') &&
//             operationData.hasOwnProperty('workflowId')
//         ) {
//             opr['type'] = operationData.type;
//             opr['workflowId'] = operationData.workflowId;
//         }else{
//             if (
//                 operationData.hasOwnProperty('name') &&
//                 operationData.name === "add"
//             ){
//                 opr['url'] = '/api/custom-collections/new/create/'+customCollectionDBName;
//             }else{
//                 opr['url'] = '/api/custom-collections/new/update/'+customCollectionDBName;
//             }
//         }
//         operations['operation'].push(opr);
//     }

//     let query = { $push: { 'types.$[index].features': operations } };

//     let option = {
//         arrayFilters: [{ 'index.id': { $eq: cmsPermissionIds.customCollectionId } }],
//     };

//     await dbDriver.update({}, query, collectionsList.cmsUserFeature, dbName, option);
// }

async function updateCollectionType(dbName, collectionName, pageId, updatedData) {
    let filter = {};

    filter = {
        _id: ObjectID(pageId),
    };
    const data = await dbDriver.findOneAndReplace(filter, updatedData, collectionName, dbName);
    return data;
}

async function getcustomCollectionTypes(dbName, query1, collectionName, user, sorter) {
    if (user && user !== '' && collectionName === collectionsList.customTypes) {
        const filter = {
            userName: user,
        };
        const userData = await dbDriver.FindOne(
            filter,
            commonDbCollectionList.cmsUsers,
            commonDatabase
        );

        if (userData && userData.roles && userData.roles.length > 0) {
            const userFeatures = await dbDriver.findAll(
                {},
                '',
                commonDbCollectionList.cmsUserFeature,
                commonDatabase
            );

            let restrictedRoles = [];
            if (
                userFeatures &&
                userFeatures.length > 0 &&
                userFeatures[0].restrictedRoles &&
                userFeatures[0].restrictedRoles.length > 0
            ) {
                for (const userRoleId of userData.roles) {
                    const restricedRole = userFeatures[0].restrictedRoles.find(
                        (role) => role.roleId === userRoleId
                    );

                    if (restricedRole && restricedRole.enabled) {
                        restrictedRoles.push(restricedRole.roleId);
                    }
                }
            }

            if (restrictedRoles.length > 0) {
                const query = { collectionType: query1, cmsRoles: { $all: restrictedRoles } };
                const data = await dbDriver.findAll(query, '', collectionName, dbName);
                return data;
            }
        }

        const query = { collectionType: query1 };
        const data = await dbDriver.findAll(query, '', collectionName, dbName);
        return data;
    } else {
        const query = { collectionType: query1 };
        const data = await dbDriver.findAll(query, sorter, collectionName, dbName);
        return data;
    }
}

async function updateCollectionDoc(dbName, collectionName, pageId, updatedData) {
    let filter = {};

    filter = {
        _id: ObjectID(pageId),
    };
    const data = await dbDriver.findOneAndReplace(filter, updatedData, collectionName, dbName);
    return data;
}

async function uploadDocument(dbName, fileName) {
    const data = await dbDriver.saveDocument(dbName, fileName);
    return data;
}

async function getDocument(dbName, fileName) {
    const data = await dbDriver.getDocumentForDisplay(dbName, fileName);
    return data;
}

async function getDocumentById(dbName, collectionName, pageId) {
    let filter = {};

    filter = {
        _id: ObjectID(pageId),
    };
    const data = await dbDriver.FindOne(filter, collectionName, dbName);
    return data;
}

/// common method to get collection documents , pass parameters : collection name and db name
async function getCollectionAll(dbName, collectionName) {
    const data = await dbDriver.findAll({}, '', collectionName, dbName);
    return data;
}

// for the image serch
async function getImagesByTitle(dbName, query1, collectionName) {
    const query = query1 === '' ? {} : { title: new RegExp(query1) };
    const data = await dbDriver.findAll(query, '', collectionName, dbName);
    return data;
}

// for the image serch
async function getImagesByDesc(dbName, query1, collectionName) {
    const query = query1 === '' ? {} : { description: new RegExp(query1) };
    const data = await dbDriver.findAll(query, '', collectionName, dbName);
    return data;
}

//for the icons search
async function getIconsByFileName(dbName, query1, collectionName) {
    const query = query1 === '' ? {} : { fileName: new RegExp(query1) };
    const data = await dbDriver.findAll(query, '', collectionName, dbName);
    return data;
}

// for the video serch
async function getVideosByTitle(dbName, query1, collectionName) {
    const query = query1 === '' ? {} : { title: new RegExp(query1) };
    const data = await dbDriver.findAll(query, '', collectionName, dbName);
    return data;
}

async function getAllCustomCollection(dbName) {
    let sorter = { collectionType: 1 };
    const data = await dbDriver.findAll({}, sorter, collectionsList.customTypes, dbName);
    return data;
}

async function saveAllCustomCollection(dbName, customCollections) {
    let filter = {};
    let update = {};
    for (let i = 0; i < customCollections.length; i++) {
        let customCollection = customCollections[i];
        filter._id = ObjectID(customCollection._id);
        update = {
            $set: { roles: customCollection.roles },
        };

        const data = await dbDriver.findOneAndUpdate(
            filter,
            update,
            collectionsList.customTypes,
            dbName
        );
    }
    return 'success';
}

async function createCustomTree(dbName, title) {
    const customTree = { title: title, tree: [] };
    const data = await dbDriver.insertOne(customTree, collectionsList.customTrees, dbName);
    return data;
}

async function getAllCustomTrees(dbName, user) {
    if (user && user !== '') {
        const filter = {
            userName: user,
        };
        const userData = await dbDriver.FindOne(
            filter,
            commonDbCollectionList.cmsUsers,
            commonDatabase
        );

        if (userData && userData.roles && userData.roles.length > 0) {
            const userFeatures = await dbDriver.findAll(
                {},
                '',
                commonDbCollectionList.cmsUserFeature,
                commonDatabase
            );

            let restrictedRoles = [];
            if (
                userFeatures &&
                userFeatures.length > 0 &&
                userFeatures[0].restrictedRoles &&
                userFeatures[0].restrictedRoles.length > 0
            ) {
                for (const userRoleId of userData.roles) {
                    const restricedRole = userFeatures[0].restrictedRoles.find(
                        (role) => role.roleId === userRoleId
                    );

                    if (restricedRole && restricedRole.enabled) {
                        restrictedRoles.push(restricedRole.roleId);
                    }
                }
            }

            if (restrictedRoles.length > 0) {
                const query = { cmsRoles: { $all: restrictedRoles } };
                const data = await dbDriver.findAll(query, '', collectionsList.customTrees, dbName);
                const treeInfo = data.map((element) => {
                    return { id: element._id.toString(), title: element.title };
                });
                return treeInfo;
            }
        }

        const query = {};
        const data = await dbDriver.findAll(query, '', collectionsList.customTrees, dbName);
        const treeInfo = data.map((element) => {
            return { id: element._id.toString(), title: element.title };
        });
        return treeInfo;
    } else {
        const data = await dbDriver.findAll({}, '', collectionsList.customTrees, dbName);
        const treeInfo = data.map((element) => {
            return { id: element._id.toString(), title: element.title };
        });
        return treeInfo;
    }
}

async function getCustomTreeById(dbName, id) {
    const filter = { _id: ObjectID(id) };
    const data = await dbDriver.FindOne(filter, collectionsList.customTrees, dbName);
    return data;
}

async function updateCustomTree(dbName, id, tree) {
    const filter = { _id: ObjectID(id) };
    const update = { $set: { tree: tree } };
    const data = await dbDriver.findOneAndUpdate(
        filter,
        update,
        collectionsList.customTrees,
        dbName
    );
    return data;
}

async function getcustomCollectionDocsByCollectionAndId(dbName, mappingQuery) {
    const collectionIdMap = mappingQuery.split('&');

    let params = [];
    collectionIdMap.map((hash) => {
        params.push(hash.split(':'));
    });

    let data = [];
    if (params.length > 0) {
        for (const collectionMap of params) {
            const [collection, objectId] = collectionMap;

            if (objectId && collection && objectId !== '' && collection !== '') {
                const filter = { _id: ObjectID(objectId) };
                const singleDocument = await dbDriver.FindOne(filter, collection, dbName);

                let modifiedDate = undefined;
                if (singleDocument && singleDocument.workflowStateId) {
                    const filterWorkflow = { _id: ObjectID(singleDocument.workflowStateId) };
                    const workflow = await dbDriver.FindOne(
                        filterWorkflow,
                        collectionsList.workflows,
                        dbName
                    );

                    modifiedDate = workflow.modifiedDate;
                }

                const historyFilter = { origDocId: objectId };
                const hsitoryDataCount = await dbDriver.getDocumentsCount(
                    collection + '-history',
                    dbName,
                    historyFilter
                );

                /*  const customTypeFilter = {customeCollectionName: collection};
                const customTypes = await dbDriver.FindOne(customTypeFilter, collectionsList.customTypes, dbName);

                let fieldList = undefined;
                if(customTypes && customTypes.fieldsList){
                    fieldList = customTypes.fieldsList;
                } */

                const pushData = {
                    id: objectId,
                    collection: collection,
                    modifiedDate: modifiedDate,
                    data: singleDocument,
                    historyCount: hsitoryDataCount,
                };

                data.push(pushData);
            }
        }
    }

    return data;
}

async function getDocumentHistory(dbName, id, collection, limit = 0) {
    const hsitoryCollection = collection + '-history';
    const filter = { origDocId: id };
    const sort = { _id: -1 };
    let docuemntLimit = 0;

    try {
        docuemntLimit = Number(limit);
    } catch (error) {
        docuemntLimit = 0;
    }

    const data = await dbDriver.findAll(filter, sort, hsitoryCollection, dbName, docuemntLimit);

    return data;
}

async function getLastUpdatedDocumentMetaInfo(dbName, collection) {
    const hsitoryCollection = collection + '-history';
    const sort = { _id: -1 };
    const data = await dbDriver.findAll({}, sort, hsitoryCollection, dbName, 1);

    if (data && data.length === 1) {
        const lastUpdatedDocument = data[0];
        const { workflowState } = lastUpdatedDocument;
        const { createdBy, modifiedBy, ...workflowDetails } = workflowState;

        return workflowDetails;
    } else {
        return undefined;
    }
}

async function getTreeCustomCollections(dbName, treeId, nodeId, nodePath) {
    const treeData = await getCustomTreeById(dbName, treeId);

    let treeDataResult = { traverse: [], data: [] };
    let data = [];
    let nodeTraverse = [];

    if (treeData && treeData.tree && treeData.tree.length > 0) {
        const tree = treeData.tree;

        for (let index = 0; index < tree.length; index++) {
            const element = tree[index];
            const searchNode = searchTreeNode(nodeId, element, nodeTraverse);

            if (searchNode && searchNode.children && searchNode.children.length > 0) {
                for (const child of searchNode.children) {
                    const { customCollection, documentID } = child;
                    const objectId = documentID;
                    const collection = customCollection;

                    if (objectId && collection && objectId !== '' && collection !== '') {
                        const filter = { _id: ObjectID(objectId) };
                        const singleDocument = await dbDriver.FindOne(filter, collection, dbName);

                        let modifiedDate = undefined;
                        if (singleDocument && singleDocument.workflowStateId) {
                            const filterWorkflow = {
                                _id: ObjectID(singleDocument.workflowStateId),
                            };
                            const workflow = await dbDriver.FindOne(
                                filterWorkflow,
                                collectionsList.workflows,
                                dbName
                            );

                            modifiedDate = workflow.modifiedDate;
                        }

                        const historyFilter = { origDocId: objectId };
                        const hsitoryDataCount = await dbDriver.getDocumentsCount(
                            collection + '-history',
                            dbName,
                            historyFilter
                        );

                        const pushData = {
                            id: objectId,
                            collection: collection,
                            modifiedDate: modifiedDate,
                            data: singleDocument,
                            historyCount: hsitoryDataCount,
                        };

                        data.push(pushData);
                    }
                }
                nodeTraverse.push(getTreeNodeFilterdDetails(element));
                treeDataResult.data = data;
                treeDataResult.traverse = nodeTraverse.reverse();
                return treeDataResult;
            }
        }
    }

    return treeDataResult;
}

function searchTreeNode(searchNodeId, node, nodePathList) {
    if (node) {
        if (node.nodeID === searchNodeId) {
            return node;
        } else if (node.children) {
            for (let index = 0; index < node.children.length; index++) {
                const element = node.children[index];
                const childNode = searchTreeNode(searchNodeId, element, nodePathList);

                if (childNode) {
                    nodePathList.push(getTreeNodeFilterdDetails(element));
                    return childNode;
                }
            }
            return undefined;
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

function getTreeNodeFilterdDetails(node) {
    let filterdNode = { nodeID: '', localizeTitle: {} };
    if (node) {
        filterdNode.nodeID = node.nodeID;
        filterdNode.localizeTitle = node.localizeTitle;
    }
    return filterdNode;
}

async function searchTreeCustomCollections(dbName, treeId, parentNodeIds, keyWord, sorting) {
    const maxTreeDepth = 5 + 1;
    const treeData = await getCustomTreeById(dbName, treeId);
    let selectedParentIds = [];
    if (parentNodeIds.length > 0) {
        selectedParentIds = parentNodeIds.split('#');
    }
    let data = [];

    if (treeData && treeData.tree && treeData.tree.length > 0) {
        let tree = [];

        if (selectedParentIds && selectedParentIds.length > 0) {
            for (let index = 0; index < treeData.tree.length; index++) {
                const node = treeData.tree[index];
                if (selectedParentIds.includes(node.nodeID)) {
                    tree.push(node);
                }
            }
        } else {
            tree = treeData.tree;
        }

        for (let index = 0; index < tree.length; index++) {
            const element = tree[index];
            const collectionData = getCollectionListOfLastNodes(
                element,
                index + 1,
                0,
                maxTreeDepth
            );

            let collectionSearch = {};
            for (const element of collectionData) {
                const collectionName = element.customCollection;
                const documentID = ObjectID(element.documentID);

                if (collectionSearch[collectionName]) {
                    if (!collectionSearch[collectionName].includes(documentID)) {
                        collectionSearch[collectionName].push(documentID);
                    }
                } else {
                    collectionSearch[collectionName] = [documentID];
                }
            }

            for (const collection of Object.keys(collectionSearch)) {
                const searchCollectionData = await searchCollections(
                    dbName,
                    keyWord,
                    collection,
                    collectionSearch[collection]
                );

                const modifiedSearchCollectionData = searchCollectionData.map((document) => {
                    let nodeIndex = 0;
                    //used for the search optimization
                    if (sorting === 'articleNumber') {
                        const nodeDetails = collectionData.find(
                            (element) => element.documentID === document._id.toString()
                        );
                        nodeIndex = nodeDetails.nodeIndex;
                    }

                    return {
                        ...document,
                        nodeIndex: nodeIndex,
                        parentNode: {
                            localizeTitle: element.localizeTitle,
                            nodeID: element.nodeID,
                        },
                    };
                });

                data = [...data, ...modifiedSearchCollectionData];
            }
        }
    }

    if (data.length > 0) {
        switch (sorting) {
            case 'relevance':
                const relevanceSortingDataMap = data.map((element, index) => {
                    return { index: index, value: element.score };
                });

                //from most to lease relevent
                relevanceSortingDataMap.sort((a, b) => (a.value - b.value) * -1);

                const relevanceResult = relevanceSortingDataMap.map((element) => {
                    return data[element.index];
                });
                return relevanceResult;
            case 'chapter':
                return data;
            case 'articleNumber':
                const articleSortingDataMap = data.map((element, index) => {
                    return { index: index, value: element.nodeIndex };
                });

                //from least number to most
                articleSortingDataMap.sort((a, b) => a.value - b.value);

                const articleresult = articleSortingDataMap.map((element) => {
                    return data[element.index];
                });

                return articleresult;
            case 'revisionDate':
                let workflowIdList = [];
                let workflowObjectMap = {};

                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    workflowObjectMap[element.workflowStateId] = element;
                    workflowIdList.push(ObjectID(element.workflowStateId));
                }

                //modified date
                const filterWorkflow = { _id: { $in: workflowIdList } };
                const workflowSort = { modifiedDate: 1 };
                const workflows = await dbDriver.findAll(
                    filterWorkflow,
                    workflowSort,
                    collectionsList.workflows,
                    dbName
                );

                const sortResult = workflows.map((element) => {
                    return workflowObjectMap[element._id.toString()];
                });

                return sortResult;
            default:
                return data;
        }
    }

    return data;
}

function getCollectionListOfLastNodes(node, nodeIndex, level, maxDepth, collectionList = []) {
    let collections = collectionList;
    if (!collections) {
        collections = [];
    }
    if (node) {
        if (node.children && node.children.length > 0) {
            let childCollectionData = [];
            for (let index = 0; index < node.children.length; index++) {
                const childNode = node.children[index];
                const collectionData = getCollectionListOfLastNodes(
                    childNode,
                    nodeIndex * 10 + index + 1,
                    level + 1,
                    maxDepth,
                    collections
                );
                childCollectionData = [...childCollectionData, ...collectionData];
            }

            collections = [...collections, ...childCollectionData];
        } else {
            const { customCollection, documentID } = node;
            if (customCollection && documentID && customCollection !== '' && documentID !== '') {
                collections = [
                    ...collections,
                    {
                        customCollection: customCollection,
                        documentID: documentID,
                        nodeID: node.nodeID,
                        nodeIndex: nodeIndex * Math.pow(10, maxDepth - level),
                    },
                ];
            }
        }
    }
    return collections;
}

async function searchCollections(dbName, keyword, collectionName, documnetIds) {
    await dbDriver.createWildCardIndex({}, collectionName, dbName);

    const filter = { _id: { $in: documnetIds }, $text: { $search: `'${keyword}'` } };
    const data = await dbDriver.findAll(filter, '', collectionName, dbName, 0, {
        score: { $meta: 'textScore' },
    });

    return data;
}

async function customCollectionRecordDelete(
    dbName,
    draftCollectionName,
    collectionName,
    workflow,
    docId,
    deletedBy
) {
    try {
        const customCollectionFilter = {
            _id: ObjectID(docId),
        };

        const results = {};
        let activityLogsResults = undefined;
        let historyCollectionResults = undefined;

        // Find the record before deleting it, in order to save it in the content-archive collection
        const document = await dbDriver.FindOne(
            customCollectionFilter,
            draftCollectionName,
            dbName
        );

        // Delete the record from main collection
        const mainCollectionResults = await dbDriver.deleteOne(
            customCollectionFilter,
            collectionName,
            dbName
        );

        // Delete the record from drafts collection
        const draftCollectionResults = await dbDriver.deleteOne(
            customCollectionFilter,
            draftCollectionName,
            dbName
        );

        if (workflow) {
            const { id, ...docWorkflowState } = workflow;

            const deleteComment = 'Document deleted';

            docWorkflowState.state = 'deleted';
            docWorkflowState.comment = deleteComment;

            if (document) {
                const { _id, ...archiveDocument } = document;

                const updatedArchiveDocument = {
                    ...archiveDocument,
                    origDocId: _id.toString(),
                    workflowState: docWorkflowState,
                    type: 'Document',
                };

                // Add a document to the content-archive collection
                historyCollectionResults = await dbDriver.insertOne(
                    updatedArchiveDocument,
                    collectionsList.contentArchive,
                    dbName
                );
            }

            const additionalData = {
                deleted: {
                    deletedBy: deletedBy ? deletedBy : '',
                    deletedDate: new Date(),
                    comment: 'Document delete',
                },
            };

            // Finally insert record into activity logs collection
            activityLogsResults = await activityLogsRepo.addDocActivityLogEntry(
                dbName,
                collectionName,
                docWorkflowState,
                additionalData
            );
        }

        if (draftCollectionResults && draftCollectionResults.deletedCount === 1) {
            let msg = 'Record';

            // // When the record deleted from main collection
            // if (mainCollectionResults && mainCollectionResults.deletedCount === 1) {

            // }

            // // When the record has associated workflow
            // if (workflowCollectionResults && workflowCollectionResults.deletedCount === 1) {
            //     msg += ", workflow, ";
            // }

            // // When the record has associated activity logs
            // if (activityLogsResults && activityLogsResults.deletedCount >= 1) {
            //     msg += "activity logs,";
            // }

            msg += ' deleted successfully.';

            // // If the history collection insert success
            // if (historyCollectionResults && historyCollectionResults.insertedId) {
            //     msg += "Collection history successfully.";
            // }

            results.status = 'success';
            results.msg = msg;
        } else {
            results.status = 'failed';
            results.msg = 'Record delete unsuccessfull. Please try again.';
        }

        return results;
    } catch (error) {
        console.log(error);
        const results = {};

        results.status = 'failed';
        results.msg = 'Something unexpected has occured. Please try again later.';

        return results;
    }
}

async function deleteTreeCustomCollections(dbName, treeId, deletedBy) {
    try {
        //Get existing tree
        const tree = await getCustomTreeById(dbName, treeId);

        if (tree) {
            //Add tree to archive collection

            const { _id, ...treeData } = tree;

            const updatedArchiveDocument = {
                ...treeData,
                origTreeId: _id.toString(),
                type: 'Tree',
                deleted: {
                    deletedBy: deletedBy ? deletedBy : '',
                    deletedDate: new Date(),
                    comment: 'Tree delete',
                },
            };

            // Add tree to the content-archive collection
            const historyCollectionResults = await dbDriver.insertOne(
                updatedArchiveDocument,
                collectionsList.contentArchive,
                dbName
            );

            //Remove tree from main collection
            const filter = { _id: ObjectID(treeId) };
            const deletedTreeInfo = await dbDriver.deleteOne(
                filter,
                collectionsList.customTrees,
                dbName
            );

            //Create dummy workflow object for audit log (Activity log)

            const activityLogRecord = {
                state: 'deleted',
                comment: 'Custom tree deleted',
                createdBy: '',
                modifiedBy: deletedBy ? deletedBy : '',
                createdDate: '',
                modifiedDate: new Date(),
                fileTitle: treeData.title,
                collection: collectionsList.customTrees,
                fileType: 'Tree',
            };

            const additionalData = {
                deleted: {
                    deletedBy: deletedBy ? deletedBy : '',
                    deletedDate: new Date(),
                    comment: 'Custom tree deleted',
                },
            };

            const activityLogsResults = await activityLogsRepo.addCustomTreeActivityLogEntry(
                dbName,
                _id.toString(),
                activityLogRecord,
                additionalData
            );

            const results = {
                status: 'success',
                msg: 'Record deleted successfully.',
            };
            return results;
        }
    } catch (error) {
        console.log(error);

        const results = {
            status: 'failed',
            msg: 'Something unexpected has occured. Please try again later.',
        };
        return results;
    }
}

module.exports = {
    createCustomCollection: createCustomCollection,
    insertNewCollection: insertNewCollection,
    // addCustomCollectionToFeature:addCustomCollectionToFeature,
    updateCollectionType: updateCollectionType,
    getcustomCollectionTypes: getcustomCollectionTypes,
    updateCollectionDoc: updateCollectionDoc,
    uploadDocument: uploadDocument,
    getDocument: getDocument,
    getCollectionAll: getCollectionAll,
    getImagesByTitle: getImagesByTitle,
    getImagesByDesc: getImagesByDesc,
    getIconsByFileName: getIconsByFileName,
    getVideosByTitle: getVideosByTitle,
    getAllCustomCollection: getAllCustomCollection,
    saveAllCustomCollection: saveAllCustomCollection,
    createCustomTree: createCustomTree,
    getAllCustomTrees: getAllCustomTrees,
    getCustomTreeById: getCustomTreeById,
    updateCustomTree: updateCustomTree,
    getcustomCollectionDocsByCollectionAndId: getcustomCollectionDocsByCollectionAndId,
    getDocumentHistory: getDocumentHistory,
    getLastUpdatedDocumentMetaInfo: getLastUpdatedDocumentMetaInfo,
    getTreeCustomCollections: getTreeCustomCollections,
    searchTreeCustomCollections: searchTreeCustomCollections,
    customCollectionRecordDelete: customCollectionRecordDelete,
    getDocumentById: getDocumentById,
    insertDynamicFormData: insertDynamicFormData,
    deleteTreeCustomCollections: deleteTreeCustomCollections,
};
