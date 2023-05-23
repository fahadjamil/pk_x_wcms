const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');

const activityLogsRepo = require('../activity-logs/activity-logs-repo');

async function getArchivedContent(dbName, searchQ) {
    let query = {
        ...(searchQ.types && {
            type: { $in: searchQ.types },
        }),

        ...(searchQ.title && {
            $or: [
                { title: { $regex: new RegExp(searchQ.title, 'i') } },
                { pageName: { $regex: new RegExp(searchQ.title, 'i') } },
            ],
        }),
        ...{
            $and: [
                searchQ.fromDate && searchQ.toDate
                    ? {
                          $or: [
                              {
                                  'deleted.deletedDate': {
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

    let sorter = { 'workflowState.modifiedDate': -1 };

    let data = [];

    if (searchQ.types) {
        data = await dbDriver.findAll(query, sorter, collectionsList.contentArchive, dbName);
    }

    return data;
}

async function checkoutArchive(dbName, data) {
    const { type, ...archiveData } = data;

    if (type.includes('Page')) {
        restorePage(dbName, archiveData);
    } else if (type.includes('Banner')) {
        restoreBanner(dbName, archiveData);
    } else if (type.includes('Template')) {
        restoreTemplate(dbName, archiveData);
    } else if (type.includes('Tree')) {
        restoreCustomTree(dbName, archiveData);
    }
}

async function deleteArchive(dbName, data) {
    const { type, ...archiveData } = data;

    if (type.includes('Page')) {
        deletePage(dbName, archiveData);
    } else if (type.includes('Banner')) {
        deleteBanner(dbName, archiveData);
    } else if (type.includes('Template')) {
        deleteTemplate(dbName, archiveData);
    } else if (type.includes('Tree')) {
        deleteCustomTree(dbName, archiveData);
    }
}

async function restorePage(dbName, page) {
    let filter = {};

    let contentArchivePageContentResults = undefined;

    const { _id, origPageId, deleted, workflowState, ...pageDetails } = page;

    const { pageData } = pageDetails;

    pageDetails._id = ObjectID(origPageId);

    // Get all page content drafts documents
    const pageContentDraftsIds = pageData.map((element) => {
        if (element) {
            const { id } = element;

            return ObjectID(id);
        }
    });

    const pageContentDraftsFilter = { _id: { $in: pageContentDraftsIds } };
    const pageContentDraftDocuments = await dbDriver.findAll(
        pageContentDraftsFilter,
        '',
        collectionsList.contentArchive,
        dbName
    );

    // Restore page
    const data = await dbDriver.insertOne(pageDetails, collectionsList.pageDrafts, dbName);

    if (pageContentDraftDocuments && pageContentDraftDocuments.length > 0) {
        const pageContentData = pageContentDraftDocuments.map((pageContentData) => {
            let { _id, origContentId, ...dataContent } = pageContentData;

            dataContent = {
                _id: _id,
                ...dataContent,
            };

            return dataContent;
        });

        if (pageContentData && pageContentData.length !== 0) {
            contentArchivePageContentResults = await dbDriver.insertMany(
                pageContentData,
                collectionsList.pageContentDrafts,
                dbName
            );
        }
    }

    const idsToDelete = [...pageContentDraftsIds, ObjectID(_id)];

    const contentArchiveFilter = { _id: { $in: idsToDelete } };
    // // Delete from content archive
    const contentArchiveResults = await dbDriver.deleteMany(
        contentArchiveFilter,
        collectionsList.contentArchive,
        dbName
    );

    const restoreComment = `${pageDetails.pageName} is restored.`;

    const additionalData = {
        restored: {
            restoredDate: new Date(),
            comment: restoreComment,
        },
    };

    // Finally insert record into activity logs collection
    const activityLogsResults = await activityLogsRepo.addPageActivityLogEntry(
        dbName,
        pageDetails._id,
        pageDetails.pageName,
        pageDetails.version,
        workflowState,
        additionalData
    );
}

async function restoreBanner(dbName, banner) {
    const { _id, origBannerId, deleted, workflowState, ...bannerData } = banner;

    bannerData._id = ObjectID(origBannerId);

    // Restore banner
    const data = await dbDriver.insertOne(bannerData, collectionsList.bannerDraft, dbName);

    const contentArchiveFilter = { _id: ObjectID(_id) };

    //  Delete from content archive
    const contentArchiveResults = await dbDriver.deleteOne(
        contentArchiveFilter,
        collectionsList.contentArchive,
        dbName
    );

    const restoreComment = `${bannerData.title} is restored.`;

    const additionalData = {
        restored: {
            restoredDate: new Date(),
            comment: restoreComment,
        },
    };

    // Finally insert record into activity logs collection
    const activityLogsResults = await activityLogsRepo.addBannerActivityLogEntry(
        dbName,
        bannerData._id,
        bannerData.title,
        bannerData.version,
        workflowState,
        additionalData
    );
}

async function restoreTemplate(dbName, template) {
    let filter = {};

    let contentArchiveTemplateContentResults = undefined;

    const { _id, origTemplateId, deleted, workflowState, ...templateDetails } = template;

    const { templateData } = templateDetails;

    templateDetails._id = ObjectID(origTemplateId);

    // Get all template content drafts documents
    const templateContentDraftsIds = templateData.map((element) => {
        if (element) {
            const { id } = element;

            return ObjectID(id);
        }
    });

    const templateContentDraftsFilter = { _id: { $in: templateContentDraftsIds } };
    const templateContentDraftDocuments = await dbDriver.findAll(
        templateContentDraftsFilter,
        '',
        collectionsList.contentArchive,
        dbName
    );

    // Restore template
    const data = await dbDriver.insertOne(templateDetails, collectionsList.templatesDraft, dbName);

    if (templateContentDraftDocuments && templateContentDraftDocuments.length > 0) {
        const templateContentData = templateContentDraftDocuments.map((templateContentData) => {
            let { _id, origContentId, ...dataContent } = templateContentData;

            dataContent = {
                _id: _id,
                ...dataContent,
            };

            return dataContent;
        });

        if (templateContentData && templateContentData.length !== 0) {
            contentArchiveTemplateContentResults = await dbDriver.insertMany(
                templateContentData,
                collectionsList.templatesContentDrafts,
                dbName
            );
        }
    }

    const idsToDelete = [...templateContentDraftsIds, ObjectID(_id)];

    const contentArchiveFilter = { _id: { $in: idsToDelete } };

    // Delete from content archive
    const contentArchiveResults = await dbDriver.deleteMany(
        contentArchiveFilter,
        collectionsList.contentArchive,
        dbName
    );

    const restoreComment = `${templateDetails.title} is restored.`;

    const additionalData = {
        restored: {
            restoredDate: new Date(),
            comment: restoreComment,
        },
    };

    // Finally insert record into activity logs collection
    const activityLogsResults = await activityLogsRepo.addTemplateActivityLogEntry(
        dbName,
        templateDetails._id,
        templateDetails.title,
        templateDetails.version,
        workflowState,
        additionalData
    );
}

async function restoreCustomTree(dbName, tree) {
    const { _id, origTreeId, type, deleted, ...treeData } = tree;

    const originalTreeData = { _id: ObjectID(origTreeId), ...treeData };

    // Restore tree data
    const data = await dbDriver.insertOne(originalTreeData, collectionsList.customTrees, dbName);

    const contentArchiveFilter = { _id: ObjectID(_id) };

    //  Delete from content archive
    const contentArchiveResults = await dbDriver.deleteOne(
        contentArchiveFilter,
        collectionsList.contentArchive,
        dbName
    );
}

async function deletePage(dbName, page) {
    const { _id, deleted, workflowState, ...pageDetails } = page;

    const { pageData } = pageDetails;

    // Get all page content drafts documents
    const pageContentDraftsIds = pageData.map((element) => {
        if (element) {
            const { id } = element;

            return ObjectID(id);
        }
    });

    const idsToDelete = [...pageContentDraftsIds, ObjectID(_id)];

    const contentArchiveFilter = { _id: { $in: idsToDelete } };

    // Delete template related documents from content archive
    const contentArchiveResults = await dbDriver.deleteMany(
        contentArchiveFilter,
        collectionsList.contentArchive,
        dbName
    );
}

async function deleteBanner(dbName, banner) {
    const { _id } = banner;

    const contentArchiveFilter = { _id: ObjectID(_id) };

    //  Delete from content archive
    const contentArchiveResults = await dbDriver.deleteOne(
        contentArchiveFilter,
        collectionsList.contentArchive,
        dbName
    );
}

async function deleteTemplate(dbName, template) {
    const { _id, deleted, workflowState, ...templateDetails } = template;

    const { templateData } = templateDetails;

    // Get all template content drafts documents
    const templateContentDraftsIds = templateData.map((element) => {
        if (element) {
            const { id } = element;

            return ObjectID(id);
        }
    });

    const idsToDelete = [...templateContentDraftsIds, ObjectID(_id)];

    const contentArchiveFilter = { _id: { $in: idsToDelete } };

    // Delete template related documents from content archive
    const contentArchiveResults = await dbDriver.deleteMany(
        contentArchiveFilter,
        collectionsList.contentArchive,
        dbName
    );
}

async function deleteCustomTree(dbName, tree) {
    const { _id } = tree;

    const contentArchiveFilter = { _id: ObjectID(_id) };

    //  Delete from content archive
    const contentArchiveResults = await dbDriver.deleteOne(
        contentArchiveFilter,
        collectionsList.contentArchive,
        dbName
    );
}

module.exports = {
    getArchivedContent: getArchivedContent,
    checkoutArchive: checkoutArchive,
    deleteArchive: deleteArchive,
};
