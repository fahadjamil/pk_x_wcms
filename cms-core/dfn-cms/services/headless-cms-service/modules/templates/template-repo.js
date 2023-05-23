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

async function createTemplate(dbName, query) {
    const templateId = new ObjectID();
    const workflowDocumentId = new ObjectID();

    query._id = templateId;
    let { workflowState, ...template } = query;

    workflowState._id = workflowDocumentId;
    template.workflowStateId = workflowDocumentId.toString();

    await sharedRepo.insertInitialWorkflow(workflowState, dbName);

    const data = await dbDriver.insertOne(template, collectionsList.templatesDraft, dbName);

    await activityLogsRepo.addGeneralActivityLogEntry(dbName, 'Template', query);
    return data;
}

async function duplicateTemplate(dbName, query) {
    try {
        const { templateTitle, templateId, createdDate, updatedDate, createdBy, templateWorkflow } =
            query;

        if (templateId) {
            const filter = { _id: ObjectID(templateId) };
            let workflowState = templateWorkflow;

            const template = await dbDriver.FindOne(filter, collectionsList.templatesDraft, dbName);

            const workflowDocumentId = new ObjectID();
            workflowState._id = workflowDocumentId;
            //Add workflow document
            await sharedRepo.insertInitialWorkflow(workflowState, dbName);

            // Unlock the record if already locked
            let { _id, recordLocked, ...duplicateTemplate } = template;

            duplicateTemplate.title = templateTitle || 'Duplicate Template';
            duplicateTemplate.created_date = createdDate || new Date().toLocaleString();
            duplicateTemplate.updated_date = updatedDate || new Date().toLocaleString();
            duplicateTemplate.createdBy = createdBy;
            duplicateTemplate.templateData = [];
            duplicateTemplate.workflowStateId = workflowDocumentId.toString();

            if (template.templateData) {
                for (const templateDataItem of template.templateData) {
                    const { id, lang } = templateDataItem;
                    const templateDataFilter = { _id: ObjectID(id) };

                    let templateContentData = await dbDriver.FindOne(
                        templateDataFilter,
                        collectionsList.templatesContentDrafts,
                        dbName
                    );

                    if (templateContentData) {
                        const templateContentDataId = new ObjectID();
                        templateContentData._id = templateContentDataId;

                        const response = await dbDriver.insertOne(
                            templateContentData,
                            collectionsList.templatesContentDrafts,
                            dbName
                        );

                        if (response.result.ok === 1) {
                            const duplicateTemplateData = {
                                id: templateContentDataId.toString(),
                                lang: lang,
                            };
                            duplicateTemplate.templateData.push(duplicateTemplateData);
                        }
                    }
                }
            }

            const data = await dbDriver.insertOne(
                duplicateTemplate,
                collectionsList.templatesDraft,
                dbName
            );

            const results = {
                status: 'success',
                msg: 'Template duplicated successfully.',
            };

            return results;
        }

        const results = {
            status: 'failed',
            msg: 'Template id not found.',
        };

        return results;
    } catch (error) {
        console.error(error);

        const results = {
            status: 'failed',
            msg: 'Something unexpected has occured. Please try again later.',
        };

        return results;
    }
}

async function getAllTemplates(dbName) {
    const data = await dbDriver.findAll({}, '', collectionsList.templatesDraft, dbName);

    return data;
}

async function getAllApprovedTemplates(dbName) {
    const isCollectionExist = await dbDriver.isCollectionExist(collectionsList.templates, dbName);

    if (!isCollectionExist) {
        await dbDriver.copyTo(collectionsList.templatesDraft, collectionsList.templates, dbName);
    }

    const data = await dbDriver.findAll({}, '', collectionsList.templates, dbName);

    return data;
}

async function getTemplate(dbName, id) {
    const query = { _id: ObjectID(id) };
    const data = await dbDriver.FindOne(query, collectionsList.templatesDraft, dbName);

    return data;
}

async function getAllTemplateContentData(dbName, idList) {
    let data = undefined;

    const isCollectionExist = await dbDriver.isCollectionExist(
        collectionsList.templatesContentDrafts,
        dbName
    );

    if (!isCollectionExist) {
        await dbDriver.copyTo(
            collectionsList.templatesContent,
            collectionsList.templatesContentDrafts,
            dbName
        );
    }

    if (idList) {
        const objIdList = idList.map((id) => {
            return ObjectID(id);
        });

        const query = { _id: { $in: objIdList } };
        data = await dbDriver.findAll(query, '', collectionsList.templatesContentDrafts, dbName);
    }

    return data;
}

