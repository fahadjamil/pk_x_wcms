const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const cache = require('cache');
const { AD_APP_ID, AD_APP_CODE, AD_SALTED_VALUE, AD_LOGIN_URL } = require('./../../config/config');
const adErrorMapping = require('./../../config/ad-error-mapping.json');

const logger = require('../../logger/logger').logger;

const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;

async function startServer() {
    updateAdErrorMappingCache();
}

async function updateAdErrorMappingCache() {
    for (var key in adErrorMapping) {
        if (adErrorMapping.hasOwnProperty(key)) {
            cache.getCache().addToCacheH('ad-error-mapping', key, adErrorMapping[key]);
        }
    }
}

async function login(username, password) {
    let user = {};

    let filter = {};

    filter = {
        userName: username,
        password: password,
    };
    let sorter = {};
    const data = await dbDriver.find(filter, sorter, 'cms-users', 'cms-admin');

    if (data[0]) {
        let sessionId = uuidv4();
        let session = {};
        session['roles'] = data[0].roles;
        session['websites'] = data[0].websites;
        user['userName'] = data[0].userName;
        user['sessionId'] = sessionId;
        user['docId'] = data[0]._id;

        logger.info(`Session info: ${JSON.stringify(session)}`);
        logger.info(`User info: ${JSON.stringify(user)}`);

        cache.getCache().addToCacheH('cms-user-sessions', sessionId, JSON.stringify(session));
    } else {
        logger.info('Invalid user name or password enterd');
        user['error'] = 'Invalid user name or password';
    }
    return user;
}

async function adLogin() {
    let appCode = AD_APP_CODE;
    let saltedValue = AD_SALTED_VALUE;
    let sessionId = uuidv4();
    let appId = AD_APP_ID;
    let appDate = formatDate();
    let appKey = parseInt(appId) + parseInt(appDate);
    console.log('Ad appKey :', appKey);

    // let appKey = [appId, formatDate()].join('');
    let md5EncryptedAppKey = crypto.createHash('md5').update(appKey.toString()).digest('hex');
    let saltedAppKey = md5EncryptedAppKey.concat(saltedValue);
    let sha256AppKey = crypto.createHash('sha256').update(saltedAppKey, 'utf-8').digest('base64');
    let encryptedAppKey = sha256AppKey.split('+').join('-').split('/').join('_');
    let requestUrl = AD_LOGIN_URL + appCode + '/' + sessionId + '/' + encryptedAppKey;
    return requestUrl;
}

async function adRedirect(sessionId, encryptedUsername, errorCode) {
    console.log('Ad Redirect service called - Auth Repo JS.............');
    let user = {};

    if (encryptedUsername) {
        console.log('Ad Redirect service called - Auth Repo UserName: ', encryptedUsername);
        let filter = {};
        filter = {
            encryptedUsername: encryptedUsername,
            status: 'Approved',
        };
        let sorter = {};
        console.log('Ad Redirect service called - Auth Repo Filter: ', JSON.stringify(filter));
        const data = await dbDriver.find(filter, sorter, 'cms-users', 'cms-admin');
        if (data[0]) {
            let session = {};
            session['roles'] = data[0].roles;
            session['websites'] = data[0].websites;
            user['userName'] = data[0].userName;
            user['sessionId'] = sessionId;
            user['docId'] = data[0]._id;

            logger.info(`Session info: ${JSON.stringify(session)}`);
            console.log('Session info:', JSON.stringify(session));
            logger.info(`User info: ${JSON.stringify(user)}`);
            console.log('User info:', JSON.stringify(user));

            cache.getCache().addToCacheH('cms-user-sessions', sessionId, JSON.stringify(session));
        } else {
            logger.info('User not registered in cms session id ' + sessionId);
            user['error'] = 'User not registered in CMS / User not Approved in CMS';
        }
    } else {
        logger.info('empty encrypted username session id ' + sessionId);
        let error = await cache.getCache().getValueFromCacheH('ad-error-mapping', errorCode);
        logger.info('Error code : ' + errorCode + ', Error Dec : ' + error);
        user['error'] = error;
    }
    return user;
}

function formatDate() {
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('');
}

module.exports = {
    startServer: startServer,
    login: login,
    adLogin: adLogin,
    adRedirect: adRedirect,
};
