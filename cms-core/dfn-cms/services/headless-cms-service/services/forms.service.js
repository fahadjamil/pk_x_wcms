const formsRepo = require('../modules/forms/forms-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.forms',

    actions: {
       
        async createForm(ctx) {
            logger.info(`CMS create forms called. DBName: ${ctx.params.dbName}`);
            const data = await this.createForm(ctx.params.dbName, ctx.params.formData);

            return JSON.stringify(data);
        },

        async getAllForms(ctx) {
            logger.info(`CMS get all forms called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllForms(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async getSingleFormItem(ctx) {
            logger.info(`CMS getSingleFormItem called. DBName: ${ctx.params.dbName}`);
            const data = await this.getSingleFormItem(
                ctx.params.dbName,
                ctx.params.formId,
                ctx.params.user
            );

            return JSON.stringify(data);
        },

        async getForm(ctx) {
            logger.info(`CMS get forms called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id}`);
            const data = await this.getForm(ctx.params.id, ctx.params.dbName);

            return JSON.stringify(data);
        },

        async updateForm(ctx) {
            logger.info(
                `CMS update forms called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id}`
            );
            const data = await this.updateForm(
                ctx.params.id,
                ctx.params.formData,
                ctx.params.dbName
            );

            return JSON.stringify(data);
        },

        async getApprovedForm(ctx) {
            logger.info(
                `CMS get approved forms called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id}`
            );
            const data = await this.getApprovedForm(ctx.params.id, ctx.params.dbName);

            return JSON.stringify(data);
        },

        async deleteForm(ctx) {
            logger.info(
                `CMS delete forms called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id} , Id: ${ctx.params.workflowId} , Id: ${ctx.params.deletedBy}`
            );
            const data = await this.deleteForm(
                ctx.params.dbName,
                ctx.params.id,
                ctx.params.workflowId,
                ctx.params.deletedBy
            );

            return JSON.stringify(data);
        },
    },

    methods: {
        


        async createForm(dbName, formData) {
            return await formsRepo.createForm(dbName, formData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllForms(dbName) {
            return await formsRepo.getAllForms(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getSingleFormItem(dbName, formId, user) {
            return await formsRepo.getSingleFormItem(dbName, formId, user).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getForm(id, dbName) {
            return await formsRepo.getForm(id, dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async updateForm(formId, formData, dbName) {
            return await formsRepo.updateForm(formId, formData, dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getApprovedForm(id, dbName) {
            return await formsRepo.getApprovedForm(id, dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async deleteForm(dbName, id, workflowId, deletedBy) {
            return await formsRepo.deleteForm(dbName, id, workflowId, deletedBy).catch((error) => {
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
