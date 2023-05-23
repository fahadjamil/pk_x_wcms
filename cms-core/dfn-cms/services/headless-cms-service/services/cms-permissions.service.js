const cmsPermissionsRepo = require('../modules/cms-permissions/cms-permissions-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.cms-permissions',

    actions: {
        async getAllCmsUserPermission(ctx) {
            logger.info(`CMS get all CMS user permission called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllCmsUserPermission(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async getAllCmsRole(ctx) {
            logger.info(`CMS get all CMS role called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllCmsRole(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async getApprovedCmsRole(ctx) {
            logger.info(`CMS get all Approved CMS role called. DBName: ${ctx.params.dbName}`);
            const data = await this.getApprovedCmsRole(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async getAllCmsFeatureOperations(ctx) {
            logger.info(`CMS get all CMS feature operations called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllCmsFeatureOperations(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async saveAllFeature(ctx) {
            logger.info(`CMS save all feature called. DBName: ${ctx.params.dbName}`);
            const data = await this.saveAllFeature(ctx.params.dbName, ctx.params.feature);

            return JSON.stringify(data);
        },

        async updateCMSRole(ctx) {
            logger.info(
                `CMS update CMS role called. DBName: ${ctx.params.dbName}, Role: ${JSON.stringify(
                    ctx.params.role
                )}`
            );
            const data = await this.updateCMSRole(ctx.params.dbName, ctx.params.role);

            return JSON.stringify(data);
        },

        async addCMSRole(ctx) {
            logger.info(
                `CMS add CMS role called. DBName: ${ctx.params.dbName}, Role: ${JSON.stringify(
                    ctx.params.role
                )}`
            );
            const data = await this.addCMSRole(ctx.params.dbName, ctx.params.role);

            return JSON.stringify(data);
        },

        async removeCMSRole(ctx) {
            logger.info(
                `CMS remove CMS role called. DBName: ${ctx.params.dbName} Role: ${JSON.stringify(
                    ctx.params.role
                )}`
            );
            const data = await this.removeCMSRole(ctx.params.dbName, ctx.params.role);

            return JSON.stringify(data);
        },

        async getCMSPermissionsForServer(ctx) {
            logger.info(`CMS get CMS permissions for server called.`);
            const data = await this.getCMSPermissionsForServer();

            return JSON.stringify(data);
        },

        async getCMSPermissionsForClient(ctx) {
            logger.info(
                `CMS get CMS permissions for client called. username: ${ctx.params.username}, roleId: ${ctx.params.roleId}`
            );
            const data = await this.getCMSPermissionsForClient(
                ctx.params.roleId,
                ctx.params.username
            );
            return JSON.stringify(data);
        },

        async saveRoleAllowedDocuments(ctx) {
            logger.info(
                `CMS saveRoleAllowedDocuments called. dbName: ${ctx.params.dbName}, roleId: ${ctx.params.roleId}`
            );
            const data = await this.saveRoleAllowedDocuments(
                ctx.params.dbName,
                ctx.params.roleId,
                ctx.params.allowedList,
                ctx.params.allowedTreeList
            );
            return JSON.stringify(data);
        },

        async getRoleAllowedDocuments(ctx) {
            logger.info(
                `CMS getRoleAllowedDocuments called. dbName: ${ctx.params.dbName}, roleId: ${ctx.params.roleId}`
            );
            const data = await this.getRoleAllowedDocuments(ctx.params.dbName, ctx.params.roleId);
            return JSON.stringify(data);
        },
    },

    methods: {
        async getAllCmsUserPermission(dbName) {
            return await cmsPermissionsRepo.getAllCmsUserPermission(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllCmsRole(dbName) {
            return await cmsPermissionsRepo.getAllCmsRole(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getApprovedCmsRole(dbName) {
            return await cmsPermissionsRepo.getApprovedCmsRole(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllCmsFeatureOperations(dbName) {
            return await cmsPermissionsRepo.getAllCmsFeatureOperations(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async saveAllFeature(dbName, feature) {
            return await cmsPermissionsRepo.saveAllFeature(dbName, feature).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async updateCMSRole(dbName, role) {
            return await cmsPermissionsRepo.updateCMSRole(dbName, role).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async addCMSRole(dbName, role) {
            return await cmsPermissionsRepo.addCMSRole(dbName, role).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async removeCMSRole(dbName, role) {
            return await cmsPermissionsRepo.removeCMSRole(dbName, role).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getCMSPermissionsForServer() {
            return await cmsPermissionsRepo.getCMSPermissionsForServer().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getCMSPermissionsForClient(roleId, username) {
            return await cmsPermissionsRepo
                .getCMSPermissionsForClient(roleId, username)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async saveRoleAllowedDocuments(dbName, roleId, allowedList, allowedTreeList) {
            return await cmsPermissionsRepo
                .saveRoleAllowedDocuments(dbName, roleId, allowedList, allowedTreeList)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getRoleAllowedDocuments(dbName, roleId) {
            return await cmsPermissionsRepo
                .getRoleAllowedDocuments(dbName, roleId)
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
