const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');

async function getDocHistoryActivityLogs(dbName, type, collection) {
    let query = { type: type, collection: collection };
    let sorter = { _id: -1 };

    const data = await dbDriver.findAll(query, sorter, collectionsList.activityLogs, dbName);
    return data;
}

async function getPageHistoryActivityLogs(dbName, pageId) {
    let query = { pageId: pageId };
    const data = await dbDriver.findAll(query, '', collectionsList.activityLogs, dbName);
    return data;
}

async function getAllActivityLogs(dbName, sortQ, limit, page, searchQ) {
    let query = {
        ...(searchQ.types && {
            type: { $in: searchQ.types },
        }),
        ...(searchQ.title && { title: { $regex: new RegExp(searchQ.title, 'i') } }),
        ...{
            $and: [
                searchQ.comment
                    ? {
                          $or: [
                              {
                                  comment: { $regex: new RegExp(searchQ.comment, 'i') },
                              },
                              { 'deleted.comment': { $regex: new RegExp(searchQ.comment, 'i') } },
                              { 'restored.comment': { $regex: new RegExp(searchQ.comment, 'i') } },
                          ],
                      }
                    : {},
                searchQ.states
                    ? {
                          $or: [
                              {
                                  state: { $in: searchQ.states },
                              },
                          ],
                      }
                    : {},
                searchQ.fromDate && searchQ.toDate
                    ? {
                          $or: [
                              {
                                  modifiedDate: {
                                      $gte: new Date(searchQ.fromDate),
                                      $lt: new Date(searchQ.toDate),
                                  },
                              },
                              {
                                  createdDate: {
                                      $gte: searchQ.fromDate,
                                      $lt: searchQ.toDate,
                                  },
                              },
                              {
                                  'deleted.deletedDate': {
                                      $gte: new Date(searchQ.fromDate),
                                      $lt: new Date(searchQ.toDate),
                                  },
                              },
                              {
                                  'restored.restoredDate': {
                                      $gte: new Date(searchQ.fromDate),
                                      $lt: new Date(searchQ.toDate),
                                  },
                              },
                          ],
                      }
                    : {},
            ],
        },
    };

    const data = dbDriver.findWithPagination(
        query,
        null,
        sortQ,
        limit,
        page,
        collectionsList.activityLogs,
        dbName
    );

    return data;
}

async function addDocActivityLogEntry(dbName, collection, workFlow, additionalData = undefined) {
    let data;
    if (workFlow) {
        let setQ = {
            ...(workFlow.state && { state: workFlow.state }),
            ...(workFlow.comment && { comment: workFlow.comment }),
            ...(workFlow.createdBy && { createdBy: workFlow.createdBy }),
            ...(workFlow.modifiedBy && { modifiedBy: workFlow.modifiedBy }),
            ...(workFlow.createdDate && { createdDate: workFlow.createdDate }),
            ...(workFlow.modifiedDate && { modifiedDate: workFlow.modifiedDate }),
            ...(workFlow.fileTitle && { title: workFlow.fileTitle }),
            collection: collection,
            ...(workFlow.fileType && { type: workFlow.fileType }),
            ...(additionalData && additionalData.deleted && { deleted: additionalData.deleted }),
        };

        data = await dbDriver.insertOne(setQ, collectionsList.activityLogs, dbName);
    }
    return data;
}

async function addPageActivityLogEntry(
    dbName,
    pageId,
    pageTitle,
    version,
    workFlow,
    additionalData = undefined
) {
    let data;

    if (pageId && workFlow) {
        workFlow.createdDate = workFlow.createdDate ? workFlow.createdDate : new Date();
        workFlow.modifiedDate = workFlow.modifiedDate ? workFlow.modifiedDate : new Date();

        let setQ = {
            ...(workFlow.state && { state: workFlow.state }),
            ...(workFlow.comment && { comment: workFlow.comment }),
            ...(workFlow.createdBy && { createdBy: workFlow.createdBy }),
            ...(workFlow.modifiedBy && { modifiedBy: workFlow.modifiedBy }),
            ...(workFlow.createdDate && { createdDate: workFlow.createdDate }),
            ...(workFlow.modifiedDate && { modifiedDate: new Date() }),
            ...(version && { version: version }),
            ...(workFlow.fileTitle && { title: pageTitle ? pageTitle : workFlow.fileTitle }),
            pageId: pageId,
            ...(workFlow.fileType && { type: workFlow.fileType }),
            ...((additionalData && additionalData.deleted && { deleted: additionalData.deleted }) ||
                (additionalData &&
                    additionalData.restored && { restored: additionalData.restored })),
        };

        data = await dbDriver.insertOne(setQ, collectionsList.activityLogs, dbName);
    }

    return data;
}

async function addGeneralActivityLogEntry(dbName, fileType, metaData) {
    let data;

    const today = new Date();
    const todayDateString = today.toLocaleString();
    const initComment = `${metaData.title} is created.`;

    if (fileType) {
        let setQ = {
            title: metaData.title,
            comment: initComment,
            createdBy: metaData.createdBy,
            modifiedBy: metaData.createdBy,
            createdDate: todayDateString,
            modifiedDate: todayDateString,
            type: fileType,
        };

        data = await dbDriver.insertOne(setQ, collectionsList.activityLogs, dbName);
    }

    return data;
}

