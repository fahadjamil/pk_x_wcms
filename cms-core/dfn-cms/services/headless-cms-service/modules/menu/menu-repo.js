const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');
const sharedRepo = require('../shared/shared-repo');

async function getAllMenu(dbName) {
    const data = await dbDriver.findAll({}, '', collectionsList.menus, dbName);
    return data;
}

async function insertMenuItem(dbName, pageId, section) {
    let filter = {};
    let update = {};

    filter._id = ObjectID(pageId);
    update = {
        $push: { menu: section },
    };

    const data = await dbDriver.findOneAndUpdate(filter, update, collectionsList.menus, dbName);

    return data;
}

async function deletePageFromMenu(dbName, pageId) {
    let filter = {};
    let update = {};

    filter._id = ObjectID(pageId);
    update = {
        $set: { path: '' },
    };

    const data = await dbDriver.findOneAndUpdate(
        filter,
        update,
        collectionsList.pageDrafts,
        dbName
    );

    return data;
}

async function saveAllMenu(dbName, menu) {
    let filter = {};
    for (let i = 0; i < menu.length; i++) {
        filter = {
            _id: ObjectID(menu[i]._id),
        };
        delete menu[i]._id;
        await dbDriver.findOneAndReplace(filter, menu[i], collectionsList.menus, dbName);
    }
    return 'success';
}

async function saveMenu(dbName, menu) {
    let filter = {
        _id: ObjectID(menu._id),
    };
    delete menu._id;
    await dbDriver.findOneAndReplace(filter, menu, collectionsList.menus, dbName);
    return 'success';
}

async function getMainMenuNamesForMappedPages(dbName) {
    const filter = { type: 'mainMenu' };
    const data = await dbDriver.FindOne(filter, collectionsList.menus, dbName);
    let pageIdMappedMenuNames = {};

    
    if (data && data.menu) {
        for (const levelOneMenu of data.menu) {
            if (levelOneMenu.page && levelOneMenu.page !== '') {
                pageIdMappedMenuNames[levelOneMenu.page] = levelOneMenu.name;
            }

            for (const levelTwoMenu of levelOneMenu.subLinks) {
                if (levelTwoMenu.page && levelTwoMenu.page !== '') {
                    pageIdMappedMenuNames[levelTwoMenu.page] = levelTwoMenu.name;
                }

                for (const levelThreeMenu of levelTwoMenu.subLinks) {
                    if (levelThreeMenu.page && levelThreeMenu.page !== '') {
                        pageIdMappedMenuNames[levelThreeMenu.page] = levelThreeMenu.name;
                    }
                }
            }
        }
    }

    return pageIdMappedMenuNames;
}

module.exports = {
    getAllMenu: getAllMenu,
    insertMenuItem: insertMenuItem,
    saveAllMenu: saveAllMenu,
    deletePageFromMenu: deletePageFromMenu,
    saveMenu: saveMenu,
    getMainMenuNamesForMappedPages: getMainMenuNamesForMappedPages,
};
