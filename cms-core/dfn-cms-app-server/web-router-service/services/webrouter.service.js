const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const queryString = require('query-string');
const fetch = require('node-fetch');
const ip = require('ip').address();
const { Readable } = require('stream');
const path = require('path');
const serveStatic = require('serve-static');
const {
    DB_NAME,
    FTP_STATIC_FOLDER,
    ENABLE_AUTHORIZATION,
    CMS_DOCUMENTS,
    RECAPTCHA_SECRET_KEY,
    RECAPTCHA_VERIFY_URL,
    RECAPTCHA_SITE_KEY,
} = require('./../config/config');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const logger = require('../logger/logger').logger;
const errorHandler = require('error-handler').errorHandler(logger);
const cache = require('cache');
const { siteAccessControl } = require('../middleware/SITEAuthorization');
const morgan = require('morgan');
const del = require('del');
const httpRequestLog = function (reqMessage) {
    logger.http(reqMessage);
};

const csrf = require('csurf');

app.use(morgan('combined', { stream: { write: httpRequestLog } }));

const port = 3300;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

var csrfProtection = csrf({
    cookie: true,
});

app.use(cookieParser());

logger.info('Authorization Status ' + ENABLE_AUTHORIZATION);

if (ENABLE_AUTHORIZATION === 'true') {
    console.log('Authorization Enable');
    app.use(siteAccessControl);
}
app.use(fileUpload());

