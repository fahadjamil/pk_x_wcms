//var ftpd = require('ftpd');
const extract = require('extract-zip');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('error-handler').errorHandler(logger);
const { FTP_ROOT_FOLDER, FTP_STATIC_FOLDER } = require('./../config/config');
const cache = require('cache');

module.exports = {
    name: 'cms.site-manager-router',
    server: null,
    hooks: {
        error: {
            // Global error handler
            '*': function (ctx, err) {
                const error = errorHandlerService.errorHandler(err);
            },
        },
    },
    actions: {
        async unzippedStaticPages() {
            logger.info('Site manager unzipped static pages called.');
            const data = await this.unzippedStaticPages();
            return data;
        },
        async refreshWebsiteCache(ctx) {
            const dbName = ctx.params.dbName;
            logger.info('Refresh website cache called ' + dbName);
            const data = await this.refreshWebsiteCache(dbName);
            return data;
        },
        async refreshFilteredWebsiteCache(ctx) {
            const dbName = ctx.params.dbName;
            const custTypeName = ctx.params.custTypeName;
            logger.info('Refresh website filtered cache called ' + dbName+ ', custType '+custTypeName);
            const data = await this.refreshFilteredWebsiteCache(dbName, custTypeName);
            return data;
        },
    },
    methods: {
        async unzippedStaticPages() {
            try {
                const targetPath = FTP_ROOT_FOLDER + '/gatsby.zip';
                const unpackPath = FTP_STATIC_FOLDER;

                const resolve = require('path').resolve;
                var resolvedUnpackPath = resolve(unpackPath);
                logger.info(`Resolved unpack path: ${resolvedUnpackPath}`);

                await extract(targetPath, { dir: resolvedUnpackPath });

                const data = await this.broker.call('app-server-web-router.deleteCmsDocsFolder');

                console.log('app-server-web-router.deleteCmsDocsFolder return--', data);
                logger.info(`app-server-web-router.deleteCmsDocsFolder return : ${data}`);    

                return {status: 'successfull', error: undefined};
            } catch (err) {
                errorHandlerService.errorHandler(err);
                return {status: 'error', error: err};
            }
        },
        async refreshWebsiteCache(dbName) {
            try {
                let data = await cache.getCache().getAllKeys();
                data.forEach(async (key) => {
                    // if(key === 'site-user-sessions' || key === 'site-permissions' || key === 'subscription-mapping'){
                    if (key === 'site-user-sessions') {
                        console.log('Bypass delete cache ----------', key);
                    } else {
                        console.log('cache cleared custom collections----------', key);
                        await cache.getCache().deleteFromCash(key);
                    }
                });                
                await cache.getCache().deleteFromCash('Banner-Text');
                console.log('cache cleared Banner-Text');
                await cache.getCache().deleteFromCash('menu-obj');
                console.log('Menu cache cleared');

                this.broker
                    .call('cms.workflow.UpdateCustTypesToPublished', {
                        dbName: dbName,
                    })
                    .then((data) => {
                        console.log('Custom Type status changed to published ----', data);
                    });

                this.broker
                    .call('web-router.getSitePermissionsForServer', { dbName: dbName })
                    .then((data) => {
                        logger.info('Refresh website server permissions');
                    })
                    .catch((err) => {
                        errorHandler.errorHandler(err);
                    });

                this.broker
                    .call('app-server.auth.refreshSubscriptionMapping')
                    .then((data) => {
                        logger.info('Refresh website server subscription mapping');
                    })
                    .catch((err) => {
                        errorHandler.errorHandler(err);
                    });
            } catch (error) {
                logger.info('Error while refresh cache ');
            }
        },
        async refreshFilteredWebsiteCache(dbName, custTypeName){
            console.log('cache cleared custom collections----------', custTypeName);
            await cache.getCache().deleteFromCash(custTypeName);
        },
    },
    async started() {
        logger.info(`SERVICE - ${this.name} - Started.`);
        //this.startFtpServer(); removed the ftrp server from molecular
    },

    async stopped() {
        logger.info(`SERVICE - ${this.name} - Stopped.`);
    },
};
