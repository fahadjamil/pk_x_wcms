const logger = require('../logger/logger').logger;
const errorHandlerService = require('error-handler').errorHandler(logger);
const { exec, execSync } = require('child_process');
const fs = require('fs');
const Client = require('ftp');
const archiver = require('archiver');
const del = require('del');
const ftpClient = new Client();
const { SITEMGR_NODE, WEBSITE_REDIS_URL } = require('./../config/config');
const { ServiceBroker } = require('moleculer');
const brokerOption = JSON.parse(WEBSITE_REDIS_URL);
const brokerWebsite = new ServiceBroker(brokerOption);
const util = require('util');

const {
    FTP_HOST,
    FTP_PORT,
    FTP_USER,
    FTP_PASSWORD,
    ARCHIVE_FOLDER,
    GATSBY_PUBLIC_FOLDER,
    FTP_TIME_OUT,
    GATSBY_CACHE_FOLDER,
} = require('../config/config');

const failResponse = 'failed';
const sucessResponse = 'published';
let isBuildInProgress = false;

const writeFile = util.promisify(fs.writeFile);

function gatsbyBuild() {
    return new Promise(function(resolve, reject) {
        const child = exec('npm run build');

        child.on('exit', resolve);
        child.on('error', reject);

        child.stdout.on('data', function(data) {
            process.stdout.write(data);
            logger.info(data);
        });

        child.stderr.on('data', function(data) {
            process.stderr.write(data);
            logger.error(data);
        });
    });
}

function archivePublicFolder() {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(ARCHIVE_FOLDER + '/public.zip');
        const archive = archiver('zip');
        output.on('close', resolve);
        output.on('end', resolve);
        output.on('error', reject);
        output.on('close', () => {
            console.log(archive.pointer() + ' total bytes');
        });
        output.on('end', () => {
            console.log(archive.pointer() + ' total bytes');
        });

        archive.on('error', reject);
        archive.pipe(output);

        archive.directory(GATSBY_PUBLIC_FOLDER, false).finalize();
    });
}

function connectAndCopyFilesToFtpClient() {
    return new Promise((resolve, reject) => {
        ftpClient.removeAllListeners();

        ftpClient.on('ready', function() {
            console.log('connected to the FTP CLIENT');
            ftpClient.put(ARCHIVE_FOLDER + '/public.zip', 'gatsby.zip', function(error) {
                if (error) {
                    reject(error);
                } else {
                    console.log('Files copied to FTP Client');
                    resolve();
                }
            });
        });

        ftpClient.on('close', reject);
        ftpClient.on('end', reject);
        ftpClient.on('error', reject);

        ftpClient.connect({
            host: FTP_HOST,
            port: FTP_PORT,
            user: FTP_USER,
            password: FTP_PASSWORD,
        });
    });
}

