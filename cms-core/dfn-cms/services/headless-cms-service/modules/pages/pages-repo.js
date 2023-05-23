const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');
const sharedRepo = require('../shared/shared-repo');
const activityLogsRepo = require('../activity-logs/activity-logs-repo');
const pageDataRepo = require('../page-data/page-data-repo');

async function getFormattedPageData(dbName, pageData) {
    let pageContentResult = {};

    if (pageData && Array.isArray(pageData) && pageData.length > 0) {
        let pageDataIds = pageData.map((pageDataItem) => {
            return pageDataItem.id;
        });

        const pageDataObjs = await pageDataRepo.getAllContentData(dbName, pageDataIds);

        if (pageDataObjs && Array.isArray(pageDataObjs) && pageDataObjs.length > 0) {
            for (let languageWiseContentData of pageDataObjs) {
                const { _id, ...contentData } = languageWiseContentData;

                if (_id) {
                    const langPageData = pageData.find(
                        (langPageData) => langPageData.id === _id.toString()
                    );

                    pageContentResult[langPageData.lang] = contentData;
                }
            }
        }
    }

    return pageContentResult;
}

async function getPage(dbName, id) {
    try {
        const results = {};
        const query = { _id: ObjectID(id) };
        const page = await dbDriver.FindOne(query, collectionsList.pageDrafts, dbName);
        const { pageData } = page;
        const formattedPageData = await getFormattedPageData(dbName, pageData);

        results['page'] = page;
        results['pageData'] = formattedPageData;

        return results;
    } catch (error) {
        console.error(error);
        return { page: undefined, pageData: undefined };
    }
}

async function getAllPages(dbName) {
    const data = await dbDriver.findAll({}, '', collectionsList.pageDrafts, dbName);
    return data;
}

async function createPage(dbName, query) {
    const pageId = new ObjectID();
    const workflowDocumentId = new ObjectID();

    query._id = pageId;
    let { workflowState, ...page } = query;

    workflowState._id = workflowDocumentId;
    page.workflowStateId = workflowDocumentId.toString();

    await sharedRepo.insertInitialWorkflow(workflowState, dbName);
    //const response = await dbDriver.insertOne(workflowState, collectionsList.workflows, dbName);

    const data = await dbDriver.insertOne(page, collectionsList.pageDrafts, dbName);
    //TODO-change activity log state as well
    await activityLogsRepo.addPageActivityLogEntry(
        dbName,
        pageId.toString(),
        query.title,
        query.version,
        query.workflowState
    );
    return data;
}

