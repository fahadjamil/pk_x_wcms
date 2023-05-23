const sitePermissionsRepo = require('../modules/site-permissions/site-permissions-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.site-permissions',

    actions: {
        async getAllRole(ctx) {
            logger.info(`CMS get all role called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllRole(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async updateRole(ctx) {
            logger.info(`CMS update role called. DBName: ${ctx.params.dbName}, Role: ${JSON.stringify(ctx.params.role)}`);
            const data = await this.updateRole(ctx.params.dbName, ctx.params.role);

            return JSON.stringify(data);
        },

        async addRole(ctx) {
            logger.info(`CMS add role called. DBName: ${ctx.params.dbName}, Role: ${JSON.stringify(ctx.params.role)}`);
            const data = await this.addRole(ctx.params.dbName, ctx.params.role);

            return JSON.stringify(data);
        },

        async removeRole(ctx) {
            logger.info(`CMS remove role called. DBName: ${ctx.params.dbName}, Role: ${JSON.stringify(ctx.params.role)}`);
            const data = await this.removeRole(ctx.params.dbName, ctx.params.role);

            return JSON.stringify(data);
        },

        async getSitePermissionsForServer(ctx) {
            logger.info(`CMS get site permissions for server called. DBName: ${ctx.params.dbName}`);
            const data = await this.getSitePermissionsForServer(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async getPathsForRole(ctx) {
            logger.info(`CMS get paths for role called. DBName: ${ctx.params.dbName}, RoleId: ${ctx.params.roleId}`);
            const data = await this.getPathsForRole(ctx.params.dbName, ctx.params.roleId);
            return JSON.stringify(data);
        },

        async getSitePermissionsForClient(ctx) {
            logger.info(`CMS get site permissions for client called. DBName: ${ctx.params.dbName}, RoleId: ${ctx.params.roleId}`);
            const data = await this.getSitePermissionsForClient(ctx.params.dbName, ctx.params.roleId);
            return JSON.stringify(data);
        },
    },

    methods: {
        async getAllRole(dbName) {
            return await sitePermissionsRepo.getAllRole(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async updateRole(dbName, role) {
            return await sitePermissionsRepo.updateRole(dbName, role).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async addRole(dbName, role) {
            return await sitePermissionsRepo.addRole(dbName, role).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async removeRole(dbName, role) {
            return await sitePermissionsRepo.removeRole(dbName, role).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getSitePermissionsForServer(dbName) {
            return await sitePermissionsRepo.getSitePermissionsForServer(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getPathsForRole(dbName, roleId) {
            return await sitePermissionsRepo.getPathsForRole(dbName, roleId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getSitePermissionsForClient(dbName, roleId) {
            return await sitePermissionsRepo.getSitePermissionsForClient(dbName, roleId).catch((error) => {
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
