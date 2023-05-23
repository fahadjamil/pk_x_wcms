const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const crypto = require('crypto');
const { AD_SALTED_VALUE } = require('./../../config/config');

const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');
const sharedRepo = require('../shared/shared-repo');

async function getLoggedUser(user, password) {
    const query = { userName: user };
    const data = await dbDriver.FindOne(query, commonDbCollectionList.cmsUsers, commonDatabase);

    return data;
}

async function getAllUsers() {
    const data = await dbDriver.findAll({}, '', commonDbCollectionList.cmsUsers, commonDatabase);
    return data;
}

async function getAllUser() {
    const data = await dbDriver.findAll({}, '', commonDbCollectionList.cmsUsers, commonDatabase);
    return data;
}

async function updateUser(dbName, user) {
    let saltedValue = AD_SALTED_VALUE;
    let md5EncryptedUsername = crypto.createHash('md5').update(user.userName).digest('hex');
    let saltedUsername = md5EncryptedUsername.concat(saltedValue);
    let sha256Username = crypto
        .createHash('sha256')
        .update(saltedUsername, 'utf-8')
        .digest('base64');
    let encryptedUsername = sha256Username.split('+').join('-').split('/').join('_');
    user.encryptedUsername = encryptedUsername;
    let filter = {};

    filter = {
        _id: ObjectID(user._id),
    };

    let query = {
        $set: {
            roles: user.roles,
            websites: user.websites,
            status: user.status,
            statusChangedBy: user.statusChangedBy,
            encryptedUsername: encryptedUsername,
            userName: user.userName,
            password: user.password,
        },
    };

    const data = await dbDriver.update(
        filter,
        query,
        commonDbCollectionList.cmsUsers,
        commonDatabase
    );
    return data;
}

async function addUser(dbName, user) {
    // let userSequence = await sharedRepo.getNextSequenceValue('user', dbName);
    // user.id = userSequence.sequence_value;
    let saltedValue = AD_SALTED_VALUE;
    let md5EncryptedUsername = crypto.createHash('md5').update(user.userName).digest('hex');
    let saltedUsername = md5EncryptedUsername.concat(saltedValue);
    let sha256Username = crypto
        .createHash('sha256')
        .update(saltedUsername, 'utf-8')
        .digest('base64');
    let encryptedUsername = sha256Username.split('+').join('-').split('/').join('_');
    user.encryptedUsername = encryptedUsername;

    const data = await dbDriver.insertOne(user, commonDbCollectionList.cmsUsers, commonDatabase);

    return data;
}

async function removeUser(dbName, user) {
    let filter = {};
    filter = {
        _id: ObjectID(user._id),
    };
    const data = await dbDriver.deleteOne(filter, commonDbCollectionList.cmsUsers, commonDatabase);
    return data;
}

module.exports = {
    getLoggedUser: getLoggedUser,
    getAllUsers: getAllUsers,
    getAllUser: getAllUser,
    updateUser: updateUser,
    addUser: addUser,
    removeUser: removeUser,
};