async function updateAllTemplateComponentData(dbName, templateId, updatedTemplateContent) {
    const data = [];
    const template = await getTemplate(dbName, templateId);

    for (const languageKey of Object.keys(updatedTemplateContent)) {
        let templateDataItem = undefined;

        if (template.templateData) {
            templateDataItem = template.templateData.find(
                (templateDataItem) => templateDataItem.lang === languageKey
            );
        }

        if (templateDataItem) {
            const filter = { _id: ObjectID(templateDataItem.id) };
            const res = await dbDriver.findOneAndReplace(
                filter,
                updatedTemplateContent[languageKey],
                collectionsList.templatesContentDrafts,
                dbName
            );
            data.push(res);
        } else {
            const res = await dbDriver.insertOne(
                updatedTemplateContent[languageKey],
                collectionsList.templatesContentDrafts,
                dbName
            );

            if (res.result.ok === 1) {
                const templateDataContent = {
                    id: updatedTemplateContent[languageKey]._id,
                    lang: languageKey,
                };
                const filter = { _id: ObjectID(templateId) };
                const query = { $push: { templateData: templateDataContent } };

                await dbDriver.findOneAndUpdate(
                    filter,
                    query,
                    collectionsList.templatesDraft,
                    dbName
                );
            }

            data.push(res);
        }
    }
    return data;
}

async function updateTemplate(dbName, templateId, templateData) {
    let filter = {};
    filter._id = ObjectID(templateId);

    let { workflowState, ...template } = templateData;

    if (templateData.workflowStateId === undefined) {
        const workflowDocumentId = new ObjectID();
        workflowState._id = workflowDocumentId;
        template.workflowStateId = workflowDocumentId.toString();

        await sharedRepo.insertInitialWorkflow(workflowState, dbName);
    }

    const data = await dbDriver.findOneAndReplace(
        filter,
        template,
        collectionsList.templatesDraft,
        dbName
    );

    return data;
}

async function uploadTemplateImage(dbName, fileName) {
    const data = await dbDriver.saveImage(dbName, fileName);
    let results = {};

    if (data === 'success') {
        results = {
            fileName: fileName,
            filePath: `/api/template/getImage/${dbName}/${fileName}`,
        };
    }

    return results;
}

