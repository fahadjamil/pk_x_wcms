const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');
const sharedRepo = require('../shared/shared-repo');
const pagesRepo = require('../pages/pages-repo');
const activityLogsRepo = require('../activity-logs/activity-logs-repo');
const templateRepo = require('../templates/template-repo');
const bannerRepo = require('../banners/banner-repo');

async function getPageHistoryData(dbName, pageId) {
    let query = { origPageId: pageId };

    let filter = {
        _id: true,
        version: true,
        title: true,
        workflowState: true,
        origPageId: true,
    };

    let sorter = { 'workflowState.modifiedDate': -1 };

    const data = await dbDriver.findWithFilter(
        query,
        filter,
        sorter,
        collectionsList.pagesHistory,
        dbName
    );

    return data;
}

async function checkoutHistoryPage(dbName, title, version, pageId, workflow) {
    let query = {
        _id: ObjectID(pageId),
    };

    const temp = await dbDriver.FindOne(query, collectionsList.pagesHistory, dbName);
    let data;

    if (temp) {
        let origPageId = temp.origPageId;
        delete temp._id;
        delete temp.origPageId;
        let pageData = temp.pageData;

        if (pageData && pageData.length > 0) {
            let newPageData = [];

            for (let i = 0; i < pageData.length; i++) {
                let pageDataItem = await dbDriver.FindOne(
                    { _id: ObjectID(pageData[i].id) },
                    collectionsList.pageContentHistory,
                    dbName
                );

                if (pageDataItem) {
                    const origContentIdObj = new ObjectID(pageDataItem.origContentId);
                    pageDataItem._id = origContentIdObj;
                    delete pageDataItem.origContentId;
                    const data = await dbDriver.findOneAndReplace(
                        { _id: origContentIdObj },
                        pageDataItem,
                        collectionsList.pageContentDrafts,
                        dbName
                    );
                    newPageData.push({
                        id: origContentIdObj.toString(),
                        lang: pageData[i].lang,
                    });
                }
            }

            temp.pageData = newPageData;
        }

        if (temp.workflowState && temp.workflowStateId) {
            let workflowObj = {
                ...temp.workflowState,
                comment: workflow.comment,
                state: workflow.state,
                modifiedBy: workflow.modifiedBy,
                modifiedDate: workflow.modifiedDate,
            };

            const workflowData = await dbDriver.update(
                { _id: ObjectID(temp.workflowStateId) },
                { $set: workflowObj },
                collectionsList.workflows,
                dbName
            );

            delete temp.workflowState;
            data = await pagesRepo.updatePage(dbName, origPageId, temp);
            await activityLogsRepo.addPageActivityLogEntry(
                dbName,
                origPageId,
                title,
                version,
                workflowObj
            );
        } else {
            console.error('could not find workflow object. could not checkout');
            data = { err: 'could not update' };
        }
    } else {
        data = { err: 'could not update' };
    }

    return data;
}

async function getDocHistoryData(dbName, collection) {
    let query = {};

    let filter = {
        _id: true,
        version: true,
        title: true,
        workflowState: true,
        origDocId: true,
    };

    let sorter = { 'workflowState.modifiedDate': -1 };

    const data = await dbDriver.findWithFilter(query, filter, sorter, collection, dbName);

    return data;
}

async function getTemplateHistoryData(dbName, templateId) {
    let query = { origTemplateId: templateId };

    let filter = {
        _id: true,
        version: true,
        title: true,
        workflowState: true,
        origTemplateId: true,
    };

    let sorter = { 'workflowState.modifiedDate': -1 };

    const data = await dbDriver.findWithFilter(
        query,
        filter,
        sorter,
        collectionsList.templatesHistory,
        dbName
    );

    return data;
}