async function deletePage(dbName, pageId, pageData, workflowId, deletedBy) {
    try {
        let pageDraftsFilter = {
            _id: ObjectID(pageId),
        };

        let workflowsFilter = {
            _id: ObjectID(workflowId),
        };

        let contentArchivePageResults = undefined;
        let contentArchivePageContentResults = undefined;
        let activityLogsResults = undefined;
        const results = {};

        // Get page drafts document
        const pageDraftDocument = await dbDriver.FindOne(
            pageDraftsFilter,
            collectionsList.pageDrafts,
            dbName
        );

        const deleteComment = `${pageDraftDocument.pageName} is deleted.`;

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
            collectionsList.pageContentDrafts,
            dbName
        );

        // Delete from page drafts
        const pageDraftsResults = await dbDriver.deleteOne(
            pageDraftsFilter,
            collectionsList.pageDrafts,
            dbName
        );

        // Delete from pages
        const pagesResults = await dbDriver.deleteOne(
            pageDraftsFilter,
            collectionsList.pages,
            dbName
        );

        // Delete from page content drafts
        const contentDraftsResults = await dbDriver.deleteMany(
            pageContentDraftsFilter,
            collectionsList.pageContentDrafts,
            dbName
        );

        // Delete from page contents
        const contentsResults = await dbDriver.deleteMany(
            pageContentDraftsFilter,
            collectionsList.pageContent,
            dbName
        );

        // Insert deleted page and page contents into content-archive collection
        if (pageDraftDocument) {
            //Add original page id for deleted page document
            let { _id, ...historyPage } = pageDraftDocument;
            delete workflowDocument._id;
            workflowDocument.state = 'deleted';
            workflowDocument.comment = deleteComment;

            historyPage = {
                ...historyPage,
                origPageId: pageId,
                workflowState: workflowDocument,
                type: 'Page',
                ...additionalData,
            };

            let pageContentOrigIdList = {};

            //Create new object ids for deleted content data and assign mapping for pageData in deleted Page
            for (let pageDataItem of historyPage.pageData) {
                const pageDraftContentId = pageDataItem.id;
                const newHistoryPageContentId = new ObjectID();

                //Update with new content data ids
                pageDataItem.id = newHistoryPageContentId.toString();
                pageContentOrigIdList[pageDraftContentId.toString()] = newHistoryPageContentId;
            }

            //add page to content-archive collection
            contentArchivePageResults = await dbDriver.insertOne(
                historyPage,
                collectionsList.contentArchive,
                dbName
            );

            //include new page content document id created from page data previously and add to content-archive
            if (pageContentDraftDocuments && pageContentDraftDocuments.length > 0) {
                const historyPageContentData = pageContentDraftDocuments.map((pageContentData) => {
                    let { _id, ...dataContent } = pageContentData;

                    dataContent = {
                        _id: pageContentOrigIdList[_id],
                        ...dataContent,
                        origContentId: _id.toString(),
                    };

                    return dataContent;
                });

                if (historyPageContentData && historyPageContentData.length !== 0) {
                    contentArchivePageContentResults = await dbDriver.insertMany(
                        historyPageContentData,
                        collectionsList.contentArchive,
                        dbName
                    );
                }
            }

            // Finally insert record into activity logs collection
            activityLogsResults = await activityLogsRepo.addPageActivityLogEntry(
                dbName,
                pageId,
                pageDraftDocument.pageName,
                pageDraftDocument.version,
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
        return results;
    }
}

async function updatePage(dbName, pageId, pageData, websiteId) {
    let filter = {};
    const { isHomePage, pageName } = pageData;

    filter._id = ObjectID(pageId);

    // If current page is set as the home page
    if (isHomePage) {
        await dbDriver.updateMany(
            { isHomePage: true },
            { $set: { isHomePage: false } },
            collectionsList.pageDrafts,
            dbName
        );

        const filter = { _id: ObjectID(websiteId) };
        const update = { $set: { homePage: { id: pageId, pageName: pageName } } };

        await dbDriver.findOneAndUpdate(
            filter,
            update,
            commonDbCollectionList.cmsWebsites,
            commonDatabase
        );
    }

    const data = await dbDriver.findOneAndReplace(
        filter,
        pageData,
        collectionsList.pageDrafts,
        dbName
    );

    const pages = await dbDriver.findAll({}, {}, collectionsList.pageDrafts, dbName);

    if (pages && pages.length > 0) {
        const page = pages.find((page) => page.isHomePage === true);

        // If there is no home page
        if (page === undefined) {
            await dbDriver.findOneAndUpdate(
                { _id: ObjectID(websiteId) },
                { $set: { homePage: {} } },
                commonDbCollectionList.cmsWebsites,
                commonDatabase
            );
        }
    } else {
        await dbDriver.findOneAndUpdate(
            { _id: ObjectID(websiteId) },
            { $set: { homePage: {} } },
            commonDbCollectionList.cmsWebsites,
            commonDatabase
        );
    }

    return { pageId: pageId, ...data };
}

async function updateAllPages(dbName, pages) {
    let filter = {};
    let data = {};

    pages.forEach(async (page, pageIndex) => {
        const { _id, ...updatedPage } = page;

        filter = {
            _id: ObjectID(_id),
        };

        const results = await dbDriver.findOneAndReplace(
            filter,
            updatedPage,
            collectionsList.pageDrafts,
            dbName
        );

        data[_id] = results;
    });

    return data;
}

async function insertPageSection(dbName, pageId, section) {
    let filter = {};
    let update = {};

    filter._id = ObjectID(pageId);
    update = {
        $push: { section: section },
    };

    const data = await dbDriver.findOneAndUpdate(
        filter,
        update,
        collectionsList.pageDrafts,
        dbName
    );

    return data;
}

async function updateLinkPage(dbName, page) {
    let filter = {};

    filter = {
        _id: ObjectID(page._id),
    };
    delete page._id;
    const data = await dbDriver.findOneAndReplace(filter, page, collectionsList.pageDrafts, dbName);
    return data;
}

async function getAllUnLinkPages(dbName, workflowState) {
    const allPages = await dbDriver.findAll({}, '', collectionsList.pageDrafts, dbName);
    const allMenus = await dbDriver.findAll({}, '', collectionsList.menus, dbName);
    const allWorkflows = await dbDriver.findAll(
        { fileType: 'Page' },
        '',
        collectionsList.workflows,
        dbName
    );

    const linkedPageIds = [];
    const linkedPageIndexes = [];
    const allUnlinkedPages = [...allPages];

    // TODO: Use Promise.all if there is any awaiting issue
    // Get all linked pages ids into an array
    allMenus &&
        allMenus.forEach((topMenuItem, topMenuItemIndex) => {
            const { _id, version, type, menu } = topMenuItem;

            menu &&
                menu.forEach((menuItem, menuItemIndex) => {
                    const { name, subLinks } = menuItem;

                    subLinks &&
                        subLinks.forEach((topLevelSubLink, topLevelSubLinkIndex) => {
                            const { subLinks, page } = topLevelSubLink;

                            // If second level sub links exists
                            if (subLinks && subLinks.length > 0) {
                                subLinks &&
                                    subLinks.forEach((topLevelSubLink, topLevelSubLinkIndex) => {
                                        const { subLinks, page } = topLevelSubLink;

                                        if (page) {
                                            linkedPageIds.push(page);
                                        }
                                    });
                            }

                            if (page) {
                                linkedPageIds.push(page);
                            }
                        });
                });
        });

    // Get those linked pages indexes in allPages array
    linkedPageIds.forEach((pageId, pageIdIndex) => {
        const pageIndex = allPages.findIndex((page) => page._id.toString() === pageId);

        if (pageIndex !== -1) {
            linkedPageIndexes.push(pageIndex);
        }
    });

    // Remove those linked pages
    if (linkedPageIndexes.length > 0) {
        // Sort to ascending order and remove
        const sortedIndexArray = linkedPageIndexes.sort((a, b) => a - b);

        for (var i = sortedIndexArray.length - 1; i >= 0; i--)
            allUnlinkedPages.splice(sortedIndexArray[i], 1);
    }

    if (workflowState.length !== 0) {
        let pageIndexes = [];

        // Get all indexes of pages as an array, which are having workflow state other than given state
        allWorkflows.forEach((workFlow, workFlowIndex) => {
            const { state, _id, fileTitle } = workFlow;

            const pageIndex = allUnlinkedPages.findIndex(
                (page) =>
                    page.workflowStateId === _id.toString() &&
                    page.pageName === fileTitle &&
                    state !== workflowState
            );

            if (pageIndex !== -1) {
                pageIndexes.push(pageIndex);
            }
        });

        // Remove pages which are having workflow state other than given state
        if (pageIndexes.length > 0) {
            // Sort to ascending order and remove
            const sortedIndexArray = pageIndexes.sort((a, b) => a - b);

            for (var i = sortedIndexArray.length - 1; i >= 0; i--)
                allUnlinkedPages.splice(sortedIndexArray[i], 1);
        }
    }

    return allUnlinkedPages;
}

async function duplicatePage(dbName, pageId, pageTitle, masterTemplateId, workflow) {
    const filter = { _id: ObjectID(pageId) };
    let workflowState = workflow;

    const page = await dbDriver.FindOne(filter, collectionsList.pageDrafts, dbName);

    const workflowDocumentId = new ObjectID();
    workflowState._id = workflowDocumentId;
    //Add workflow document
    await sharedRepo.insertInitialWorkflow(workflowState, dbName);
    //const response = await dbDriver.insertOne(workflowState, collectionsList.workflows, dbName);

    let { _id, menu, ...duplicatePage } = page;
    duplicatePage.pageName = pageTitle;
    duplicatePage.path = '';
    duplicatePage.pageData = [];
    duplicatePage.workflowStateId = workflowDocumentId.toString();

    if (masterTemplateId && masterTemplateId !== '') {
        duplicatePage.masterTemplate = masterTemplateId;
    }

    if (page.pageData) {
        for (const pageDataItem of page.pageData) {
            const { id, lang } = pageDataItem;
            const pageDataFilter = { _id: ObjectID(id) };

            let pageContentData = await dbDriver.FindOne(
                pageDataFilter,
                collectionsList.pageContentDrafts,
                dbName
            );

            if (pageContentData) {
                const pageContentDataId = new ObjectID();
                pageContentData._id = pageContentDataId;

                const response = await dbDriver.insertOne(
                    pageContentData,
                    collectionsList.pageContentDrafts,
                    dbName
                );

                if (response.result.ok === 1) {
                    const duplicatePageData = {
                        id: pageContentDataId.toString(),
                        lang: lang,
                    };
                    duplicatePage.pageData.push(duplicatePageData);
                }
            }
        }
    }

    const data = await dbDriver.insertOne(duplicatePage, collectionsList.pageDrafts, dbName);

    return data;
}

//NOT IN USE
async function getAllPagesByStatus(dbName, queryValue) {
    const query = { publishState: queryValue };
    const data = await dbDriver.findAll(query, '', collectionsList.pages, dbName);
    return data;
}
//----------

async function getPagesByWorkflowArry(dbName, workFlowIdsArry) {
    const query = { workflowStateId: { $in: workFlowIdsArry } };
    const data = await dbDriver.findAll(query, '', collectionsList.pageDrafts, dbName);
    return data;
}

async function recordLock(dbName, pageId, query, activeUserId) {
    try {
        if (dbName && pageId && query) {
            const filter = { _id: ObjectID(pageId) };

            let updatedPage = await dbDriver.FindOne(filter, collectionsList.pageDrafts, dbName);
            const results = await getPageLockingStatus(dbName, pageId);

            if (results && !results.locked) {
                // const options = {
                //     returnOriginal: false,
                // };

                const data = await dbDriver.findOneAndUpdate(
                    filter,
                    query,
                    collectionsList.pageDrafts,
                    dbName
                    // options
                );

                const { modifiedCount } = data;

                if (modifiedCount === 1) {
                    updatedPage = await dbDriver.FindOne(
                        filter,
                        collectionsList.pageDrafts,
                        dbName
                    );
                    const { pageData } = updatedPage;
                    const formattedPageData = await getFormattedPageData(dbName, pageData);

                    const result = {
                        status: 'success',
                        msg: 'Record locked successfully.',
                        updatedPageDoc: updatedPage,
                        updatedPageDataDocs: formattedPageData,
                    };

                    return result;
                } else {
                    const results = {
                        status: 'failed',
                        msg: 'Record locking Unsuccessfull.',
                        lockingStatus: results,
                        updatedPageDoc: updatedPage,
                    };

                    return results;
                }
            } else {
                if (results && results.lockedBy === activeUserId) {
                    const data = {
                        status: 'success',
                        msg: 'You have already locked this record.',
                        updatedPageDoc: updatedPage,
                    };

                    return data;
                }

                const data = {
                    status: 'failed',
                    msg: 'This record has already been locked. You can not edit or lock this record.',
                    lockingStatus: results,
                    updatedPageDoc: updatedPage,
                };

                return data;
            }
        } else {
            const data = {
                status: 'failed',
                msg: 'Page ID not found.',
            };

            return data;
        }
    } catch (error) {
        console.error(error);

        const data = {
            status: 'failed',
            msg: 'Something unexpected has occured. Please try again later.',
        };

        return data;
    }
}

async function recordUnLock(dbName, pageId, query, activeUserId) {
    try {
        if (dbName && pageId && query) {
            const filter = { _id: ObjectID(pageId) };

            let updatedPage = await dbDriver.FindOne(filter, collectionsList.pageDrafts, dbName);
            const results = await getPageLockingStatus(dbName, pageId);

            if (results.locked) {
                if (results.lockedBy !== activeUserId) {
                    const data = {
                        status: 'failed',
                        msg: 'This record has locked by another user. You can not unlock this record.',
                        lockingStatus: results,
                        updatedPageDoc: updatedPage,
                    };

                    return data;
                }

                // const options = {
                //     returnOriginal: false,
                // };

                const data = await dbDriver.findOneAndUpdate(
                    filter,
                    query,
                    collectionsList.pageDrafts,
                    dbName
                    // options
                );

                const { modifiedCount } = data;

                if (modifiedCount === 1) {
                    updatedPage = await dbDriver.FindOne(
                        filter,
                        collectionsList.pageDrafts,
                        dbName
                    );

                    const { pageData } = updatedPage;
                    const formattedPageData = await getFormattedPageData(dbName, pageData);

                    const result = {
                        status: 'success',
                        msg: 'Record unlocked successfully.',
                        updatedPageDoc: updatedPage,
                        updatedPageDataDocs: formattedPageData,
                    };

                    return result;
                } else {
                    const data = {
                        status: 'failed',
                        msg: 'Record unlocking not successfull.',
                        lockingStatus: results,
                        updatedPageDoc: updatedPage,
                    };

                    return data;
                }
            } else {
                const data = {
                    status: 'success',
                    msg: 'This record has already been unlocked.',
                    updatedPageDoc: updatedPage,
                };

                return data;
            }
        } else {
            const data = {
                status: 'failed',
                msg: 'Page ID not found.',
            };

            return data;
        }
    } catch (error) {
        console.error(error);

        const data = {
            status: 'failed',
            msg: 'Something unexpected has occured. Please try again later.',
        };

        return data;
    }
}

async function getPageLockingStatus(dbName, id) {
    const query = { _id: ObjectID(id) };
    const data = await dbDriver.FindOne(query, collectionsList.pageDrafts, dbName);
    const { recordLocked } = data;

    if (recordLocked) {
        const results = {
            locked: true,
            ...recordLocked,
        };
        return results;
    }

    const results = {
        locked: false,
    };

    return results;
}

module.exports = {
    getPage: getPage,
    getAllPages: getAllPages,
    createPage: createPage,
    deletePage: deletePage,
    updatePage: updatePage,
    updateAllPages: updateAllPages,
    insertPageSection: insertPageSection,
    updateLinkPage: updateLinkPage,
    getAllUnLinkPages: getAllUnLinkPages,
    duplicatePage: duplicatePage,
    getAllPagesByStatus: getAllPagesByStatus,
    getPagesByWorkflowArry: getPagesByWorkflowArry,
    recordLock: recordLock,
    recordUnLock: recordUnLock,
    getPageLockingStatus: getPageLockingStatus,
};
