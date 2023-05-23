const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');
const activityLogsRepo = require('../activity-logs/activity-logs-repo');
const sharedRepo = require('../shared/shared-repo');

async function createBanner(dbName, bannerData) {
    const bannerId = new ObjectID();
    const workflowDocumentId = new ObjectID();

    bannerData._id = bannerId;
    let { workflowState, ...banner } = bannerData;

    workflowState._id = workflowDocumentId;
    banner.workflowStateId = workflowDocumentId.toString();

    await sharedRepo.insertInitialWorkflow(workflowState, dbName);

    dbDriver
        .insertOne(banner, collectionsList.bannerDraft, dbName)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            throw new Error('Banner creation Failed');
        });

    //return data;
    await activityLogsRepo.addGeneralActivityLogEntry(dbName, 'Banner', bannerData);
}

async function getAllBanners(dbName) {
    const isCollectionExist = await dbDriver.isCollectionExist(collectionsList.bannerDraft, dbName);

    if (!isCollectionExist && dbName != undefined) {
        // if (!isCollectionExist) {
        await dbDriver.copyTo(collectionsList.banners, collectionsList.bannerDraft, dbName);
    }

    const data = await dbDriver
        .findAll({}, '', collectionsList.bannerDraft, dbName)
        .catch((error) => {
            return {};
        });

    return data;
}

async function getBanner(id, dbName) {
    const filter = { _id: ObjectID(id) };
    const data = await dbDriver
        .FindOne(filter, collectionsList.bannerDraft, dbName)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            return {};
        });

    return data;
}

async function getApprovedBanner(id, dbName) {
    const filter = { _id: ObjectID(id) };
    const data = await dbDriver
        .FindOne(filter, collectionsList.banners, dbName)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            return {};
        });

    return data;
}

async function updateBanner(bannerId, bannerData, dbName) {
    const filter = { _id: ObjectID(bannerId) };
    let { id, workflowState, ...bannerContentData } = bannerData;

    if (bannerData.workflowStateId === undefined) {
        const workflowDocumentId = new ObjectID();
        workflowState._id = workflowDocumentId;
        bannerContentData.workflowStateId = workflowDocumentId.toString();

        await sharedRepo.insertInitialWorkflow(workflowState, dbName);
    }

    dbDriver
        .findOneAndReplace(filter, bannerContentData, collectionsList.bannerDraft, dbName)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            throw new Error('Banner Update Failed');
        });

    return {};
}

async function deleteBanner(dbName, bannerId, workflowId, deletedBy) {
    try {
        let bannerDraftsFilter = {
            _id: ObjectID(bannerId),
        };

        let workflowsFilter = {
            _id: ObjectID(workflowId),
        };

        let contentArchiveBannerResults = undefined;
        let activityLogsResults = undefined;
        const results = {};

        // Get banner drafts document
        const bannerDraftDocument = await dbDriver.FindOne(
            bannerDraftsFilter,
            collectionsList.bannerDraft,
            dbName
        );

        const deleteComment = `${bannerDraftDocument.title} is deleted.`;

        const additionalData = {
            deleted: {
                deletedBy: deletedBy,
                deletedDate: new Date(),
                comment: deleteComment,
            },
        };

        // Get related workflow document
        const workflowDocument = await dbDriver.FindOne(
            workflowsFilter,
            collectionsList.workflows,
            dbName
        );

        // Delete from banner drafts
        const bannerDraftsResults = await dbDriver.deleteOne(
            bannerDraftsFilter,
            collectionsList.bannerDraft,
            dbName
        );

        // Delete from banners
        const bannerResults = await dbDriver.deleteOne(
            bannerDraftsFilter,
            collectionsList.banners,
            dbName
        );

        // Insert deleted banner into content-archive collection
        if (bannerDraftDocument) {
            //Add original banner id for deleted page document
            let { _id, ...historyBanner } = bannerDraftDocument;
            delete workflowDocument._id;
            workflowDocument.state = 'deleted';
            workflowDocument.comment = deleteComment;

            historyBanner = {
                ...historyBanner,
                origBannerId: bannerId,
                workflowState: workflowDocument,
                type: 'Banner',
                ...additionalData,
            };

            //add banner to content-archive collection
            contentArchiveBannerResults = await dbDriver.insertOne(
                historyBanner,
                collectionsList.contentArchive,
                dbName
            );

            // Finally insert record into activity logs collection
            activityLogsResults = await activityLogsRepo.addBannerActivityLogEntry(
                dbName,
                bannerId,
                bannerDraftDocument.title,
                bannerDraftDocument.version,
                workflowDocument,
                additionalData
            );
        }

        results.status = 'success';
        results.msg = 'Record deleted successfully.';

        return results;
    } catch (error) {
        console.error(error);
        const results = {};

        results.status = 'failed';
        results.msg = 'Something unexpected has occured. Please try again later.';
    }
}

module.exports = {
    createBanner: createBanner,
    getAllBanners: getAllBanners,
    getBanner: getBanner,
    updateBanner: updateBanner,
    getApprovedBanner: getApprovedBanner,
    deleteBanner: deleteBanner,
};