async function deleteTemplate(dbName, templateId, templateData, deletedBy) {
    let templateDraftsFilter = {
        _id: ObjectID(templateId),
    };
    let successState = {};

    // Get template drafts document
    const templateDraftDocument = await dbDriver.FindOne(
        templateDraftsFilter,
        collectionsList.templatesDraft,
        dbName
    );

    const deleteComment = `${templateDraftDocument.title} is deleted.`;

    const additionalData = {
        deleted: {
            deletedBy: deletedBy,
            deletedDate: new Date(),
            comment: deleteComment,
        },
    };

    let workflowsFilter = {
        _id: ObjectID(templateDraftDocument.workflowStateId),
    };

    // Get related workflow document
    const workflowDocument = await dbDriver.FindOne(
        workflowsFilter,
        collectionsList.workflows,
        dbName
    );

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
        collectionsList.templatesContentDrafts,
        dbName
    );

    // Insert deleted template and template contents into content-archive collection
    if (templateDraftDocument) {
        //Add original template id for deleted template document
        let { _id, ...historyTemplate } = templateDraftDocument;
        delete workflowDocument._id;
        workflowDocument.state = 'deleted';
        workflowDocument.comment = deleteComment;

        historyTemplate = {
            ...historyTemplate,
            origTemplateId: templateId,
            workflowState: workflowDocument,
            type: 'Template',
            ...additionalData,
        };

        let templateContentOrigIdList = {};

        //Create new object ids for deleted content data and assign mapping for templateData in deleted template
        for (let templateDataItem of historyTemplate.templateData) {
            const templateDraftContentId = templateDataItem.id;
            const newHistoryTemplateContentId = new ObjectID();

            //Update with new content data ids
            templateDataItem.id = newHistoryTemplateContentId.toString();
            templateContentOrigIdList[templateDraftContentId.toString()] =
                newHistoryTemplateContentId;
        }

        //add template to content-archive collection
        contentArchiveTemplateResults = await dbDriver.insertOne(
            historyTemplate,
            collectionsList.contentArchive,
            dbName
        );

        //include new template content document id created from template data previously and add to content-archive
        if (templateContentDraftDocuments && templateContentDraftDocuments.length > 0) {
            const historytemplateContentData = templateContentDraftDocuments.map(
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
                contentArchivetemplateContentResults = await dbDriver.insertMany(
                    historytemplateContentData,
                    collectionsList.contentArchive,
                    dbName
                );
            }
        }

        // Finally insert record into activity logs collection
        activityLogsResults = await activityLogsRepo.addTemplateActivityLogEntry(
            dbName,
            templateId,
            templateDraftDocument.title,
            templateDraftDocument.version,
            workflowDocument,
            additionalData
        );
    }

    await dbDriver.deleteOne(templateDraftsFilter, collectionsList.templates, dbName);

    const finished = await dbDriver
        .deleteOne(templateDraftsFilter, collectionsList.templatesDraft, dbName)
        .then(async (results) => {
            const { result, deletedCount } = results;

            // If template delete success, then delete the template contents
            if (result && result.ok === 1 && deletedCount === 1) {
                successState.templateDelete = 'Template deleted successfully';
                successState.templateData = {};

                if (templateData.length > 0) {
                    await Promise.all(
                        templateData.map(async (element) => {
                            const { id, lang } = element;

                            if (id) {
                                let templateContentDraftsFilter = {
                                    _id: ObjectID(id),
                                };

                                await dbDriver.deleteOne(
                                    templateContentDraftsFilter,
                                    collectionsList.templatesContentDrafts,
                                    dbName
                                );

                                await dbDriver
                                    .deleteOne(
                                        templateContentDraftsFilter,
                                        collectionsList.templatesContent,
                                        dbName
                                    )
                                    .then((results) => {
                                        const { result, deletedCount } = results;

                                        if (result && result.ok === 1 && deletedCount === 1) {
                                            successState.templateData[
                                                lang
                                            ] = `Template data id ${id} deleted successfully`;
                                        }
                                    });
                            }
                        })
                    );
                }
            }

            return results;
        })
        .then(async (results) => {
            const { result, deletedCount } = results;

            // If template delete success, then update the related page documents
            if (result && result.ok === 1 && deletedCount === 1) {
                const query = { masterTemplate: templateId };
                await dbDriver
                    .updateMany(
                        query,
                        { $set: { masterTemplate: '' } },
                        collectionsList.pageDrafts,
                        dbName
                    )
                    .then((results) => {
                        const { result, modifiedCount } = results;

                        if (result && result.ok === 1 && modifiedCount !== 0) {
                            successState.pageDraftUpdate = `${modifiedCount} page drafts were updated`;
                        }
                    });
            }

            return successState;
        });

    return finished;
}

async function getPublishablePagesTemplates(dbName, publishLevel) {
    let approvedWfData = undefined;
    let masterTemplateIds = [];
    let query = { $and: [{ state: 'approved' }, { fileType: 'Page' }] };

    const isCollectionExist = await dbDriver.isCollectionExist(collectionsList.templates, dbName);

    if (!isCollectionExist) {
        await dbDriver.copyTo(collectionsList.templatesDraft, collectionsList.templates, dbName);
    }

    if (publishLevel === 'published') {
        query = {
            $and: [{ $or: [{ state: 'published' }, { state: 'approved' }] }, { fileType: 'Page' }],
        };
    }

    approvedWfData = await dbDriver.findAll(query, '', collectionsList.workflows, dbName);

    const objIdList = approvedWfData.map((worflow) => {
        return worflow._id.toString();
    });

    const query2 = { workflowStateId: { $in: objIdList } };
    const pageDrafts = await dbDriver.findAll(query2, '', collectionsList.pageDrafts, dbName);

    pageDrafts.forEach((page) => {
        if (page.masterTemplate && page.masterTemplate !== '') {
            masterTemplateIds.push(page.masterTemplate);
        }
    });

    const materTemplateIds = masterTemplateIds.map((id) => {
        return ObjectID(id);
    });

    const query3 = { _id: { $in: materTemplateIds } };
    const templateDrafts = await dbDriver.findAll(
        query3,
        '',
        collectionsList.templatesDraft,
        dbName
    );

    return templateDrafts;
}

async function getPublishablePagesTemplatesData(dbName, publishLevel) {
    let templateDataIds = [];

    const approvedPageTemplates = await getPublishablePagesTemplates(dbName, publishLevel);

    if (approvedPageTemplates) {
        approvedPageTemplates.forEach((pageTemplate) => {
            if (pageTemplate.templateData) {
                pageTemplate.templateData.forEach((templateData) => {
                    templateDataIds.push(templateData.id);
                });
            }
        });
    }

    const objIdList = templateDataIds.map((id) => {
        return ObjectID(id);
    });

    const query = { _id: { $in: objIdList } };
    const pageTemplateContents = await dbDriver.findAll(
        query,
        '',
        collectionsList.templatesContent,
        dbName
    );

    return pageTemplateContents;
}

