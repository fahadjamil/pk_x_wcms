const activityLogsRepo = require('../modules/activity-logs/activity-logs-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.activity-logs',

    actions: {
        async getDocHistoryActivityLogs(ctx) {
            const { dbName, type, collection } = ctx.params;
            logger.info(
                `CMS Doc History activity logs called. DBName: ${dbName}, Type: ${type}, Collection: ${collection}`
            );
            const data = await this.getDocHistoryActivityLogs(dbName, type, collection);

            return JSON.stringify(data);
        },

        async getPageHistoryActivityLogs(ctx) {
            const { dbName, pageId } = ctx.params;
            logger.info(
                `CMS Page History activity logs called. DBName: ${dbName}, PageId: ${pageId}`
            );
            const data = await this.getPageHistoryActivityLogs(dbName, pageId);

            return JSON.stringify(data);
        },

        async getAllActivityLogs(ctx) {
            const { dbName, sortQ, limit, page, searchQ } = ctx.params;
            logger.info(
                `CMS Doc History activity logs called. DBName: ${dbName}, sortQ : ${sortQ}, limit: ${limit} page: ${page}, searchQ: ${searchQ}`
            );
            const data = await this.getAllActivityLogs(dbName, sortQ, limit, page, searchQ);

            return JSON.stringify(data);
        },

        async getTemplateHistoryActivityLogs(ctx) {
            const { dbName, templateId } = ctx.params;
            logger.info(
                `CMS Template History activity logs called. DBName: ${dbName}, TemplateId: ${templateId}`
            );
            const data = await this.getTemplateHistoryActivityLogs(dbName, templateId);

            return JSON.stringify(data);
        },

        async getBannerHistoryActivityLogs(ctx) {
            const { dbName, bannerId } = ctx.params;
            logger.info(
                `CMS Banner History activity logs called. DBName: ${dbName}, bannerId: ${bannerId}`
            );
            const data = await this.getBannerHistoryActivityLogs(dbName, bannerId);

            return JSON.stringify(data);
        },
    },

    methods: {
        async getDocHistoryActivityLogs(dbName, type, collection) {
            return await activityLogsRepo
                .getDocHistoryActivityLogs(dbName, type, collection)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getPageHistoryActivityLogs(dbName, pageId) {
            return await activityLogsRepo
                .getPageHistoryActivityLogs(dbName, pageId)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getAllActivityLogs(dbName, sortQ, limit, page, searchQ) {
            return await activityLogsRepo
                .getAllActivityLogs(dbName, sortQ, limit, page, searchQ)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getTemplateHistoryActivityLogs(dbName, templateId) {
            return await activityLogsRepo
                .getTemplateHistoryActivityLogs(dbName, templateId)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getBannerHistoryActivityLogs(dbName, bannerId) {
            return await activityLogsRepo
                .getBannerHistoryActivityLogs(dbName, bannerId)
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
