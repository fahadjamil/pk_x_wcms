const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const logger = require('../../logger/logger').logger;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');
const sharedRepo = require('../shared/shared-repo');

async function getAllRole(dbName) {
    let sorter = { id: 1 };
    const data = await dbDriver.findAll({}, sorter, collectionsList.siteUserRoles, dbName);
    return data;
}

async function updateRole(dbName, role) {
    let filter = {};

    filter = {
        _id: ObjectID(role._id),
    };
    delete role._id;
    const data = await dbDriver.findOneAndReplace(
        filter,
        role,
        collectionsList.siteUserRoles,
        dbName
    );
    return data;
}

async function addRole(dbName, role) {
    let roleSequence = await sharedRepo.getNextSequenceValue('role', dbName);
    role.id = roleSequence.sequence_value;
    const data = await dbDriver.insertOne(role, collectionsList.siteUserRoles, dbName);

    let menuQuery = {
        $push: {
            'menu.$[main].roles': roleSequence.sequence_value,
            'menu.$[main].subLinks.$[sub].roles': roleSequence.sequence_value,
            'menu.$[main].subLinks.$[sub].subLinks.$[sub2].roles': roleSequence.sequence_value,
        },
    };

    let menuOption = {
        arrayFilters: [
            { 'main.subLinks': { $exists: true } },
            { 'sub.subLinks': { $exists: true } },
            { 'sub2.subLinks': { $exists: true } },
        ],
        multi: true,
    };

    await dbDriver.update({}, menuQuery, collectionsList.menus, dbName, menuOption);

    let customTypeQuery = { $push: { roles: roleSequence.sequence_value } };
    let customTypeOption = { multi: true };

    await dbDriver.update({}, customTypeQuery, 'custome-types', dbName, customTypeOption);

    return data;
}

async function removeRole(dbName, role) {
    let filter = {};

    filter = {
        _id: ObjectID(role._id),
    };

    const data = await dbDriver.deleteOne(filter, collectionsList.siteUserRoles, dbName);

    let menuQuery = {
        $pull: {
            'menu.$[main].roles': role.id,
            'menu.$[main].subLinks.$[sub].roles': role.id,
            'menu.$[main].subLinks.$[sub].subLinks.$[sub2].roles': role.id,
        },
    };

    let menuOption = {
        arrayFilters: [
            { 'main.subLinks': { $exists: true } },
            { 'sub.subLinks': { $exists: true } },
            { 'sub2.subLinks': { $exists: true } },
        ],
        multi: true,
    };

    await dbDriver.update({}, menuQuery, collectionsList.menus, dbName, menuOption);

    let customTypeQuery = { $pull: { roles: role.id } };
    let customTypeOption = { multi: true };

    await dbDriver.update({}, customTypeQuery, 'custome-types', dbName, customTypeOption);

    return data;
}

async function getSitePermissionsForServer(dbName) {
    let map = new Map();
    const data = await dbDriver.find({}, '', collectionsList.menus, dbName);
    const customCollections = await dbDriver.find({}, '', 'custome-types', dbName);
    let pathsWithRoles = [];

    if (data && data.length > 0) {
        let pathStrings = [];

        for (let j = 0; j < data.length; j++) {
            if (data[j].hasOwnProperty('menu')) {
                let menuArray = data[j].menu;

                for (let i = 0; i < menuArray.length; i++) {
                    const obj = menuArray[i];

                    generatePathsWithRoles(obj, pathStrings);
                    for (let r = 0; r < pathStrings.length; r++) {
                        pathsWithRoles.push(pathStrings[r]);
                    }
                    pathStrings = [];
                }
            } else {
                logger.info('Menu not found');
            }
        }
    }

    if (customCollections && customCollections.length > 0) {
        for (let i = 0; i < customCollections.length; i++) {
            const customCollection = customCollections[i];
            const path =
                'api/custom-collection/' +
                customCollection.menuName.replace(/\s/g, '-').toLowerCase();

            if (customCollection.hasOwnProperty('roles')) {
                if (customCollection.roles.length > 0) {
                    let rolesArray = customCollection.roles;
                    pathsWithRoles.push(path + ':' + rolesArray);
                } else {
                    pathsWithRoles.push(path);
                }
            } else {
                pathsWithRoles.push(path);
            }
        }
    }
    //logger.info('getPathsWithRoles ' + pathsWithRoles);
    map.set('site-permissions', pathsWithRoles);
    // }
    const results = [...map].map(([name, value]) => ({ name, value }));
    //logger.info('Final results of getSitePermissionsForServer :' + JSON.stringify(results));
    return results;
}

