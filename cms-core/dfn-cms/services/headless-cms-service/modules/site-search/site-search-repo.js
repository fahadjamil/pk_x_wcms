const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
} = require('../../constants/collections-list');
const sharedRepo = require('../shared/shared-repo');

async function getSiteSearchMenuResults(dbName, keyword, langKey) {
    const data = await dbDriver.findAll({}, '', collectionsList.menus, dbName);

    let results = [];

    for (let x = 0; x < data.length; x++) {
        for (let i = 0; i < data[x].menu.length; i++) {
            for (let j = 0; j < data[x].menu[i].subLinks.length; j++) {
                // footer menu items with only 2 menu levels
                if (
                    data[x].type === 'footerMenu' &&
                    data[x].menu[i].subLinks[j].name[langKey.toLowerCase()]
                        .toLowerCase()
                        .includes(keyword.toLowerCase())
                ) {
                    let newObject = {
                        path: data[x].menu[i].path + data[x].menu[i].subLinks[j].path,

                        name: data[x].menu[i].subLinks[j].name[langKey.toLowerCase()],
                    };
                    results.push(newObject);
                }

                // main menu items with 3 menu levels
                for (let k = 0; k < data[x].menu[i].subLinks[j].subLinks.length; k++) {
                    if (
                        data[x].menu[i].subLinks[j].subLinks[k].name[langKey.toLowerCase()]
                            .toLowerCase()
                            .includes(keyword.toLowerCase())
                    ) {
                        let newObject = {
                            path:
                                data[x].menu[i].path +
                                data[x].menu[i].subLinks[j].path +
                                data[x].menu[i].subLinks[j].subLinks[k].path,
                            name:
                                data[x].menu[i].subLinks[j].subLinks[k].name[langKey.toLowerCase()],
                        };
                        results.push(newObject);
                    }
                }
            }
        }
    }

    return results;
}

async function getSiteSearchCollectionResults(dbName, keyword, langKey, collectionName) {
    // const indexes = await dbDriver.getIndexes({}, collectionName, dbName);
    // console.log('len' + indexes.length);
    // if (!indexes.length >= 2) {
    //     await dbDriver.createWildCardIndex({}, collectionName, dbName);
    // }
    await dbDriver.createWildCardIndex({}, collectionName, dbName);
    // keyword modified to search phrases
    let modifiedKeyword = `"${keyword}"`;
    const data = await dbDriver.findAll(
        { $text: { $search: modifiedKeyword } },
        '',
        collectionName,
        dbName
    );

    let results = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i].fieldData && data[i].fieldData[langKey].document) {
            let newObject = {
                path: data[i].fieldData[langKey].document
                    ? `api/documents/${dbName}/${data[i].fieldData[langKey].document}`
                    : undefined,
                name: data[i].fieldData[langKey].entry_name,
            };
            results.push(newObject);
        }
    }

    return results;
}

async function getSiteSearchPageResults(dbName, keyword, langKey) {
    await dbDriver.createWildCardIndex({}, collectionsList.pageContent, dbName);
    await dbDriver.createWildCardIndex({}, collectionsList.pages, dbName);

    // keyword modified to search phrases
    let modifiedKeyword = `"${keyword}"`;

    const pageContent = await dbDriver.findAll(
        { $text: { $search: modifiedKeyword } },
        '',
        collectionsList.pageContent,
        dbName
    );

    let results = [];

    for (let i = 0; i < pageContent.length; i++) {
        let docId = pageContent[i] ? pageContent[i]._id.toString() : '';
        if (docId != '') {
            const pages = await dbDriver.findAll(
                { $text: { $search: docId } },
                '',
                collectionsList.pages,
                dbName
            );

            const existingIds = results.map((result) => result.id.toString());

            // to eliminate duplicates due to lang wise content data
            if (!existingIds.includes(pages[0]._id.toString())) {
                if (pages[0] && pages[0].path && !pages[0].isSearchDisabled) {
                    let newObject = {
                        id: pages[0]._id,
                        path: pages[0].path ? `/${pages[0].path}` : undefined,
                        name: pages[0].pageName,
                    };
                    results.push(newObject);
                }
            }
        }
    }

    return results;
}

module.exports = {
    getSiteSearchMenuResults: getSiteSearchMenuResults,
    getSiteSearchCollectionResults: getSiteSearchCollectionResults,
    getSiteSearchPageResults: getSiteSearchPageResults,
};