module.exports = {
    name: 'app-server-web-router',
    server: null,
    actions: {
        async deleteCmsDocsFolder() {
            logger.info('Delete CMS-DOCUMENTS folder method called');
            const data = await this.deleteCmsDocsFolder();
            return data;
        },
    },
    methods: {
        startServer(ctx) {
            this.loadSitePermissionsForServer(); //disable backend auth
            console.log('FTP_STATIC_FOLDER', FTP_STATIC_FOLDER);
            console.log('DB_NAME', DB_NAME);
            console.log('CMS_DOCUMENTS', CMS_DOCUMENTS);
            app.use(express.static(path.join(FTP_STATIC_FOLDER)));
            //app.use(express.static(path.join(__dirname, 'staticpages')));
            app.get('/api/updateAccessControl', this.updateAccessControl);

            // CMS-Server Services - Call to cms-server web router
            app.get('/api/cms/getCollectionData', this.cmsServerGetCollectionData);
            app.get('/api/cms/getSingleDocument', this.cmsServerGetSingleDocument);
            app.get('/api/cms/getSingleDocumentById', this.cmsServerGetSingleDocumentById);
            app.get('/api/cms/custom/documents', this.cmsServerGetDocsByCollectionAndId);
            app.get('/api/cms/collection/history', this.cmsServerGetDocumentHistory);
            app.get('/api/customCollections/last/meta', this.cmsServerGetCustomCollectionMeta);
            // app.post('/api/customCollections/add-record', this.cmsServerAddCustomCollectionData); //custom-collections
            app.post('/api/cms/add-record', this.cmsServerInsertRecord);
            app.post('/api/custom-collections/documents/upload', this.uploadDocument); //custom-collections

            // Forms module specific route
            app.post('/api/customCollections/add-record', this.cmsServerAddDynamicFormsData);
            app.get('/api/site/getValidationKey', this.getRecaptchaSiteKey);

            // App Data Services
            app.get('/api/getSampleResponse', this.getSampleResponse); // TODO: Remove temp service
            app.get('/api/web/collection-data-by-lang', this.collectionDataByLang);
            app.get('/api/web/kuwaiti-banks-holding-summary', this.kuwaitiBanksHoldingSummary);
            app.get('/api/web/kuwaiti-banks-holding-detail', this.kuwaitiBanksHoldingDetail);
            app.get('/api/web/market-makers', this.marketMakers);
            app.post('/api/web/contact-us', this.contactUs);

            // Auth Services
            app.post('/api/web/auth/register', this.register);
            app.get('/api/web/auth/activate-account', this.activateAccount);
            app.get('/api/web/auth/login', this.loginOld);
            app.get('/api/web/auth/logout', this.logoutOld);
            app.post('/api/web/auth/login', this.login);
            app.post('/api/web/auth/logout', this.logout);
            app.post('/api/web/auth/change-password', this.changePassword);
            app.post('/api/web/auth/forgot-password', this.forgotPassword);
            app.post('/api/web/auth/otp-validation', this.otpValidation);
            app.post('/api/web/auth/contact-us', this.contactUsMobile); // TODO: Remove this service

            // User Management Services
            // app.get('/api/web/user-management/user-details-by-email', this.userDetailsByEmail);
            // app.get('/api/web/user-management/user-details-by-reg-date', this.userDetailsByRegDate);
            // app.post('/api/web/user-management/resend-activation-link', this.resendActivationLink);
            // app.post('/api/web/user-management/activate-user', this.activateUser);

            // Product Subscription Services
            app.get('/api/web/subscription/product-details', this.productDetails);
            app.post('/api/web/subscription/product-subscription', this.productSubscription);

            app.get('/api/menus', this.getAllMenu);
            app.get('/api/getPermissions', this.getSitePermissionsForClient);

            app.get('/api/page-data/getImage/:dbname/:filename', this.cmsServerGetImage);
            app.get('/api/documents/:dbname/:filename', this.cmsServerGetDocument);
            app.get('/api/posts/:dbname/:filename', this.cmsServerGetDocument);

            app.get('/api/banner', this.getBannerDetials);
            app.get('/api/tree', this.getTreeViewDetials);
            app.get('/api/tree/collection', this.getTreeCustomCollectionsData);
            app.get('/api/tree/search', this.getTreeSearchDetials);

            //services - site search
            app.get('/api/site-search/data', this.getSiteSearchResults);

            //EOP Authentication
            app.post('/api/auth/eop_user_registration', csrfProtection, this.eop_user_registration);
            app.post('/api/auth/eop_user_logIn', csrfProtection, this.eop_user_logIn);
            app.post('/api/auth/eop_forgot_password', this.eop_forgot_password);
            app.get('/api/auth/eop_user', this.eop_user);
            app.post('/api/auth/eop_admin_user_logIn', csrfProtection, this.eop_admin_user_logIn);
            app.get('/api/auth/eop_single_user/:id', this.eop_single_user);
            app.get('/api/auth/eop_registered_user', this.eop_registered_user);

            //EOP Cotegories
            app.post('/api/eop_add_categories', csrfProtection, this.eop_add_categories);
            app.get('/api/eop_show_categories', this.eop_show_categories);
            app.get('/api/eop_show_categories_admin', this.eop_show_categories_admin);
            app.get('/api/eop_show_categories/:id', this.eop_show_single_category);
            app.post('/api/eop_update_category', csrfProtection, this.eop_update_category);
            app.post('/api/eop_delete_category/:id', csrfProtection, this.eop_delete_category);

            //EOP Steps
            app.post('/api/eop_step_num', csrfProtection, this.eop_step_num);
            app.post('/api/eop_step_item', csrfProtection, this.eop_step_item);
            app.get('/api/eop_show_steps/:id', this.eop_show_steps);
            app.get('/api/eop_show_single_step/:id', this.eop_show_single_step);
            app.post('/api/eop_update_step_num', csrfProtection, this.eop_update_step_num);
            app.post('/api/eop_update_step_item', csrfProtection, this.eop_update_step_item);
            app.get('/api/eop_show_item/:id', this.eop_show_single_item);
            app.post('/api/eop_update_item', csrfProtection, this.eop_update_item);
            app.get('/api/eop_show_category/:id', this.eop_show_category);

            //EOP User Management
            app.post('/api/eop_role', csrfProtection, this.eop_role);
            app.get('/api/eop_show_role', this.eop_show_role);
            app.post('/api/eop_user_designation', csrfProtection, this.eop_user_designation);
            app.get('/api/eop_show_user_designation', this.eop_show_user_designation);
            app.get('/api/eop_show_single_designation/:id', this.eop_show_single_designation);
            app.post('/api/eop_update_designation', csrfProtection, this.eop_update_designation);
            app.post('/api/eop_user_department', csrfProtection, this.eop_user_department);
            app.get('/api/eop_show_user_department', this.eop_show_user_department);
            app.post('/api/eop_add_user', csrfProtection, this.eop_add_user);
            app.get('/api/eop_role_listing', this.eop_role_listing);
            app.get('/api/eop_single_role_listing/:id', this.eop_single_role_listing);
            app.get('/api/eop_single_user_listing/:id', this.eop_single_user_listing);
            app.post('/api/eop_update_user_role', csrfProtection, this.eop_update_user_role);
            app.get('/api/eop_show_departments/:id', this.eop_show_single_department);
            app.post('/api/eop_update_department', csrfProtection, this.eop_update_department);
            app.post('/api/eop_delete_designation', csrfProtection, this.eop_delete_designation);
            app.post('/api/eop_delete_department', csrfProtection, this.eop_delete_department);
            app.post('/api/eop_delete_role', csrfProtection, this.eop_delete_role);
            app.post('/api/eop_delete_eopUser', csrfProtection, this.eop_delete_eopUser);

            //EOP User Management
            app.get('/api/eop_get_form_data/:id', this.eop_get_form_data);
            app.post(
                '/api/eop_application_submissions',
                csrfProtection,
                this.eop_application_submissions
            );
            app.post('/api/submited_applications', csrfProtection, this.submited_applications);
            app.get('/api/submited_application/:id', this.submited_application);
            app.get('/api/eop_application_document/:filename', this.eop_createReadStreamFromFile);
            app.post('/api/eop_edit_application', csrfProtection, this.eop_edit_application);
            app.get('/api/eop_configuraion', this.eop_configuraion);

            //Reports
            app.post('/api/applications_report', csrfProtection, this.applications_report);
            app.post(
                '/api/categories_applications_report',
                csrfProtection,
                this.categories_applications_report
            );
            app.post('/api/css_track_and_monitor', csrfProtection, this.css_track_and_monitor);
            app.post('/api/death_noc_report', csrfProtection, this.death_noc_report);
            app.get('/api/reason_of_death', this.reason_of_death);
            app.get('/api/place_of_death', this.place_of_death);

            //Eop pages
            app.get('/api/eop_get_pages', this.eop_get_pages);

            //Eop Workflow Configuration
            app.post('/api/eop_approval_workflow', csrfProtection, this.eop_approval_workflow);
            app.get('/api/eop_approval_workflow/:id', this.eop_show_approval_workflow);

            //Eop Application Workflow Configuration
            app.post('/api/eop_application_pick', csrfProtection, this.eop_application_pick);
            app.post('/api/eop_application_reject', csrfProtection, this.eop_application_reject);
            app.post('/api/eop_application_approved', csrfProtection, this.eop_application_approved);
            app.post('/api/eop_application_askinfo', csrfProtection, this.eop_application_askinfo);
            app.post('/api/eop_application_review_update', csrfProtection, this.eop_application_review_update);
            app.get('/api/eop_application_comments/:id', this.eop_application_comments);

            //Eop Role Permission
            app.post(
                '/api/eop_add_role_permissions',
                csrfProtection,
                this.eop_add_role_permissions
            );
            app.get('/api/eop_show_role_permissions/:id', this.eop_show_role_permissions);
            app.get('/api/eop_get_permissions', this.eop_get_permissions);
            app.get('/api/eop_get_resources', this.eop_get_resources);
            app.get('/api/eop_check_role_permission/:id', this.eop_check_role_permission);

            //CSS Dashboard
            app.get('/api/css_portal_pieChart', this.css_portal_pieChart);
            app.get('/api/css_portal_barChart', this.css_portal_barChart);
            app.get('/api/eop_myInbox/:id', this.eop_myInbox);
            app.get('/api/eop_myInbox_count/:id', this.eop_myInbox_count);
            app.post('/api/eop_mark_read', csrfProtection, this.eop_mark_read);
            app.post('/api/eop_mark_unread', csrfProtection, this.eop_mark_unread);

            //CSRF Tokens
            app.get('/getCSRFToken', csrfProtection, this.CSRFToken);

            //Payment Getway
            app.post('/api/eop_payment_getway', csrfProtection, this.eop_payment_getway);
            app.get('/api/eop_voucher_list', this.eop_voucher_list);
            app.get('/api/eop_voucher/:id', this.eop_voucher);
            app.post('/api/eop_mark_paid', csrfProtection, this.eop_mark_paid);
            app.post('/api/eop_mark_refund', csrfProtection, this.eop_mark_refund);

            //Error handling middlewear
            app.use(errorHandler.serviceErrorHandler);

            this.server = app.listen(port, () =>
                console.log(`Example app listening at http://localhost:${port}`)
            );
        },

        // Common method to validate google recaptch token
        async isRecaptchaValidationSuccess(token, remoteAddress) {
            try {
                // Secret key
                const secretKey = RECAPTCHA_SECRET_KEY; // Version 2

                // Verify URL
                const query = queryString.stringify({
                    secret: secretKey,
                    response: token,
                    remoteip: remoteAddress,
                });

                const verifyURL = `${RECAPTCHA_VERIFY_URL}${query}`;

                // Make a request to verifyURL
                const body = await fetch(verifyURL).then((res) => res.json());

                // If not successful
                if (body.success !== undefined && !body.success) {
                    return false;
                }

                // If successful
                return true;
            } catch (err) {
                errorHandler.errorHandler(err);
                return false;
            }
        },

        async getRecaptchaSiteKey(req, res, next) {
            if (RECAPTCHA_SITE_KEY && RECAPTCHA_SITE_KEY != '') {
                res.send({
                    status: 'success',
                    key: RECAPTCHA_SITE_KEY,
                });
            } else {
                res.send({
                    status: 'failed',
                    key: undefined,
                });
            }
        },

        async deleteCmsDocsFolder() {
            try {
                del.sync([CMS_DOCUMENTS]);
                logger.info(`Delete CMS_DOCUMENTS folder: ${CMS_DOCUMENTS}`);
                console.log('Delete CMS_DOCUMENTS folder');
                return 'successfull';
            } catch (err) {
                errorHandler.errorHandler(err);
                return err;
            }
        },

        async getAllMenu(req, res, next) {
            let dbName = DB_NAME;
            let collectionName = 'menu-obj';

            if (await cache.getCache().isExists(collectionName, req.url)) {
                let results = await cache.getCache().getValueFromCacheH(collectionName, req.url);
                if (results) {
                    console.log('from cache - ', collectionName);
                    res.send(results);
                } else {
                    this.broker
                        .call('web-router.getAllMenu', {
                            dbName: dbName,
                        })
                        .then((data) => {
                            cache.getCache().addToCacheH(collectionName, req.url, data);
                            console.log('from DB - ', collectionName);
                            res.send(data);
                        })
                        .catch((err) => {
                            next(err);
                        });
                }
            } else {
                this.broker
                    .call('web-router.getAllMenu', {
                        dbName: dbName,
                    })
                    .then((data) => {
                        cache.getCache().addToCacheH(collectionName, req.url, data);
                        console.log('from DB - ', collectionName);
                        res.send(data);
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
        },

        async getSitePermissionsForClient(req, res, next) {
            const dbName = DB_NAME;
            const roleId = 1; //TODO : this one need to get from session
            let collectionName = 'menu-obj';
            let menus;

            menus = await cache.getCache().getValueFromCacheH(collectionName, '/api/menus');
            await this.updateMenuFromDB(menus, collectionName, dbName, req.url)
                .then(async (data) => {
                    const obj = JSON.parse(data);
                    const results = await this.getSitePermissionsForClientMethod(
                        dbName,
                        roleId,
                        obj
                    );
                    console.log('Path for site user : ' + JSON.stringify(results));
                    res.send(results);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateAccessControl(req, res, next) {
            const dbName = req.query.dbName;
            //TODO: need to implement.
        },

        async cmsServerAddCustomCollectionData(req, res, next) {
            const query = req.body.data;
            const dbName = req.body.nameSpace;
            const collectionName = req.body.collectionName;
            delete req.body.dbName;

            this.broker
                .call('web-router.appServerAddCustomCollectionData', {
                    dbName: dbName,
                    query: query,
                    collectionName: collectionName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async cmsServerAddDynamicFormsData(req, res, next) {
            const query = req.body.data;
            const dbName = req.body.nameSpace;
            const collectionName = req.body.collectionName;
            const token = req.body.token;
            const remoteAddress = req.socket.remoteAddress;
            delete req.body.dbName;

            if (token && token != '' && remoteAddress) {
                const isValid = await this.isRecaptchaValidationSuccess(token, remoteAddress);

                if (isValid) {
                    this.broker
                        .call('web-router.appServerAddCustomCollectionData', {
                            dbName: dbName,
                            query: query,
                            collectionName: collectionName,
                        })
                        .then((data) => {
                            res.send(data);
                        })
                        .catch((err) => {
                            next(err);
                        });
                } else {
                    res.send({
                        status: 'failed',
                        msg: 'Recaptcha validation failed',
                    });
                }
            } else {
                res.send({
                    status: 'failed',
                    msg: 'Invalid recaptcha token',
                });
            }
        },

        async cmsServerGetCollectionData(req, res, next) {
            const query = req.query.searchQuery ? JSON.parse(req.query.searchQuery) : {};
            const sorter = req.query.sorter ? JSON.parse(req.query.sorter) : {};
            const dbName = req.query.nameSpace;
            const collectionName = req.query.collectionName;

            if (await cache.getCache().isExists(collectionName, req.url)) {
                let results = await cache.getCache().getValueFromCacheH(collectionName, req.url);
                console.log('from cache - ', collectionName);
                res.send(results);
            } else {
                this.broker
                    .call('web-router.appServerGetCollectionData', {
                        dbName: dbName,
                        query: query,
                        sorter: sorter,
                        collectionName: collectionName,
                    })
                    .then((data) => {
                        cache.getCache().addToCacheH(collectionName, req.url, data);
                        console.log('from DB - ', collectionName);
                        res.send(data);
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
        },

        async cmsServerGetSingleDocument(req, res, next) {
            const query = req.query.searchQuery ? req.query.searchQuery : {};
            const dbName = req.query.dbName;
            const collectionName = req.query.collectionName;

            this.broker
                .call('web-router.appServerGetSingleDocument', {
                    dbName: dbName,
                    query: query,
                    collectionName: collectionName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async cmsServerGetSingleDocumentById(req, res, next) {
            const query = req.query.searchId ? req.query.searchId : '';
            const dbName = req.query.nameSpace;
            const collectionName = req.query.collectionName;

            this.broker
                .call('web-router.appServerGetSingleDocumentById', {
                    dbName: dbName,
                    query: query,
                    collectionName: collectionName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async cmsServerGetDocsByCollectionAndId(req, res, next) {
            const mappingQuery = req.query.mappingQuery;
            const dbName = req.query.nameSpace;

            this.broker
                .call('web-router.cmsServerGetDocsByCollectionAndId', {
                    dbName: dbName,
                    mappingQuery: mappingQuery,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async cmsServerGetDocumentHistory(req, res, next) {
            const dbName = req.query.nameSpace;
            const id = req.query.id;
            const collection = req.query.collection;
            const limit = req.query.limit;

            this.broker
                .call('web-router.cmsServerGetDocumentHistory', {
                    dbName: dbName,
                    id: id,
                    collection: collection,
                    limit: limit,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async cmsServerGetCustomCollectionMeta(req, res, next) {
            const dbName = req.query.nameSpace;
            const collection = req.query.collection;

            this.broker
                .call('web-router.cmsServerGetCustomCollectionMeta', {
                    dbName: dbName,
                    collection: collection,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async cmsServerGetImage(req, res, next) {
            const fileName = req.params.filename;
            const dbName = req.params.dbname;

            let fPath = path.join(CMS_DOCUMENTS, '/', fileName);
            console.log('fPath ----------', fPath);

            if (!fs.existsSync(CMS_DOCUMENTS)) {
                fs.mkdirSync(CMS_DOCUMENTS);
            }

            try {
                if (fs.existsSync(fPath)) {
                    console.log('File From Server');
                    let readStream = fs.createReadStream(fPath);
                    readStream.on('open', function () {
                        readStream.pipe(res);
                    });
                } else {
                    console.log('File From DB');
                    console.log(fileName, dbName);
                    this.broker
                        .call('web-router.appServerGetImage', {
                            dbName: dbName,
                            fileName: fileName,
                        })
                        .then((data) => {
                            data.pipe(res);
                            let writeStream = fs.createWriteStream(fPath);
                            data.pipe(writeStream);
                        })
                        .catch((err) => {
                            next(err);
                        });
                }
            } catch (err) {
                console.error(err);
            }
        },

        async cmsServerGetDocument(req, res, next) {
            const fileName = req.params.filename;
            const dbName = req.params.dbname;

            let fPath = path.join(CMS_DOCUMENTS, '/', fileName);
            console.log('fPath ----------', fPath);

            if (!fs.existsSync(CMS_DOCUMENTS)) {
                fs.mkdirSync(CMS_DOCUMENTS);
            }

            try {
                if (fs.existsSync(fPath)) {
                    console.log('File From Server');
                    let readStream = fs.createReadStream(fPath);
                    readStream.on('open', function () {
                        readStream.pipe(res);
                    });
                } else {
                    console.log('File From DB');
                    console.log(fileName, dbName);
                    this.broker
                        .call('web-router.appServerGetDocument', {
                            dbName: dbName,
                            fileName: fileName,
                        })
                        .then((data) => {
                            data.pipe(res);
                            let writeStream = fs.createWriteStream(fPath);
                            data.pipe(writeStream);
                        })
                        .catch((err) => {
                            next(err);
                        });
                }
            } catch (err) {
                console.error(err);
            }
        },

        getSampleResponse(req, res, next) {
            let type;
            for (let paramName in req.query) {
                if (type) {
                    type = type + '_' + req.query[paramName];
                } else {
                    type = req.query[paramName];
                }
            }

            fs.readFile('config/sample-responses.json', (err, data) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                }

                const responses = JSON.parse(data);

                const filterdResponse = responses.filter(function (item) {
                    return item.key == type;
                });

                if (filterdResponse[0]) {
                    res.send(filterdResponse[0]['value']);
                } else {
                    res.send({});
                }
            });
        },

        async collectionDataByLang(req, res, next) {
            const dbName = DB_NAME;
            const language = req.query.lang;
            let collection = req.query.collection;
            const sortBy = req.query.sortBy;
            const sortType = req.query.sortType;
            const field = req.query.field;
            const value = req.query.value;
            const filterType = req.query.filterType;
            const limit = req.query.limit;

            if (await cache.getCache().isExists(collection, req.url)) {
                let results = await cache.getCache().getValueFromCacheH(collection, req.url);
                console.log('From cache - ' + collection, req.url);
                res.send(results);
            } else {
                this.broker
                    .call('app-server.dynamic-content.app-data.collectionDataByLang', {
                        dbName: dbName,
                        language: language,
                        collection: collection,
                        sortBy: sortBy,
                        sortType: sortType,
                        field: field,
                        value: value,
                        filterType: filterType,
                        limit: limit,
                    })
                    .then((data) => {
                        cache.getCache().addToCacheH(collection, req.url, data);
                        console.log('From DB - ' + collection, req.url);
                        res.send(data);
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
        },

        async kuwaitiBanksHoldingSummary(req, res, next) {
            const dbName = DB_NAME;
            const collection = 'docs-holdings-in-kuwaiti-banks';

            if (await cache.getCache().isExists(collection, req.url)) {
                let results = await cache.getCache().getValueFromCacheH(collection, req.url);
                console.log('From cache - ' + collection, req.url);
                res.send(results);
            } else {
                this.broker
                    .call('app-server.dynamic-content.app-data.kuwaitiBanksHoldingSummary', {
                        dbName: dbName,
                        collection: collection,
                    })
                    .then((data) => {
                        cache.getCache().addToCacheH(collection, req.url, data);
                        console.log('From DB - ' + collection, req.url);
                        res.send(data);
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
        },

        async kuwaitiBanksHoldingDetail(req, res, next) {
            const dbName = DB_NAME;
            const collection = 'docs-holdings-in-kuwaiti-banks';
            const language = req.query.lang;
            const year = req.query.year;
            const month = req.query.month;

            if (await cache.getCache().isExists(collection, req.url)) {
                let results = await cache.getCache().getValueFromCacheH(collection, req.url);
                console.log('From cache - ' + collection, req.url);
                res.send(results);
            } else {
                this.broker
                    .call('app-server.dynamic-content.app-data.kuwaitiBanksHoldingDetail', {
                        dbName: dbName,
                        language: language,
                        collection: collection,
                        year: year,
                        month: month,
                    })
                    .then((data) => {
                        cache.getCache().addToCacheH(collection, req.url, data);
                        console.log('From DB - ' + collection, req.url);
                        res.send(data);
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
        },

        async marketMakers(req, res, next) {
            const dbName = DB_NAME;
            const language = req.query.lang;
            const marketMakersCollection = 'docs-market-makers';
            const securitiesCollection = 'docs-market-maker-securities';

            if (
                (await cache.getCache().isExists(marketMakersCollection, req.url)) &&
                (await cache.getCache().isExists(securitiesCollection, req.url))
            ) {
                let results = await cache
                    .getCache()
                    .getValueFromCacheH(marketMakersCollection, req.url);
                console.log('From cache - ' + marketMakersCollection, req.url);
                console.log('From cache - ' + securitiesCollection, req.url);

                res.send(results);
            } else {
                this.broker
                    .call('app-server.dynamic-content.app-data.marketMakers', {
                        dbName: dbName,
                        language: language,
                        marketMakersCollection: marketMakersCollection,
                        securitiesCollection: securitiesCollection,
                    })
                    .then((data) => {
                        cache.getCache().addToCacheH(marketMakersCollection, req.url, data);
                        cache.getCache().addToCacheH(securitiesCollection, req.url, data);
                        console.log('From DB - ' + marketMakersCollection, req.url);
                        console.log('From DB - ' + securitiesCollection, req.url);
                        res.send(data);
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
        },

        async contactUs(req, res, next) {
            const name = req.body.name;
            const email = req.body.email;
            const mobileNo = req.body.mobileNo;
            const message = req.body.message;
            const contactUsType = req.body.type;

            this.broker
                .call('app-server.dynamic-content.app-data.contactUs', {
                    name: name,
                    email: email,
                    mobileNo: mobileNo,
                    message: message,
                    contactUsType: contactUsType,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async cmsServerInsertRecord(req, res, next) {
            const data = req.body.data;
            const collectionName = req.body.collectionName;
            const dbName = req.body.nameSpace;

            this.broker
                .call('web-router.appServerInsertRecord', {
                    data: data,
                    collectionName: collectionName,
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async uploadDocument(req, res, next) {
            try {
                if (req.files === null) {
                    return res.status(400).json({ msg: 'No file uploaded!' });
                }

                const file = req.files.file;
                const dbName = req.body.nameSpace;

                this.broker
                    .call('web-router.appServerUploadDocument', {
                        file: file,
                        dbName: dbName,
                    })
                    .then((data) => {
                        res.send(data);
                    })
                    .catch((err) => {
                        next(err);
                    });
            } catch (error) {
                next(error);
            }
        },

        async register(req, res, next) {
            const { name, email, password, password2, lang, prodId } = req.body;

            this.broker
                .call('app-server.auth.register', {
                    name: name,
                    email: email,
                    password: password,
                    password2: password2,
                    lang: lang,
                    prodId: prodId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async activateAccount(req, res, next) {
            const { code, prodId } = req.query;

            this.broker
                .call('app-server.auth.activateAccount', {
                    activationCode: code,
                    prodId: prodId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async loginOld(req, res, next) {
            const { email, password, prodId } = req.query;

            this.broker
                .call('app-server.auth.login', {
                    email: email,
                    password: password,
                    prodId: prodId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async logoutOld(req, res, next) {
            const { email, prodId, sessionId } = req.query;

            this.broker
                .call('app-server.auth.logout', {
                    email: email,
                    prodId: prodId,
                    sessionId: sessionId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async login(req, res, next) {
            const { email, password, prodId } = req.body;

            this.broker
                .call('app-server.auth.login', {
                    email: email,
                    password: password,
                    prodId: prodId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async logout(req, res, next) {
            const { email, prodId, sessionId } = req.body;

            this.broker
                .call('app-server.auth.logout', {
                    email: email,
                    prodId: prodId,
                    sessionId: sessionId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async changePassword(req, res, next) {
            const { userName, oldPassword, newPassword, newPassword2, prodId } = req.body;

            this.broker
                .call('app-server.auth.changePassword', {
                    userName: userName,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    newPassword2: newPassword2,
                    prodId: prodId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async forgotPassword(req, res, next) {
            const { email, prodId } = req.body;

            this.broker
                .call('app-server.auth.forgotPassword', {
                    email: email,
                    prodId: prodId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async otpValidation(req, res, next) {
            const { email, otp, newPassword, newPassword2, prodId } = req.body;

            this.broker
                .call('app-server.auth.otpValidation', {
                    email: email,
                    otp: otp,
                    newPassword: newPassword,
                    newPassword2: newPassword2,
                    prodId: prodId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async contactUsMobile(req, res, next) {
            const { email, message } = req.body;

            this.broker
                .call('app-server.auth.contactUs', {
                    email: email,
                    message: message,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async userDetailsByEmail(req, res, next) {
            const { email } = req.query;

            this.broker
                .call('app-server.user-management.userDetailsByEmail', {
                    email: email,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async userDetailsByRegDate(req, res, next) {
            const { regDate } = req.query;

            this.broker
                .call('app-server.user-management.userDetailsByRegDate', {
                    regDate: regDate,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async resendActivationLink(req, res, next) {
            const { email, lang } = req.body;

            this.broker
                .call('app-server.user-management.resendActivationLink', {
                    email: email,
                    lang: lang,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async activateUser(req, res, next) {
            const { email } = req.body;

            this.broker
                .call('app-server.user-management.activateUser', {
                    email: email,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async productDetails(req, res, next) {
            const loginId = req.query.loginId;

            this.broker
                .call('app-server.subscription.productDetails', { loginId: loginId })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async productSubscription(req, res, next) {
            const { loginId, paybleAmount, subscriptions, lang } = req.body;

            this.broker
                .call('app-server.subscription.productSubscription', {
                    loginId: loginId,
                    paybleAmount: paybleAmount,
                    subscriptions: subscriptions,
                    lang: lang,
                })
                .then((data) => {
                    console.log('Response : ' + JSON.stringify(data));
                    if (data.hasOwnProperty('response_url') && data.response_url) {
                        res.redirect(data.response_url);
                    } else {
                        res.send(data);
                    }
                })
                .catch((err) => {
                    logger.info('Error : ' + err);
                    next(err);
                });
        },

        async loadSitePermissionsForServer() {
            try {
                this.broker
                    .waitForServices('web-router')
                    .then(() => {
                        this.broker
                            .call('web-router.getSitePermissionsForServer', { dbName: DB_NAME })
                            .then((data) => {
                                logger.info('Update site server permissions');
                            })
                            .catch((err) => {
                                errorHandler.errorHandler(err);
                            });
                    })
                    .catch((err) => {
                        errorHandler.errorHandler(err);
                    });
            } catch (error) {
                errorHandler.errorHandler(error);
            }
        },

        async getBannerDetials(req, res, next) {
            const dbName = req.query.nameSpace;
            const id = req.query.id;
            const collection = 'Banner-Text';
            if (await cache.getCache().isExists(collection, req.url)) {
                let results = await cache.getCache().getValueFromCacheH(collection, req.url);
                console.log('From cache - ' + collection, req.url);
                res.send(results);
            } else {
                this.broker
                    .call('web-router.getBannerDetails', {
                        id: id,
                        dbName: dbName,
                    })
                    .then((data) => {
                        cache.getCache().addToCacheH(collection, req.url, data);
                        console.log('From DB - ' + collection, req.url);
                        res.send(data);
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
        },

        async getTreeViewDetials(req, res, next) {
            const dbName = req.query.nameSpace;
            const id = req.query.id;
            const collection = 'tree-view';
            if (await cache.getCache().isExists(collection, req.url)) {
                let results = await cache.getCache().getValueFromCacheH(collection, req.url);
                console.log('From cache - ' + collection, req.url);
                res.send(results);
            } else {
                this.broker
                    .call('web-router.getTreeViewDetials', {
                        id: id,
                        dbName: dbName,
                    })
                    .then((data) => {
                        cache.getCache().addToCacheH(collection, req.url, data);
                        console.log('From DB - ' + collection, req.url);
                        res.send(data);
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
        },

        async getTreeSearchDetials(req, res, next) {
            const dbName = req.query.nameSpace;
            const treeId = req.query.treeId;
            const parentNodeIds = req.query.parentNodeIds;
            const keyWord = req.query.keyWord;
            const sorting = req.query.sorting;

            this.broker
                .call('web-router.getTreeSearchDetials', {
                    dbName: dbName,
                    treeId: treeId,
                    parentNodeIds: parentNodeIds,
                    keyWord: keyWord,
                    sorting: sorting,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getSiteSearchResults(req, res, next) {
            const dbName = req.query.nameSpace;
            const keyword = req.query.keyword;
            const langKey = req.query.langKey;
            this.broker
                .call('web-router.getCMSSiteSearchResults', {
                    dbName: dbName,
                    keyword: keyword,
                    langKey: langKey,
                })
                .then((data) => {
                    // cache.getCache().addToCacheH(collection, req.url, data);
                    // console.log('From DB - ' + collection, req.url);
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async getTreeCustomCollectionsData(req, res, next) {
            const dbName = req.query.nameSpace;
            const treeId = req.query.treeId;
            const nodeId = req.query.nodeId;
            const nodePath = req.query.nodePath;

            this.broker
                .call('web-router.getTreeCustomCollectionsData', {
                    dbName: dbName,
                    treeId: treeId,
                    nodeId: nodeId,
                    nodePath: nodePath,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getSitePermissionsForClientMethod(dbName, roleId, data) {
            //const data = await dbDriver.find({}, '', collectionsList.menus, dbName);
            let pathsForRole = [];

            if (data && data.length > 0) {
                let pathStrings = [];
                for (let j = 0; j < data.length; j++) {
                    if (data[j].hasOwnProperty('menu')) {
                        let menuArray = data[j].menu;

                        for (let i = 0; i < menuArray.length; i++) {
                            const obj = menuArray[i];
                            await this.generatePathsForRole(obj, pathStrings, roleId);
                            for (let r = 0; r < pathStrings.length; r++) {
                                pathsForRole.push(pathStrings[r]);
                            }
                            pathStrings = [];
                        }
                    } else {
                        logger.info('Menu not found');
                    }
                }
            }
            return pathsForRole;
        },

        async generatePathsForRole(obj, paths, roleId) {
            if (obj.hasOwnProperty('subLinks')) {
                let objArray = obj.subLinks;
                let pathStr = [];

                for (let i = 0; i < objArray.length; i++) {
                    const objTemp = objArray[i];
                    await this.generatePathsForRole(objTemp, pathStr, roleId);
                    for (let r = 0; r < pathStr.length; r++) {
                        paths.push(pathStr[r]);
                    }
                    pathStr = [];
                }
            }

            if (obj.hasOwnProperty('roles')) {
                if (obj.roles.length > 0) {
                    let rolesArray = obj.roles;
                    if (rolesArray.includes(roleId)) {
                        paths.push(obj.path);
                    } else if (roleId === '-1') {
                        paths.push(obj.path);
                    } else {
                        logger.info(rolesArray);
                        //roleId don't have access to path
                    }
                } else {
                    if (roleId === '-1') {
                        paths.push(obj.path);
                    }
                    //no roles have access to this path
                }
            } else {
                //this one we can thing about free users not authorized
            }
        },

        async updateMenuFromDB(menus, collectionName, dbName, url) {
            if (menus) {
                console.log('from cache - ', collectionName);
            } else {
                await this.broker
                    .call('web-router.getAllMenu', {
                        dbName: dbName,
                    })
                    .then((data) => {
                        cache.getCache().addToCacheH(collectionName, url, data);
                        console.log('from DB - ', collectionName);
                        menus = data;
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
            return menus;
        },
        async eop_user_registration(req, res, next) {
            const formData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_user_registration - method--');
            console.log(formData);
            // console.log(req.body);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_user_registration', {
                    dbName: dbName,
                    formData: formData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_user_logIn(req, res, next) {
            console.log('----eop_user_logIn---Req headers--');
            console.log(JSON.stringify(req.headers));
            const loginData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_user_login - method--');
            console.log(loginData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_user_logIn', {
                    dbName: dbName,
                    loginData: loginData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_forgot_password(req, res, next) {
            const forgetEmail = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_user_login - method--');
            console.log(forgetEmail);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_forgot_password', {
                    dbName: dbName,
                    forgetEmail: forgetEmail,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_admin_user_logIn(req, res, next) {
            const loginData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_admin_user_logIn - method--');
            console.log(loginData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_admin_user_logIn', {
                    dbName: dbName,
                    loginData: loginData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_user(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_user', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_registered_user(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_registered_user', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_add_categories(req, res, next) {
            const categoriesData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_categories - method--');
            console.log(categoriesData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_add_categories', {
                    dbName: dbName,
                    categoriesData: categoriesData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_role(req, res, next) {
            const roleData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_role - method--');
            console.log(roleData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_role', {
                    dbName: dbName,
                    roleData: roleData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_add_user(req, res, next) {
            const userData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_role - method--');
            console.log(userData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_add_user', {
                    dbName: dbName,
                    userData: userData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_add_role_permissions(req, res, next) {
            const permissionData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_permissionData - method--');
            console.log(permissionData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_add_role_permissions', {
                    dbName: dbName,
                    permissionData: permissionData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_approval_workflow(req, res, next) {
            const stepData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_approval_workflow - method--');
            console.log(stepData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_approval_workflow', {
                    dbName: dbName,
                    stepData: stepData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_payment_getway(req, res, next) {
            const paymentData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_payment_getway - method--');
            console.log(paymentData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_payment_getway', {
                    dbName: dbName,
                    paymentData: paymentData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_mark_read(req, res, next) {
            const markData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_mark_read - method--');
            console.log(markData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_mark_read', {
                    dbName: dbName,
                    markData: markData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_mark_unread(req, res, next) {
            const markData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_mark_unread - method--');
            console.log(markData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_mark_unread', {
                    dbName: dbName,
                    markData: markData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_mark_paid(req, res, next) {
            const paymentData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_mark_paid - method--');
            console.log(paymentData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_mark_paid', {
                    dbName: dbName,
                    paymentData: paymentData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_mark_refund(req, res, next) {
            const refundData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_mark_refund - method--');
            console.log(refundData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_mark_refund', {
                    dbName: dbName,
                    refundData: refundData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_application_pick(req, res, next) {
            const pickData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_application_pick - method--');
            console.log(pickData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_application_pick', {
                    dbName: dbName,
                    pickData: pickData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_application_reject(req, res, next) {
            const rejectData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_application_reject - method--');
            console.log(rejectData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_application_reject', {
                    dbName: dbName,
                    rejectData: rejectData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_application_approved(req, res, next) {
            const approvedData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_application_approved - method--');
            console.log(approvedData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_application_approved', {
                    dbName: dbName,
                    approvedData: approvedData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_application_askinfo(req, res, next) {
            const appData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_application_askinfo - method--');
            console.log(appData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_application_askinfo', {
                    dbName: dbName,
                    appData: appData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_application_review_update(req, res, next) {
            const dbName = req.query.dbName;
            console.log('--eop_application_review_update - method--');
            console.log(req.body);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_application_review_update', {
                    dbName: dbName,
                    appData: req.body,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_application_submissions(req, res, next) {
            const applicationData = req.body;

            let files = req.files;
            const dbName = req.query.dbName;
            let items = JSON.parse(applicationData.items);
            console.log('After Assigning to veriable');
            console.log(items);
            console.log(typeof items);
            console.log('--eop_role - method--');
            console.log(applicationData);
            console.log(JSON.parse(applicationData.items));
            console.log(files);
            var UPLOAD_PATH = '/usr/etc/app/uploads';
            for (var file in files) {
                console.log('--file--');
                console.log(file);
                console.log('--file object--');
                console.log(files[file]);

                const extension = path.extname(files[file].name);
                const fileName =
                    applicationData.submit_user +
                    '_' +
                    file +
                    '_' +
                    new Date().getTime() +
                    extension;
                const buffer = Buffer.from(files[file].data);
                console.log('upload path');
                console.log(UPLOAD_PATH);
                console.log('fileName');
                console.log(fileName);

                const fileCreation = await this.createFileFromStream(
                    buffer,
                    `${UPLOAD_PATH}/${fileName}`
                );
                items.push({
                    item_id: file,
                    type: 'file',
                    data: { file_name: fileName, mimetype: files[file].mimetype },
                });
                console.log(items);

                if (fileCreation === 'error') {
                    return JSON.stringify({ msg: 'No file uploaded!' });
                }
            }
            applicationData.items = items;
            console.log(applicationData);

            this.broker
                .call('app-server.dynamic-content.app-data.eop_application_submissions', {
                    dbName: dbName,
                    applicationData: applicationData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_edit_application(req, res, next) {
            const applicationData = req.body;

            let files = req.files;
            const dbName = req.query.dbName;
            let items = JSON.parse(applicationData.items);
            console.log('After Assigning to veriable');
            console.log(items);
            console.log(typeof items);
            console.log('--eop_role - method--');
            console.log(applicationData);
            console.log(JSON.parse(applicationData.items));
            console.log(files);
            var UPLOAD_PATH = '/usr/etc/app/uploads';
            for (var file in files) {
                console.log('--file--');
                console.log(file);
                console.log('--file object--');
                console.log(files[file]);

                const extension = path.extname(files[file].name);
                const fileName =
                    applicationData.update_by +
                    '_' +
                    file +
                    '_' +
                    new Date().getTime() +
                    extension;
                const buffer = Buffer.from(files[file].data);
                console.log('upload path');
                console.log(UPLOAD_PATH);
                console.log('fileName');
                console.log(fileName);

                const fileCreation = await this.createFileFromStream(
                    buffer,
                    `${UPLOAD_PATH}/${fileName}`
                );
                items.push({
                    item_id: file,
                    type: 'file',
                    data: { file_name: fileName, mimetype: files[file].mimetype },
                });
                console.log(items);

                if (fileCreation === 'error') {
                    return JSON.stringify({ msg: 'No file uploaded!' });
                }
            }
            applicationData.items = items;
            console.log(applicationData);

            this.broker
                .call('app-server.dynamic-content.app-data.eop_edit_application', {
                    dbName: dbName,
                    applicationData: applicationData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async createFileFromStream(buffer, path) {
            if (!Buffer.isBuffer(buffer)) {
                return 'error';
            }

            return new Promise((resolve, reject) => {
                // Setup readable stream from buffer.
                let streamData = buffer;
                let readStream = Readable();

                readStream._read = () => {
                    readStream.push(streamData);
                    streamData = null;
                };

                // Setup file system writable stream.
                let fstream = fs.createWriteStream(path);

                // Copy file via piping streams.
                readStream.pipe(fstream).on('finish', resolve).on('error', reject);
            });
        },
        async eop_createReadStreamFromFile(req, res, next) {
            const fileName = req.params.filename;

            var UPLOAD_PATH = '/usr/etc/app/uploads';
            let fPath = path.join(UPLOAD_PATH, '/', fileName);
            console.log('fPath ----------', fPath);

            try {
                if (fs.existsSync(fPath)) {
                    console.log('File From Server');
                    let readStream = fs.createReadStream(fPath);
                    readStream.on('open', function () {
                        readStream.pipe(res);
                    });
                }
            } catch (err) {
                console.error(err);
            }
        },
        async eop_show_role(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_role', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_role_listing(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_role_listing', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_get_pages(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_get_pages', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_get_permissions(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_get_permissions', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_get_resources(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_get_resources', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_single_user_listing(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_single_user_role - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_single_user_listing', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_single_role_listing(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_single_user_role - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_single_role_listing', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async submited_application(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-submited_application - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.submited_application', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_show_approval_workflow(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_show_approval_workflow - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_approval_workflow', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_application_comments(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_application_comments - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_application_comments', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_show_user_designation(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_user_designation', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_user_designation(req, res, next) {
            const designationData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_designation - method--');
            console.log(designationData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_user_designation', {
                    dbName: dbName,
                    designationData: designationData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async eop_show_user_department(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_user_department', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async reason_of_death(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.reason_of_death', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async place_of_death(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.place_of_death', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async eop_user_department(req, res, next) {
            const departmentData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_department - method--');
            console.log(departmentData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_user_department', {
                    dbName: dbName,
                    departmentData: departmentData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async eop_show_categories(req, res, next) {
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_categories')
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_show_categories_admin(req, res, next) {
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_categories_admin')
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_show_single_category(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_single_category - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_single_category', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_single_user(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_single_user - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_single_user', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_show_single_department(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_single_department - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_single_department', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_show_single_designation(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_show_single_designation - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_single_designation', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_show_single_step(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_single_step - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_single_step', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_show_category(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_category - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_category', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async eop_show_single_item(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_single_step - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_single_item', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_get_form_data(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_get_form_data - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_get_form_data', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_delete_category(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter-eop_single_category - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_delete_category', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async eop_update_category(req, res, next) {
            const categoriesData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_categories - method--');
            console.log(categoriesData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_update_category', {
                    dbName: dbName,
                    categoriesData: categoriesData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_delete_designation(req, res, next) {
            const designationData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_designation - method--');
            console.log(designationData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_delete_designation', {
                    dbName: dbName,
                    designationData: designationData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_delete_department(req, res, next) {
            const departmentData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_department - method--');
            console.log(departmentData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_delete_department', {
                    dbName: dbName,
                    departmentData: departmentData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_delete_role(req, res, next) {
            const roleData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_role - method--');
            console.log(roleData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_delete_role', {
                    dbName: dbName,
                    roleData: roleData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_delete_eopUser(req, res, next) {
            const eopUserData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_eopUser - method--');
            console.log(eopUserData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_delete_eopUser', {
                    dbName: dbName,
                    eopUserData: eopUserData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async eop_update_department(req, res, next) {
            const departmentsData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_departments - method--');
            console.log(departmentsData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_update_department', {
                    dbName: dbName,
                    departmentsData: departmentsData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_update_designation(req, res, next) {
            const designationData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_designation - method--');
            console.log(designationData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_update_designation', {
                    dbName: dbName,
                    designationData: designationData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async eop_update_user_role(req, res, next) {
            const userData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_step - method--');
            console.log(userData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_update_user_role', {
                    dbName: dbName,
                    userData: userData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_update_step_num(req, res, next) {
            const stepData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_step - method--');
            console.log(stepData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_update_step_num', {
                    dbName: dbName,
                    stepData: stepData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_update_item(req, res, next) {
            const itemData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_step - method--');
            console.log(itemData);

            let finaldata = JSON.parse(itemData.finaldata);
            console.log('--finaldata--');
            console.log(finaldata);

            let files = req.files;
            console.log('---files---');
            console.log(files);

            var UPLOAD_PATH = '/usr/etc/app/uploads';
            for (var file in files) {
                console.log('--file--');
                console.log(file);
                console.log('--file object--');
                console.log(files[file]);

                const extension = path.extname(files[file].name);
                const fileName = finaldata.id + '_' + file + '_' + new Date().getTime() + extension;
                const buffer = Buffer.from(files[file].data);
                console.log('upload path');
                console.log(UPLOAD_PATH);
                console.log('fileName');
                console.log(fileName);

                const fileCreation = await this.createFileFromStream(
                    buffer,
                    `${UPLOAD_PATH}/${fileName}`
                );
                if (fileCreation === 'error') {
                    return JSON.stringify({ msg: 'No file uploaded!' });
                }

                finaldata.download_file = fileName;
            }

            console.log('--finaldata--after file upload--');
            console.log(finaldata);

            this.broker
                .call('app-server.dynamic-content.app-data.eop_update_item', {
                    dbName: dbName,
                    itemData: finaldata,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_update_step_item(req, res, next) {
            const stepData = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_step - method--');
            console.log(stepData);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_update_step_item', {
                    dbName: dbName,
                    stepData: stepData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_step_num(req, res, next) {
            const step_data = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_categories - method--');
            console.log(step_data);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_step_num', {
                    dbName: dbName,
                    step_data: step_data,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_step_item(req, res, next) {
            const step_data = req.body;
            const dbName = req.query.dbName;
            console.log('--eop_categories - method--');
            console.log(step_data);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_step_item', {
                    dbName: dbName,
                    step_data: step_data,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_show_steps(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter- - method--');
            console.log(id);
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_steps', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async submited_applications(req, res, next) {
            const fetchData = req.body;
            const dbName = req.query.dbName;
            console.log('--submited_applications - method--');
            console.log(fetchData);
            this.broker
                .call('app-server.dynamic-content.app-data.submited_applications', {
                    dbName: dbName,
                    params: req.query.params,
                    fetchData: fetchData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_configuraion(req, res, next) {
            this.broker
                .call('app-server.dynamic-content.app-data.eop_configuraion', {
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async applications_report(req, res, next) {
            const fetchData = req.body;
            const dbName = req.query.dbName;
            console.log('--applications_report - method--');
            console.log(fetchData);
            this.broker
                .call('app-server.dynamic-content.app-data.applications_report', {
                    dbName: dbName,
                    fetchData: fetchData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async death_noc_report(req, res, next) {
            const fetchData = req.body;
            const dbName = req.query.dbName;
            console.log('--death_noc_report - method--');
            console.log(fetchData);
            this.broker
                .call('app-server.dynamic-content.app-data.death_noc_report', {
                    dbName: dbName,
                    fetchData: fetchData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async categories_applications_report(req, res, next) {
            const fetchData = req.body;
            const dbName = req.query.dbName;
            console.log('--applications_report - method--');
            console.log(fetchData);
            this.broker
                .call('app-server.dynamic-content.app-data.categories_applications_report', {
                    dbName: dbName,
                    fetchData: fetchData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async css_track_and_monitor(req, res, next) {
            const fetchData = req.body;
            const dbName = req.query.dbName;
            console.log('--css_track_and_monitor_report - method--');
            console.log(fetchData);
            this.broker
                .call('app-server.dynamic-content.app-data.css_track_and_monitor', {
                    dbName: dbName,
                    fetchData: fetchData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_show_role_permissions(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter- - method--');
            console.log(id);
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_show_role_permissions', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_check_role_permission(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter- - method--');
            console.log(id);
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_check_role_permission', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_myInbox(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter- eop_myInbox - method--');
            console.log(id);
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_myInbox', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_myInbox_count(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter- eop_myInbox_count - method--');
            console.log(id);
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_myInbox_count', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async CSRFToken(req, res, next) {
            try {
                res.send({ csrfToken: req.csrfToken() });
            } catch (err) {
                next(err);
            }
        },
        async css_portal_pieChart(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.css_portal_pieChart', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async css_portal_barChart(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.css_portal_barChart', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_voucher_list(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_voucher_list', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        async eop_voucher(req, res, next) {
            const id = req.params.id;
            console.log('-webrouter- eop_voucher - method--');
            console.log(id);
            const dbName = req.query.dbName;
            this.broker
                .call('app-server.dynamic-content.app-data.eop_voucher', {
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
    },

    async started() {
        logger.info(`SERVICE - ${this.name} - Started.`);
        this.startServer(this.broker);
    },

    async stopped() {
        this.server.close();
        logger.info(`SERVICE - ${this.name} - Stopped.`);
    },
};
