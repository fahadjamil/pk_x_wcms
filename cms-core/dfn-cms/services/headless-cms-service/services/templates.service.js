const templatesRepo = require('../modules/templates/template-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.templates',

    actions: {
        async createTemplate(ctx) {
            logger.info(`CMS create template called. DBName: ${ctx.params.dbName}`);
            const data = await this.createTemplate(ctx.params.dbName, ctx.params.query);

            return JSON.stringify(data);
        },

        async duplicateTemplate(ctx) {
            logger.info(`CMS duplicate template called. DBName: ${ctx.params.dbName}`);
            const data = await this.duplicateTemplate(ctx.params.dbName, ctx.params.query);

            return JSON.stringify(data);
        },

        async getAllTemplates(ctx) {
            logger.info(`CMS get all templates called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllTemplates(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async getAllApprovedTemplates(ctx) {
            logger.info(`CMS get all approved templates called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllApprovedTemplates(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async getTemplate(ctx) {
            logger.info(
                `CMS get template called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id}`
            );
            const data = await this.getTemplate(ctx.params.dbName, ctx.params.id);

            return JSON.stringify(data);
        },

        async getAllTemplateContentData(ctx) {
            logger.info(
                `CMS get all template content data called. DBName: ${
                    ctx.params.dbName
                }, Ids: ${JSON.stringify(ctx.params.idList)}`
            );
            const data = await this.getAllTemplateContentData(ctx.params.dbName, ctx.params.idList);

            return JSON.stringify(data);
        },

        async updateAllTemplateComponentData(ctx) {
            logger.info(
                `CMS update all template component data called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.templateId}`
            );
            const data = await this.updateAllTemplateComponentData(
                ctx.params.dbName,
                ctx.params.templateId,
                ctx.params.updatedTemplateContent
            );

            return JSON.stringify(data);
        },

        async updateTemplate(ctx) {
            logger.info(
                `CMS update template called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.templateId}`
            );
            const data = await this.updateTemplate(
                ctx.params.dbName,
                ctx.params.templateId,
                ctx.params.templateData
            );

            return JSON.stringify(data);
        },

        async uploadTemplateImage(ctx) {
            logger.info(
                `CMS upload template image called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`
            );
            const data = await this.uploadTemplateImage(ctx.params.dbName, ctx.params.fileName);

            return JSON.stringify(data);
        },

        async deleteTemplate(ctx) {
            logger.info(
                `CMS delete template called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.templateId}`
            );
            const data = await this.deleteTemplate(
                ctx.params.dbName,
                ctx.params.templateId,
                ctx.params.templateData,
                ctx.params.deletedBy
            );

            return JSON.stringify(data);
        },

        async getPublishablePagesTemplates(ctx) {
            logger.info(
                `CMS get approved pages templates called. DBName: ${ctx.params.dbName}, Publish level: ${ctx.params.publishLevel}`
            );
            const data = await this.getPublishablePagesTemplates(
                ctx.params.dbName,
                ctx.params.publishLevel
            );

            return JSON.stringify(data);
        },

        async getPublishablePagesTemplatesData(ctx) {
            logger.info(
                `CMS get approved pages templates data called. DBName: ${ctx.params.dbName}, Publish level: ${ctx.params.publishLevel}`
            );
            const data = await this.getPublishablePagesTemplatesData(
                ctx.params.dbName,
                ctx.params.publishLevel
            );

            return JSON.stringify(data);
        },

        async recordLock(ctx) {
            logger.info(
                `CMS template recordLock called. DBName: ${ctx.params.dbName}, templateId: ${ctx.params.templateId}, query: ${ctx.params.query}`
            );
            const data = await this.recordLock(
                ctx.params.dbName,
                ctx.params.templateId,
                ctx.params.query,
                ctx.params.activeUserId
            );

            return JSON.stringify(data);
        },

        async recordUnLock(ctx) {
            logger.info(
                `CMS template recordUnLock called. DBName: ${ctx.params.dbName}, templateId: ${ctx.params.templateId}, query: ${ctx.params.query}`
            );
            const data = await this.recordUnLock(
                ctx.params.dbName,
                ctx.params.templateId,
                ctx.params.query,
                ctx.params.activeUserId
            );

            return JSON.stringify(data);
        },

        async getTemplatesLockingStatus(ctx) {
            logger.info(
                `CMS get templateLockingStatus called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id}`
            );
            const data = await this.getTemplatesLockingStatus(ctx.params.dbName, ctx.params.id);

            return JSON.stringify(data);
        },
    },

    methods: {
        async createTemplate(dbName, query) {
            return await templatesRepo.createTemplate(dbName, query).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async duplicateTemplate(dbName, query) {
            return await templatesRepo.duplicateTemplate(dbName, query).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllTemplates(dbName) {
            return await templatesRepo.getAllTemplates(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllApprovedTemplates(dbName) {
            return await templatesRepo.getAllApprovedTemplates(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getTemplate(dbName, id) {
            return await templatesRepo.getTemplate(dbName, id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllTemplateContentData(dbName, idList) {
            return await templatesRepo.getAllTemplateContentData(dbName, idList).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async updateAllTemplateComponentData(dbName, templateId, updatedTemplateContent) {
            return await templatesRepo
                .updateAllTemplateComponentData(dbName, templateId, updatedTemplateContent)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async updateTemplate(dbName, templateId, templateData) {
            return await templatesRepo
                .updateTemplate(dbName, templateId, templateData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async uploadTemplateImage(dbName, fileName) {
            return await templatesRepo.uploadTemplateImage(dbName, fileName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async deleteTemplate(dbName, templateId, templateData, deletedBy) {
            return await templatesRepo
                .deleteTemplate(dbName, templateId, templateData, deletedBy)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getPublishablePagesTemplates(dbName, publishLevel) {
            return await templatesRepo
                .getPublishablePagesTemplates(dbName, publishLevel)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getPublishablePagesTemplatesData(dbName, publishLevel) {
            return await templatesRepo
                .getPublishablePagesTemplatesData(dbName, publishLevel)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async recordLock(dbName, templateId, query, activeUserId) {
            return await templatesRepo
                .recordLock(dbName, templateId, query, activeUserId)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async recordUnLock(dbName, templateId, query, activeUserId) {
            return await templatesRepo
                .recordUnLock(dbName, templateId, query, activeUserId)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getTemplatesLockingStatus(dbName, id) {
            return await templatesRepo.getTemplatesLockingStatus(dbName, id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
    },

    async started() {
        logger.info(`SERVICE - ${this.name} - Started`);
    },

    async stopped() {
        logger.info(`SERVICE - ${this.name} - Stopped`);
    },
};
