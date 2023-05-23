//const { Service } = require("moleculer");
// FIXME : Why a gatsby folder included here?
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const util = require('util');
const fs = require('fs');
const queryString = require('query-string');
const fetch = require('node-fetch');
const { Readable } = require('stream');
// const authService = require('auth-service');
const cache = require('cache');
const port = 3200;
const { UPLOAD_PATH, HEADLESS_NODE, WEBSITE_REDIS_URL } = require('./../config/config');
var ffmpeg = require('fluent-ffmpeg');
// const { head } = require('auth-service/routes/AuthService');
const { cmsAccessControl } = require('../middleware/CMSAuthorization');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('error-handler').errorHandler(logger);
const morgan = require('morgan');
const { ServiceBroker } = require('moleculer');
const brokerOption = JSON.parse(WEBSITE_REDIS_URL);
const brokerWebsite = new ServiceBroker(brokerOption);

const httpRequestLog = function (reqMessage) {
    logger.http(reqMessage);
};

app.use(morgan('combined', { stream: { write: httpRequestLog } }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'gatsby')));

// authService.initializeAuthService(app, 'CMS');

// let myLogger = function (req, res, next) {
//     let header = JSON.stringify(req.query);
//     let body = req.body;
//     console.log('=======Request Header ======= : ' + header);
//     next();
// };

// app.use(myLogger);
app.use(cmsAccessControl);

