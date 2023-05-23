const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');

async function getNextSequenceValue(sequenceName, dbName) {
    let filter = { _id: sequenceName };
    let update = { $inc: { sequence_value: 1 } };

    await dbDriver.findOneAndUpdate(filter, update, 'counters', dbName);

    const data = await dbDriver.FindOne(filter, 'counters', dbName);
    return data;
}

//Included here to remove cerculer dependancy
async function insertInitialWorkflow(initialWorkflow, dbName) {
    const currentDate = new Date();
    const workflowWithCreatedDate = {
        ...initialWorkflow,
        createdDate: currentDate,
        modifiedDate: currentDate,
    };
    const data = await dbDriver.insertOne(
        workflowWithCreatedDate,
        collectionsList.workflows,
        dbName
    );
    return data;
}

module.exports = {
    getNextSequenceValue: getNextSequenceValue,
    insertInitialWorkflow: insertInitialWorkflow,
};
