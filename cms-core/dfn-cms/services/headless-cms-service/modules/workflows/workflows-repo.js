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
const publishPagesRepo = require('../publish-pages/publish-pages-repo');
const templatesRepo = require('../templates/template-repo');
const formsRepo = require('../forms/forms-repo');
const bannerRepo = require('../banners/banner-repo');
const customCollectionsRepo = require('../custom-collections/custom-collections-repo');

async function updatePageWorkflow(dbName, pageWorkflow, pageID) {
    const { id, ...pageWorkflowState } = pageWorkflow;
    const filter = { _id: ObjectID(id) };
    const options = { upsert: true };

    const createdDate = pageWorkflowState.createdDate;
    const pageWorkflowWithModifiedDate = {
        ...pageWorkflowState,
        modifiedDate: new Date(),
        createdDate: new Date(createdDate),
    };

    const data = await dbDriver.findOneAndReplace(
        filter,
        pageWorkflowWithModifiedDate,
        collectionsList.workflows,
        dbName
    );

    const results = await pagesRepo.getPage(dbName, pageID);
    const { page } = results;

    if (pageWorkflow && pageWorkflow.state === 'approved') {
        //Copy page from page-drafts to pages collection
        page.publishState = 'Publish Ready';
        page.version = page.version != '' ? page.version + 1 : 1;
        const pageFilter = { _id: ObjectID(pageID) };
        const responsePages = await dbDriver.findOneAndReplace(
            pageFilter,
            page,
            collectionsList.pages,
            dbName,
            options
        );

        // update version in page draft
        await pagesRepo.updatePage(dbName, pageID, page);

        //Copy page content data from page-content-drafts to page-content collection
        if (responsePages.result.ok === 1) {
            if (page.pageData) {
                for (const pageDataItem of page.pageData) {
                    const contentFilter = { _id: ObjectID(pageDataItem.id) };
                    const contentData = await dbDriver.FindOne(
                        contentFilter,
                        collectionsList.pageContentDrafts,
                        dbName
                    );

                    await dbDriver.findOneAndReplace(
                        contentFilter,
                        contentData,
                        collectionsList.pageContent,
                        dbName,
                        options
                    );
                }
            }
        }

        //Add original page id for history page document
        let { _id, ...historyPage } = page;
        const { id, ...historyPageWorkflow } = pageWorkflow;

        historyPageWorkflow.createdDate = new Date(historyPageWorkflow.createdDate);
        historyPageWorkflow.modifiedDate = new Date(historyPageWorkflow.modifiedDate);

        historyPage = {
            ...historyPage,
            origPageId: _id.toString(),
            workflowState: historyPageWorkflow,
        };

        let pageContentOrigIdList = {};

        //Create new object ids for history content data and assign mapping for pageData in historyPage
        for (let pageDataItem of historyPage.pageData) {
            const pageDraftContentId = pageDataItem.id;
            const newHistoryPageContentId = new ObjectID();
            //Update with new history content data ids
            pageDataItem.id = newHistoryPageContentId.toString();
            pageContentOrigIdList[pageDraftContentId.toString()] = newHistoryPageContentId;
        }

        //add page to history collection
        await dbDriver.insertOne(historyPage, collectionsList.pagesHistory, dbName);

        // get all page content data from page content dratfs
        const pageContentsFilter = Object.keys(pageContentOrigIdList).map((pageConetntId) => {
            return ObjectID(pageConetntId);
        });

        const query = { _id: { $in: pageContentsFilter } };
        const pageContentDataList = await dbDriver.findAll(
            query,
            '',
            collectionsList.pageContentDrafts,
            dbName
        );

        //include new page content document id created from page data previously and add to page content history
        if (pageContentDataList) {
            const historyPageContentData = pageContentDataList.map((pageContentData) => {
                let { _id, ...dataContent } = pageContentData;
                dataContent = {
                    _id: pageContentOrigIdList[_id],
                    ...dataContent,
                    origContentId: _id.toString(),
                };
                return dataContent;
            });

            if (historyPageContentData && historyPageContentData.length !== 0) {
                await dbDriver.insertMany(
                    historyPageContentData,
                    collectionsList.pageContentHistory,
                    dbName
                );
            }
        }
    }

    await activityLogsRepo.addPageActivityLogEntry(
        dbName,
        pageID,
        page.pageName,
        page.version,
        pageWorkflow
    );

    return data;
}

