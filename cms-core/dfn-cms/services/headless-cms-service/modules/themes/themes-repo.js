const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');
const sharedRepo = require('../shared/shared-repo');

async function getAllThemes(dbName) {
    const data = await dbDriver.findAll({}, '', collectionsList.themes, dbName);
    return data;
}

async function updateThemeData(dbName, pageId, updatedData) {
    let filter = {};

    filter = {
        _id: ObjectID(pageId),
    };

    const data = await dbDriver.findOneAndReplace(
        filter,
        updatedData,
        collectionsList.themes,
        dbName
    );
    return data;
}

module.exports = {
    getAllThemes:getAllThemes,
    updateThemeData:updateThemeData,
}