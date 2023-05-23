const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const logger = require('../../logger/logger').logger;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
    gridFsCollectionsList,
} = require('../../constants/collections-list');
const sharedRepo = require('../shared/shared-repo');

async function getAllWebSites() {
    const data = await dbDriver.findAll({}, '', commonDbCollectionList.cmsWebsites, commonDatabase);

    return data;
}

async function getWebSite(id) {
    const filter = { _id: ObjectID(id) };
    const data = await dbDriver.FindOne(filter, commonDbCollectionList.cmsWebsites, commonDatabase);

    return data;
}

async function createWebSite(
    query,
    dbName,
    themes,
    workflows,
    mainMenu,
    footerMenu,
    roleCounter,
    username
) {
    const website = await dbDriver.insertOne(
        query,
        commonDbCollectionList.cmsWebsites,
        commonDatabase
    );
    let data = {};
    let defaultThemes;

    if (website.result.ok === 1) {
        Object.entries(collectionsList).forEach(async ([key, value]) => {
            await dbDriver.createCollection({}, value, dbName);
        });

        // Insert default themes
        let results = await dbDriver.insertMany(themes, collectionsList.themes, dbName);

        if (results.result.ok === 1) {
            defaultThemes = results.ops;
        }

        const masterInfoDocumentCount = await dbDriver.getDocumentsCount(
            commonDbCollectionList.masterInfo,
            commonDatabase
        );

        //Inster master data only in first time
        if (masterInfoDocumentCount === 0) {
            await dbDriver.insertOne(workflows, commonDbCollectionList.masterInfo, commonDatabase);
        }

        console.log('----------' + username);
        await dbDriver.insertOne(mainMenu, collectionsList.menus, dbName);
        await dbDriver.insertOne(footerMenu, collectionsList.menus, dbName);
        await dbDriver.insertOne(roleCounter, collectionsList.counters, dbName);

        try {
            console.log('----------' + username);
            let filter = {};
            let update = {};
            let set = {};
            filter.userName = username;
            set['roles.' + dbName] = [1];
            update = {
                $set: set,
            };
            await dbDriver.findOneAndUpdate(
                filter,
                update,
                commonDbCollectionList.cmsUsers,
                commonDatabase
            );
        } catch (error) {
            console.log('==========' + error);
        }

        // add website to the super user to allow handel cms users when initial deployment
        const filter = { isAdmin: true };
        const update = { $push: { websites: dbName } };
        await dbDriver.findOneAndUpdate(
            filter,
            update,
            commonDbCollectionList.cmsUsers,
            commonDatabase
        );
    }

    data.data = website;
    data.database_name = dbName;
    data.defaultThemes = defaultThemes;

    return data;
}

// async function generateCmsCustomControlData(cmsContentOperations, cmsUserFeature, workflows) {
//     const data = workflows.workflows;
//     let userOperation = [];

//     for (let i = 0; i < data.length; i++) {

//         let workflow = {
//             id: (i + 1).toString(),
//             type: 'workflow',
//             name: data[i].workflowName,
//             workflowId: data[i].workflowId,
//         };

//         let workflowUser = {
//             id: (i + 1).toString(),
//             type: 'workflow',
//             name: data[i].workflowName,
//             workflowId: data[i].workflowId,
//             roles: [],
//         };
//     if (!(workflow.workflowId === 'initial')) {
//         userOperation.push(workflowUser);

//         cmsContentOperations.operationsType
//             .find((x) => x.id === cmsPermissionIds.workflowId)
//             .operations.push(workflow);

//         let workflowItem = {
//             id: (
//                 cmsContentOperations.operationsType.find(
//                     (x) => x.id === cmsPermissionIds.customCollectionId
//                 ).operations.length + 1
//             ).toString(),
//             type: 'workflow',
//             name: data[i].workflowName,
//             workflowId: data[i].workflowId,
//         };

