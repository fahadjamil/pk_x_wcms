const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');
const sharedRepo = require('../shared/shared-repo');
const websiteRepo = require('../websites/websites-repo');

async function getAllCmsUserPermission(dbName) {
    const data = await dbDriver.findAll(
        {},
        '',
        commonDbCollectionList.cmsUserFeature,
        commonDatabase
    );
    return data;
}

async function getAllCmsRole(dbName) {
    // let sorter = { id: 1 };
    const data = await dbDriver.findAll(
        {},
        {},
        commonDbCollectionList.cmsUserRoles,
        commonDatabase
    );
    return data;
}

async function getApprovedCmsRole(dbName) {
    filter = {
        status: 'Approved',
    };
    const data = await dbDriver.findAll(
        filter,
        {},
        commonDbCollectionList.cmsUserRoles,
        commonDatabase
    );
    return data;
}

async function getAllCmsFeatureOperations(dbName) {
    const data = await dbDriver.findAll(
        {},
        '',
        commonDbCollectionList.cmsContentOperation,
        commonDatabase
    );
    return data;
}

async function saveAllFeature(dbName, feature) {
    let filter = {};

    filter = {
        _id: ObjectID(feature._id),
    };
    delete feature._id;
    const update = { $set: { types: feature.types } };
    const data = await dbDriver.findOneAndUpdate(
        filter,
        update,
        commonDbCollectionList.cmsUserFeature,
        commonDatabase
    );
    return data;
}

async function updateCMSRole(dbName, role) {
    let filter = {};

    filter = {
        _id: ObjectID(role._id),
    };
    delete role._id;
    const data = await dbDriver.findOneAndReplace(
        filter,
        role,
        commonDbCollectionList.cmsUserRoles,
        commonDatabase
    );
    return data;
}

async function addCMSRole(dbName, role) {
    // let roleSequence = await sharedRepo.getNextSequenceValue('cmsRole', dbName);
    // role.id = roleSequence.sequence_value;
    const data = await dbDriver.insertOne(
        role,
        commonDbCollectionList.cmsUserRoles,
        commonDatabase
    );
    return data;
}

// async function addWorkflowToOperations(dbName, workFlowName, workFlowDescription) {
//     const data = await dbDriver.findAll({}, '', commonDbCollectionList.cmsContentOperation, commonDatabase);
//     const nextId = sharedRepo.getNextSequenceValue('customcollectionworkflow', dbName);

//     let operation = {
//         id: nextId,
//         name: workFlowName,
//         description: workFlowDescription,
//     };

//     let query = { $push: { 'operationsTypes.$[index].operations': operation } };
//     let option = {
//         arrayFilters: [{ 'index.id': { $eq: cmsPermissionIds.customCollectionId } }],
//     };
//     await dbDriver.update({}, query, commonDbCollectionList.cmsContentOperation, commonDatabase, option);
//     await addOperationsToCustomCollectionFeature(dbName, nextId);
// }

// async function addOperationsToCustomCollectionFeature(dbName, operationId) {
//     let operation = {
//         id: operationId,
//         roleId: [],
//     };

//     //operations type[3] custom collection master data
//     let query = { $push: { 'types.$[index].features.$[].operation': operation } };
//     let option = {
//         arrayFilters: [{ 'index.id': { $eq: cmsPermissionIds.customCollectionId } }],
//     };
//     await dbDriver.update({}, query, commonDbCollectionList.cmsUserFeature, commonDatabase, option);
// }

async function getCMSPermissionsForServer() {
    let map = new Map();
    // let websites = await websiteRepo.getAllWebSites();
    // for (let i = 0; i < websites.length; i++) {
    // let dbName = websites[i].databaseName;
    const dataALL = await dbDriver.find(
        {},
        '',
        commonDbCollectionList.cmsUserFeature,
        commonDatabase
    );
    const data = dataALL[0].types;
    let workWithRole = [];

    console.log(data);

    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            this.generatePathWithRoleForCMSServer(data, i, workWithRole);
        }
    } else {
        console.log('Empty data from database');
    }

    console.log(JSON.stringify(workWithRole));
    map.set('cms-permissions', workWithRole);
    // }
    const results = [...map].map(([name, value]) => ({ name, value }));
    console.log('Final results of getCMSPermissionsForServer :' + JSON.stringify(results));
    return results;
}