async function recordLock(dbName, templateId, query, activeUserId) {
    try {
        if (dbName && templateId && query) {
            const filter = { _id: ObjectID(templateId) };

            const results = await getTemplatesLockingStatus(dbName, templateId);
            let updatedTemplate = await dbDriver.FindOne(
                filter,
                collectionsList.templatesDraft,
                dbName
            );

            if (results && !results.locked) {
                const data = await dbDriver.findOneAndUpdate(
                    filter,
                    query,
                    collectionsList.templatesDraft,
                    dbName
                );

                const { modifiedCount } = data;

                if (modifiedCount === 1) {
                    updatedTemplate = await dbDriver.FindOne(
                        filter,
                        collectionsList.templatesDraft,
                        dbName
                    );

                    const results = {
                        status: 'success',
                        msg: 'Record locked successfully.',
                        updatedTemplateDoc: updatedTemplate,
                    };

                    return results;
                } else {
                    const results = {
                        status: 'failed',
                        msg: 'Record locking Unsuccessfull.',
                        updatedTemplateDoc: updatedTemplate,
                        lockingStatus: results,
                    };

                    return results;
                }
            } else {
                if (results && results.lockedBy === activeUserId) {
                    const data = {
                        status: 'success',
                        msg: 'You have already locked this record.',
                        updatedTemplateDoc: updatedTemplate,
                    };

                    return data;
                }

                const data = {
                    status: 'failed',
                    msg: 'This record has already been locked. You can not edit or lock this record.',
                    updatedTemplateDoc: updatedTemplate,
                    lockingStatus: results,
                };

                return data;
            }
        } else {
            const data = {
                status: 'failed',
                msg: 'Template ID not found.',
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

async function recordUnLock(dbName, templateId, query, activeUserId) {
    try {
        if (dbName && templateId && query) {
            const filter = { _id: ObjectID(templateId) };

            const results = await getTemplatesLockingStatus(dbName, templateId);
            let updatedTemplate = await dbDriver.FindOne(
                filter,
                collectionsList.templatesDraft,
                dbName
            );

            if (results.locked) {
                if (results.lockedBy !== activeUserId) {
                    const data = {
                        status: 'failed',
                        msg: 'This record has locked by another user. You can not unlock this record.',
                        lockingStatus: results,
                        updatedTemplateDoc: updatedTemplate,
                    };

                    return data;
                }

                const data = await dbDriver.findOneAndUpdate(
                    filter,
                    query,
                    collectionsList.templatesDraft,
                    dbName
                );

                const { modifiedCount } = data;

                if (modifiedCount === 1) {
                    updatedTemplate = await dbDriver.FindOne(
                        filter,
                        collectionsList.templatesDraft,
                        dbName
                    );

                    const data = {
                        status: 'success',
                        msg: 'Record unlocked successfully.',
                        updatedTemplateDoc: updatedTemplate,
                    };

                    return data;
                } else {
                    const data = {
                        status: 'failed',
                        msg: 'Record unlocking not successfull.',
                        lockingStatus: results,
                        updatedTemplateDoc: updatedTemplate,
                    };

                    return data;
                }
            } else {
                const data = {
                    status: 'success',
                    msg: 'This record has already been unlocked.',
                    updatedTemplateDoc: updatedTemplate,
                };

                return data;
            }
        } else {
            const data = {
                status: 'failed',
                msg: 'Template ID not found.',
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

async function getTemplatesLockingStatus(dbName, id) {
    const query = { _id: ObjectID(id) };
    const data = await dbDriver.FindOne(query, collectionsList.templatesDraft, dbName);
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
    createTemplate: createTemplate,
    duplicateTemplate: duplicateTemplate,
    getAllTemplates: getAllTemplates,
    getAllApprovedTemplates: getAllApprovedTemplates,
    getTemplate: getTemplate,
    getAllTemplateContentData: getAllTemplateContentData,
    updateAllTemplateComponentData: updateAllTemplateComponentData,
    updateTemplate: updateTemplate,
    uploadTemplateImage: uploadTemplateImage,
    deleteTemplate: deleteTemplate,
    getPublishablePagesTemplates: getPublishablePagesTemplates,
    getPublishablePagesTemplatesData: getPublishablePagesTemplatesData,
    recordLock: recordLock,
    recordUnLock: recordUnLock,
    getTemplatesLockingStatus: getTemplatesLockingStatus,
};