//         cmsContentOperations.operationsType
//             .find((x) => x.id === cmsPermissionIds.customCollectionId)
//             .operations.push(workflowItem);

//     }

// }

// const dataItem = cmsUserFeature.types[1].features;
// for (let i = 0; i < dataItem.length; i++) {
//     cmsUserFeature.types[1].features[i].operation = userOperation;
// }
// }

async function getAllDataFromCollection(dbName, collectionName) {
    const data = await dbDriver.findAll({}, '', collectionName, dbName);
    return data;
}

async function getFileFromGridFs(dbName, collectionName, fileName) {
    const data = await dbDriver.retrieveFileFromGridFs(dbName, collectionName, fileName);
    return data;
}

async function updateWebsiteLanguages(id, languages) {
    const filter = { _id: ObjectID(id) };
    const update = { $set: { languages: languages } };

    const data = await dbDriver.findOneAndUpdate(
        filter,
        update,
        commonDbCollectionList.cmsWebsites,
        commonDatabase
    );

    return data;
}

async function updateWebsite(id, query) {
    const filter = { _id: ObjectID(id) };
    const update = { $set: query };

    const data = await dbDriver.findOneAndUpdate(
        filter,
        update,
        commonDbCollectionList.cmsWebsites,
        commonDatabase
    );

    return data;
}

async function getWebsiteLanguages(dbName) {
    const query = { databaseName: dbName };

    const data = await dbDriver.FindOne(query, commonDbCollectionList.cmsWebsites, commonDatabase);
    const { languages } = data;

    return languages;
}

async function getWebsiteVersion(dbName) {
    const query = { databaseName: dbName };

    const data = await dbDriver.FindOne(query, commonDbCollectionList.cmsWebsites, commonDatabase);
    const { version } = data;

    return version;
}

async function updateWebsiteVersion(dbName, query) {
    const filter = { databaseName: dbName };
    const update = { $set: query };

    const data = await dbDriver.findOneAndUpdate(
        filter,
        update,
        commonDbCollectionList.cmsWebsites,
        commonDatabase
    );

    return data;
}

