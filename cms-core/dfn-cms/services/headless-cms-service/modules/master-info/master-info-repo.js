const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');
const sharedRepo = require('../shared/shared-repo');

async function getAllMasterInfo() {
    const data = await dbDriver.findAll(
        {},
        '',
        commonDbCollectionList.masterInfo,
        commonDatabase
    );
    return data;
}

async function updateMasterInfo(updateData, id) {
    const filter = { _id: ObjectID(id) };
    const data = await dbDriver.findOneAndReplace(
        filter,
        updateData,
        commonDbCollectionList.masterInfo,
        commonDatabase
    );

    return data;
}

module.exports = {
    getAllMasterInfo:getAllMasterInfo,
    updateMasterInfo:updateMasterInfo,
}