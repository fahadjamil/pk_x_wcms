const historyRepo = require('../modules/history/history-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.history',

    actions: {
        async getPageHistoryData(ctx) {
            const { dbName, pageId } = ctx.params;
            logger.info(`CMS get page history data called. DBName: ${dbName}, PageId: ${pageId}`);
            const data = await this.getPageHistoryData(dbName, pageId);

            return JSON.stringify(data);
        },

        async checkoutHistoryPage(ctx) {
            const { dbName, title, pageId, version, workflow } = ctx.params;
            logger.info(
                `CMS checkout history page called. DBName: ${dbName}, PageId: ${pageId}, Title: ${title}, Version: ${version}`
            );
            const data = await this.checkoutHistoryPage(dbName, title, version, pageId, workflow);

            return JSON.stringify(data);
        },

        async getDocHistoryData(ctx) {
            const { dbName, collection } = ctx.params;
            logger.info(
                `CMS get doc history data called. DBName: ${dbName}, Collection: ${collection}`
            );
            const data = await this.getDocHistoryData(dbName, collection);

            return JSON.stringify(data);
        },

        async getTemplateHistoryData(ctx) {
            const { dbName, templateId } = ctx.params;
            logger.info(
                `CMS get page template data called. DBName: ${dbName}, PageId: ${templateId}`
            );
            const data = await this.getTemplateHistoryData(dbName, templateId);

            return JSON.stringify(data);
        },

        async checkoutHistoryTemplate(ctx) {
            const { dbName, title, templateId, version, workflow } = ctx.params;
            logger.info(
                `CMS checkout history template called. DBName: ${dbName}, PageId: ${templateId}, Title: ${title}, Version: ${version}`
            );
            const data = await this.checkoutHistoryTemplate(
                dbName,
                title,
                version,
                templateId,
                workflow
            );

            return JSON.stringify(data);
        },

        async getBannerHistoryData(ctx) {
            const { dbName, bannerId } = ctx.params;
            logger.info(
                `CMS get banner hsitory data called. DBName: ${dbName}, bannerId: ${bannerId}`
            );
            const data = await this.getBannerHistoryData(dbName, bannerId);

            return JSON.stringify(data);
        },

        async checkoutHistoryBanner(ctx) {
            const { dbName, title, bannerId, workflow } = ctx.params;
            logger.info(
                `CMS checkout history banner called. DBName: ${dbName}, bannerId: ${bannerId}, Title: ${title}`
            );
            const data = await this.checkoutHistoryBanner(dbName, title, bannerId, workflow);

            return JSON.stringify(data);
        },
    },

    methods: {
        async getPageHistoryData(dbName, pageId) {
            return await historyRepo.getPageHistoryData(dbName, pageId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async checkoutHistoryPage(dbName, title, version, pageId, workflow) {
            return await historyRepo
                .checkoutHistoryPage(dbName, title, version, pageId, workflow)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getDocHistoryData(dbName, collection) {
            return await historyRepo.getDocHistoryData(dbName, collection).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getTemplateHistoryData(dbName, templateId) {
            return await historyRepo.getTemplateHistoryData(dbName, templateId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async checkoutHistoryTemplate(dbName, title, version, templateId, workflow) {
            return await historyRepo
                .checkoutHistoryTemplate(dbName, title, version, templateId, workflow)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getBannerHistoryData(dbName, bannerId) {
            return await historyRepo.getBannerHistoryData(dbName, bannerId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async checkoutHistoryBanner(dbName, title, bannerId, workflow) {
            return await historyRepo
                .checkoutHistoryBanner(dbName, title, bannerId, workflow)
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