async function removeCMSRole(dbName, role) {
    let filter = {};

    console.log(JSON.stringify(role));

    filter = {
        _id: ObjectID(role._id),
    };

    // const data = await dbDriver.deleteOne(filter, commonDbCollectionList.cmsUserRoles, commonDatabase);
    let featureQuery = {
        $pull: { 'types.$[type].features.$[feature].operation.$[ope].roles': role._id },
    };

    let featureOption = {
        arrayFilters: [
            { 'type.features': { $exists: true } },
            { 'feature.operation': { $exists: true } },
            { 'ope.roles': { $exists: true } },
        ],
        multi: true,
    };
    await dbDriver.updateMany(
        {},
        featureQuery,
        commonDbCollectionList.cmsUserFeature,
        commonDatabase,
        featureOption
    );

    return data;
}

async function removeCMSRole(dbName, role) {
    let filter = {};

    console.log(JSON.stringify(role));

    filter = {
        _id: ObjectID(role._id),
    };

    const data = await dbDriver.deleteOne(
        filter,
        commonDbCollectionList.cmsUserRoles,
        commonDatabase
    );
    let featureQuery = {
        $pull: { 'types.$[type].features.$[feature].operation.$[ope].roles': role._id },
    };

    let featureOption = {
        arrayFilters: [
            { 'type.features': { $exists: true } },
            { 'feature.operation': { $exists: true } },
            { 'ope.roles': { $exists: true } },
        ],
        multi: true,
    };
    await dbDriver.updateMany(
        {},
        featureQuery,
        commonDbCollectionList.cmsUserFeature,
        commonDatabase,
        featureOption
    );

    let query = { $pull: { roles: role._id } };

    await dbDriver.update({}, query, commonDbCollectionList.cmsUsers, commonDatabase);

    return data;
}

function generatePathWithRoleForCMSServer(data, i, workWithRole) {
    try {
        let featureArray = data[i].features;
        console.log(JSON.stringify(featureArray));

        for (let j = 0; j < featureArray.length; j++) {
            let featureName = featureArray[j].name;
            let operationArray = featureArray[j].operation;

            for (let k = 0; k < operationArray.length; k++) {
                let operation = operationArray[k];

                if (operation.hasOwnProperty('type')) {
                    if (operation.type === 'workflow') {
                        workWithRole.push(
                            featureName + '/' + operation.workflowId + ':' + operation.roles
                        );
                    }
                } else {
                    if (operation.hasOwnProperty('url')) {
                        workWithRole.push(operation.url + ':' + operation.roles);
                    } else {
                        console.log('URL not found');
                    }
                }
            }
        }
    } catch (error) {
        console.log('Error : ' + error);
    }
}

async function getCMSPermissionsForClient(roleId, username) {
    try {
        let websites = await websiteRepo.getAllWebSites();
        let map = new Map();
        //TODO after login success need to get from session

        let filter = {};

        filter = {
            userName: username,
        };
        let sorter = {};
        const data = await dbDriver.find(filter, sorter, 'cms-users', 'cms-admin');
        console.log('data from db' + JSON.stringify(data[0]));
        let user = data[0];
        map.set('websites', user.websites);
        console.log(user);
        // for (let i = 0; i < websites.length; i++) {
        // let dbName = websites[i].databaseName;

        const dataALL = await dbDriver.find(
            {},
            '',
            commonDbCollectionList.cmsUserFeature,
            commonDatabase
        );

        if (dataALL[0].hasOwnProperty('types')) {
            const data = dataALL[0].types;
            let workWithRole = [];
            console.log(user);
            if (user.roles) {
                for (let j = 0; j < user.roles.length; j++) {
                    let role = user.roles[j];
                    if (data && data.length > 0) {
                        for (let k = 0; k < data.length; k++) {
                            generatePermissionsForCMS(data, k, workWithRole, role);
                        }
                    } else {
                        console.log('Empty data from database');
                    }
                }
                var uniquePermissions = Array.from(new Set(workWithRole));
                map.set('permissions', uniquePermissions);
            }
        } else {
            console.log('Type undefine');
        }
        // }

        const results = [...map].map(([name, value]) => ({ name, value }));
        return JSON.stringify(results);
    } catch (error) {
        console.log(error);
    }
}