async function addTemplateActivityLogEntry(
    dbName,
    templateId,
    templateTitle,
    version,
    workFlow,
    additionalData = undefined
) {
    let data;

    if (templateId && workFlow) {
        let setQ = {
            ...(workFlow.state && { state: workFlow.state }),
            ...(workFlow.comment && { comment: workFlow.comment }),
            ...(workFlow.createdBy && { createdBy: workFlow.createdBy }),
            ...(workFlow.modifiedBy && { modifiedBy: workFlow.modifiedBy }),
            ...(workFlow.createdDate && { createdDate: workFlow.createdDate }),
            ...(workFlow.modifiedDate && { modifiedDate: new Date() }),
            ...(version && { version: version }),
            ...(workFlow.fileTitle && {
                title: templateTitle ? templateTitle : workFlow.fileTitle,
            }),
            templateId: templateId,
            ...(workFlow.fileType && { type: workFlow.fileType }),
            ...((additionalData && additionalData.deleted && { deleted: additionalData.deleted }) ||
                (additionalData &&
                    additionalData.restored && { restored: additionalData.restored })),
        };

        data = await dbDriver.insertOne(setQ, collectionsList.activityLogs, dbName);
    }

    return data;
}

async function getTemplateHistoryActivityLogs(dbName, templateId) {
    let query = { templateId: templateId };
    const data = await dbDriver.findAll(query, '', collectionsList.activityLogs, dbName);
    return data;
}

async function addBannerActivityLogEntry(
    dbName,
    bannerId,
    bannerTitle,
    version,
    workFlow,
    additionalData = undefined
) {
    let data;

    if (bannerId && workFlow) {
        let setQ = {
            ...(workFlow.state && { state: workFlow.state }),
            ...(workFlow.comment && { comment: workFlow.comment }),
            ...(workFlow.createdBy && { createdBy: workFlow.createdBy }),
            ...(workFlow.modifiedBy && { modifiedBy: workFlow.modifiedBy }),
            ...(workFlow.createdDate && { createdDate: workFlow.createdDate }),
            ...(workFlow.modifiedDate && { modifiedDate: new Date() }),
            ...(version && { version: version }),
            ...(workFlow.fileTitle && {
                title: bannerTitle ? bannerTitle : workFlow.fileTitle,
            }),
            bannerId: bannerId,
            ...(workFlow.fileType && { type: workFlow.fileType }),
            ...((additionalData && additionalData.deleted && { deleted: additionalData.deleted }) ||
                (additionalData &&
                    additionalData.restored && { restored: additionalData.restored })),
        };

        data = await dbDriver.insertOne(setQ, collectionsList.activityLogs, dbName);
    }

    return data;
}

async function addFormActivityLogEntry(
    dbName,
    formId,
    formTitle,
    version,
    workFlow,
    additionalData = undefined
) {
    let data;

    if (formId && workFlow) {
        let setQ = {
            ...(workFlow.state && { state: workFlow.state }),
            ...(workFlow.comment && { comment: workFlow.comment }),
            ...(workFlow.createdBy && { createdBy: workFlow.createdBy }),
            ...(workFlow.modifiedBy && { modifiedBy: workFlow.modifiedBy }),
            ...(workFlow.createdDate && { createdDate: workFlow.createdDate }),
            ...(workFlow.modifiedDate && { modifiedDate: new Date() }),
            ...(version && { version: version }),
            ...(workFlow.fileTitle && {
                title: formTitle ? formTitle : workFlow.fileTitle,
            }),
            formId: formId,
            ...(workFlow.fileType && { type: workFlow.fileType }),
            ...((additionalData && additionalData.deleted && { deleted: additionalData.deleted }) ||
                (additionalData &&
                    additionalData.restored && { restored: additionalData.restored })),
        };

        data = await dbDriver.insertOne(setQ, collectionsList.activityLogs, dbName);
    }

    return data;
}

async function getBannerHistoryActivityLogs(dbName, bannerId) {
    let query = { bannerId: bannerId };
    const data = await dbDriver.findAll(query, '', collectionsList.activityLogs, dbName);
    return data;
}

async function addCustomTreeActivityLogEntry(dbName, treeId, workFlow, additionalData = undefined) {
    let data;

    if (treeId && workFlow) {
        const activity = {
            state: workFlow.state,
            comment: workFlow.comment,
            createdBy: workFlow.createdBy,
            modifiedBy: workFlow.modifiedBy,
            createdDate: workFlow.createdDate,
            modifiedDate: workFlow.modifiedDate,
            ...(workFlow.fileTitle && {
                title: workFlow.fileTitle,
            }),
            treeId: treeId,
            type: workFlow.fileType,
            ...((additionalData && additionalData.deleted && { deleted: additionalData.deleted }) ||
                (additionalData &&
                    additionalData.restored && { restored: additionalData.restored })),
        };

        data = await dbDriver.insertOne(activity, collectionsList.activityLogs, dbName);
    }

    return data;
}

module.exports = {
    getDocHistoryActivityLogs: getDocHistoryActivityLogs,
    getPageHistoryActivityLogs: getPageHistoryActivityLogs,
    getAllActivityLogs: getAllActivityLogs,
    addDocActivityLogEntry: addDocActivityLogEntry,
    addPageActivityLogEntry: addPageActivityLogEntry,
    addGeneralActivityLogEntry: addGeneralActivityLogEntry,
    addTemplateActivityLogEntry: addTemplateActivityLogEntry,
    getTemplateHistoryActivityLogs: getTemplateHistoryActivityLogs,
    addBannerActivityLogEntry: addBannerActivityLogEntry,
    getBannerHistoryActivityLogs: getBannerHistoryActivityLogs,
    addFormActivityLogEntry: addFormActivityLogEntry,
    addCustomTreeActivityLogEntry: addCustomTreeActivityLogEntry,
};