async function updateDocumentWorkflow(
    dbName,
    draftCollectionName,
    collectionName,
    workflow,
    docId
) {
    const { id, ...docWorkflowState } = workflow;
    const filter = { _id: ObjectID(id) };
    const options = { upsert: true };
    const createdDate = docWorkflowState.createdDate;
    const docWorkflowWithModifiedDate = {
        ...docWorkflowState,
        modifiedDate: new Date(),
        createdDate: new Date(createdDate),
    };

    const data = await dbDriver.findOneAndReplace(
        filter,
        docWorkflowWithModifiedDate,
        collectionsList.workflows,
        dbName
    );

    const documentFilter = { _id: ObjectID(docId) };
    const document = await customCollectionsRepo.getDocumentById(
        dbName,
        draftCollectionName,
        docId
    );

    if (workflow && workflow.state === 'approved') {
        document.version = document.version ? document.version + 1 : 1;

        const response = await dbDriver.findOneAndReplace(
            documentFilter,
            document,
            collectionName,
            dbName,
            options
        );

        // update version in document draft
        await customCollectionsRepo.updateCollectionDoc(
            dbName,
            draftCollectionName,
            docId,
            document
        );

        /*  if (response.result.ok === 1) {
            await dbDriver.deleteOne(filter, draftCollectionName, dbName);
        }*/

        let { _id, ...historyDocument } = document;

        historyDocument = {
            ...historyDocument,
            origDocId: _id.toString(),
            workflowState: docWorkflowState,
        };

        //add document to the history collection
        await dbDriver.insertOne(historyDocument, `${collectionName}-history`, dbName);
    }

    await activityLogsRepo.addDocActivityLogEntry(
        dbName,
        collectionName,
        workflow,
        document.version
    );

    return data;
}

async function getFilteredWorkflows(dbName, query, filter, sorter) {
    let findQuery = {};
    let sortQuery = {};

    if (query) {
        findQuery = JSON.parse(query);
    }

    if (sorter) {
        sortQuery = JSON.parse(sorter);
    }

    const data = await dbDriver.findAll(findQuery, sortQuery, collectionsList.workflows, dbName);
    return data;
}

async function getWorkflowState(dbName, id) {
    const filter = { _id: ObjectID(id) };

    const data = await dbDriver.FindOne(filter, collectionsList.workflows, dbName);
    return data;
}

async function getWorkflows(dbName, idList) {
    let data = undefined;

    if (idList) {
        const objIdList = idList.map((id) => {
            return ObjectID(id);
        });

        const query = { _id: { $in: objIdList } };
        data = await dbDriver.findAll(query, '', collectionsList.workflows, dbName);
    }

    return data;
}

async function getApprovedPageWorkFlows(dbName) {
    let data = undefined;
    const query = { $and: [{ state: 'approved' }, { fileType: 'Page' }] };

    data = await dbDriver.findAll(query, '', collectionsList.workflows, dbName);
    return data;
}

async function getApprovedWorkFlowsCustCollec(dbName) {
    let data = undefined;
    let collectionNames = [];

    const query = {
        $or: [
            { $and: [{ state: 'approved' }, { fileType: 'Documents' }] },
            { $and: [{ state: 'approved' }, { fileType: 'Posts' }] },
            { $and: [{ state: 'published' }, { fileType: 'Documents' }] },
        ],
    };
    data = await dbDriver.findAll(query, '', collectionsList.workflows, dbName);
    Object.keys(data).forEach((key) => {
        if (data[key].collectionName) {
            collectionNames.push(String(data[key].collectionName));
        }
    });
    return collectionNames;
}

