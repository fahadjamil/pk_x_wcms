const workflowRepo = require('../modules/workflows/workflows-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;
const { PUBLISHER_NODE } = require('./../config/config');


module.exports = {
    name: 'cms.workflow',

    actions: {
        async updatePageWorkflow(ctx) {
            logger.info(
                `CMS update page workflow called. DBName: ${ctx.params.dbName}, PageId: ${ctx.params.pageId}`
            );
            const data = await this.updatePageWorkflow(
                ctx.params.dbName,
                ctx.params.pageWorkflow,
                ctx.params.pageId
            );

            return JSON.stringify(data);
        },

        async updateFormWorkflow(ctx) {
            logger.info(
                `CMS update form workflow called. DBName: ${ctx.params.dbName}, formId: ${ctx.params.formId}`
            );
            const data = await this.updateFormWorkflow(
                ctx.params.dbName,
                ctx.params.formWorkflow,
                ctx.params.formId
            );

            return JSON.stringify(data);
        },

        async updateDocumentWorkflow(ctx) {
            logger.info(
                `CMS update document workflow called. DBName: ${ctx.params.dbName}, DocId: ${ctx.params.docId}, Collection: ${ctx.params.collectionName}, Draft-Collection: ${ctx.params.draftCollectionName}`
            );
            const data = await this.updateDocumentWorkflow(
                ctx.params.dbName,
                ctx.params.draftCollectionName,
                ctx.params.collectionName,
                ctx.params.workflow,
                ctx.params.docId
            );

            return JSON.stringify(data);
        },

        async getFilteredWorkflows(ctx) {
            logger.info(
                `CMS get filtered workflows called. DBName: ${
                    ctx.params.dbName
                }, Query: ${JSON.stringify(ctx.params.query)}`
            );
            const data = await this.getFilteredWorkflows(
                ctx.params.dbName,
                ctx.params.query,
                ctx.params.filter,
                ctx.params.sorter
            );

            return JSON.stringify(data);
        },

        async getWorkflowState(ctx) {
            logger.info(
                `CMS get workflow state called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id}`
            );
            const data = await this.getWorkflowState(ctx.params.dbName, ctx.params.id);

            return JSON.stringify(data);
        },

        async getWorkflows(ctx) {
            logger.info(
                `CMS get workflows called. DBName: ${ctx.params.dbName}, Ids: ${JSON.stringify(
                    ctx.params.idList
                )}`
            );
            const data = await this.getWorkflows(ctx.params.dbName, ctx.params.idList);

            return JSON.stringify(data);
        },

        async getApprovedWorkFlowsCustCollec(ctx) {
            logger.info(
                `CMS get approved workflows custom collection called. DBName: ${ctx.params.dbName}`
            );
            const data = await this.getApprovedWorkFlowsCustCollec(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async UpdateCustTypesToPublished(ctx) {
            logger.info(
                `CMS update custom types to published called. DBName: ${ctx.params.dbName}`
            );
            const data = await this.UpdateCustTypesToPublished(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async UpdateFilteredCustTypesToPublished(ctx) {
            logger.info(
                `CMS update filtered custom types to published called. DBName: ${ctx.params.dbName} cust types names ${ctx.params.custTypesName}`
            );
            const data = await this.UpdateFilteredCustTypesToPublished(ctx.params.dbName, ctx.params.custTypesName);

            return JSON.stringify(data);
        },

        async getCustomCollectionWorkflows(ctx) {
            logger.info(
                `CMS get workflow for custom collection called. DBName: ${ctx.params.dbName} Collection: ${ctx.params.collectionName}`
            );
            const data = await this.getCustomCollectionWorkflows(
                ctx.params.dbName,
                ctx.params.collectionName
            );

            return JSON.stringify(data);
        },

        async updateTemplateWorkflow(ctx) {
            logger.info(
                `CMS update template workflow called. DBName: ${ctx.params.dbName}, PageId: ${ctx.params.pageId}`
            );
            const data = await this.updateTemplateWorkflow(
                ctx.params.dbName,
                ctx.params.pageWorkflow,
                ctx.params.pageId
            );

            return JSON.stringify(data);
        },

        async updateBannerWorkflow(ctx) {
            logger.info(
                `CMS update banner workflow called. DBName: ${ctx.params.dbName}, PageId: ${ctx.params.pageId}`
            );
            const data = await this.updateBannerWorkflow(
                ctx.params.dbName,
                ctx.params.pageWorkflow,
                ctx.params.pageId
            );

            return JSON.stringify(data);
        },
    },

    methods: {
        async updatePageWorkflow(dbName, pageWorkflow, pageID) {
            return await workflowRepo
                .updatePageWorkflow(dbName, pageWorkflow, pageID)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async updateFormWorkflow(dbName, formWorkflow, formID) {
            return await workflowRepo
                .updateFormWorkflow(dbName, formWorkflow, formID)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async updateDocumentWorkflow(dbName, draftCollectionName, collectionName, workflow, docId) {
            const results = await workflowRepo
                .updateDocumentWorkflow(
                    dbName,
                    draftCollectionName,
                    collectionName,
                    workflow,
                    docId
                )
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });

            if (workflow && workflow.state === 'approved') {
                try {
                    this.broker
                        .call(
                            'cms.site-publisher.refreshFilteredWebsiteCache',
                            { dbName: dbName, custTypeName: collectionName },
                            { nodeID: PUBLISHER_NODE }
                        )
                        .then((data) => {
                            workflowRepo.UpdateFilteredCustTypesToPublished(dbName, collectionName);
                            logger.info("Website cache successfully refreshed ")
                            return results;
                        })
                        .catch((err) => {
                            logger.info('Error while refresh website cache ' + collectionName)
                            return errorHandlerService.errorHandler(err);
                        });
                } catch (e) {
                    return errorHandlerService.errorHandler(e);
                }
            }
        },

        async getFilteredWorkflows(dbName, query, filter, sorter) {
            return await workflowRepo
                .getFilteredWorkflows(dbName, query, filter, sorter)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getWorkflowState(dbName, id) {
            return await workflowRepo.getWorkflowState(dbName, id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getWorkflows(dbName, idList) {
            return await workflowRepo.getWorkflows(dbName, idList).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getApprovedWorkFlowsCustCollec(dbName) {
            return await workflowRepo.getApprovedWorkFlowsCustCollec(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async UpdateCustTypesToPublished(dbName) {
            return await workflowRepo.UpdateCustTypesToPublished(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getCustomCollectionWorkflows(dbName, collectionName) {
            return await workflowRepo
                .getCustomCollectionWorkflows(dbName, collectionName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async updateTemplateWorkflow(dbName, pageWorkflow, pageID) {
            return await workflowRepo
                .updateTemplateWorkflow(dbName, pageWorkflow, pageID)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async updateBannerWorkflow(dbName, pageWorkflow, pageID) {
            return await workflowRepo
                .updateBannerWorkflow(dbName, pageWorkflow, pageID)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
    },

    async started() {
        logger.info(`SERVICE - ${this.name} - Started.`);
    },

    async stopped() {
        logger.info(`SERVICE - ${this.name} - Stopped.`);
    },
};