async function AddStaticResource(dbName, uploadedFileName, uniqFileName, fileSize, fileType) {
    try {
        const gridFsResults = await dbDriver.saveFileToGridfs(
            dbName,
            gridFsCollectionsList.resources,
            uniqFileName
        );

        const { _id, status, msg, length } = gridFsResults;
        let results = {};

        if (length > 0) {
            if (status === 'success') {
                const { _id, filename, uploadDate } = gridFsResults;
                const query = { uploadFileName: uploadedFileName };
                // Find for previously uploaded file.
                const previousResource = await dbDriver.FindOne(
                    query,
                    collectionsList.staticResources,
                    dbName
                );

                // If previously uploaded file exsists
                if (previousResource) {
                    const { _id, ...rest } = previousResource;

                    // Move that record into History collection
                    const data = await dbDriver.insertOne(
                        rest,
                        collectionsList.staticResourcesHistory,
                        dbName
                    );
                    const { result, insertedCount } = data;

                    if (result && result.n === 1 && result.ok === 1 && insertedCount === 1) {
                        // Delete that record from static resources collection
                        const filter = { _id: ObjectID(_id) };
                        const data = await dbDriver.deleteOne(
                            filter,
                            collectionsList.staticResources,
                            dbName
                        );
                    }
                }

                const doc = {
                    gridFsId: _id,
                    gridFsFileName: filename,
                    uploadDate: uploadDate,
                    uploadFileName: uploadedFileName,
                    fileSize: fileSize,
                    fileType: fileType,
                    fileUrl: `/api/file/${dbName}/${gridFsCollectionsList.resources}/${filename}`,
                };

                const data = await dbDriver.insertOne(doc, collectionsList.staticResources, dbName);
                const { result, insertedCount } = data;

                if (result && result.n === 1 && result.ok === 1 && insertedCount === 1) {
                    const data = await dbDriver.findAll(
                        {},
                        '',
                        collectionsList.staticResources,
                        dbName
                    );

                    results.status = status;
                    results.msg = msg;
                    results.data = data.length > 0 ? data : [];

                    return results;
                }

                results.status = 'failed';
                results.msg = "Unable to save uploaded file's data into database.";

                return results;
            }
        } else {
            const id = ObjectID(_id);
            const gridFsResults = await dbDriver.deleteFromGridfs(
                dbName,
                id,
                gridFsCollectionsList.resources
            );

            results.status = 'failed';
            results.msg = 'File has not uploaded to the database properly. Please upload again.';

            return results;
        }

        results.status = status;
        results.msg = msg;

        return results;
    } catch (error) {
        console.error(error);
        logger.info('Add Static Resource Failed');
        logger.info(error);
        return {
            status: 'failed',
            msg: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function updateStaticResourceLinks(dbName, staticResourceLinks) {
    try {
        let results = [];
        let finalResults = {};

        for (staticResourceLink in staticResourceLinks) {
            const { _id, links } = staticResourceLinks[staticResourceLink];

            // If _id present then update.
            // Otherwise insert new record
            if (_id) {
                const filter = {
                    _id: ObjectID(_id),
                };
                const update = {
                    $set: { links: links },
                };

                const data = await dbDriver.findOneAndUpdate(
                    filter,
                    update,
                    collectionsList.staticResourcesLinks,
                    dbName
                );

                results.push(data);
            } else {
                const doc = staticResourceLinks[staticResourceLink];

                const data = await dbDriver.insertOne(
                    doc,
                    collectionsList.staticResourcesLinks,
                    dbName
                );
                results.push(data);
            }
        }

        for (resultData of results) {
            const { result } = resultData;

            if (result.n !== 1 || result.ok !== 1) {
                finalResults.status = 'failed';
                finalResults.msg = 'Database error occured. Please try again later.';
            } else {
                finalResults.status = 'success';
                finalResults.msg = 'Record saved successfully.';

                const data = await dbDriver.findAll(
                    {},
                    '',
                    collectionsList.staticResourcesLinks,
                    dbName
                );

                finalResults.resourceLinks = data;
            }
        }

        return finalResults;
    } catch (error) {
        console.error(error);
        logger.info('Update Static ResourceLinks Failed');
        logger.info(error);
        return {
            status: 'failed',
            msg: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function deleteStaticResource(dbName, id, collectionName) {
    try {
        const filter = { _id: ObjectID(id) };
        const data = await dbDriver.deleteOne(filter, collectionName, dbName);
        const { result, deletedCount } = data;
        let results = {};

        if (result && result.n === 1 && result.ok === 1 && deletedCount === 1) {
            const data = await dbDriver.findAll({}, '', collectionsList.staticResources, dbName);

            results.data = data.length > 0 ? data : [];
            results.status = 'success';
            results.msg = 'Record deleted successfully.';
        } else {
            results.status = 'failed';
            results.msg = 'Something unexpected has occured. Please try again later.';
        }

        return results;
    } catch (error) {
        console.error(error);
        logger.info('Delete Static Resource Failed');
        logger.info(error);
        return {
            status: 'failed',
            msg: 'Something unexpected has occured. Please try again later.',
        };
    }
}

module.exports = {
    getAllWebSites: getAllWebSites,
    createWebSite: createWebSite,
    getWebSite: getWebSite,
    updateWebsiteLanguages: updateWebsiteLanguages,
    getWebsiteLanguages: getWebsiteLanguages,
    updateWebsite: updateWebsite,
    getWebsiteVersion: getWebsiteVersion,
    updateWebsiteVersion: updateWebsiteVersion,
    getAllDataFromCollection: getAllDataFromCollection,
    getFileFromGridFs: getFileFromGridFs,
    AddStaticResource: AddStaticResource,
    updateStaticResourceLinks: updateStaticResourceLinks,
    deleteStaticResource: deleteStaticResource,
};