function generatePathsWithRoles(obj, paths) {
    if (obj.hasOwnProperty('subLinks')) {
        let objArray = obj.subLinks;
        let pathStr = [];

        for (let i = 0; i < objArray.length; i++) {
            const objTemp = objArray[i];
            generatePathsWithRoles(objTemp, pathStr);
            for (let r = 0; r < pathStr.length; r++) {
                paths.push(pathStr[r]);
            }
            pathStr = [];
        }
    }

    for (let j = 0; j < paths.length; j++) {
        paths[j] = obj.path + paths[j];
    }

    if (obj.hasOwnProperty('roles')) {
        if (obj.roles.length > 0) {
            let rolesArray = obj.roles;
            paths.push(obj.path + ':' + rolesArray);
        } else {
            paths.push(obj.path);
        }
    } else {
        paths.push(obj.path);
    }
}

async function getPathsForRole(dbName, roleId) {
    const data = await dbDriver.find({}, '', collectionsList.menus, dbName);
    let pathsForRole = [];

    if (data && data.length > 0) {
        let pathStrings = [];
        for (let j = 0; j < data.length; j++) {
            if (data[j].hasOwnProperty('menu')) {
                let menuArray = data[j].menu;

                for (let i = 0; i < menuArray.length; i++) {
                    const obj = menuArray[i];
                    generatePathsForRole(obj, pathStrings, '-1');
                    for (let r = 0; r < pathStrings.length; r++) {
                        pathsForRole.push(pathStrings[r]);
                    }
                    pathStrings = [];
                }
            } else {
                logger.info('Menu not found');
            }
        }
    }
    return pathsForRole;
}

async function getSitePermissionsForClient(dbName, roleId) {
    const data = await dbDriver.find({}, '', collectionsList.menus, dbName);
    let pathsForRole = [];

    if (data && data.length > 0) {
        let pathStrings = [];
        for (let j = 0; j < data.length; j++) {
            if (data[j].hasOwnProperty('menu')) {
                let menuArray = data[j].menu;

                for (let i = 0; i < menuArray.length; i++) {
                    const obj = menuArray[i];
                    generatePathsForRole(obj, pathStrings, roleId);
                    for (let r = 0; r < pathStrings.length; r++) {
                        pathsForRole.push(pathStrings[r]);
                    }
                    pathStrings = [];
                }
            } else {
                logger.info('Menu not found');
            }
        }
    }
    return pathsForRole;
}

function generatePathsForRole(obj, paths, roleId) {
    if (obj.hasOwnProperty('subLinks')) {
        let objArray = obj.subLinks;
        let pathStr = [];

        for (let i = 0; i < objArray.length; i++) {
            const objTemp = objArray[i];
            generatePathsForRole(objTemp, pathStr, roleId);
            for (let r = 0; r < pathStr.length; r++) {
                paths.push(pathStr[r]);
            }
            pathStr = [];
        }
    }

    if (obj.hasOwnProperty('roles')) {
        if (obj.roles.length > 0) {
            let rolesArray = obj.roles;
            if (rolesArray.includes(roleId)) {
                paths.push(obj.path);
            } else if (roleId === '-1') {
                paths.push(obj.path);
            } else {
                logger.info(rolesArray);
                //roleId don't have access to path
            }
        } else {
            if (roleId === '-1') {
                paths.push(obj.path);
            }
            //no roles have access to this path
        }
    } else {
        //this one we can thing about free users not authorized
    }
}

module.exports = {
    getAllRole: getAllRole,
    updateRole: updateRole,
    addRole: addRole,
    removeRole: removeRole,
    getSitePermissionsForServer: getSitePermissionsForServer,
    getPathsForRole: getPathsForRole,
    getSitePermissionsForClient: getSitePermissionsForClient,
};
