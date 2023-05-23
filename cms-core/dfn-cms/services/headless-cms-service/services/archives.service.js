const archivesRepo = require('../modules/archives/archives-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.archives',

    actions: {
        async getArchivedContent(ctx) {
            const { dbName, searchQ } = ctx.params;
            logger.info(`CMS get Archived Content called. DBName: ${dbName}, searchQ: ${searchQ}`);
            const data = await this.getArchivedContent(dbName, searchQ);

            return JSON.stringify(data);
        },

        async checkoutArchive(ctx) {
            const { dbName, archiveData } = ctx.params;
            logger.info(
                `CMS get checkout Archive  called. DBName: ${dbName}, archiveData: ${archiveData}`
            );
            const data = await this.checkoutArchive(dbName, archiveData);

            return JSON.stringify(data);
        },

        async deleteArchive(ctx) {
            const { dbName, archiveData } = ctx.params;
            logger.info(
                `CMS get delete Archived  called. DBName: ${dbName}, archiveData: ${archiveData}`
            );
            const data = await this.deleteArchive(dbName, archiveData);

            return JSON.stringify(data);
        },
    },

    methods: {
        async getArchivedContent(dbName, searchQ) {
            return await archivesRepo.getArchivedContent(dbName, searchQ).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async checkoutArchive(dbName, archiveData) {
            return await archivesRepo.checkoutArchive(dbName, archiveData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async deleteArchive(dbName, archiveData) {
            return await archivesRepo.deleteArchive(dbName, archiveData).catch((error) => {
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
