const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const logger = require('../../logger/logger').logger;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');
const activityLogsRepo = require('../activity-logs/activity-logs-repo');
const sharedRepo = require('../shared/shared-repo');
const customCollectionsRepo = require('../custom-collections/custom-collections-repo');


async function createForm(dbName, formData) {
    try {
        const formId = new ObjectID();
        const workflowDocumentId = new ObjectID();

        formData._id = formId;
        let { workflowState, ...form } = formData;

        workflowState._id = workflowDocumentId;
        form.workflowStateId = workflowDocumentId.toString();

        const formsResults = await dbDriver.insertOne(form, collectionsList.formDrafts, dbName);
        const activityLogsResults = await activityLogsRepo.addGeneralActivityLogEntry(
            dbName,
            'Form',
            formData
        );
        const workflowResults = await sharedRepo.insertInitialWorkflow(workflowState, dbName);

        if (
            formsResults &&
            formsResults.result &&
            formsResults.result.n === 1 &&
            activityLogsResults &&
            activityLogsResults.result &&
            activityLogsResults.result.n === 1 &&
            workflowResults &&
            workflowResults.result &&
            workflowResults.result.n === 1
        ) {
            // Update custom types forms
            const updatedCustomTypeForm = await dbDriver.update(
                { customeCollectionName: form.customCollection },
                { $set: { mappedDynamicForm: formId.toString() } },
                collectionsList.customTypes,
                dbName
            );
            const allForms = await dbDriver.findAll({}, '', collectionsList.formDrafts, dbName);

            let data = {
                status: 'success',
                msg: 'Form created successfully',
            };

            const filter = { _id: workflowDocumentId };
            const workflow = await dbDriver.FindOne(filter, collectionsList.workflows, dbName);
            data.workflow = Object.keys(workflow).length > 0 ? workflow : undefined;

            if (allForms && Array.isArray(allForms) && allForms.length > 0) {
                data.allForms = allForms;
            }

            return data;
        } else {
            // TODO: Need to rollback the action. Similar to SQL transactions
            return {
                status: 'failed',
                msg: 'Form creation failed',
            };
        }
    } catch (error) {
        logger.info('Form creation failed');
        logger.info(error);
        console.log(error);

        return {
            status: 'failed',
            msg: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getAllForms(dbName) {
    try {
        const formDrafts = await dbDriver.findAll({}, '', collectionsList.formDrafts, dbName);
        const results = {
            allForms: [],
            workflow: undefined,
        };

        // Get workflow of first form item
        if (formDrafts && Array.isArray(formDrafts) && formDrafts.length > 0) {
            const firstItem = formDrafts[0];
            const { workflowStateId } = firstItem;

            results.allForms = formDrafts;

            if (workflowStateId) {
                const filter = { _id: ObjectID(workflowStateId) };
                const workflow = await dbDriver.FindOne(filter, collectionsList.workflows, dbName);
                results.workflow = Object.keys(workflow).length > 0 ? workflow : undefined;
            }
        }

        return results;
    } catch (error) {
        logger.info('Form select all failed');
        logger.info(error);
        console.log(error);
    }
}

async function getSingleFormItem(dbName, formId, user) {
    try {
        const results = {
            formItem: undefined,
            workflow: undefined,
            collection: undefined,
        };

        if (formId) {
            const filter = { _id: ObjectID(formId) };
            const formItem = await dbDriver.FindOne(filter, collectionsList.formDrafts, dbName);

            // Get workflow of first form item
            if (formItem) {
                const { workflowStateId, customCollection } = formItem;

                results.formItem = formItem;

                if (customCollection) {
                    const allFormsCollections =
                        await customCollectionsRepo.getcustomCollectionTypes(
                            dbName,
                            'Forms',
                            'custome-types',
                            user
                        );

                    if (allFormsCollections && Array.isArray(allFormsCollections)) {
                        let selectedCollection = allFormsCollections.find(
                            (collection) => collection.customeCollectionName === customCollection
                        );

                        results.collection = selectedCollection;
                    }
                }

                if (workflowStateId) {
                    const filter = { _id: ObjectID(workflowStateId) };
                    const workflow = await dbDriver.FindOne(
                        filter,
                        collectionsList.workflows,
                        dbName
                    );
                    results.workflow = Object.keys(workflow).length > 0 ? workflow : undefined;
                }
            }

            return results;
        }

        return results;
    } catch (error) {
        logger.info('Form select all failed');
        logger.info(error);
        console.log(error);
    }
}

async function getForm(id, dbName) {
    try {
        const filter = { _id: ObjectID(id) };
        const data = await dbDriver.FindOne(filter, collectionsList.formDrafts, dbName);

        return data;
    } catch (error) {
        console.log(error);
    }
}

async function getApprovedForm(id, dbName) {
    const filter = { _id: ObjectID(id) };
    const data = await dbDriver
        .FindOne(filter, collectionsList.forms, dbName)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            return {};
        });

    return data;
}

async function updateForm(formId, formData, dbName) {
    try {
        const filter = { _id: ObjectID(formId) };
        let { _id, workflowState, ...formContentData } = formData;

        if (formData.workflowStateId === undefined) {
            const workflowDocumentId = new ObjectID();
            workflowState._id = workflowDocumentId;
            formContentData.workflowStateId = workflowDocumentId.toString();

            await sharedRepo.insertInitialWorkflow(workflowState, dbName);
        }

        const data = await dbDriver.findOneAndReplace(
            filter,
            formContentData,
            collectionsList.formDrafts,
            dbName
        );

        if (data) {
            const { result } = data;

            if (result.n == 1 && result.ok == 1) {
                return {
                    status: 'success',
                    msg: 'Form updated successfully',
                };
            }
        }

        return {
            status: 'failed',
            msg: 'Form update failed',
        };
    } catch (error) {
        console.error(error);
        return {
            status: 'failed',
            msg: 'Something unexpected has occured. Please try again later',
        };
    }
}

async function deleteForm(dbName, formId, workflowId, deletedBy) {
    try {
        let formDraftsFilter = {
            _id: ObjectID(formId),
        };

        let workflowsFilter = {
            _id: ObjectID(workflowId),
        };

        let contentArchiveFormResults = undefined;
        let activityLogsResults = undefined;
        const results = {};

        // Get form drafts document
        const formDraftDocument = await dbDriver.FindOne(
            formDraftsFilter,
            collectionsList.formDrafts,
            dbName
        );

        const deleteComment = `${formDraftDocument.title} is deleted.`;

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

        // Delete from form drafts
        const formDraftsResults = await dbDriver.deleteOne(
            formDraftsFilter,
            collectionsList.formDrafts,
            dbName
        );

        // Delete from forms
        const formResults = await dbDriver.deleteOne(
            formDraftsFilter,
            collectionsList.forms,
            dbName
        );

        // Delete from workflows
        const formWorkflowResults = await dbDriver.deleteOne(
            workflowsFilter,
            collectionsList.workflows,
            dbName
        );

        // Update custom types forms
        const updatedCustomTypeForm = await dbDriver.update(
            { customeCollectionName: formDraftDocument.customCollection },
            { $set: { mappedDynamicForm: '' } },
            collectionsList.customTypes,
            dbName
        );

        // Insert deleted form into content-archive collection
        if (formDraftDocument) {
            //Add original form id for deleted form document
            let { _id, ...historyForm } = formDraftDocument;
            delete workflowDocument._id;

            historyForm = {
                ...historyForm,
                origFormId: formId,
                workflowState: workflowDocument,
                type: 'Form',
                ...additionalData,
            };

            //add form to content-archive collection
            contentArchiveFormResults = await dbDriver.insertOne(
                historyForm,
                collectionsList.contentArchive,
                dbName
            );

            // Finally insert record into activity logs collection
            activityLogsResults = await activityLogsRepo.addFormActivityLogEntry(
                dbName,
                formId,
                formDraftDocument.title,
                formDraftDocument.version,
                workflowDocument,
                additionalData
            );
        }

        const allForms = await dbDriver.findAll({}, '', collectionsList.formDrafts, dbName);

        if (allForms && Array.isArray(allForms)) {
            results.allForms = allForms;

            if (allForms.length > 0) {
                const firstItem = allForms[0];
                const { workflowStateId } = firstItem;

                if (workflowStateId) {
                    const filter = { _id: ObjectID(workflowStateId) };
                    const workflow = await dbDriver.FindOne(
                        filter,
                        collectionsList.workflows,
                        dbName
                    );
                    results.workflow = Object.keys(workflow).length > 0 ? workflow : undefined;
                }
            }
        }

        results.status = 'success';
        results.msg = 'Record deleted successfully';

        return results;
    } catch (error) {
        console.error(error);
        const results = {};

        results.status = 'failed';
        results.msg = 'Something unexpected has occured. Please try again later';
    }
}

module.exports = {
    createForm: createForm,
    getAllForms: getAllForms,
    getSingleFormItem: getSingleFormItem,
    getForm: getForm,
    updateForm: updateForm,
    getApprovedForm: getApprovedForm,
    deleteForm: deleteForm,
    
};