module.exports = {
    name: 'cms.site-publisher',
    server: null,
    hooks: {
        error: {
            // Global error handler
            '*': function(ctx, err) {
                const error = errorHandlerService.errorHandler(err);
            },
        },
    },
    actions: {
        async releaseBuild(ctx) {
            logger.info('Publisher releaseBuild called');
            const data = await this.releaseBuild(ctx.params.dbName, ctx.params.publishLevel);
            return JSON.stringify(data);
        },
        async refreshWebsiteCache(ctx) {
            const dbName = ctx.params.dbName;
            logger.info('Refresh cache called ' + dbName);
            const data = await this.refreshWebsiteCache(dbName);
            return data;
        },
        async refreshFilteredWebsiteCache(ctx) {
            const dbName = ctx.params.dbName;
            const custTypeName = ctx.params.custTypeName;
            logger.info('Refresh cache called ' + dbName);
            const data = await this.refreshFilteredWebsiteCache(dbName, custTypeName);
            return data;
        },
        async isBuildInProgress(ctx) {
            return isBuildInProgress;
        },
    },
    methods: {
        async releaseBuild(dbName, publishLevel) {
            try {
                //Build Process Start
                isBuildInProgress = true;

                const params = { dbName: dbName, publishLevel: publishLevel };

                await writeFile('db_name.txt', JSON.stringify(params), 'utf8');

                logger.info(`CLEAR GATSBY_CACHE_FOLDER ${GATSBY_CACHE_FOLDER}`);
                del.sync([GATSBY_CACHE_FOLDER]);

                const gatsbyExitCode = await gatsbyBuild().catch((error) => {
                    logger.error('GATSBY build Error... !');
                    console.log('GATSBY build Error... !');
                    throw error;
                });

                //Return fail if exit code is not 0
                if (gatsbyExitCode !== 0) {
                    await this.postReleaseProgress(dbName, failResponse);

                    logger.error('GATSBY build Error... !');
                    console.log('GATSBY build Error... !');

                    return failResponse;
                }

                logger.info('GATSBY build completed !');
                console.log('GATSBY build completed !');

                await archivePublicFolder().catch((error) => {
                    logger.error('Archive public folder Error... !');
                    console.log('Archive public folder Error... !');
                    throw error;
                });

                logger.info(
                    'Archiver has been finalized and the output file descriptor has closed.'
                );
                console.log(
                    'Archiver has been finalized and the output file descriptor has closed.'
                );

                await connectAndCopyFilesToFtpClient().catch((error) => {
                    logger.error('FTP File copy Error... !');
                    console.log('FTP File copy Error... !');
                    throw error;
                });

                ftpClient.end();
                ftpClient.removeAllListeners();

                logger.info('FTP Client Closed');
                console.log('FTP Client Closed');

                await new Promise((resolve) => setTimeout(resolve, FTP_TIME_OUT));

                const data = await brokerWebsite
                    .call('cms.site-manager-router.unzippedStaticPages', null, {
                        nodeID: SITEMGR_NODE,
                    })
                    .catch((err) => {
                        logger.error(`Site manger unzip static page error.`);
                        console.log(`Site manger unzip static page error.`);

                        throw err;
                    });

                if (data.status === 'successfull') {
                    logger.info('unzip static page successfull');
                    console.log('unzip static page successfull');

                    await this.postReleaseProgress(dbName, sucessResponse);

                    logger.info('page status changed to published');
                    console.log('page status changed to published');

                    return sucessResponse;
                } else {
                    await this.postReleaseProgress(dbName, failResponse);

                    logger.error('unzip static page error');
                    console.log('unzip static page error');

                    return failResponse;
                }
            } catch (error) {
                errorHandlerService.errorHandler(error);
                await this.postReleaseProgress(dbName, failResponse);

                return failResponse;
            }
        },

        async postReleaseProgress(dbName, status) {
             //End of the Build Process Sucess or Fail
            isBuildInProgress = false;

            await this.broker
                .call('cms.publish-pages.postReleaseProgress', {
                    dbName: dbName,
                    status: status,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });
        },

        async refreshWebsiteCache(dbName) {
            brokerWebsite
                .call(
                    'cms.site-manager-router.refreshWebsiteCache',
                    { dbName: dbName },
                    { nodeID: SITEMGR_NODE }
                )
                .then((data) => {})
                .catch((err) => {
                    logger.error(`Refresh Website cache failed : ${JSON.stringify(err)}`);
                    console.log('Refresh Website cache failed ----', err);
                });
        },

        async refreshFilteredWebsiteCache(dbName, custTypeName){
            brokerWebsite
                .call(
                    'cms.site-manager-router.refreshFilteredWebsiteCache',
                    { dbName: dbName , custTypeName: custTypeName},
                    { nodeID: SITEMGR_NODE }
                )
                .then((data) => {})
                .catch((err) => {
                    logger.error(`Refresh Website cache failed : ${JSON.stringify(err)}`);
                    console.log('Refresh Website cache failed ----', err);
                });
        }
    },

    async started() {
        logger.info(`SERVICE - ${this.name} - Started.`);
        brokerWebsite.start();
        isBuildInProgress = false;
    },

    async stopped() {
        logger.info(`SERVICE - ${this.name} - Stopped.`);
        brokerWebsite.stop();
    },
};