module.exports = {
    name: 'web-router',
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

        

       


        async appServerGetCollectionData(ctx) {
            console.log('-------------appServerGetCollectionData----------------');
            const data = await this.appServerGetCollectionData(ctx);

            return data;
        },

        async appServerGetSingleDocument(ctx) {
            console.log('-------------appServerGetSingleDocument----------------');
            const data = await this.appServerGetSingleDocument(ctx);

            return data;
        },

        async appServerGetSingleDocumentById(ctx) {
            console.log('-------------appServerGetSingleDocumentById----------------');
            const data = await this.appServerGetSingleDocumentById(ctx);

            return data;
        },

        async appServerInsertRecord(ctx) {
            console.log('-------------appServerInsertRecord----------------');
            const data = await this.appServerInsertRecord(ctx);

            return data;
        },

        async appServerUploadDocument(ctx) {
            console.log('-------------appServerUploadDocument----------------');
            const data = await this.appServerUploadDocument(ctx);

            return data;
        },

        async appServerAddCustomCollectionData(ctx) {
            console.log('-------------appServerAddCollectionData----------------');
            const data = await this.appServerAddCustomCollectionData(ctx);

            return data;
        },

        async cmsServerGetDocsByCollectionAndId(ctx) {
            console.log('-------------cmsServerGetDocsByCollectionAndId----------------');
            const data = await this.cmsServerGetDocsByCollectionAndId(ctx);

            return data;
        },

        async getAllMenu(ctx) {
            console.log('-------------getAllMenu----------------');
            const data = await this.getAllAppMenu(ctx);

            return data;
        },
        async getSitePermissionsForClient(ctx) {
            console.log('-------------getSitePermissionsForClient-Web----------------');
            const data = await this.getSitePermissionsForClient(ctx);

            return data;
        },

        async appServerGetImage(ctx) {
            console.log('-------------appServerGetImage----------------');
            const data = await this.appServerGetImage(ctx);

            return data;
        },

        async appServerGetDocument(ctx) {
            console.log('-------------appServerGetDocument----------------');
            const data = await this.appServerGetDocument(ctx);

            return data;
        },

        async getSitePermissionsForServer(ctx) {
            console.log('-------------getSitePermissionsForServer----------------');
            const data = await this.getSitePermissionsForServer(ctx.params.dbName);

            return data;
        },

        async getBannerDetails(ctx) {
            console.log('-------------getBannerDetails----------------');
            const data = await this.getBannerDetails(ctx);

            return data;
        },

        async getTreeViewDetials(ctx) {
            console.log('-------------getTreeViewDetials----------------');
            const data = await this.getTreeViewDetials(ctx);

            return data;
        },

        async getTreeSearchDetials(ctx) {
            console.log('-------------getTreeSearchDetials----------------');
            const data = await this.getTreeSearchDetials(ctx);

            return data;
        },

        async getTreeCustomCollectionsData(ctx) {
            console.log('-------------getTreeCustomCollectionsData----------------');
            const data = await this.getTreeCustomCollectionsData(ctx);

            return data;
        },

        async cmsServerGetDocumentHistory(ctx) {
            console.log('-------------cmsServerGetDocumentHistory----------------');
            const data = await this.cmsServerGetDocumentHistory(ctx);

            return data;
        },

        async cmsServerGetCustomCollectionMeta(ctx) {
            console.log('-------------cmsServerGetCustomCollectionMeta----------------');
            const data = await this.cmsServerGetCustomCollectionMeta(ctx);

            return data;
        },

        async getCMSSiteSearchResults(ctx) {
            console.log('-------------getCMSSiteSearchResults----------------');
            const data = await this.getCMSSiteSearchResults(ctx);

            return data;
        },
    },
    methods: {
        startServer(ctx) {
            this.getCMSPermissionsForServer();

            /**
             * Common APIs
             **/
            app.get('/api/collection/data/all', this.getAllDataFromCollection); // Get all data from a collection
            app.get('/api/cms/getSingleDocumentById', this.getSingleDocumentById);
            app.get('/api/file/:dbname/:collectionName/:filename', this.getFileFromGridFs); // Get file (image/document ...etc) from grid fs


          

            //Services - WebSites
            app.get('/api/websites/:id', this.getWebSite);
            app.get('/api/websites', this.getAllWebSites); //WebSites
            app.post('/api/websites/create', this.createWebSite); //WebSites
            app.put('/api/websites/update', this.updateWebsite); //WebSites
            app.post('/api/websites/languages/update', this.updateWebsiteLanguages); //WebSites
            app.get('/api/websites/languages/data', this.getWebsiteLanguages);

            // Upload file into GridFs and save returned data into static-resources
            app.post('/api/websites/static-resources/create', this.AddStaticResource);
            app.put('/api/websites/static-resources-links/update', this.updateStaticResourceLinks); // Update static resource links collection
            app.delete('/api/websites/static-resources/delete', this.deleteStaticResource);

            //Services - Website User Managment
            app.get('/api/websites/user-management/userDetailsByEmail', this.userDetailsByEmail); //WebSite Users
            app.get('/api/websites/user-management/userDetailsByName', this.userDetailsByName); //WebSite Users
            app.get('/api/websites/user-management/userDetailsByStatus', this.userDetailsByStatus); //WebSite Users
            app.get(
                '/api/websites/user-management/userDetailsByRegDate',
                this.userDetailsByRegDate
            ); //WebSite Users
            app.get(
                '/api/websites/user-management/resendActivationLink',
                this.resendActivationLink
            ); //WebSite Users
            app.get('/api/websites/user-management/activateUser', this.activateUser); //WebSite Users

        
         

            //master info
            app.get('/api/master-data', this.getAllMasterInfo); //master-info
            app.put('/api/master-data/update', this.updateMasterInfo); //master-info - not used

            //Services - Pages
            app.get('/api/pages/data', this.getPage); //pages
            app.get('/api/pages', this.getAllPages); //pages
            app.post('/api/pages/create', this.createPage); //pages
            app.put('/api/pages/update', this.updatePage); //pages - not used
            app.put('/api/pages/update-all', this.updateAllPages); //pages - not used
            app.post('/api/pages/new-section', this.insertPageSection); //pages
            app.put('/api/pages/link-page', this.updateLinkPage); //pages
            app.get('/api/pages/unlink-pages', this.getAllUnLinkPages); //pages
            app.post('/api/pages/duplicate', this.duplicatePage); //pages
            app.delete('/api/pages/delete', this.deletePage); //pages
            app.post('/api/pages/record-lock', this.pagesRecordLock); //pages
            app.post('/api/pages/record-unlock', this.pagesRecordUnLock); //pages
            app.get('/api/pages/locking-status', this.getPageLockingStatus); //pages

            //Services - Pages Data
            app.get('/api/pages/data/get-data', this.getContentData); //page-data - not used - Need to Remove
            app.get('/api/pages/contents/data', this.getAllContentData); //page-data
            app.get('/api/pages/data/all', this.getAllPageData); //page-data - not used
            app.get('/api/pages/data/publish', this.getPublishablePageData); //page-data - not used
            // app.get('/api/pages/data/images/:dbname/:filename', this.getImage); //page-data
            app.get('/api/page-data/getImage/:dbname/:filename', this.getImage); //page-data
            app.post('/api/pages/data/create', this.insertPageData); //page-data - not used
            app.post('/api/pages/sections/data/create', this.insertSectionData); //page-data - not used
            app.put('/api/pages/components/data/update', this.updateComponentData); //page-data - not used
            app.put('/api/pages/data/update', this.updateAllPageComponentData); //page-data
            app.post('/api/pages/data/images/upload', this.uploadImage); //page-data
            app.post('/api/pages/data/image/replce', this.ReplaceImageFile); //page-data
            app.post('/api/pages/data/image/replceThumbnail', this.ReplaceImageThumbnail); //page-data

            //Services - Pages-History
            app.get('/api/pages/history', this.getPageHistoryData); //history
            app.post('/api/pages/history/checkout', this.historyPageCheckout); //history

            //Services - CK Editor
            app.post('/api/ck-editor/image/upload', this.ckEditorUploadImage); //page-data

            //Services - activity-logs
            app.get('/api/documents/activity-logs', this.getDocHistoryActivityLogs); //activity-logs
            app.get('/api/pages/activity-logs', this.getPageHistoryActivityLogs); //activity-logs
            app.post('/api/activity-logs', this.getAllActivityLogs); //activity-logs
            app.get('/api/templates/activity-logs', this.getTemplateHistoryActivityLogs); //activity-logs
            app.get('/api/banner/activity-logs', this.getBannerHistoryActivityLogs); //activity-logs

            // Services - Theme
            app.get('/api/themes', this.getAllThemes); //theme
            app.post('/api/theme/update', this.updateThemeData); //theme

            //new collections
            app.post('/api/custom-collections/create', this.createCustomCollection); //custom-collections
            app.post('/api/custom-collections/new/create', this.insertNewCollection); //custom-collections
            // app.post('/api/customCollections/add-record', this.addCustomCollectionData); //custom-collections
            app.put('/api/custom-collections/new/update', this.updateCollectionType); //custom-collections
            app.get('/api/custom-collections/types', this.getcustomCollectionTypes); //custom-collections
            app.put('/api/custom-collections/documents/update', this.updateCollectionDoc); //custom-collections
            app.post('/api/custom-collections/documents/upload', this.uploadDocument); //custom-collections
            app.get('/api/documents/:dbname/:filename', this.getDocument); //custom-collections
            app.get('/api/posts/:dbname/:filename', this.getDocument); //custom-collections
            // app.get('/api/custom-collections/posts/:dbname/:filename', this.getDocument); //custom-collections
            app.get('/api/custom-collections/all', this.getCollectionAll); //custom-collections
            app.get('/api/custom-collections/images/title', this.getImagesByTitle); //custom-collections
            app.get('/api/custom-collections/images/description', this.getImagesByDesc); //custom-collections
            app.post('/api/custom-collections/icons/upload', this.uploadIcons); //custom-collections
            app.delete('/api/custom-collections/icons/delete', this.deleteIcon); //custom-collections
            app.get('/api/custom-collections/icons/name', this.getIconsByFileName); //custom-collections
            app.delete('/api/custom-collections/images/delete', this.deleteImage); //custom-collections
            app.post('/api/custom-collections/videos/upload', this.uploadVideo); //custom-collections
            app.get('/api/custom-collections/videos/title', this.getVideosByTitle); //custom-collections
            app.post('/api/custom-collections/videos/delete', this.deleteVideo); //custom-collections
            app.get('/api/custom-collections', this.getAllCustomCollection); //custom-collections
            app.post('/api/custom-collections/save', this.saveAllCustomCollection); //custom-collections
            app.post('/api/custom-collections/image/create', this.insertNewCollection);
            app.post('/api/custom-collections/video/create', this.insertNewCollection);
            app.get(
                '/api/custom-collections/custom/documents',
                this.getcustomCollectionDocsByCollectionAndId
            ); //custom-collections
            app.get('/api/custom-collections/history', this.getDocumentHistory);
            app.get('/api/custom-collections/last/meta', this.getLastUpdatedDocumentMetaInfo);
            app.post('/api/custom-collections/document/delete', this.customCollectionRecordDelete); // Delete a record from the given custom-collection

            //custom-collection tree structure
            app.post('/api/custom-collections/tree/create', this.createCustomTree);
            app.get('/api/custom-collections/tree/all', this.getAllCustomTrees);
            app.get('/api/custom-collections/tree', this.getCustomTreeById);
            app.post('/api/custom-collections/tree/update', this.updateCustomTree);
            app.get('/api/custom-collections/tree/collection', this.getTreeCustomCollections);
            app.get('/api/custom-collections/tree/search', this.searchTreeCustomCollections);
            app.delete('/api/custom-collections/tree/delete', this.deleteTreeCustomCollections);

            //Services - document-History
            app.get('/api/documents/history', this.getDocHistoryData); //history
            //app.post('/api/page-history/pageCheckout', this.historyPageCheckout);

            //services - Menu
            app.get('/api/menus', this.getAllMenu); //menu
            app.post('/api/menus/create', this.insertMenuItem); //menu
            app.post('/api/menus/save', this.saveAllMenu); //menu
            app.post('/api/menus/data/save', this.saveMenu); //menu
            app.post('/api/menus/page', this.deletePageFromMenu); //menu
            app.get('/api/menus/names', this.getMainMenuNamesForMappedPages); //menu

            //services - Users
            app.get('/api/cms/users', this.getAllUser); //add-users
            app.put('/api/cms/users/update', this.updateUser); //add-users
            app.post('/api/cms/users/create', this.addUser); //add-users
            app.delete('/api/cms/users/delete', this.removeUser); //add-users

            //services - Permission -Site
            app.get('/api/sites/roles', this.getAllRole); //site-permissions
            app.put('/api/sites/roles/update', this.updateRole); //site-permissions
            app.post('/api/sites/roles/create', this.addRole); //site-permissions
            app.delete('/api/sites/roles/delete', this.removeRole); //site-permissions

            //services - Permission -CMS
            app.get('/api/cms/permissions', this.getAllCmsUserPermission); //cms-permissions
            app.get('/api/cms/roles', this.getAllCmsRole); //cms-permissions
            app.get('/api/cms/roles/approved', this.getApprovedCmsRole); //cms-permissions
            app.get('/api/cms/feature-operations', this.getAllCmsFeatureOperations); //cms-permissions
            app.post('/api/cms/features/save', this.saveAllFeature); //cms-permissions
            app.put('/api/cms/roles/update', this.updateCMSRole); //cms-permissions
            app.post('/api/cms/roles/create', this.addCMSRole); //cms-permissions
            app.get('/api/cms/permission', this.getCMSPermissionsForClient); //cms-permissions
            app.delete('/api/cms/roles/delete', this.removeCMSRole); //cms-permissions
            app.post('/api/cms/roles/allowedDocuments/save', this.saveRoleAllowedDocuments); //cms-permissions
            app.get('/api/cms/roles/allowedDocuments', this.getRoleAllowedDocuments); //cms-permissions

            //services - workflow
            app.post('/api/workflow/pages/update', this.updatePageWorkflow); //workflow
            app.post('/api/workflow/documents/update', this.updateDocumentWorkflow); //workflow
            app.get('/api/workflow/filter', this.getFilteredWorkflows); //workflow
            app.get('/api/workflow/state', this.getWorkflowState); //workflow
            app.get('/api/workflow', this.getWorkflows); //workflow
            app.get('/api/workflow/customCollections', this.getCustomCollectionWorkflows); //workflow
            app.post('/api/workflow/templates/update', this.updateTemplateWorkflow); //workflow
            app.post('/api/workflow/banners/update', this.updateBannerWorkflow); //workflow
            app.post('/api/workflow/forms/update', this.updateFormWorkflow); //workflow

            //cms-users
            // app.get('/api/users/login', this.getLoggedUser); //users
            app.get('/api/users/login', this.login); //users
            app.get('/api/users/logout', this.logout); //users
            app.get('/api/users', this.getAllUsers); //users
            app.get('/api/users/adLogin', this.adLogin); //users
            app.get('/api/users/adRedirect', this.adRedirect); //users

            //for app-server specific use
            app.get('/api/getWorkflowWithRoles', this.getWorkflowWithRoles); //website-service
            app.get('/api/getPermissions', this.getPathsForRole); //website-service

            //banners
            app.post('/api/banners/create', this.createBanner); //cms-banners
            app.get('/api/banners', this.getAllBanners); //cms-banners
            app.get('/api/banners/:id', this.getBanner); //cms-banners - /api/banners/banner
            app.post('/api/banners/update', this.updateBanner); //cms-banners
            app.delete('/api/banners/delete', this.deleteBanner); //cms-banners
            //Services - banners-History
            app.get('/api/banner/history', this.getBannerHistoryData); //history
            app.post('/api/banner/history/checkout', this.historyBannerCheckout); //history

            //forms
            app.get('/api/forms', this.getAllForms); //cms-forms
            app.get('/api/forms/get-item-data', this.getSingleFormItem); //cms-forms
            app.post('/api/forms/create', this.createForm); //cms-forms
            app.delete('/api/forms/delete', this.deleteForm); //cms-forms
            app.put('/api/forms/update', this.updateForm); //cms-forms
            // Not using. Google recaptcha validation not triggered within CMS
            app.post('/api/customCollections/add-record', this.cmsServerAddDynamicFormsData); //custom-collections

            // Table Component Temporary Routes
            app.get('/api/cms/getCollectionData', this.cmsServerGetCollectionData);

            // templates
            app.post('/api/templates/create', this.createTemplate); //cms-templates
            app.post('/api/templates/duplicate', this.duplicateTemplate); //cms-templates
            app.get('/api/templates', this.getAllTemplates); //cms-templates
            app.get('/api/templates/approved', this.getAllApprovedTemplates); //cms-templates
            app.get('/api/templates/data', this.getTemplate); //cms-templates
            app.get('/api/templates/data/publish', this.getPublishablePagesTemplates); //cms-templates
            app.get('/api/templates/content', this.getAllTemplateContentData); //cms-templates
            app.get('/api/templates/content/publish', this.getPublishablePagesTemplatesData); //cms-templates
            app.post('/api/template/content/update', this.updateAllTemplateComponentData); //cms-templates
            app.put('/api/templates/update', this.updateTemplate); //cms-templates
            app.post('/api/templates/image/upload', this.uploadTemplateImage); //cms-templates
            app.delete('/api/templates/delete', this.deleteTemplate); //cms-templates
            app.post('/api/templates/record-lock', this.templatesRecordLock); //cms-templates
            app.post('/api/templates/record-unlock', this.templatesRecordUnLock); //cms-templates
            app.get('/api/templates/locking-status', this.getTemplatesLockingStatus); //cms-templates

            //Services - Templates-History
            app.get('/api/templates/history', this.getTemplateHistoryData); //history
            app.post('/api/templates/history/checkout', this.historyTemplateCheckout); //history

            // publish pages
            app.get('/api/publish/get-pages-publish', this.getPublishablePages);
            app.post('/api/publish/post-release', this.postRelease);
            app.get('/api/publish/get-release', this.getReleases);
            app.get('/api/publish/get-release-progress', this.getReleaseProgress);
            app.put('/api/publish/update-Custom-Types', this.updateCustomTypes);
            app.post('/api/publish/refresh-website-cache', this.refreshWebsiteCache);

            //services - site search
            app.get('/api/site-search/data', this.getSiteSearchResults);

            // Product Subscription
            app.get('/api/subscription/products', this.getAllProducts); // Get All Products
            app.get('/api/subscription/product', this.getProduct); // Get Product Details By Id
            app.get('/api/subscription/product/other-data', this.getOtherProductData); // Get all groups, sub groups and periods
            app.post('/api/subscription/product/add', this.addProduct); // Add Product
            app.put('/api/subscription/product/edit', this.editProduct); // Edit Product
            app.delete('/api/subscription/product/delete', this.deleteProduct); // Delete Product
            app.get('/api/subscription/sub-groups', this.getAllProductSubGroups); // Get All Product Sub Groups
            app.get('/api/subscription/sub-group', this.getProductSubGroup); // Get Product Sub Group Details By Id
            app.get('/api/subscription/sub-group/other-data', this.getOtherProductSubGroupData); // Get all groups
            app.post('/api/subscription/sub-group/add', this.addProductSubGroup); // Add Product Sub Group
            app.put('/api/subscription/sub-group/edit', this.editProductSubGroup); // Edit Product Sub Group
            app.delete('/api/subscription/sub-group/delete', this.deleteProductSubGroup); // Delete Product Sub Group
            app.get('/api/subscription/groups', this.getAllProductGroups); // Get All Product Groups
            app.get('/api/subscription/group', this.getProductGroup); // Get Product Group Details By Id
            app.post('/api/subscription/group/add', this.addProductGroup); // Add Product Group
            app.put('/api/subscription/group/edit', this.editProductGroup); // Edit Product Group
            app.delete('/api/subscription/group/delete', this.deleteProductGroup); // Delete Product Group
            app.get('/api/subscription/subscriptions', this.getAllProductSubscriptions); // Get All Product Subscriptions
            app.get(
                '/api/subscription/subscriptions/filter',
                this.getAllProductSubscriptionsByFilter
            ); // Get All Product Subscriptions By Filter
            app.get('/api/subscription/purchase-transactions', this.getAllPurchaseTransactions); // Get All Purchase Transactions
            app.get(
                '/api/subscription/purchase-transactions/filter',
                this.getAllPurchaseTransactionsByFilter
            ); // Get All Purchase Transactions By Filter
            app.get(
                '/api/subscription/subscription-periods',
                this.getAllProductSubscriptionPeriods
            ); // Get All ProductSubscriptionPeriods
            app.get('/api/subscription/subscription-period', this.getProductSubscriptionPeriod); // Get ProductSubscriptionPeriod Details By Id
            app.post(
                '/api/subscription/subscription-period/add',
                this.addProductSubscriptionPeriod
            ); // Add ProductSubscriptionPeriod
            app.put(
                '/api/subscription/subscription-period/edit',
                this.editProductSubscriptionPeriod
            ); // Edit ProductSubscriptionPeriod
            app.delete(
                '/api/subscription/subscription-period/delete',
                this.deleteProductSubscriptionPeriod
            ); // Delete ProductSubscriptionPeriod

            //services - archives
            app.post('/api/archives/data', this.getArchiveResults);
            app.post('/api/archives/checkout', this.checkoutArchive);
            app.post('/api/archives/delete', this.deleteArchive);

            //Error handling middlewear
            app.use(errorHandlerService.serviceErrorHandler);

            this.server = app.listen(port, () =>
                console.log(`Example app listening at http://localhost:${port}`)
            );
        },

        // Common method to validate google recaptch token
        async isRecaptchaValidationSuccess(token, remoteAddress) {
            try {
                // Secret key
                const secretKey = '6LfzUCYcAAAAAKTRq9bh8WVJheLYainiLjr4NgXq'; // Version 2

                // Verify URL
                const query = queryString.stringify({
                    secret: secretKey,
                    response: token,
                    remoteip: remoteAddress,
                });

                const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

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

      

        async getAllDataFromCollection(req, res, next) {
            const dbName = req.query.dbName;
            const collectionName = req.query.collection;
            delete req.body.dbName;

            this.broker
                .call('cms.websites.getAllDataFromCollection', {
                    dbName: dbName,
                    collectionName: collectionName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getFileFromGridFs(req, res, next) {
            const fileName = req.params.filename;
            const collectionName = req.params.collectionName;
            const dbName = req.params.dbname;

            this.broker
                .call('cms.websites.getFileFromGridFs', {
                    dbName: dbName,
                    collectionName: collectionName,
                    fileName: fileName,
                })
                .then((data) => {
                    data.pipe(res);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getSingleDocumentById(req, res, next) {
            const query = req.query.searchId ? req.query.searchId : '';
            const dbName = req.query.dbName;
            const collectionName = req.query.collectionName;

            this.broker
                .call('headless-cms.appServerGetSingleDocumentById', {
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

        async getAllWebSites(req, res, next) {
            this.broker
                .call('cms.websites.getAllWebSites')
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async userDetailsByEmail(req, res, next) {
            logger.info('get Web Site Users userDetailsByEmail');
            const email = req.query.email;
            brokerWebsite
                .call('app-server.user-management.userDetailsByEmail', { email: email })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async userDetailsByName(req, res, next) {
            logger.info('get Web Site Users userDetailsByName');
            const name = req.query.name;
            brokerWebsite
                .call('app-server.user-management.userDetailsByName', { name: name })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async userDetailsByStatus(req, res, next) {
            logger.info('get Web Site Users userDetailsByStatus');
            const status = req.query.status;
            brokerWebsite
                .call('app-server.user-management.userDetailsByStatus', { status: status })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async userDetailsByRegDate(req, res, next) {
            logger.info('get Web Site Users - userDetailsByRegDate');
            const fromDate = req.query.fromDate;
            const toDate = req.query.toDate;
            brokerWebsite
                .call('app-server.user-management.userDetailsByRegDate', {
                    fromDate: fromDate,
                    toDate: toDate,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async resendActivationLink(req, res, next) {
            logger.info('get Web Site Users - resendActivationLink');
            const email = req.query.email;
            const lang = null;

            brokerWebsite
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
            logger.info('get Web Site Users - activateUser');
            const email = req.query.email;
            brokerWebsite
                .call('app-server.user-management.activateUser', { email: email })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllProducts(req, res, next) {
            logger.info('Product subscription - Get all products');

            brokerWebsite
                .call('app-server.subscription.getAllProducts', {})
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllProductSubGroups(req, res, next) {
            logger.info('Product subscription - Get all Product Sub Groups');

            brokerWebsite
                .call('app-server.subscription.getAllProductSubGroups', {})
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllProductGroups(req, res, next) {
            logger.info('Product subscription - Get all Product Groups');

            brokerWebsite
                .call('app-server.subscription.getAllProductGroups', {})
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllProductSubscriptionPeriods(req, res, next) {
            logger.info('Product subscription - getAllProductSubscriptionPeriods');

            brokerWebsite
                .call('app-server.subscription.getAllProductSubscriptionPeriods', {})
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllProductSubscriptions(req, res, next) {
            logger.info('Product subscription - Get all Product Subscriptions');

            brokerWebsite
                .call('app-server.subscription.getAllProductSubscriptions', {})
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllProductSubscriptionsByFilter(req, res, next) {
            logger.info('Product subscription - getAllProductSubscriptionsByFilter');
            const filter = req.query.filter;

            brokerWebsite
                .call('app-server.subscription.getAllProductSubscriptionsByFilter', {
                    filter: filter,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllPurchaseTransactions(req, res, next) {
            logger.info('Product subscription - Get all PurchaseTransactions');

            brokerWebsite
                .call('app-server.subscription.getAllPurchaseTransactions', {})
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllPurchaseTransactionsByFilter(req, res, next) {
            logger.info('Product subscription - Get all PurchaseTransactions');
            const filter = req.query.filter;

            brokerWebsite
                .call('app-server.subscription.getAllPurchaseTransactionsByFilter', {
                    filter: filter,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getProduct(req, res, next) {
            logger.info('Product subscription - Get product');
            const productId = req.query.productId;

            brokerWebsite
                .call('app-server.subscription.getProduct', { productId: productId })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getProductSubGroup(req, res, next) {
            logger.info('Product subscription - Get product sub groups');
            const subGroupId = req.query.subGroupId;

            brokerWebsite
                .call('app-server.subscription.getProductSubGroup', { subGroupId: subGroupId })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getProductGroup(req, res, next) {
            logger.info('Product subscription - Get product groups');
            const groupId = req.query.groupId;

            brokerWebsite
                .call('app-server.subscription.getProductGroup', { groupId: groupId })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getProductSubscriptionPeriod(req, res, next) {
            logger.info('Product subscription - getProductSubscriptionPeriod');
            const subPeriodId = req.query.subPeriodId;

            brokerWebsite
                .call('app-server.subscription.getProductSubscriptionPeriod', {
                    subPeriodId: subPeriodId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getOtherProductData(req, res, next) {
            logger.info('Product subscription - getOtherProductData');
            const productId = req.query.productId;

            brokerWebsite
                .call('app-server.subscription.getOtherProductData', { productId: productId })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getOtherProductSubGroupData(req, res, next) {
            logger.info('Product subscription - getOtherProductSubGroupData');
            const subGroupId = req.query.subGroupId;

            brokerWebsite
                .call('app-server.subscription.getOtherProductSubGroupData', {
                    subGroupId: subGroupId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async addProduct(req, res, next) {
            logger.info('Product subscription - Add product');
            const { productData } = req.body;

            brokerWebsite
                .call('app-server.subscription.addProduct', { productData: productData })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async addProductSubGroup(req, res, next) {
            logger.info('Product subscription - Add product sub group');
            const { subGroupData } = req.body;

            brokerWebsite
                .call('app-server.subscription.addProductSubGroup', { subGroupData: subGroupData })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async addProductGroup(req, res, next) {
            logger.info('Product subscription - Add product group');
            const { groupData } = req.body;

            brokerWebsite
                .call('app-server.subscription.addProductGroup', { groupData: groupData })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async addProductSubscriptionPeriod(req, res, next) {
            logger.info('Product subscription - addProductSubscriptionPeriod');
            const { subscriptionPeriodData } = req.body;

            brokerWebsite
                .call('app-server.subscription.addProductSubscriptionPeriod', {
                    subscriptionPeriodData: subscriptionPeriodData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async editProduct(req, res, next) {
            logger.info('Product subscription - Edit product');
            const { productData } = req.body;

            brokerWebsite
                .call('app-server.subscription.editProduct', { productData: productData })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async editProductSubGroup(req, res, next) {
            logger.info('Product subscription - Edit ProductSubGroup');
            const { subGroupData } = req.body;

            brokerWebsite
                .call('app-server.subscription.editProductSubGroup', { subGroupData: subGroupData })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async editProductGroup(req, res, next) {
            logger.info('Product subscription - Edit Product Group');
            const { groupData } = req.body;

            brokerWebsite
                .call('app-server.subscription.editProductGroup', { groupData: groupData })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async editProductSubscriptionPeriod(req, res, next) {
            logger.info('Product subscription - editProductSubscriptionPeriod');
            const { subscriptionPeriodData } = req.body;

            brokerWebsite
                .call('app-server.subscription.editProductSubscriptionPeriod', {
                    subscriptionPeriodData: subscriptionPeriodData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async deleteProduct(req, res, next) {
            logger.info('Product subscription - delete Product');
            const { productId } = req.body;

            brokerWebsite
                .call('app-server.subscription.deleteProduct', { productId: productId })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async deleteProductSubGroup(req, res, next) {
            logger.info('Product subscription - deleteProductSubGroup');
            const { subGroupId } = req.body;

            brokerWebsite
                .call('app-server.subscription.deleteProductSubGroup', { subGroupId: subGroupId })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async deleteProductGroup(req, res, next) {
            logger.info('Product subscription - deleteProduct Group');
            const { groupId } = req.body;

            brokerWebsite
                .call('app-server.subscription.deleteProductGroup', { groupId: groupId })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async deleteProductSubscriptionPeriod(req, res, next) {
            logger.info('Product subscription - deleteProductSubscriptionPeriod');
            const { subPeriodId } = req.body;

            brokerWebsite
                .call('app-server.subscription.deleteProductSubscriptionPeriod', {
                    subPeriodId: subPeriodId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getWebSite(req, res, next) {
            const id = req.params.id;

            this.broker
                .call('cms.websites.getWebSite', { id: id })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateWebsiteLanguages(req, res, next) {
            const id = req.body.id;
            const languages = req.body.languages;

            this.broker
                .call('cms.websites.updateWebsiteLanguages', { id: id, languages: languages })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateWebsite(req, res, next) {
            const { id, query } = req.body;

            this.broker
                .call('cms.websites.updateWebsite', {
                    id: id ? id : '',
                    query: query ? query : {},
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getWebsiteLanguages(req, res, next) {
            const dbName = req.query.dbName;

            this.broker
                .call('cms.websites.getWebsiteLanguages', { dbName: dbName })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllPages(req, res, next) {
            let dbName = req.query.dbName;

            this.broker
                .call('cms.pages.getAllPages', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getPage(req, res, next) {
            const dbName = req.query.dbName;
            const id = req.query.id;

            this.broker
                .call('cms.pages.getPage', {
                    dbName: dbName,
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getPageLockingStatus(req, res, next) {
            const dbName = req.query.dbName || '';
            const id = req.query.id || '';

            this.broker
                .call('cms.pages.getPageLockingStatus', {
                    dbName: dbName,
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getTemplatesLockingStatus(req, res, next) {
            const dbName = req.query.dbName || '';
            const id = req.query.id || '';

            this.broker
                .call('cms.templates.getTemplatesLockingStatus', {
                    dbName: dbName,
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getContentData(req, res, next) {
            const dbName = req.query.dbName;
            const id = req.query.id;

            this.broker
                .call('cms.page-data.getContentData', {
                    dbName: dbName,
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllContentData(req, res, next) {
            const dbName = req.query.dbName;
            const idList = req.query.idList;

            this.broker
                .call('cms.page-data.getAllContentData', {
                    dbName: dbName,
                    idList: idList,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllPageData(req, res, next) {
            const dbName = req.query.dbName;

            this.broker
                .call('cms.page-data.getAllPageData', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getPublishablePageData(req, res, next) {
            const dbName = req.query.dbName;
            const publishLevel = req.query.publishLevel;
            this.broker
                .call('cms.page-data.getPublishablePageData', {
                    dbName: dbName,
                    publishLevel: publishLevel,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getImage(req, res, next) {
            const fileName = req.params.filename;
            const dbName = req.params.dbname;
            this.broker
                .call('cms.page-data.getImage', {
                    dbName: dbName,
                    fileName: fileName,
                })
                .then((data) => {
                    data.pipe(res);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async createWebSite(req, res, next) {
            const {
                website,
                themes,
                workflows,
                languages,
                mainMenu,
                footerMenu,
                roleCounter,
                homePage,
                username,
            } = req.body;
            const { name, databaseName } = website;
            const dbName = website.databaseName;

            this.broker
                .call('cms.websites.createWebSite', {
                    query: {
                        name: name,
                        databaseName: databaseName,
                        languages: languages,
                        homePage: homePage,
                    },
                    dbName: dbName,
                    themes: themes,
                    workflows: workflows,
                    mainMenu: mainMenu,
                    footerMenu: footerMenu,
                    roleCounter: roleCounter,
                    username: username,
                })
                .then((data) => {
                    this.getCMSPermissionsForServer();
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async createPage(req, res, next) {
            const query = req.body;
            const dbName = req.body.dbName;
            delete req.body.dbName;

            this.broker
                .call('cms.pages.createPage', {
                    query: query,
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async deletePage(req, res, next) {
            const { dbName, pageId, workflowId, pageData, deletedBy } = req.body;

            this.broker
                .call('cms.pages.deletePage', {
                    dbName: dbName ? dbName : '',
                    pageId: pageId ? pageId : '',
                    pageData: pageData ? pageData : [],
                    workflowId: workflowId ? workflowId : '',
                    deletedBy: deletedBy ? deletedBy : '',
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async deleteTemplate(req, res, next) {
            const { dbName, templateId, templateData, deletedBy } = req.body;

            this.broker
                .call('cms.templates.deleteTemplate', {
                    dbName: dbName ? dbName : '',
                    templateId: templateId ? templateId : '',
                    templateData: templateData ? templateData : [],
                    deletedBy: deletedBy,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getTemplateHistoryData(req, res, next) {
            const dbName = req.query.dbName;
            const templateId = req.query.templateId;

            this.broker
                .call('cms.history.getTemplateHistoryData', {
                    dbName: dbName,
                    templateId: templateId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async historyTemplateCheckout(req, res, next) {
            const { dbName, title, templateId, version, workflow } = req.body;

            this.broker
                .call('cms.history.checkoutHistoryTemplate', {
                    dbName: dbName,
                    title: title,
                    templateId: templateId,
                    version: version,
                    workflow: workflow,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updatePage(req, res, next) {
            const pageData = req.body.pageData;
            const dbName = req.body.dbName;
            const pageId = req.body.pageId;
            const websiteId = req.body.websiteId;

            this.broker
                .call('cms.pages.updatePage', {
                    pageId: pageId,
                    dbName: dbName,
                    pageData: pageData,
                    websiteId: websiteId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateForm(req, res, next) {
            const dbName = req.body.dbName;
            const updatedForm = req.body.updatedForm;
            const id = req.body.id;

            this.broker
                .call('cms.forms.updateForm', {
                    id: id,
                    formData: updatedForm,
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateAllPages(req, res, next) {
            const pages = req.body.pages;
            const dbName = req.body.dbName;

            this.broker
                .call('cms.pages.updateAllPages', {
                    pages: pages,
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async insertPageData(req, res, next) {
            const query = req.body;
            const dbName = req.body.dbName;
            delete req.body.dbName;

            this.broker
                .call('cms.page-data.insertPageData', {
                    query: query,
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async insertPageSection(req, res, next) {
            const dbName = req.body.dbName;
            const pageId = req.body.page_id;
            const section = req.body.new_section;

            this.broker
                .call('cms.pages.insertPageSection', {
                    dbName: dbName,
                    pageId: pageId,
                    section: section,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async insertSectionData(req, res, next) {
            const dbName = req.body.dbName;
            const pageId = req.body.page_id;
            const sectionData = req.body.new_data;

            this.broker
                .call('cms.page-data.insertSectionData', {
                    dbName: dbName,
                    pageId: pageId,
                    sectionData: sectionData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateComponentData(req, res, next) {
            const dbName = req.body.dbName;
            const pageId = req.body._id;
            const updatedData = req.body.updated_data;

            this.broker
                .call('cms.page-data.updateComponentData', {
                    dbName: dbName,
                    pageId: pageId,
                    updatedData: updatedData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateAllPageComponentData(req, res, next) {
            const dbName = req.body.dbName;
            const pageId = req.body.pageId;
            const updatedPageContent = req.body.updatedPageContent;

            this.broker
                .call('cms.page-data.updateAllPageComponentData', {
                    dbName: dbName,
                    pageId: pageId,
                    updatedPageContent: updatedPageContent,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async uploadImage(req, res, next) {
            try {
                if (req.files === null) {
                    return res.status(400).json({ msg: 'No file uploaded!' });
                }
                const files = req.files;
                const dbName = req.body.dbName;

                if (!files.hasOwnProperty('file')) {
                    // If language wise content is present
                    const languages = Object.keys(files);
                    let results = {};

                    for (const language of languages) {
                        const file = req.files[language];

                        if (req.files[language].length !== undefined) {
                            console.log(
                                '------------If Multipe File Present---------',
                                req.files[language].length
                            );
                            // TODO - Multiple file uploads for single language
                        } else {
                            // If single file uploads for single language
                            console.log('------------If Single File Present----------');
                            const extension = path.extname(file.name);
                            const fileName = new Date().getTime() + extension;
                            const moveFile = util.promisify(file.mv);

                            // TODO: Delete the file after saving into database
                            await moveFile(`${UPLOAD_PATH}/${fileName}`);

                            const data = await this.broker.call('cms.page-data.uploadImage', {
                                dbName: dbName,
                                fileName: fileName,
                            });

                            results[language] = JSON.parse(data);
                        }
                    }

                    res.send(results);
                } else {
                    // - If language wise content is not present
                    let results = {};
                    const extension = path.extname(files.file.name);
                    const fileName = new Date().getTime() + extension;
                    const moveFile = util.promisify(files.file.mv);

                    // TODO: Delete the file after saving into database
                    await moveFile(`${UPLOAD_PATH}/${fileName}`);

                    const data = await this.broker.call('cms.page-data.uploadImage', {
                        dbName: dbName,
                        fileName: fileName,
                    });

                    results = JSON.parse(data);

                    return res.send(results);
                }
            } catch (error) {
                console.error(error);
                next(error);
            }
        },

        // when update images
        async ReplaceImageFile(req, res, next) {
            try {
                if (req.files === null) {
                    return res.status(400).json({ msg: 'No file uploaded!' });
                }
                const files = req.files;
                const dbName = req.body.dbName;
                const fileName = req.body.fileName;

                //deleting grid fs media file
                const dataExistingMediaFilesDelete = await this.broker.call(
                    'headless-cms.deleteExistingMediaFiles',
                    {
                        dbName: dbName,
                        fileName: fileName,
                    }
                );

                const moveFile = util.promisify(files.file.mv);

                // TODO: Delete the file after saving into database
                // move the new image to grid fs files,  use the same filename
                await moveFile(`${UPLOAD_PATH}/${fileName}`);

                const newImageReplacedGfs = await this.broker.call('cms.page-data.uploadImage', {
                    dbName: dbName,
                    fileName: fileName,
                });

                results = JSON.parse(newImageReplacedGfs);
                return res.send(results);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },

        async ReplaceImageThumbnail(req, res, next) {
            const dbName = req.body.dbName;
            const fileName = req.body.fileName;
            const thumbnailUri = req.body.thumbnailUri;

            const updateMediaImage = await this.broker.call('cms.page-data.ReplaceImageFile', {
                dbName: dbName,
                thumbnailUri: thumbnailUri,
                fileName: fileName,
            });
            console.log('update Media-Image -- ', updateMediaImage);

            results = JSON.parse(updateMediaImage);
            return res.send(results);
        },

        async deleteImage(req, res, next) {
            const dbName = req.body.dbName;
            const fileName = req.body.fileName;
            let results = {};

            //.files .chunks
            const dataExistingMediaFilesDelete = await this.broker.call(
                'headless-cms.deleteExistingMediaFiles',
                {
                    dbName: dbName,
                    fileName: fileName,
                }
            );
            console.log('dataExistingMediaFilesDelete ---', dataExistingMediaFilesDelete);
            //Image
            const dataExistingIconDelete = await this.broker.call(
                'headless-cms.deleteExistingImage',
                {
                    dbName: dbName,
                    fileName: fileName,
                }
            );
            results = JSON.parse(dataExistingIconDelete);
            return res.send(results);
        },

        async uploadVideo(req, res, next) {
            if (req.files === null) {
                return res.status(400).json({ msg: 'No file uploaded!' });
            }
            const files = req.files;
            const dbName = req.body.dbName;

            let results = [{}];
            const extension = path.extname(files.file.name);
            const uniqueId = new Date().getTime();
            const fileName = uniqueId + extension;

            files.file.mv(`${UPLOAD_PATH}/${fileName}`, (err) => {
                if (err) {
                    console.error(err);
                    return err;
                }
            });

            const data = await this.broker.call('cms.page-data.uploadImage', {
                dbName: dbName,
                fileName: fileName,
            });
            results[0] = JSON.parse(data);

            const createdThumb = await this.genarateThumbnail(fileName);
            if (createdThumb === 'success') {
                const thumbnailData = await this.broker.call('cms.page-data.uploadImage', {
                    dbName: dbName,
                    fileName: 'thumbnail-' + uniqueId + '.png',
                });
                results[1] = JSON.parse(thumbnailData);
                console.log('results ----', results);
                return res.send(results);
            }
        },

        async genarateThumbnail(fileName) {
            let filePath = '';
            ffmpeg.ffprobe(`${UPLOAD_PATH}/${fileName}`, function (err, metadata) {});

            const ffg = ffmpeg(`${UPLOAD_PATH}/${fileName}`)
                .on('filenames', function (filenames) {
                    filePath = `${UPLOAD_PATH}/${fileName}`;
                })
                .on('end', function (filenames) {
                    return {
                        success: true,
                        url: filePath,
                    };
                })
                .on('error', function (err) {
                    return { success: false, err };
                })
                .screenshots({
                    count: 1,
                    folder: `${UPLOAD_PATH}`,
                    size: '240x180',
                    filename: 'thumbnail-%b.png',
                });

            const end = new Promise(function (resolve, reject) {
                ffg.on('end', () => resolve('success'));
                ffg.on('error', reject);
            });

            const results = await end;
            return results;
        },

        async uploadIcons(req, res, next) {
            let filesArry = [];
            filesArry = req.files.file;
            const dbName = req.body.dbName;
            let results = {};

            if (filesArry.length > 1) {
                for (var i in filesArry) {
                    const fileName = filesArry[i].name;

                    filesArry[i].mv(`${UPLOAD_PATH}/${fileName}`, (err) => {
                        if (err) {
                            console.error(err);
                            return err;
                        }
                    });
                    //check icon name does exists
                    const dataExistingIcon = await this.broker.call(
                        'headless-cms.getExistingIcon',
                        {
                            dbName: dbName,
                            fileName: fileName,
                        }
                    );

                    // if icon name exists, remove them from collections.
                    if (dataExistingIcon != null) {
                        const dataExistingMedia = await this.broker.call(
                            'headless-cms.getExistingMedia',
                            {
                                dbName: dbName,
                                fileName: fileName,
                            }
                        );
                        //.chunk
                        const dataExistingMediaChunksDelete = await this.broker.call(
                            'headless-cms.deleteExistingMediaChunks',
                            {
                                dbName: dbName,
                                id: dataExistingMedia._id,
                            }
                        );
                        //.files
                        const dataExistingMediaFilesDelete = await this.broker.call(
                            'headless-cms.deleteExistingMediaFiles',
                            {
                                dbName: dbName,
                                fileName: fileName,
                            }
                        );
                        //Icons
                        const dataExistingIconDelete = await this.broker.call(
                            'headless-cms.deleteExistingIcon',
                            {
                                dbName: dbName,
                                fileName: fileName,
                            }
                        );
                    }

                    // add data to Gridfs
                    const data = await this.broker.call('cms.page-data.uploadImage', {
                        dbName: dbName,
                        fileName: fileName,
                    });
                    results = JSON.parse(data);

                    // add data to media-icons
                    const dataInsertNewCollection = await this.broker.call(
                        'cms.custom-collections.insertNewCollection',
                        {
                            dbName: dbName,
                            query: {
                                fileName: fileName,
                                filePath: `/api/page-data/getImage/${dbName}/${fileName}`,
                            },
                            collectionName: 'media-icons',
                        }
                    );
                }
            } // if one icon uploaded
            else {
                const fileName = filesArry.name;

                filesArry.mv(`${UPLOAD_PATH}/${fileName}`, (err) => {
                    if (err) {
                        console.error(err);
                        return err;
                    }
                });

                //check icon name does exists
                const dataExistingIcon = await this.broker.call('headless-cms.getExistingIcon', {
                    dbName: dbName,
                    fileName: fileName,
                });

                // if icon name exists, remove them from collections.
                if (dataExistingIcon != null) {
                    const dataExistingMedia = await this.broker.call(
                        'headless-cms.getExistingMedia',
                        {
                            dbName: dbName,
                            fileName: fileName,
                        }
                    );
                    //.chunk
                    const dataExistingMediaChunksDelete = await this.broker.call(
                        'headless-cms.deleteExistingMediaChunks',
                        {
                            dbName: dbName,
                            id: dataExistingMedia._id,
                        }
                    );
                    //.files
                    const dataExistingMediaFilesDelete = await this.broker.call(
                        'headless-cms.deleteExistingMediaFiles',
                        {
                            dbName: dbName,
                            fileName: fileName,
                        }
                    );
                    //Icons
                    const dataExistingIconDelete = await this.broker.call(
                        'headless-cms.deleteExistingIcon',
                        {
                            dbName: dbName,
                            fileName: fileName,
                        }
                    );
                }

                const data = await this.broker.call('cms.page-data.uploadImage', {
                    dbName: dbName,
                    fileName: fileName,
                });

                // add data to media-icons
                const dataInsertNewCollection = await this.broker.call(
                    'cms.custom-collections.insertNewCollection',
                    {
                        dbName: dbName,
                        query: {
                            fileName: fileName,
                            filePath: `/api/page-data/getImage/${dbName}/${fileName}`,
                        },
                        collectionName: 'media-icons',
                    }
                );
                results = JSON.parse(data);
            }

            return res.send(results);
        },

        async deleteIcon(req, res, next) {
            const dbName = req.body.dbName;
            const fileName = req.body.fileName;
            let results = {};

            const dataExistingMedia = await this.broker.call('headless-cms.getExistingMedia', {
                dbName: dbName,
                fileName: fileName,
            });
            //.chunk
            const dataExistingMediaChunksDelete = await this.broker.call(
                'headless-cms.deleteExistingMediaChunks',
                {
                    dbName: dbName,
                    id: dataExistingMedia._id,
                }
            );
            //.files
            const dataExistingMediaFilesDelete = await this.broker.call(
                'headless-cms.deleteExistingMediaFiles',
                {
                    dbName: dbName,
                    fileName: fileName,
                }
            );
            //Icons
            const dataExistingIconDelete = await this.broker.call(
                'headless-cms.deleteExistingIcon',
                {
                    dbName: dbName,
                    fileName: fileName,
                }
            );
            results = JSON.parse(dataExistingIconDelete);
            return res.send(results);
        },

        async deleteVideo(req, res, next) {
            const dbName = req.body.dbName;
            const fileName = req.body.fileName;
            let results = {};

            const dataExistingMedia = await this.broker.call('headless-cms.getExistingMedia', {
                dbName: dbName,
                fileName: fileName,
            });
            //.chunk
            const dataExistingMediaChunksDelete = await this.broker.call(
                'headless-cms.deleteExistingMediaChunks',
                {
                    dbName: dbName,
                    id: dataExistingMedia._id,
                }
            );

            //.files
            const dataExistingMediaFilesDelete = await this.broker.call(
                'headless-cms.deleteExistingMediaFiles',
                {
                    dbName: dbName,
                    fileName: fileName,
                }
            );
            //delete media-videos
            const dataExistingIconDelete = await this.broker.call(
                'headless-cms.deleteExistingVideo',
                {
                    dbName: dbName,
                    fileName: fileName,
                }
            );
            results = JSON.parse(dataExistingIconDelete);
            return res.send(results);
        },

        async ckEditorUploadImage(req, res, next) {
            try {
                if (req.files === null) {
                    return res.status(400).json({ msg: 'No file uploaded!' });
                }

                const file = req.files.upload;
                const dbName = req.header('dbName');
                const extension = path.extname(file.name);
                const fileName = new Date().getTime() + extension;
                const moveFile = util.promisify(file.mv);

                // TODO: Delete the file after saving into database
                // move the new image to grid fs files,  use the same filename
                await moveFile(`${UPLOAD_PATH}/${fileName}`);

                const data = await this.broker.call('cms.page-data.ckEditorUploadImage', {
                    dbName: dbName,
                    fileName: fileName,
                });

                return res.send(JSON.parse(data));
            } catch (error) {
                console.error(error);
                next(error);
            }
        },

        async getAllThemes(req, res, next) {
            let dbName = req.query.dbName;
            this.broker
                .call('cms.theme.getAllThemes', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateThemeData(req, res, next) {
            const dbName = req.body.dbName;
            const pageId = req.body.pageId;
            const updatedData = req.body.themeData;

            this.broker
                .call('cms.theme.updateThemeData', {
                    dbName: dbName,
                    pageId: pageId,
                    updatedData: updatedData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async insertNewCollection(req, res, next) {
            const query = req.body.pageData;
            const dbName = req.body.dbName;
            const collectionName = req.body.collection;
            delete req.body.dbName;

            this.broker
                .call('cms.custom-collections.insertNewCollection', {
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

        async addCustomCollectionData(req, res, next) {
            const query = req.body.data;
            const dbName = req.body.nameSpace;
            const collectionName = req.body.collectionName;
            delete req.body.dbName;

            this.broker
                .call('cms.custom-collections.insertDynamicFormData', {
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
                        .call('cms.custom-collections.insertDynamicFormData', {
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

        async getcustomCollectionDocsByCollectionAndId(req, res, next) {
            const dbName = req.query.dbName;
            const mappingQuery = req.query.mappingQuery;

            this.broker
                .call('cms.custom-collections.getcustomCollectionDocsByCollectionAndId', {
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

        async getDocumentHistory(req, res, next) {
            const dbName = req.query.dbName;
            const id = req.query.id;
            const collection = req.query.collection;
            const limit = req.query.limit;

            this.broker
                .call('cms.custom-collections.getDocumentHistory', {
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

        async getLastUpdatedDocumentMetaInfo(req, res, next) {
            const dbName = req.query.dbName;
            const collection = req.query.collection;

            this.broker
                .call('cms.custom-collections.getLastUpdatedDocumentMetaInfo', {
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

        async createCustomTree(req, res, next) {
            const title = req.body.title;
            const dbName = req.body.dbName;

            this.broker
                .call('cms.custom-collections.createCustomTree', {
                    dbName: dbName,
                    title: title,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllCustomTrees(req, res, next) {
            const dbName = req.query.dbName;
            const user = req.query.user;

            this.broker
                .call('cms.custom-collections.getAllCustomTrees', {
                    dbName: dbName,
                    user: user,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getCustomTreeById(req, res, next) {
            const dbName = req.query.dbName;
            const id = req.query.id;

            this.broker
                .call('cms.custom-collections.getCustomTreeById', {
                    dbName: dbName,
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateCustomTree(req, res, next) {
            const id = req.body.id;
            const dbName = req.body.dbName;
            const tree = req.body.tree;

            this.broker
                .call('cms.custom-collections.updateCustomTree', {
                    dbName: dbName,
                    id: id,
                    tree: tree,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getTreeCustomCollections(req, res, next) {
            const dbName = req.query.dbName;
            const treeId = req.query.treeId;
            const nodeId = req.query.nodeId;
            const nodePath = req.query.nodePath;

            this.broker
                .call('cms.custom-collections.getTreeCustomCollections', {
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

        async searchTreeCustomCollections(req, res, next) {
            const dbName = req.query.dbName;
            const treeId = req.query.treeId;
            const parentNodeIds = req.query.parentNodeIds;
            const keyWord = req.query.keyWord;
            const sorting = req.query.sorting;

            this.broker
                .call('cms.custom-collections.searchTreeCustomCollections', {
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

        async deleteTreeCustomCollections(req, res, next) {
            const dbName = req.body.dbName;
            const treeId = req.body.treeId;
            const deletedBy = req.body.deletedBy;

            this.broker
                .call('cms.custom-collections.deleteTreeCustomCollections', {
                    dbName: dbName,
                    treeId: treeId,
                    deletedBy: deletedBy,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async createCustomCollection(req, res, next) {
            const query = req.body.pageData;
            const dbName = req.body.dbName;
            const collectionName = req.body.collection;
            delete req.body.dbName;
            this.broker
                .call('cms.custom-collections.createCustomCollection', {
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

        async updateCollectionType(req, res, next) {
            const dbName = req.body.dbName;
            const collectionName = req.body.collectionName;
            const pageId = req.body._id;
            const updatedData = req.body.updated_data;

            this.broker
                .call('cms.custom-collections.updateCollectionType', {
                    dbName: dbName,
                    collectionName: collectionName,
                    pageId: pageId,
                    updatedData: updatedData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getcustomCollectionTypes(req, res, next) {
            const query = req.query.searchQuery;
            const dbName = req.query.dbName;
            const collectionName = req.query.collection;
            const user = req.query.user;
            const sorter = req.query.sorter ? JSON.parse(req.query.sorter) : {};
            delete req.body.dbName;

            this.broker
                .call('cms.custom-collections.getcustomCollectionTypes', {
                    dbName: dbName,
                    query: query,
                    collectionName: collectionName,
                    user: user,
                    sorter: sorter,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getCollectionAll(req, res, next) {
            const dbName = req.query.dbName;
            const collectionName = req.query.collection;
            delete req.body.dbName;

            this.broker
                .call('cms.custom-collections.getCollectionAll', {
                    dbName: dbName,
                    collectionName: collectionName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getImagesByTitle(req, res, next) {
            const query = req.query.searchQuery;
            const dbName = req.query.dbName;
            const collectionName = req.query.collection;
            delete req.body.dbName;

            this.broker
                .call('cms.custom-collections.getImagesByTitle', {
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

            res.send(data);
        },

        async getVideosByTitle(req, res, next) {
            const query = req.query.searchQuery;
            const dbName = req.query.dbName;
            const collectionName = req.query.collection;
            delete req.body.dbName;

            this.broker
                .call('cms.custom-collections.getVideosByTitle', {
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

        async getIconsByFileName(req, res, next) {
            const query = req.query.searchQuery;
            const dbName = req.query.dbName;
            const collectionName = req.query.collection;
            delete req.body.dbName;

            this.broker
                .call('cms.custom-collections.getIconsByFileName', {
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

        async getImagesByDesc(req, res, next) {
            const query = req.query.searchQuery;
            const dbName = req.query.dbName;
            const collectionName = req.query.collection;
            delete req.body.dbName;

            this.broker
                .call('cms.custom-collections.getImagesByDesc', {
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

        async updateCollectionDoc(req, res, next) {
            const dbName = req.body.dbName;
            const collectionName = req.body.collectionName;
            const pageId = req.body._id;
            const updatedData = req.body.updated_data;

            this.broker
                .call('cms.custom-collections.updateCollectionDoc', {
                    dbName: dbName,
                    collectionName: collectionName,
                    pageId: pageId,
                    updatedData: updatedData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getDocument(req, res, next) {
            const fileName = req.params.filename;
            const dbName = req.params.dbname;

            const data = await this.broker
                .call('cms.custom-collections.getDocument', {
                    dbName: dbName,
                    fileName: fileName,
                })
                .then((data) => {
                    data.pipe(res);
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
                const dbName = req.body.dbName;
                const extension = path.extname(file.name);
                const fileName = new Date().getTime() + extension;
                const moveFile = util.promisify(file.mv);

                // TODO: Delete the file after saving into database
                // move the new image to grid fs files,  use the same filename
                await moveFile(`${UPLOAD_PATH}/${fileName}`);

                const data = await this.broker.call(
                    'cms.custom-collections.uploadDocument',
                    {
                        dbName: dbName,
                        fileName: fileName,
                    },
                    { nodeID: HEADLESS_NODE }
                );

                return res.send(data);
            } catch (error) {
                next(error);
            }
        },

        async getAllMenu(req, res, next) {
            let dbName = req.query.dbName;
            const data = await this.broker
                .call('cms.menu.getAllMenu', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllAppMenu(ctx) {
            const data = await this.broker.call('cms.menu.getAllMenu', {
                ...ctx.params,
            });
            return data;
        },

        async getAllCustomCollection(req, res, next) {
            let dbName = req.query.dbName;
            this.broker
                .call('cms.custom-collections.getAllCustomCollection', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllUser(req, res, next) {
            let dbName = req.query.dbName;

            this.broker
                .call('cms.users.getAllUser', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateUser(req, res, next) {
            console.log('updateUser', req.body);
            let dbName = req.query.dbName;
            let user = req.body;
            this.broker
                .call('cms.users.updateUser', {
                    dbName: dbName,
                    user: user,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async addUser(req, res, next) {
            console.log('addUsers', req.body);
            let dbName = req.query.dbName;
            let user = req.body;
            this.broker
                .call('cms.users.addUser', {
                    dbName: dbName,
                    user: user,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async removeUser(req, res, next) {
            const { dbName, user } = req.body;
            this.broker
                .call('cms.users.removeUser', {
                    dbName: dbName,
                    user: user,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllRole(req, res, next) {
            let dbName = req.query.dbName;
            this.broker
                .call('cms.site-permissions.getAllRole', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllCmsUserPermission(req, res, next) {
            let dbName = req.query.dbName;
            this.broker
                .call('cms.cms-permissions.getAllCmsUserPermission', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getCMSPermissionsForClient(req, res) {
            console.log('==================getCMSPermissionsForClient called -----------------');
            let roleId = 1; //TODO : this one can get from user cache after login implement
            let username = req.query.username;
            const data = await this.broker.call('cms.cms-permissions.getCMSPermissionsForClient', {
                roleId: roleId,
                username: username,
            });
            console.log(data);
            res.send(data);
        },

        async getAllCmsRole(req, res, next) {
            let dbName = req.query.dbName;
            this.broker
                .call('cms.cms-permissions.getAllCmsRole', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getApprovedCmsRole(req, res, next) {
            let dbName = req.query.dbName;
            this.broker
                .call('cms.cms-permissions.getApprovedCmsRole', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllCmsFeatureOperations(req, res, next) {
            let dbName = req.query.dbName;
            this.broker
                .call('cms.cms-permissions.getAllCmsFeatureOperations', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async saveAllMenu(req, res, next) {
            let dbName = req.query.dbName;
            let menu = req.body;
            await cache.getCache().deleteFromCash('menu-obj');
            console.log('Menu cache cleared');
            this.broker
                .call('cms.menu.saveAllMenu', {
                    dbName: dbName,
                    menu: menu,
                })
                .then((data) => {
                    this.getSitePermissionsForServer(dbName);
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async saveMenu(req, res, next) {
            let dbName = req.query.dbName;
            let menu = req.body;

            await cache.getCache().deleteFromCash('menu-obj');
            console.log('Menu cache cleared');

            this.broker
                .call('cms.menu.saveMenu', {
                    dbName: dbName,
                    menu: menu,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getMainMenuNamesForMappedPages(req, res, next) {
            let dbName = req.query.dbName;

            this.broker
                .call('cms.menu.getMainMenuNamesForMappedPages', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateLinkPage(req, res, next) {
            console.log('updateLinkPage', req.body);
            let dbName = req.query.dbName;
            let page = req.body;
            this.broker
                .call('cms.pages.updateLinkPage', {
                    dbName: dbName,
                    page: page,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllUnLinkPages(req, res, next) {
            let { dbName, workflowState } = req.query;
            // let page = req.body;
            this.broker
                .call('cms.pages.getAllUnLinkPages', {
                    dbName: dbName,
                    workflowState: workflowState ? workflowState : '',
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async duplicatePage(req, res, next) {
            const dbName = req.body.dbName;
            const pageId = req.body.pageId;
            const pageTitle = req.body.pageName;
            const masterTemplateId = req.body.masterTemplate;
            const workflow = req.body.pageWorkflow;

            this.broker
                .call('cms.pages.duplicatePage', {
                    dbName: dbName,
                    pageId: pageId,
                    pageTitle: pageTitle,
                    masterTemplateId: masterTemplateId,
                    workflow: workflow,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async pagesRecordLock(req, res, next) {
            const dbName = req.body.dbName || undefined;
            const pageId = req.body.pageId || undefined;
            const query = req.body.query ? JSON.parse(req.body.query) : undefined;
            const activeUserId = req.body.activeUserId || undefined;

            this.broker
                .call('cms.pages.recordLock', {
                    dbName: dbName,
                    pageId: pageId,
                    query: query,
                    activeUserId: activeUserId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async templatesRecordLock(req, res, next) {
            const dbName = req.body.dbName || undefined;
            const templateId = req.body.templateId || undefined;
            const query = req.body.query ? JSON.parse(req.body.query) : undefined;
            const activeUserId = req.body.activeUserId || undefined;

            this.broker
                .call('cms.templates.recordLock', {
                    dbName: dbName,
                    templateId: templateId,
                    query: query,
                    activeUserId: activeUserId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async pagesRecordUnLock(req, res, next) {
            const dbName = req.body.dbName || undefined;
            const pageId = req.body.pageId || undefined;
            const query = req.body.query ? JSON.parse(req.body.query) : undefined;
            const activeUserId = req.body.activeUserId || undefined;

            this.broker
                .call('cms.pages.recordUnLock', {
                    dbName: dbName,
                    pageId: pageId,
                    query: query,
                    activeUserId: activeUserId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async templatesRecordUnLock(req, res, next) {
            const dbName = req.body.dbName || undefined;
            const templateId = req.body.templateId || undefined;
            const query = req.body.query ? JSON.parse(req.body.query) : undefined;
            const activeUserId = req.body.activeUserId || undefined;

            this.broker
                .call('cms.templates.recordUnLock', {
                    dbName: dbName,
                    templateId: templateId,
                    query: query,
                    activeUserId: activeUserId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async saveAllFeature(req, res, next) {
            console.log('saveAllFeature', req.body);
            let dbName = req.query.dbName;
            let feature = req.body;
            this.broker
                .call('cms.cms-permissions.saveAllFeature', {
                    dbName: dbName,
                    feature: feature,
                })
                .then((data) => {
                    this.getCMSPermissionsForServer();
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async saveAllCustomCollection(req, res, next) {
            let dbName = req.query.dbName;
            let customCollections = req.body;
            this.broker
                .call('cms.custom-collections.saveAllCustomCollection', {
                    dbName: dbName,
                    customCollections: customCollections,
                })
                .then((data) => {
                    this.getSitePermissionsForServer(dbName);
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllMasterInfo(req, res, next) {
            this.broker
                .call('cms.master-info.getAllMasterInfo')
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateMasterInfo(req, res, next) {
            const updatedData = req.body.masterInfo;
            const id = req.body.id;

            this.broker
                .call('cms.master-info.updateMasterInfo', {
                    updatedData: updatedData,
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updatePageWorkflow(req, res, next) {
            const dbName = req.body.dbName;
            const pageWorkflow = req.body.pageWorkflow;
            const pageId = req.body.pageId;

            this.broker
                .call('cms.workflow.updatePageWorkflow', {
                    dbName: dbName,
                    pageWorkflow: pageWorkflow,
                    pageId: pageId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateDocumentWorkflow(req, res, next) {
            const dbName = req.body.dbName;
            const draftCollectionName = req.body.draftCollectionName;
            const collectionName = req.body.collectionName;
            const workflow = req.body.workflow;
            const docId = req.body.docId;

            this.broker
                .call('cms.workflow.updateDocumentWorkflow', {
                    dbName: dbName,
                    draftCollectionName: draftCollectionName,
                    collectionName: collectionName,
                    workflow: workflow,
                    docId: docId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async customCollectionRecordDelete(req, res, next) {
            const dbName = req.body.dbName;
            const draftCollectionName = req.body.draftCollectionName;
            const collectionName = req.body.collectionName;
            const workflow = req.body.workflow;
            const docId = req.body.docId;
            const deletedBy = req.body.deletedBy;

            this.broker
                .call('cms.custom-collections.customCollectionRecordDelete', {
                    dbName: dbName,
                    draftCollectionName: draftCollectionName,
                    collectionName: collectionName,
                    workflow: workflow,
                    docId: docId,
                    deletedBy: deletedBy,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getFilteredWorkflows(req, res, next) {
            const dbName = req.query.dbName;
            const query = req.query.query;
            const filter = req.query.filter;
            const sorter = req.query.sorter;
            this.broker
                .call('cms.workflow.getFilteredWorkflows', {
                    dbName: dbName,
                    query: query,
                    filter: filter,
                    sorter: sorter,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getWorkflowState(req, res, next) {
            const dbName = req.query.dbName;
            const id = req.query.id;
            this.broker
                .call('cms.workflow.getWorkflowState', {
                    dbName: dbName,
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getWorkflows(req, res, next) {
            const dbName = req.query.dbName;
            const idList = req.query.idList;
            this.broker
                .call('cms.workflow.getWorkflows', {
                    dbName: dbName,
                    idList: idList,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getCustomCollectionWorkflows(req, res, next) {
            const dbName = req.query.dbName;
            const collectionName = req.query.collectionName;
            console.log('--getCustomCollectionWorkflows--');
            this.broker
                .call('cms.workflow.getCustomCollectionWorkflows', {
                    dbName: dbName,
                    collectionName: collectionName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateTemplateWorkflow(req, res, next) {
            const dbName = req.body.dbName;
            const pageWorkflow = req.body.pageWorkflow;
            const pageId = req.body.pageId;

            this.broker
                .call('cms.workflow.updateTemplateWorkflow', {
                    dbName: dbName,
                    pageWorkflow: pageWorkflow,
                    pageId: pageId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateBannerWorkflow(req, res, next) {
            const dbName = req.body.dbName;
            const pageWorkflow = req.body.pageWorkflow;
            const pageId = req.body.pageId;

            this.broker
                .call('cms.workflow.updateBannerWorkflow', {
                    dbName: dbName,
                    pageWorkflow: pageWorkflow,
                    pageId: pageId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateFormWorkflow(req, res, next) {
            const dbName = req.body.dbName;
            const formWorkflow = req.body.formWorkflow;
            const formId = req.body.formId;

            this.broker
                .call('cms.workflow.updateFormWorkflow', {
                    dbName: dbName,
                    formWorkflow: formWorkflow,
                    formId: formId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateRole(req, res, next) {
            console.log('updateRole', req.body);
            let dbName = req.query.dbName;
            let role = req.body;
            this.broker
                .call('cms.site-permissions.updateRole', {
                    dbName: dbName,
                    role: role,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async insertMenuItem(req, res, next) {
            const dbName = req.body.dbName;
            const pageId = req.body.page_id;
            const section = req.body.new_section;

            this.broker
                .call('cms.menu.insertMenuItem', {
                    dbName: dbName,
                    pageId: pageId,
                    section: section,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async deletePageFromMenu(req, res, next) {
            const dbName = req.body.dbName;
            const pageId = req.body.page_id;

            this.broker
                .call('cms.menu.deletePageFromMenu', {
                    dbName: dbName,
                    pageId: pageId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async addRole(req, res, next) {
            console.log('addRole', req.body);
            let dbName = req.query.dbName;
            let role = req.body;
            this.broker
                .call('cms.site-permissions.addRole', {
                    dbName: dbName,
                    role: role,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async removeRole(req, res, next) {
            const { dbName, role } = req.body;
            this.broker
                .call('cms.site-permissions.removeRole', {
                    dbName: dbName,
                    role: role,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateCMSRole(req, res, next) {
            console.log('updateCMSRole', req.body);
            let dbName = req.query.dbName;
            let role = req.body;
            this.broker
                .call('cms.cms-permissions.updateCMSRole', {
                    dbName: dbName,
                    role: role,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async addCMSRole(req, res, next) {
            console.log('addCMSRole', req.body);
            let dbName = req.query.dbName;
            let role = req.body;
            this.broker
                .call('cms.cms-permissions.addCMSRole', {
                    dbName: dbName,
                    role: role,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async removeCMSRole(req, res, next) {
            const { dbName, role } = req.body;
            this.broker
                .call('cms.cms-permissions.removeCMSRole', {
                    dbName: dbName,
                    role: role,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async saveRoleAllowedDocuments(req, res, next) {
            const dbName = req.body.dbName;
            const roleId = req.body.roleId;
            const allowedList = req.body.allowedList;
            const allowedTreeList = req.body.allowedTreeList;
            this.broker
                .call('cms.cms-permissions.saveRoleAllowedDocuments', {
                    dbName: dbName,
                    roleId: roleId,
                    allowedList: allowedList,
                    allowedTreeList: allowedTreeList,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getRoleAllowedDocuments(req, res, next) {
            const dbName = req.query.dbName;
            const roleId = req.query.roleId;
            this.broker
                .call('cms.cms-permissions.getRoleAllowedDocuments', {
                    dbName: dbName,
                    roleId: roleId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getSitePermissionsForServer(dbName) {
            this.broker
                .waitForServices('headless-cms')
                .then(() => {
                    this.broker
                        .call('cms.site-permissions.getSitePermissionsForServer', {
                            dbName: dbName,
                        })
                        .then((data) => {
                            const response = JSON.parse(data);
                            //logger.info('Site permissions for server : ' + response.length);
                            console.log('Site permissions for server : ' + response.length);

                            if (response && response.length > 0) {
                                for (let i = 0; i < response.length; i++) {
                                    cache.getCache().deleteFromCash(response[i].name);
                                    for (let j = 0; j < response[i].value.length; j++) {
                                        let words = response[i].value[j].split(':');
                                        //logger.info(words);
                                        console.log(words);

                                        if (words.length === 1) {
                                            cache
                                                .getCache()
                                                .addToCacheH(response[i].name, words[0], '-1');
                                        } else {
                                            cache
                                                .getCache()
                                                .addToCacheH(response[i].name, words[0], words[1]);
                                        }
                                    }
                                    return 'success';
                                }
                            } else {
                                logger.info('Site permission data not received from cms');
                            }
                        })
                        .catch((err) => {
                            errorHandlerService.errorHandler(err);
                        });
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });
        },

        async getPathsForRole(req, res, next) {
            const dbName = req.query.dbName;
            const roleId = 2; //todo this one get from cms session

            this.broker
                .call('cms.site-permissions.getPathsForRole', {
                    dbName: dbName,
                    roleId: roleId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getSitePermissionsForClient(ctx) {
            const data = await this.broker.call(
                'cms.site-permissions.getSitePermissionsForClient',
                {
                    dbName: ctx.params.dbName,
                    roleId: 1,
                }
            );

            return data;
        },

        async getWorkflowWithRoles(req, res, next) {
            this.broker
                .call('cms.cms-permissions.getWorkflowWithRoles', {})
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async appServerGetCollectionData(ctx) {
            console.log('----------Method - appServerGetCollectionData--------------');
            console.log(ctx.params);
            const data = await this.broker
                .call('headless-cms.appServerGetCollectionData', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },

        async appServerGetSingleDocument(ctx) {
            console.log('----------Method - appServerGetSingleDocument--------------');
            console.log(ctx.params);
            const data = await this.broker
                .call('headless-cms.appServerGetSingleDocument', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },

        async appServerGetSingleDocumentById(ctx) {
            console.log('----------Method - appServerGetSingleDocumentById--------------');
            console.log(ctx.params);
            const data = await this.broker
                .call('headless-cms.appServerGetSingleDocumentById', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },

        async appServerInsertRecord(ctx) {
            const data = await this.broker
                .call('headless-cms.appServerInsertRecord', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },
        async appServerUploadDocument(ctx) {
            try {
                const file = ctx.params.file;
                const dbName = ctx.params.dbName;
                const extension = path.extname(file.name);
                const fileName = new Date().getTime() + extension;
                const buffer = Buffer.from(file.data.data);

                const fileCreation = await this.createFileFromStream(
                    buffer,
                    `${UPLOAD_PATH}/${fileName}`
                );

                if (fileCreation === 'error') {
                    return JSON.stringify({ msg: 'No file uploaded!' });
                }

                const data = await this.broker.call(
                    'cms.custom-collections.uploadDocument',
                    {
                        dbName: dbName,
                        fileName: fileName,
                    },
                    { nodeID: HEADLESS_NODE }
                );

                return data;
            } catch (error) {
                console.log(error);
                return JSON.stringify({ msg: 'No file uploaded!' });
            }
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

        async appServerAddCustomCollectionData(ctx) {
            const data = await this.broker
                .call('cms.custom-collections.insertDynamicFormData', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },

        async cmsServerGetDocsByCollectionAndId(ctx) {
            console.log('----------Method - cmsServerGetDocsByCollectionAndId--------------');
            console.log(ctx.params);
            const data = await this.broker
                .call('cms.custom-collections.getcustomCollectionDocsByCollectionAndId', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },

        async appServerGetImage(ctx) {
            console.log('----------Method - appServerGetImage--------------');
            console.log(ctx.params);
            const data = await this.broker
                .call('headless-cms.appServerGetImage', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            console.log('appServerGetImage method***************', data);
            logger.log('info', 'appServerGetImage method***************', data);
            return data;
        },

        async appServerGetDocument(ctx) {
            console.log('----------Method - appServerGetDocument--------------');
            console.log(ctx.params);
            const data = await this.broker
                .call('headless-cms.appServerGetDocument', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },

        async getLoggedUser(req, res, next) {
            const user = req.query.user;
            const password = req.query.password;

            this.broker
                .call('cms.users.getLoggedUser', {
                    user: user,
                    password: password,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async login(req, res, next) {
            console.log('login service called .............');
            const user = req.query.user;
            const password = req.query.password;

            this.broker
                .call('auth-service.login', {
                    username: user,
                    password: password,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async adLogin(req, res, next) {
            console.log('adLogin service called .............');

            this.broker
                .call('auth-service.adLogin', {})
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async adRedirect(req, res, next) {
            console.log('Ad Redirect service called .............');
            const sessionId = req.query.sessionId;
            const encryptedUsername = req.query.encryptedUsername;
            const errorCode = req.query.errorCode;

            this.broker
                .call('auth-service.adRedirect', {
                    sessionId: sessionId,
                    encryptedUsername: encryptedUsername,
                    errorCode: errorCode,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async logout(req, res, next) {
            console.log('logout service called ..........');
            res.send('done');
        },

        async getAllUsers(req, res, next) {
            this.broker
                .call('cms.users.getAllUsers')
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getPageHistoryData(req, res, next) {
            const dbName = req.query.dbName;
            const pageId = req.query.pageId;

            this.broker
                .call('cms.history.getPageHistoryData', {
                    dbName: dbName,
                    pageId: pageId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getDocHistoryData(req, res, next) {
            const dbName = req.query.dbName;
            const collection = req.query.collection;

            this.broker
                .call('cms.history.getDocHistoryData', {
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

        async historyPageCheckout(req, res, next) {
            const { dbName, title, pageId, version, workflow } = req.body;

            this.broker
                .call('cms.history.checkoutHistoryPage', {
                    dbName: dbName,
                    title: title,
                    pageId: pageId,
                    version: version,
                    workflow: workflow,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getPageHistoryActivityLogs(req, res, next) {
            const dbName = req.query.dbName;
            const pageId = req.query.pageId;

            this.broker
                .call('cms.activity-logs.getPageHistoryActivityLogs', {
                    dbName: dbName,
                    pageId: pageId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getDocHistoryActivityLogs(req, res, next) {
            const dbName = req.query.dbName;
            const type = req.query.type;
            const collection = req.query.collection;

            this.broker
                .call('cms.activity-logs.getDocHistoryActivityLogs', {
                    dbName: dbName,
                    type: type,
                    collection: collection,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllActivityLogs(req, res, next) {
            const dbName = req.body.dbName;
            const searchQ = req.body.searchQ;
            //TODO: remove hardcoded selection which should come from frontend
            let sortQ = { _id: -1 };
            let limit = null;
            let page = null;

            this.broker
                .call('cms.activity-logs.getAllActivityLogs', {
                    dbName: dbName,
                    searchQ: searchQ,
                    sortQ: sortQ,
                    limit: limit,
                    page: page,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getTemplateHistoryActivityLogs(req, res, next) {
            const dbName = req.query.dbName;
            const templateId = req.query.templateId;

            this.broker
                .call('cms.activity-logs.getTemplateHistoryActivityLogs', {
                    dbName: dbName,
                    templateId: templateId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getBannerHistoryActivityLogs(req, res, next) {
            const dbName = req.query.dbName;
            const bannerId = req.query.id;

            this.broker
                .call('cms.activity-logs.getBannerHistoryActivityLogs', {
                    dbName: dbName,
                    bannerId: bannerId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async createTemplate(req, res, next) {
            const query = req.body;
            const dbName = req.body.dbName;
            delete req.body.dbName;
            this.broker
                .call('cms.templates.createTemplate', {
                    query: query,
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async duplicateTemplate(req, res, next) {
            const query = req.body;
            const dbName = req.body.dbName;
            delete req.body.dbName;

            this.broker
                .call('cms.templates.duplicateTemplate', {
                    query: query,
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllTemplates(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('cms.templates.getAllTemplates', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllApprovedTemplates(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('cms.templates.getAllApprovedTemplates', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllTemplateContentData(req, res, next) {
            const dbName = req.query.dbName;
            const idList = req.query.idList;
            this.broker
                .call('cms.templates.getAllTemplateContentData', {
                    dbName: dbName,
                    idList: idList,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getPublishablePagesTemplatesData(req, res, next) {
            const dbName = req.query.dbName;
            const publishLevel = req.query.publishLevel;

            this.broker
                .call('cms.templates.getPublishablePagesTemplatesData', {
                    dbName: dbName,
                    publishLevel: publishLevel,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateAllTemplateComponentData(req, res, next) {
            const dbName = req.body.dbName;
            const templateId = req.body.templateId;
            const updatedTemplateContent = req.body.updatedTemplateContent;

            this.broker
                .call('cms.templates.updateAllTemplateComponentData', {
                    dbName: dbName,
                    templateId: templateId,
                    updatedTemplateContent: updatedTemplateContent,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async updateTemplate(req, res, next) {
            const templateData = req.body.templateData;
            const dbName = req.body.dbName;
            const templateId = req.body.templateId;

            this.broker
                .call('cms.templates.updateTemplate', {
                    dbName: dbName,
                    templateData: templateData,
                    templateId: templateId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async uploadTemplateImage(req, res, next) {
            if (req.files === null) {
                return res.status(400).json({ msg: 'No file uploaded!' });
            }

            const files = req.files;
            const dbName = req.body.dbName;

            if (!files.hasOwnProperty('file')) {
                // If language wise content is present
                const languages = Object.keys(files);
                let results = {};
                await Promise.all(
                    languages.map(async (language, index) => {
                        const file = req.files[language];

                        if (req.files[language].length !== undefined) {
                            // TODO - Multiple file uploads for single language
                        } else {
                            // If single file uploads for single language
                            const extension = path.extname(file.name);
                            const fileName = new Date().getTime() + extension;

                            file.mv(`${UPLOAD_PATH}/${fileName}`, (err) => {
                                if (err) {
                                    console.error(err);
                                    return err;
                                }
                            });

                            const data = await this.broker.call(
                                'cms.templates.uploadTemplateImage',
                                {
                                    dbName: dbName,
                                    fileName: fileName,
                                }
                            );

                            results[language] = JSON.parse(data);

                            return results;
                        }
                    })
                );

                res.send(results);
            } else {
                // TODO - If language wise content is not present
            }
        },

        async getTemplate(req, res, next) {
            const dbName = req.query.dbName;
            const id = req.query.id;

            this.broker
                .call('cms.templates.getTemplate', {
                    dbName: dbName,
                    id: id,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getPublishablePagesTemplates(req, res, next) {
            const dbName = req.query.dbName;
            const publishLevel = req.query.publishLevel;

            this.broker
                .call('cms.templates.getPublishablePagesTemplates', {
                    dbName: dbName,
                    publishLevel: publishLevel,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async createBanner(req, res, next) {
            const bannerData = req.body.bannerData;
            const dbName = req.body.dbName;

            this.broker
                .call('cms.banner.createBanner', {
                    dbName: dbName,
                    bannerData: bannerData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async createForm(req, res, next) {
            const formData = req.body.formData;
            const dbName = req.body.dbName;

            this.broker
                .call('cms.forms.createForm', {
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

        async getAllBanners(req, res, next) {
            const dbName = req.query.dbName;

            this.broker
                .call('cms.banner.getAllBanners', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getAllForms(req, res, next) {
            const dbName = req.query.dbName;

            this.broker
                .call('cms.forms.getAllForms', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getSingleFormItem(req, res, next) {
            const dbName = req.query.dbName;
            const formId = req.query.formId;
            const user = req.query.user;

            this.broker
                .call('cms.forms.getSingleFormItem', {
                    dbName: dbName,
                    formId: formId,
                    user: user,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getBanner(req, res, next) {
            const dbName = req.query.dbName;
            const id = req.query.id;

            this.broker
                .call('cms.banner.getBanner', {
                    id: id,
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        // get approved banners
        async getBannerDetails(ctx) {
            const data = await this.broker
                .call('cms.banner.getApprovedBanner', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },

        async getTreeViewDetials(ctx) {
            const data = await this.broker
                .call('cms.custom-collections.getCustomTreeById', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },

        async getTreeSearchDetials(ctx) {
            const data = await this.broker
                .call('cms.custom-collections.searchTreeCustomCollections', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },

        async getTreeCustomCollectionsData(ctx) {
            const data = await this.broker
                .call('cms.custom-collections.getTreeCustomCollections', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },

        async cmsServerGetDocumentHistory(ctx) {
            const data = await this.broker
                .call('cms.custom-collections.getDocumentHistory', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },

        async cmsServerGetCustomCollectionMeta(ctx) {
            const data = await this.broker
                .call('cms.custom-collections.getLastUpdatedDocumentMetaInfo', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
        },

        async getCMSSiteSearchResults(ctx) {
            const collections = await this.broker
                .call('cms.custom-collections.getAllCustomCollection', {
                    ...ctx.params,
                })
                .catch((err) => {
                    errorHandlerService.rrorHandler(err);
                });

            const data = await this.broker
                .call('cms.site-search.getSiteSearchResults', {
                    ...ctx.params,
                    collectionList: JSON.parse(collections),
                })
                .catch((err) => {
                    errorHandlerService.errorHandler(err);
                });

            return data;
            // .then(async (data) => {
            //     data = JSON.parse(data);

            // })
            // .catch((err) => {
            //     errorHandlerService.errorHandler(err);
            // });
            // const data = await this.broker
            //     .call('cms.site-search.getSiteSearchResults', {
            //         ...ctx.params,
            //     })
            //     .catch((err) => {
            //         errorHandlerService.errorHandler(err);
            //     });
        },

        async updateBanner(req, res, next) {
            const bannerData = req.body.bannerData;
            const dbName = req.body.dbName;
            const id = req.body.id;

            this.broker
                .call('cms.banner.updateBanner', {
                    id: id,
                    bannerData: bannerData,
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getBannerHistoryData(req, res, next) {
            const dbName = req.query.dbName;
            const bannerId = req.query.id;

            this.broker
                .call('cms.history.getBannerHistoryData', {
                    dbName: dbName,
                    bannerId: bannerId,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async historyBannerCheckout(req, res, next) {
            const { dbName, title, bannerId, workflow } = req.body;

            this.broker
                .call('cms.history.checkoutHistoryBanner', {
                    dbName: dbName,
                    title: title,
                    bannerId: bannerId,
                    workflow: workflow,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async deleteBanner(req, res, next) {
            const workflowId = req.body.workflowId;
            const dbName = req.body.dbName;
            const id = req.body.bannerId;
            const deletedBy = req.body.deletedBy;

            this.broker
                .call('cms.banner.deleteBanner', {
                    dbName: dbName,
                    id: id,
                    workflowId: workflowId,
                    deletedBy: deletedBy,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async deleteForm(req, res, next) {
            const workflowId = req.body.workflowId;
            const dbName = req.body.dbName;
            const id = req.body.formId;
            const deletedBy = req.body.deletedBy;

            this.broker
                .call('cms.forms.deleteForm', {
                    dbName: dbName,
                    id: id,
                    workflowId: workflowId,
                    deletedBy: deletedBy,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        // Table Component Temporary Routes
        async cmsServerGetCollectionData(req, res, next) {
            const query = req.query.searchQuery ? JSON.parse(req.query.searchQuery) : {};
            const sorter = req.query.sorter ? JSON.parse(req.query.sorter) : {};
            const limit = req.query.limit ? req.query.limit : 0;
            const dbName = req.query.nameSpace;
            const collectionName = req.query.collectionName;

            this.broker
                .call('headless-cms.appServerGetCollectionData', {
                    dbName: dbName,
                    query: query,
                    sorter: sorter,
                    collectionName: collectionName,
                    limit: limit,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },
        // publish

        async postRelease(req, res, next) {
            try {
                const query = req.body.pageData;
                const dbName = req.body.dbName;
                const publishLevel = req.body.publishLevel;
                let dataArray = [];

                const releaseData = await this.broker.call(
                    'cms.publish-pages.postRelease',
                    {
                        dbName: dbName,
                        query: query,
                        publishLevel: publishLevel,
                    },
                    { nodeID: HEADLESS_NODE }
                );

                // invalidate caching for custom-collections here ...
                if (releaseData && JSON.parse(releaseData).status === 'success') {
                    const cacheData = await this.broker.call(
                        'cms.workflow.getApprovedWorkFlowsCustCollec',
                        {
                            dbName: dbName,
                        }
                    );
                    const data = JSON.parse(cacheData);

                    if (Array.isArray(data)) {
                        for (let collec of data) {
                            await cache.getCache().deleteFromCash(collec);
                        }
                    }

                    await cache.getCache().deleteFromCash('Banner-Text');
                    await cache.getCache().deleteFromCash('menu-obj');

                    res.send(
                        JSON.stringify({
                            releaseData: JSON.parse(releaseData),
                            cacheData: data,
                        })
                    );

                    return;
                }

                res.send(
                    JSON.stringify({
                        releaseData: JSON.parse(releaseData),
                        cacheData: undefined,
                    })
                );
            } catch (error) {
                next(error);
            }
        },

        async refreshWebsiteCache(req, res, next) {
            const dbName = req.body.dbName;
            this.broker
                .call(
                    'cms.publish-pages.refreshWebsiteCache',
                    {
                        dbName: dbName,
                    },
                    { nodeID: HEADLESS_NODE }
                )
                .then(async (data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        //update types (docs n posts)

        async updateCustomTypes(req, res, next) {
            const dbName = req.body.dbName;

            // invalidate caching for custom-collections here ...
            this.broker
                .call('cms.workflow.getApprovedWorkFlowsCustCollec', {
                    dbName: dbName,
                })
                .then(async (data) => {
                    data = JSON.parse(data);
                    data.forEach(async (element) => {
                        await cache.getCache().deleteFromCash(element);
                    });
                    console.log('cache cleared custom collections----------', data);
                    await cache.getCache().deleteFromCash('Banner-Text');
                    console.log('cache cleared Banner-Text');
                    await cache.getCache().deleteFromCash('menu-obj');
                    console.log('Menu cache cleared');
                })
                .catch((err) => {
                    next(err);
                });

            this.broker
                .call('cms.workflow.UpdateCustTypesToPublished', {
                    dbName: dbName,
                })
                .then((data) => {
                    console.log('Custom Type status changed to published ----', data);
                    res.send(data);
                });
        },

        async getPublishablePages(req, res, next) {
            const dbName = req.query.dbName;
            const publishLevel = req.query.publishLevel;
            this.broker
                .call('cms.publish-pages.getPublishablePages', {
                    dbName: dbName,
                    publishLevel: publishLevel,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getReleases(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('cms.publish-pages.getReleases', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getReleaseProgress(req, res, next) {
            const dbName = req.query.dbName;
            this.broker
                .call('cms.publish-pages.getReleaseProgress', {
                    dbName: dbName,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getCMSPermissionsForServer() {
            try {
                this.broker
                    .waitForServices('headless-cms')
                    .then(() => {
                        this.broker
                            .call('cms.cms-permissions.getCMSPermissionsForServer', {})
                            .then((data) => {
                                const response = JSON.parse(data);
                                //logger.info('getCMSPermissionsForServer ' + data);
                                if (response && response.length > 0) {
                                    for (let i = 0; i < response.length; i++) {
                                        for (let j = 0; j < response[i].value.length; j++) {
                                            let words = response[i].value[j].split(':');
                                            if (words.length === 1) {
                                                cache
                                                    .getCache()
                                                    .addToCacheH(response[i].name, words[0], '-1');
                                            } else {
                                                cache
                                                    .getCache()
                                                    .addToCacheH(
                                                        response[i].name,
                                                        words[0],
                                                        words[1]
                                                    );
                                            }
                                        }
                                    }
                                } else {
                                    logger.info('paths are not received');
                                }
                            })
                            .catch((err) => {
                                next(err);
                            });
                    })
                    .catch((err) => {
                        errorHandlerService.errorHandler(err);
                    });
            } catch (error) {
                errorHandlerService.errorHandler(error);
            }
        },

        async getSiteSearchResults(req, res, next) {
            const dbName = req.query.nameSpace;
            const keyword = req.query.keyword;
            const langKey = req.query.langKey;

            this.broker
                .call('cms.custom-collections.getAllCustomCollection', {
                    dbName: dbName,
                })
                .then(async (data) => {
                    data = JSON.parse(data);

                    this.broker
                        .call('cms.site-search.getSiteSearchResults', {
                            dbName: dbName,
                            keyword: keyword,
                            langKey: langKey,
                            collectionList: data,
                        })
                        .then((data) => {
                            res.send(data);
                        })
                        .catch((err) => {
                            next(err);
                        });
                })
                .catch((err) => {
                    next(err);
                });
        },

        async getArchiveResults(req, res, next) {
            const dbName = req.query.dbName;
            const searchQ = req.body.searchQ;
            this.broker
                .call('cms.archives.getArchivedContent', {
                    dbName: dbName,
                    searchQ: searchQ,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async checkoutArchive(req, res, next) {
            const dbName = req.query.dbName;
            const archiveData = req.body.archiveData;
            this.broker
                .call('cms.archives.checkoutArchive', {
                    dbName: dbName,
                    archiveData: archiveData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async deleteArchive(req, res, next) {
            const dbName = req.query.dbName;
            const archiveData = req.body.archiveData;
            this.broker
                .call('cms.archives.deleteArchive', {
                    dbName: dbName,
                    archiveData: archiveData,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async AddStaticResource(req, res, next) {
            try {
                if (req.files === null) {
                    return res.status(400).json({ msg: 'No file uploaded!', status: 'failed' });
                }

                const files = req.files;
                const { website, fileSize, fileType, fileName } = req.body;

                if (files.hasOwnProperty('file')) {
                    const extension = path.extname(files.file.name);
                    const uniqFileName = new Date().getTime() + extension;
                    const moveFile = util.promisify(files.file.mv);

                    // TODO: Delete the file after saving into database
                    await moveFile(`${UPLOAD_PATH}/${uniqFileName}`);

                    const data = await this.broker.call('cms.websites.AddStaticResource', {
                        dbName: website,
                        fileName: fileName,
                        uniqFileName: uniqFileName,
                        fileSize: fileSize,
                        fileType: fileType,
                    });

                    return res.send(data);
                }

                return res.status(400).json({ msg: 'No file uploaded!', status: 'failed' });
            } catch (err) {
                console.error(err);
                return res.status(400).json({ msg: 'No file uploaded!', status: 'failed' });
            }
        },

        async updateStaticResourceLinks(req, res, next) {
            const { dbName, staticResourceLinks } = req.body;

            this.broker
                .call('cms.websites.updateStaticResourceLinks', {
                    dbName: dbName,
                    staticResourceLinks: staticResourceLinks,
                })
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    next(err);
                });
        },

        async deleteStaticResource(req, res, next) {
            const { dbName, collectionName, id } = req.body;

            this.broker
                .call('cms.websites.deleteStaticResource', {
                    dbName: dbName ? dbName : '',
                    id: id,
                    collectionName: collectionName ? collectionName : '',
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
        console.log(`SERVICE - ${this.name} - Started`);
        this.startServer(this.broker);
        brokerWebsite.start();
    },

    async stopped() {
        this.server.close();
        console.log(`SERVICE - ${this.name} - Stopped`);
        brokerWebsite.stop();
    },
};