// async function getCMSPermissionsForClient(roleId, username) {
//     try {
//         let websites = await websiteRepo.getAllWebSites();
//         let map = new Map();
//         //TODO after login success need to get from session

//         let filter = {};

//         filter = {
//             userName: username,
//         };
//         let sorter = {};
//         const data = await dbDriver.find(filter, sorter, 'cms-users', 'cms-admin');
//         console.log('data from db' + JSON.stringify(data[0]));
//         let user = data[0];

//         console.log(user);
//         for (let i = 0; i < websites.length; i++) {
//             let dbName = websites[i].databaseName;

//             const dataALL = await dbDriver.find(
//                 {},
//                 '',
//                 commonDbCollectionList.cmsUserFeature,
//                 commonDatabase
//             );

//             if(dataALL[0].hasOwnProperty('types')){
//                 const data = dataALL[0].types;
//                 let workWithRole = [];
//                 console.log(user);
//                 if (user.roles[dbName]) {
//                     for (let j = 0; j < user.roles[dbName].length; j++) {
//                         let role = user.roles[dbName][j];
//                         if (data && data.length > 0) {
//                             for (let k = 0; k < data.length; k++) {
//                                 generatePermissionsForCMS(data, k, workWithRole, role);
//                             }
//                         } else {
//                             console.log('Empty data from database');
//                         }
//                     }
//                     var uniquePermissions = Array.from(new Set(workWithRole));
//                     map.set(websites[i].databaseName, uniquePermissions);
//                 }
//             }else{
//                 console.log("Tyoes undefine");
//             }
//         }

//         const results = [...map].map(([name, value]) => ({ name, value }));
//         return JSON.stringify(results);
//     } catch (error) {
//         console.log(error);
//     }
// }