async function UpdateWorkFlowsToPublished(dbName) {
    let data = undefined;
    //const query = { $and: [{ state: 'approved' }, { fileType: 'Page' }] };
    const query = { state: 'approved' };
    data = await dbDriver.updateMany(
        query,
        { $set: { state: 'published' } },
        collectionsList.workflows,
        dbName
    );
    return data;
}

async function UpdateCustTypesToPublished(dbName) {
    let data = undefined;
    //const query = { $and: [{ state: 'approved' }, { fileType: 'Page' }] };
    const query = {
        $and: [{ state: 'approved' }, { $or: [{ fileType: 'Posts' }, { fileType: 'Documents' }] }],
    };
    data = await dbDriver.updateMany(
        query,
        { $set: { state: 'published' } },
        collectionsList.workflows,
        dbName
    );
    return data;
}

async function UpdateFilteredCustTypesToPublished(dbName, custTypesName) {
    let data = undefined;
    //const query = { $and: [{ state: 'approved' }, { fileType: 'Page' }] };
    const query = {
        $and: [{ state: 'approved' }, { $or: [{ fileType: 'Posts' }, { fileType: 'Documents' }, {collectionName : custTypesName}] }],
    };
    data = await dbDriver.updateMany(
        query,
        { $set: { state: 'published' } },
        collectionsList.workflows,
        dbName
    );
    return data;
}

async function getPublishablePageWorkflowsByLevel(dbName, publishLevel) {
    // return all approved pages workflows for any pbulish level excepet state "published"
    let query = { $and: [{ state: 'approved' }, { fileType: 'Page' }] };

    // return all published and approved pages workflows
    if (publishLevel === 'published') {
        query = {
            $and: [{ $or: [{ state: 'published' }, { state: 'approved' }] }, { fileType: 'Page' }],
        };
    }

    data = await dbDriver.findAll(query, '', collectionsList.workflows, dbName);
    return data;
}

async function getCustomCollectionWorkflows(dbName, collectionName) {
    const customCollection = await dbDriver.findAll({}, '', collectionName, dbName);
    let workFlowIdList = [];
    workFlowIdList = customCollection.map((doc) => {
        if (doc.workflowStateId) {
            return doc.workflowStateId;
        }
    });

    return await getWorkflows(dbName, workFlowIdList);
}