async function checkoutHistoryTemplate(dbName, title, version, templateId, workflow) {
    let query = {
        _id: ObjectID(templateId),
    };

    const temp = await dbDriver.FindOne(query, collectionsList.templatesHistory, dbName);
    let data;

    if (temp) {
        let origTemplateId = temp.origTemplateId;
        delete temp._id;
        delete temp.origTemplateId;
        let tempData = temp.templateData;

        if (tempData && tempData.length > 0) {
            let newTempData = [];

            for (let i = 0; i < tempData.length; i++) {
                let tempDataItem = await dbDriver.FindOne(
                    { _id: ObjectID(tempData[i].id) },
                    collectionsList.templatesContentHistory,
                    dbName
                );

                if (tempDataItem) {
                    const origContentIdObj = new ObjectID(tempDataItem.origContentId);
                    tempDataItem._id = origContentIdObj;
                    delete tempDataItem.origContentId;
                    const data = await dbDriver.findOneAndReplace(
                        { _id: origContentIdObj },
                        tempDataItem,
                        collectionsList.templatesContentDrafts,
                        dbName
                    );

                    newTempData.push({
                        id: origContentIdObj.toString(),
                        lang: tempData[i].lang,
                    });
                }
            }

            temp.templateData = newTempData;
        }

        if (temp.workflowState && temp.workflowStateId) {
            let workflowObj = {
                ...temp.workflowState,
                comment: workflow.comment,
                state: workflow.state,
                modifiedBy: workflow.modifiedBy,
                modifiedDate: workflow.modifiedDate,
            };

            const workflowData = await dbDriver.update(
                { _id: ObjectID(temp.workflowStateId) },
                { $set: workflowObj },
                collectionsList.workflows,
                dbName
            );

            delete temp.workflowState;
            data = await templateRepo.updateTemplate(dbName, origTemplateId, temp);
            await activityLogsRepo.addTemplateActivityLogEntry(
                dbName,
                origTemplateId,
                title,
                version,
                workflowObj
            );
        } else {
            console.error('could not find workflow object. could not checkout');
            data = { err: 'could not update template issue' };
        }
    } else {
        data = { err: 'could not update' };
    }

    return data;
}

async function getBannerHistoryData(dbName, bannerId) {
    let query = { origBannerId: bannerId };

    let filter = {
        _id: true,
        version: true,
        title: true,
        workflowState: true,
        origBannerId: true,
    };

    let sorter = { 'workflowState.modifiedDate': -1 };

    const data = await dbDriver.findWithFilter(
        query,
        filter,
        sorter,
        collectionsList.bannerHistory,
        dbName
    );

    return data;
}

async function checkoutHistoryBanner(dbName, title, bannerId, workflow) {
    let query = {
        _id: ObjectID(bannerId),
    };

    const banner = await dbDriver.FindOne(query, collectionsList.bannerHistory, dbName);
    let data;

    if (banner) {
        let origBannerId = banner.origBannerId;
        delete banner._id;
        delete banner.origBannerId;

        if (banner.workflowState && banner.workflowStateId) {
            let workflowObj = {
                ...banner.workflowState,
                comment: workflow.comment,
                state: workflow.state,
                modifiedBy: workflow.modifiedBy,
                modifiedDate: workflow.modifiedDate,
            };

            const workflowData = await dbDriver.update(
                { _id: ObjectID(banner.workflowStateId) },
                { $set: workflowObj },
                collectionsList.workflows,
                dbName
            );

            delete banner.workflowState;
            data = await bannerRepo.updateBanner(origBannerId, banner, dbName);
            await activityLogsRepo.addBannerActivityLogEntry(
                dbName,
                origBannerId,
                title,
                workflowObj
            );
        } else {
            console.error('could not find workflow object. could not checkout');
            data = { err: 'could not update banner issue' };
        }
    } else {
        data = { err: 'could not update' };
    }

    return data;
}

module.exports = {
    getPageHistoryData: getPageHistoryData,
    checkoutHistoryPage: checkoutHistoryPage,
    getDocHistoryData: getDocHistoryData,
    getTemplateHistoryData: getTemplateHistoryData,
    checkoutHistoryTemplate: checkoutHistoryTemplate,
    getBannerHistoryData: getBannerHistoryData,
    checkoutHistoryBanner: checkoutHistoryBanner,
};
