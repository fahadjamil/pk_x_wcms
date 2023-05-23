const masterInfoRepo = require('../modules/master-info/master-info-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.master-info',

    actions: {
        async getAllMasterInfo(ctx) {
            logger.info('CMS get all master info called.');
            const data = await this.getAllMasterInfo();

            return JSON.stringify(data);
        },

        async updateMasterInfo(ctx) {
            logger.info(`CMS update master info called. ID: ${ctx.params.id}`);
            const data = await this.updateMasterInfo(ctx.params.updatedData, ctx.params.id);

            return JSON.stringify(data);
        },
    },

    methods: {
        async getAllMasterInfo() {
            return await masterInfoRepo.getAllMasterInfo().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async updateMasterInfo(updateData, id) {
            return await masterInfoRepo.updateMasterInfo(updateData, id).catch((error) => {
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