async function updateTemplateWorkflow(dbName, templateWorkflow, templateID) {
    const { id, ...templateWorkflowState } = templateWorkflow;
    const filter = { _id: ObjectID(id) };
    const options = { upsert: true };

    const isCollectionExistTemplates = await dbDriver.isCollectionExist(
        collectionsList.templates,
        dbName
    );

    if (!isCollectionExistTemplates) {
        await dbDriver.copyTo(collectionsList.templatesDraft, collectionsList.templates, dbName);
    }

    const isCollectionExistContent = await dbDriver.isCollectionExist(
        collectionsList.templatesContentDrafts,
        dbName
    );

    if (!isCollectionExistContent) {
        await dbDriver.copyTo(
            collectionsList.templatesContent,
            collectionsList.templatesContentDrafts,
            dbName
        );
    }

    const createdDate = templateWorkflowState.createdDate;
    const templateWorkflowWithModifiedDate = {
        ...templateWorkflow,
        modifiedDate: new Date(),
        createdDate: new Date(createdDate),
    };

    const data = await dbDriver.findOneAndReplace(
        filter,
        templateWorkflowWithModifiedDate,
        collectionsList.workflows,
        dbName,
        options
    );

    const template = await templatesRepo.getTemplate(dbName, templateID);

    if (templateWorkflow && templateWorkflow.state === 'approved') {
        //Copy template from template-drafts to template collection
        template.publishState = 'Publish Ready';
        template.version = template.version + 1;
        const templateFilter = { _id: ObjectID(templateID) };
        const responseTemplates = await dbDriver.findOneAndReplace(
            templateFilter,
            template,
            collectionsList.templates,
            dbName,
            options
        );

        // update version in template draft
        await templatesRepo.updateTemplate(dbName, templateID, template);

        //Copy template content data from template-content-drafts to template-content collection
        if (responseTemplates.result.ok === 1) {
            if (template.templateData) {
                for (const templateDataItem of template.templateData) {
                    const contentFilter = { _id: ObjectID(templateDataItem.id) };

                    const contentData = await dbDriver.FindOne(
                        contentFilter,
                        collectionsList.templatesContentDrafts,
                        dbName,
                        options
                    );

                    await dbDriver.findOneAndReplace(
                        contentFilter,
                        contentData,
                        collectionsList.templatesContent,
                        dbName,
                        options
                    );
                }
            }
        }

        //Add original template id for history template document
        let { _id, ...historytemplate } = template;
        const { id, ...historytemplateWorkflow } = templateWorkflow;
        historytemplate = {
            ...historytemplate,
            origTemplateId: _id.toString(),
            workflowState: historytemplateWorkflow,
        };

        let templateContentOrigIdList = {};

        //Create new object ids for history content data and assign mapping for templateData in historytemplate
        for (let templateDataItem of historytemplate.templateData) {
            const templateDraftContentId = templateDataItem.id;
            const newHistorytemplateContentId = new ObjectID();
            //Update with new history content data ids
            templateDataItem.id = newHistorytemplateContentId.toString();
            templateContentOrigIdList[templateDraftContentId.toString()] =
                newHistorytemplateContentId;
        }

        //add template to history collection
        await dbDriver.insertOne(historytemplate, collectionsList.templatesHistory, dbName);

        // get all template content data from template content dratfs
        if (templateContentOrigIdList) {
            const templateContentsFilter = Object.keys(templateContentOrigIdList).map(
                (templateConetntId) => {
                    return ObjectID(templateConetntId);
                }
            );

            const query = { _id: { $in: templateContentsFilter } };
            const templateContentDataList = await dbDriver.findAll(
                query,
                '',
                collectionsList.templatesContentDrafts,
                dbName
            );

            //include new template content document id created from template data previously and add to template content history
            if (templateContentDataList) {
                const historytemplateContentData = templateContentDataList.map(
                    (templateContentData) => {
                        let { _id, ...dataContent } = templateContentData;
                        dataContent = {
                            _id: templateContentOrigIdList[_id],
                            ...dataContent,
                            origContentId: _id.toString(),
                        };
                        return dataContent;
                    }
                );

                if (historytemplateContentData && historytemplateContentData.length !== 0) {
                    await dbDriver.insertMany(
                        historytemplateContentData,
                        collectionsList.templatesContentHistory,
                        dbName
                    );
                }
            }
        }
    }

    // template activity log
    await activityLogsRepo.addTemplateActivityLogEntry(
        dbName,
        templateID,
        template.title,
        template.version + 1,
        templateWorkflow
    );

    return data;
}

async function updateBannerWorkflow(dbName, bannerWorkflow, bannerID) {
    const { id, ...bannerWorkflowState } = bannerWorkflow;
    const filter = { _id: ObjectID(id) };
    const options = { upsert: true };

    const isCollectionExist = await dbDriver.isCollectionExist(collectionsList.banners, dbName);

    if (!isCollectionExist) {
        await dbDriver.copyTo(collectionsList.bannerDraft, collectionsList.banners, dbName);
    }

    const createdDate = bannerWorkflowState.createdDate;
    const bannerWorkflowWithModifiedDate = {
        ...bannerWorkflow,
        modifiedDate: new Date(),
        createdDate: new Date(createdDate),
    };

    const data = await dbDriver.findOneAndReplace(
        filter,
        bannerWorkflowWithModifiedDate,
        collectionsList.workflows,
        dbName,
        options
    );

    const banner = await bannerRepo.getBanner(bannerID, dbName);

    if (bannerWorkflow && bannerWorkflow.state === 'approved') {
        //Copy banner from banner-drafts to banner collection
        banner.publishState = 'Publish Ready';
        banner.version = banner.version ? banner.version + 1 : 1;
        const bannerFilter = { _id: ObjectID(bannerID) };
        const responseBanners = await dbDriver.findOneAndReplace(
            bannerFilter,
            banner,
            collectionsList.banners,
            dbName,
            options
        );

        // update version in banner draft
        await bannerRepo.updateBanner(bannerID, banner, dbName);

        //Add original banner id for history banner document
        let { _id, ...historyBanner } = banner;
        const { id, ...historyBannerWorkflow } = bannerWorkflow;
        historyBanner = {
            ...historyBanner,
            origBannerId: _id.toString(),
            workflowState: historyBannerWorkflow,
        };

        //add banner to history collection
        await dbDriver.insertOne(historyBanner, collectionsList.bannerHistory, dbName);
    }

    // banner activity log
    await activityLogsRepo.addBannerActivityLogEntry(
        dbName,
        bannerID,
        banner.title,
        banner.version,
        bannerWorkflow
    );

    return data;
}