async function generatePermissionsForCMS(data, i, workWithRole, roleId) {
    try {
        let featureArray = data[i].features;
        console.log(JSON.stringify(featureArray));

        for (let j = 0; j < featureArray.length; j++) {
            let featureName = featureArray[j].name;
            let operationArray = featureArray[j].operation;

            for (let k = 0; k < operationArray.length; k++) {
                let operation = operationArray[k];
                console.log('operation.roles :' + operation.roles + ', roleId ' + roleId);
                if (operation.roles.includes(roleId)) {
                    if (operation.hasOwnProperty('type')) {
                        if (operation.type === 'workflow') {
                            workWithRole.push(featureName + '/' + operation.workflowId);
                        } else if (operation.type === 'side') {
                            workWithRole.push(operation.name);
                        }
                    } else {
                        if (operation.hasOwnProperty('url')) {
                            workWithRole.push(operation.url);
                        } else {
                            console.log('URL not found');
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log('Error : ' + error);
    }
}

async function saveRoleAllowedDocuments(dbName, roleId, allowedList, allowedTreeList) {
    const userFeatures = await dbDriver.findAll(
        {},
        '',
        commonDbCollectionList.cmsUserFeature,
        commonDatabase
    );
    if (userFeatures && userFeatures.length > 0) {
        const { _id, ...userFeaturesContent } = userFeatures[0];

        let restrictedRoles = userFeaturesContent.restrictedRoles;

        if (restrictedRoles === undefined) {
            restrictedRoles = [];
        }
        const restrictedRole = restrictedRoles.find((resRole) => resRole.roleId === roleId);

        if (
            (allowedList && allowedList.length > 0) ||
            (allowedTreeList && allowedTreeList.length > 0)
        ) {
            if (restrictedRole) {
                const elementIndex = restrictedRoles.indexOf(restrictedRole);

                if (elementIndex > -1) {
                    restrictedRoles[elementIndex].enabled = true;
                }
            } else {
                restrictedRoles.push({ enabled: true, roleId: roleId });
            }
        } else {
            if (restrictedRole) {
                const elementIndex = restrictedRoles.indexOf(restrictedRole);

                if (elementIndex > -1) {
                    restrictedRoles[elementIndex].enabled = false;
                }
            }
        }

        const filter = { _id: ObjectID(_id) };
        const update = { $set: { restrictedRoles: restrictedRoles } };
        await dbDriver.findOneAndUpdate(
            filter,
            update,
            commonDbCollectionList.cmsUserFeature,
            commonDatabase
        );

        const customTypes = await dbDriver.findAll({}, '', collectionsList.customTypes, dbName);
        const customTrees = await dbDriver.findAll({}, '', collectionsList.customTrees, dbName);

        for (const document of customTypes) {
            let cmsRoles = document.cmsRoles;
            if (cmsRoles === undefined) {
                cmsRoles = [];
            }
            let isDocIncludedInAllowedList = false;

            if (allowedList) {
                const allowedDoc = allowedList.find((docId) => docId === document._id.toString());

                if (allowedDoc) {
                    isDocIncludedInAllowedList = true;
                }
            }

            if (isDocIncludedInAllowedList) {
                if (!cmsRoles.includes(roleId)) {
                    cmsRoles.push(roleId);
                }
            } else {
                const roleIndex = cmsRoles.indexOf(roleId);

                if (roleIndex > -1) {
                    cmsRoles.splice(roleIndex, 1);
                }
            }

            const customTypeFilter = { _id: ObjectID(document._id) };
            const customTypeUpdate = { $set: { cmsRoles: cmsRoles } };
            await dbDriver.findOneAndUpdate(
                customTypeFilter,
                customTypeUpdate,
                collectionsList.customTypes,
                dbName
            );
        }

        for (const document of customTrees) {
            let cmsRoles = document.cmsRoles;
            if (cmsRoles === undefined) {
                cmsRoles = [];
            }
            let isDocIncludedInAllowedList = false;

            if (allowedTreeList) {
                const allowedDoc = allowedTreeList.find(
                    (docId) => docId === document._id.toString()
                );

                if (allowedDoc) {
                    isDocIncludedInAllowedList = true;
                }
            }

            if (isDocIncludedInAllowedList) {
                if (!cmsRoles.includes(roleId)) {
                    cmsRoles.push(roleId);
                }
            } else {
                const roleIndex = cmsRoles.indexOf(roleId);

                if (roleIndex > -1) {
                    cmsRoles.splice(roleIndex, 1);
                }
            }

            const customTypeTreeFilter = { _id: ObjectID(document._id) };
            const customTypeTreeUpdate = { $set: { cmsRoles: cmsRoles } };
            await dbDriver.findOneAndUpdate(
                customTypeTreeFilter,
                customTypeTreeUpdate,
                collectionsList.customTrees,
                dbName
            );
        }
    }

    return {};
}

async function getRoleAllowedDocuments(dbName, roleId) {
    const filterPosts = { cmsRoles: roleId, collectionType: 'Posts' };
    const dataPosts = await dbDriver.findAll(filterPosts, '', collectionsList.customTypes, dbName);

    const filterDocs = { cmsRoles: roleId, collectionType: 'Documents' };
    const dataDocs = await dbDriver.findAll(filterDocs, '', collectionsList.customTypes, dbName);

    const filterTrees = { cmsRoles: roleId };
    const dataTrees = await dbDriver.findAll(filterTrees, '', collectionsList.customTrees, dbName);

    const filterForms = { cmsRoles: roleId, collectionType: 'Forms' };
    const dataForms = await dbDriver.findAll(filterForms, '', collectionsList.customTypes, dbName);

    return { documents: dataDocs, posts: dataPosts, forms: dataForms, trees: dataTrees };
}

module.exports = {
    getAllCmsUserPermission: getAllCmsUserPermission,
    getAllCmsRole: getAllCmsRole,
    getApprovedCmsRole: getApprovedCmsRole,
    getAllCmsFeatureOperations: getAllCmsFeatureOperations,
    saveAllFeature: saveAllFeature,
    updateCMSRole: updateCMSRole,
    addCMSRole: addCMSRole,
    removeCMSRole: removeCMSRole,
    // addWorkflowToOperations: addWorkflowToOperations,
    // addOperationsToCustomCollectionFeature: addOperationsToCustomCollectionFeature,
    getCMSPermissionsForServer: getCMSPermissionsForServer,
    generatePathWithRoleForCMSServer: generatePathWithRoleForCMSServer,
    getCMSPermissionsForClient: getCMSPermissionsForClient,
    saveRoleAllowedDocuments: saveRoleAllowedDocuments,
    getRoleAllowedDocuments: getRoleAllowedDocuments,
};