async function updateFormWorkflow(dbName, formWorkflow, formID) {
    const { id, ...formWorkflowState } = formWorkflow;
    const filter = { _id: ObjectID(id) };
    const options = { upsert: true };

    const isCollectionExist = await dbDriver.isCollectionExist(collectionsList.forms, dbName);

    if (!isCollectionExist) {
        await dbDriver.copyTo(collectionsList.formDrafts, collectionsList.forms, dbName);
    }

    const createdDate = formWorkflowState.createdDate;
    const formWorkflowWithModifiedDate = {
        ...formWorkflow,
        modifiedDate: new Date(),
        createdDate: new Date(createdDate),
    };

    const data = await dbDriver.findOneAndReplace(
        filter,
        formWorkflowWithModifiedDate,
        collectionsList.workflows,
        dbName,
        options
    );

    const form = await formsRepo.getForm(formID, dbName);

    if (formWorkflow && formWorkflow.state === 'approved') {
        //Copy form from form-drafts to forms collection
        form.publishState = 'Publish Ready';
        form.version = form.version ? form.version + 1 : 1;
        const formFilter = { _id: ObjectID(formID) };
        const responseForms = await dbDriver.findOneAndReplace(
            formFilter,
            form,
            collectionsList.forms,
            dbName,
            options
        );

        // update version in form drafts
        await formsRepo.updateForm(formID, form, dbName);

        //Add original form id for history form document
        let { _id, ...historyForm } = form;
        const { id, ...historyFormWorkflow } = formWorkflow;
        historyForm = {
            ...historyForm,
            origFormId: _id.toString(),
            workflowState: historyFormWorkflow,
        };

        //add form to history collection
        await dbDriver.insertOne(historyForm, collectionsList.formsHistory, dbName);
    }

    // form activity log
    await activityLogsRepo.addFormActivityLogEntry(
        dbName,
        formID,
        form.title,
        form.version,
        formWorkflow
    );

    return data;
}

module.exports = {
    updatePageWorkflow: updatePageWorkflow,
    updateDocumentWorkflow: updateDocumentWorkflow,
    getFilteredWorkflows: getFilteredWorkflows,
    getWorkflowState: getWorkflowState,
    getWorkflows: getWorkflows,
    getApprovedPageWorkFlows: getApprovedPageWorkFlows,
    UpdateWorkFlowsToPublished: UpdateWorkFlowsToPublished,
    getApprovedWorkFlowsCustCollec: getApprovedWorkFlowsCustCollec,
    UpdateCustTypesToPublished: UpdateCustTypesToPublished,
    UpdateFilteredCustTypesToPublished: UpdateFilteredCustTypesToPublished,
    getPublishablePageWorkflowsByLevel: getPublishablePageWorkflowsByLevel,
    getCustomCollectionWorkflows: getCustomCollectionWorkflows,
    updateTemplateWorkflow: updateTemplateWorkflow,
    updateBannerWorkflow: updateBannerWorkflow,
    updateFormWorkflow: updateFormWorkflow,
};
