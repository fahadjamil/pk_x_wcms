const { eop_delete_department, applications_report } = require('../modules/app-data/app-data-repo');
const appDataRepo = require('../modules/app-data/app-data-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'app-server.dynamic-content.app-data',

    actions: {
        async eop_update_user_role(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Categories');
            console.log(ctx.params.userData);
            const data = await this.eop_update_user_role(ctx.params.dbName, ctx.params.userData);

            return JSON.stringify(data);
        },
        async eop_role_listing(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.eop_role_listing(ctx.params.dbName, ctx.params.roleData);

            return JSON.stringify(data);
        },
        async eop_get_pages(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.eop_get_pages(ctx.params.dbName, ctx.params.roleData);

            return JSON.stringify(data);
        },
        async eop_get_permissions(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.eop_get_permissions(ctx.params.dbName);

            return JSON.stringify(data);
        },
        async eop_get_resources(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.eop_get_resources(ctx.params.dbName);

            return JSON.stringify(data);
        },
        async eop_application_submissions(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: Add application data');
            console.log(ctx.params.applicationData);
            const data = await this.eop_application_submissions(
                ctx.params.dbName,
                ctx.params.applicationData
            );

            return JSON.stringify(data);
        },
        async eop_edit_application(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: Add application data');
            console.log(ctx.params.applicationData);
            const data = await this.eop_edit_application(
                ctx.params.dbName,
                ctx.params.applicationData
            );

            return JSON.stringify(data);
        },
        async eop_add_user(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: ADD User');
            console.log(ctx.params.userData);
            const data = await this.eop_add_user(ctx.params.dbName, ctx.params.userData);

            return JSON.stringify(data);
        },
        async eop_add_role_permissions(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: permissionData');
            console.log(ctx.params.permissionData);
            const data = await this.eop_add_role_permissions(
                ctx.params.dbName,
                ctx.params.permissionData
            );

            return JSON.stringify(data);
        },
        async eop_approval_workflow(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: eop_approval_workflow');
            console.log(ctx.params.stepData);
            const data = await this.eop_approval_workflow(ctx.params.dbName, ctx.params.stepData);

            return JSON.stringify(data);
        },
        async eop_payment_getway(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: eop_payment_getway');
            console.log(ctx.params.paymentData);
            const data = await this.eop_payment_getway(ctx.params.dbName, ctx.params.paymentData);

            return JSON.stringify(data);
        },
        async eop_mark_read(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: eop_mark_read');
            console.log(ctx.params.markData);
            const data = await this.eop_mark_read(ctx.params.dbName, ctx.params.markData);

            return JSON.stringify(data);
        },
        async eop_mark_unread(ctx) {
            console.log('Action: eop_mark_unread');
            console.log(ctx.params.markData);
            const data = await this.eop_mark_unread(ctx.params.dbName, ctx.params.markData);

            return JSON.stringify(data);
        },
        async eop_mark_paid(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: eop_mark_paid');
            console.log(ctx.params.paymentData);
            const data = await this.eop_mark_paid(ctx.params.dbName, ctx.params.paymentData);

            return JSON.stringify(data);
        },
        async eop_mark_refund(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: eop_mark_refund');
            console.log(ctx.params.refundData);
            const data = await this.eop_mark_refund(ctx.params.dbName, ctx.params.refundData);

            return JSON.stringify(data);
        },
        async eop_application_pick(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: eop_application_pick');
            console.log(ctx.params.pickData);
            const data = await this.eop_application_pick(ctx.params.dbName, ctx.params.pickData);

            return JSON.stringify(data);
        },
        async eop_application_reject(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: eop_application_reject');
            console.log(ctx.params.rejectData);
            const data = await this.eop_application_reject(
                ctx.params.dbName,
                ctx.params.rejectData
            );

            return JSON.stringify(data);
        },
        async eop_application_approved(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: eop_application_approved');
            console.log(ctx.params.approvedData);
            const data = await this.eop_application_approved(
                ctx.params.dbName,
                ctx.params.approvedData
            );

            return JSON.stringify(data);
        },
        async eop_application_askinfo(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: eop_application_askinfo');
            console.log(ctx.params.appData);
            const data = await this.eop_application_askinfo(
                ctx.params.dbName,
                ctx.params.appData
            );

            return JSON.stringify(data);
        },
        async eop_application_review_update(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: eop_application_review_update');
            console.log(ctx.params.appData);
            const data = await this.eop_application_review_update(
                ctx.params.dbName,
                ctx.params.appData
            );

            return JSON.stringify(data);
        },
        async eop_delete_category(ctx) {
            logger.info(`CMS create form called. id: ${ctx.params.id}`);
            const data = await this.eop_delete_category(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_update_category(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Categories');
            console.log(ctx.params.categoriesData);
            const data = await this.eop_update_category(
                ctx.params.dbName,
                ctx.params.categoriesData
            );

            return JSON.stringify(data);
        },
        async eop_delete_designation(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Delete Designation');
            console.log(ctx.params.designationData);
            const data = await this.eop_delete_designation(
                ctx.params.dbName,
                ctx.params.designationData
            );

            return JSON.stringify(data);
        },
        async eop_delete_department(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Delete eop_delete_department');
            console.log(ctx.params.departmentData);
            const data = await this.eop_delete_department(
                ctx.params.dbName,
                ctx.params.departmentData
            );

            return JSON.stringify(data);
        },
        async eop_delete_role(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Delete eop_delete_role');
            console.log(ctx.params.roleData);
            const data = await this.eop_delete_role(ctx.params.dbName, ctx.params.roleData);

            return JSON.stringify(data);
        },
        async eop_delete_eopUser(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Delete eop_delete_eopUser');
            console.log(ctx.params.eopUserData);
            const data = await this.eop_delete_eopUser(ctx.params.dbName, ctx.params.eopUserData);

            return JSON.stringify(data);
        },

        async eop_update_department(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Departments');
            console.log(ctx.params.departmentsData);
            const data = await this.eop_update_department(
                ctx.params.dbName,
                ctx.params.departmentsData
            );

            return JSON.stringify(data);
        },
        async eop_update_designation(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:designation');
            console.log(ctx.params.designationData);
            const data = await this.eop_update_designation(
                ctx.params.dbName,
                ctx.params.designationData
            );

            return JSON.stringify(data);
        },
        async eop_update_step_num(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Categories');
            console.log(ctx.params.stepData);
            const data = await this.eop_update_step_num(ctx.params.dbName, ctx.params.stepData);

            return JSON.stringify(data);
        },
        async eop_update_item(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Item');
            console.log(ctx.params.itemData);
            const data = await this.eop_update_item(ctx.params.dbName, ctx.params.itemData);

            return JSON.stringify(data);
        },
        async eop_update_step_item(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Categories');
            console.log(ctx.params.stepData);
            const data = await this.eop_update_step_item(ctx.params.dbName, ctx.params.stepData);

            return JSON.stringify(data);
        },
        async eop_show_single_category(ctx) {
            logger.info(`CMS create form called. id: ${ctx.params.id}`);
            const data = await this.eop_show_single_category(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_single_user(ctx) {
            logger.info(`CMS create form called. id: ${ctx.params.id}`);
            const data = await this.eop_single_user(ctx.params.id);

            return JSON.stringify(data);
        },

        async eop_show_single_department(ctx) {
            logger.info(`CMS create form called. id: ${ctx.params.id}`);
            const data = await this.eop_show_single_department(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_show_single_designation(ctx) {
            logger.info(`CMS create form called. id: ${ctx.params.id}`);
            const data = await this.eop_show_single_designation(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_show_user_designation(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.eop_show_user_designation(
                ctx.params.dbName,
                ctx.params.designationData
            );

            return JSON.stringify(data);
        },
        async eop_show_user_department(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.eop_show_user_department(
                ctx.params.dbName,
                ctx.params.departmentData
            );

            return JSON.stringify(data);
        },
        async reason_of_death(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.reason_of_death(ctx.params.dbName, ctx.params.departmentData);

            return JSON.stringify(data);
        },
        async place_of_death(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.place_of_death(ctx.params.dbName, ctx.params.departmentData);

            return JSON.stringify(data);
        },
        async eop_show_role(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.eop_show_role(ctx.params.dbName, ctx.params.roleData);

            return JSON.stringify(data);
        },
        async eop_show_categories(ctx) {
            const data = await this.eop_show_categories();
            return JSON.stringify(data);
        },
        async eop_show_categories_admin(ctx) {
            const data = await this.eop_show_categories_admin();
            return JSON.stringify(data);
        },
        async eop_role(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: User Role');
            console.log(ctx.params.roleData);
            const data = await this.eop_role(ctx.params.dbName, ctx.params.roleData);

            return JSON.stringify(data);
        },
        async eop_user_designation(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: User Designation');
            console.log(ctx.params.designationData);
            const data = await this.eop_user_designation(
                ctx.params.dbName,
                ctx.params.designationData
            );

            return JSON.stringify(data);
        },
        async eop_user_department(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action: User Department');
            console.log(ctx.params.departmentData);
            const data = await this.eop_user_department(
                ctx.params.dbName,
                ctx.params.departmentData
            );

            return JSON.stringify(data);
        },
        async eop_add_categories(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Categories');
            console.log(ctx.params.categoriesData);
            const data = await this.eop_add_categories(
                ctx.params.dbName,
                ctx.params.categoriesData
            );

            return JSON.stringify(data);
        },
        async eop_step_num(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Step num');
            console.log(ctx.params.step_data);
            const data = await this.eop_step_num(ctx.params.dbName, ctx.params.step_data);

            return JSON.stringify(data);
        },
        async eop_step_item(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Step num');
            console.log(ctx.params.step_data);
            const data = await this.eop_step_item(ctx.params.dbName, ctx.params.step_data);

            return JSON.stringify(data);
        },
        async eop_user(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.eop_user(ctx.params.dbName, ctx.params.categoriesData);

            return JSON.stringify(data);
        },
        async eop_registered_user(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.eop_registered_user(
                ctx.params.dbName,
                ctx.params.categoriesData
            );

            return JSON.stringify(data);
        },
        async eop_user_logIn(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:loginData');
            console.log(ctx.params.loginData);
            const data = await this.eop_user_logIn(ctx.params.dbName, ctx.params.loginData);

            return JSON.stringify(data);
        },
        async eop_forgot_password(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:forgetEmail');
            console.log(ctx.params.forgetEmail);
            const data = await this.eop_forgot_password(ctx.params.dbName, ctx.params.forgetEmail);

            return JSON.stringify(data);
        },
        async eop_admin_user_logIn(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:loginData');
            console.log(ctx.params.loginData);
            const data = await this.eop_admin_user_logIn(ctx.params.dbName, ctx.params.loginData);

            return JSON.stringify(data);
        },
        async eop_user_registration(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:formdata');
            console.log(ctx.params.formData);
            const data = await this.eop_user_registration(ctx.params.dbName, ctx.params.formData);

            return JSON.stringify(data);
        },
        async eop_show_steps(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.id}`);
            const data = await this.eop_show_steps(ctx.params.id);

            return JSON.stringify(data);
        },
        async submited_applications(ctx) {
            logger.info(`CMS create form called. All Params: ${ctx.params}`);
            const data = await this.submited_applications(ctx.params.dbName, ctx.params.params, ctx.params.fetchData);

            return JSON.stringify(data);
        },
        async eop_configuraion(ctx) {
            const data = await this.eop_configuraion();
            return JSON.stringify(data);
        },
        async categories_applications_report(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:css_track_and_monitor Report');
            console.log(ctx.params.fetchData);
            const data = await this.categories_applications_report(
                ctx.params.dbName,
                ctx.params.fetchData
            );

            return JSON.stringify(data);
        },
        async css_track_and_monitor(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:css_track_and_monitor Report');
            console.log(ctx.params.fetchData);
            const data = await this.css_track_and_monitor(ctx.params.dbName, ctx.params.fetchData);

            return JSON.stringify(data);
        },
        async applications_report(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Application Report');
            console.log(ctx.params.fetchData);
            const data = await this.applications_report(ctx.params.dbName, ctx.params.fetchData);

            return JSON.stringify(data);
        },
        async death_noc_report(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            console.log('Action:Application Report');
            console.log(ctx.params.fetchData);
            const data = await this.death_noc_report(ctx.params.dbName, ctx.params.fetchData);

            return JSON.stringify(data);
        },
        async eop_show_role_permissions(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.id}`);
            const data = await this.eop_show_role_permissions(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_check_role_permission(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.id}`);
            const data = await this.eop_check_role_permission(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_myInbox(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.id}`);
            const data = await this.eop_myInbox(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_myInbox_count(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.id}`);
            const data = await this.eop_myInbox_count(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_voucher(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.id}`);
            const data = await this.eop_voucher(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_show_approval_workflow(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.id}`);
            const data = await this.eop_show_approval_workflow(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_application_comments(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.id}`);
            const data = await this.eop_application_comments(ctx.params.id);

            return JSON.stringify(data);
        },
        async css_portal_pieChart(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.css_portal_pieChart(
                ctx.params.dbName,
                ctx.params.submitedApplicationsS
            );

            return JSON.stringify(data);
        },
        async CSRFToken(ctx) {
            const data = await this.CSRFToken(ctx.params.req);
            return JSON.stringify(data);
        },
        async css_portal_barChart(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.css_portal_barChart(
                ctx.params.dbName,
                ctx.params.submitedApplicationsS
            );

            return JSON.stringify(data);
        },
        async eop_voucher_list(ctx) {
            logger.info(`CMS create form called. DBName: ${ctx.params.dbName}`);
            const data = await this.eop_voucher_list(ctx.params.dbName);

            return JSON.stringify(data);
        },
        async eop_show_single_step(ctx) {
            logger.info(`CMS create form called. id: ${ctx.params.id}`);
            const data = await this.eop_show_single_step(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_show_category(ctx) {
            logger.info(`CMS create form called. id: ${ctx.params.id}`);
            const data = await this.eop_show_category(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_show_single_item(ctx) {
            logger.info(`CMS create form called. id: ${ctx.params.id}`);
            const data = await this.eop_show_single_item(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_get_form_data(ctx) {
            logger.info(`CMS create form called. id: ${ctx.params.id}`);
            const data = await this.eop_get_form_data(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_single_user_listing(ctx) {
            logger.info(`CMS create form called. id: ${ctx.params.id}`);
            const data = await this.eop_single_user_listing(ctx.params.id);

            return JSON.stringify(data);
        },
        async eop_single_role_listing(ctx) {
            logger.info(`CMS create form called. id: ${ctx.params.id}`);
            const data = await this.eop_single_role_listing(ctx.params.id);

            return JSON.stringify(data);
        },
        async submited_application(ctx) {
            logger.info(`CMS create form called. id: ${ctx.params.id}`);
            const data = await this.submited_application(ctx.params.id);

            return JSON.stringify(data);
        },
        async collectionDataByLang(ctx) {
            logger.info(
                `Dynamic Content - CollectionDataByLang Called - DBName: ${ctx.params.dbName}, Lang: ${ctx.params.language}, Collection: ${ctx.params.collection}`
            );
            const data = await this.collectionDataByLang(
                ctx.params.dbName,
                ctx.params.language,
                ctx.params.collection,
                ctx.params.sortBy,
                ctx.params.sortType,
                ctx.params.field,
                ctx.params.value,
                ctx.params.filterType,
                ctx.params.limit
            );

            return JSON.stringify(data);
        },

        async kuwaitiBanksHoldingSummary(ctx) {
            logger.info(
                `Dynamic Content - KuwaitiBanksHoldingSummary Called - DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collection}`
            );
            const data = await this.kuwaitiBanksHoldingSummary(
                ctx.params.dbName,
                ctx.params.collection
            );

            return JSON.stringify(data);
        },

        async kuwaitiBanksHoldingDetail(ctx) {
            logger.info(
                `Dynamic Content - KuwaitiBanksHoldingDetail Called - DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collection}
                Language: ${ctx.params.language}, Year: ${ctx.params.year}, Month: ${ctx.params.month}`
            );
            const data = await this.kuwaitiBanksHoldingDetail(
                ctx.params.dbName,
                ctx.params.language,
                ctx.params.collection,
                ctx.params.year,
                ctx.params.month
            );

            return JSON.stringify(data);
        },

        async marketMakers(ctx) {
            logger.info(
                `Dynamic Content - MarketMakers Called - DBName: ${ctx.params.dbName}, Language: ${ctx.params.language}`
            );
            const data = await this.marketMakers(
                ctx.params.dbName,
                ctx.params.language,
                ctx.params.marketMakersCollection,
                ctx.params.securitiesCollection
            );

            return JSON.stringify(data);
        },

        async contactUs(ctx) {
            logger.info(
                `Dynamic Content - ContactUs Called - Name: ${ctx.params.name}, Email: ${ctx.params.email}, MobileNo: ${ctx.params.mobileNo}, Message: ${ctx.params.message}, ContactUsType: ${ctx.params.contactUsType}`
            );
            const data = await this.contactUs(
                ctx.params.name,
                ctx.params.email,
                ctx.params.mobileNo,
                ctx.params.message,
                ctx.params.contactUsType
            );

            return JSON.stringify(data);
        },
    },

    methods: {
        async eop_update_user_role(dbName, userData) {
            console.log('--eop_update user role--');
            console.log(userData);
            return await appDataRepo.eop_update_user_role(dbName, userData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_role_listing(dbName) {
            return await appDataRepo.eop_role_listing(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_get_pages(dbName) {
            return await appDataRepo.eop_get_pages(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_get_permissions(dbName) {
            return await appDataRepo.eop_get_permissions(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_get_resources(dbName) {
            return await appDataRepo.eop_get_resources(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_application_submissions(dbName, applicationData) {
            console.log('--eop_application_submissions--');
            console.log(applicationData);
            return await appDataRepo
                .eop_application_submissions(dbName, applicationData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
        async eop_edit_application(dbName, applicationData) {
            console.log('--eop_edit_application--');
            console.log(applicationData);
            return await appDataRepo
                .eop_edit_application(dbName, applicationData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
        async eop_add_user(dbName, userData) {
            console.log('--eop_add_user--');
            console.log(userData);
            return await appDataRepo.eop_add_user(dbName, userData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_add_role_permissions(dbName, permissionData) {
            console.log('--eop_add_role_permissions--');
            console.log(permissionData);
            return await appDataRepo
                .eop_add_role_permissions(dbName, permissionData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
        async eop_approval_workflow(dbName, stepData) {
            console.log('--eop_approval_workflow--');
            console.log(stepData);
            return await appDataRepo.eop_approval_workflow(dbName, stepData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_payment_getway(dbName, paymentData) {
            console.log('--eop_payment_getway--');
            console.log(paymentData);
            return await appDataRepo.eop_payment_getway(dbName, paymentData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_mark_read(dbName, markData) {
            console.log('--eop_mark_read--');
            console.log(markData);
            return await appDataRepo.eop_mark_read(dbName, markData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_mark_unread(dbName, markData) {
            console.log('--eop_mark_unread--');
            console.log(markData);
            return await appDataRepo.eop_mark_unread(dbName, markData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_mark_paid(dbName, paymentData) {
            console.log('--eop_mark_paid--');
            console.log(paymentData);
            return await appDataRepo.eop_mark_paid(dbName, paymentData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_mark_refund(dbName, refundData) {
            console.log('--eop_mark_refund--');
            console.log(refundData);
            return await appDataRepo.eop_mark_refund(dbName, refundData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_application_pick(dbName, pickData) {
            console.log('--eop_application_pick--');
            console.log(pickData);
            return await appDataRepo.eop_application_pick(dbName, pickData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_application_reject(dbName, rejectData) {
            console.log('--eop_application_reject--');
            console.log(rejectData);
            return await appDataRepo.eop_application_reject(dbName, rejectData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_application_approved(dbName, approvedData) {
            console.log('--eop_application_approved--');
            console.log(approvedData);
            return await appDataRepo
                .eop_application_approved(dbName, approvedData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
        async eop_application_askinfo(dbName, appData) {
            console.log('--eop_application_askinfo--');
            console.log(appData);
            return await appDataRepo
                .eop_application_askinfo(dbName, appData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
        async eop_application_review_update(dbName, appData) {
            console.log('--eop_application_review_update--');
            console.log(appData);
            return await appDataRepo
                .eop_application_review_update(dbName, appData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
        async eop_update_step_num(dbName, stepData) {
            console.log('--eop_update_step_num--');
            console.log(stepData);
            return await appDataRepo.eop_update_step_num(dbName, stepData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_update_item(dbName, itemData) {
            console.log('--eop_update_item--');
            console.log(itemData);
            return await appDataRepo.eop_update_item(dbName, itemData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_update_step_item(dbName, stepData) {
            console.log('--eop_update_step_item--');
            console.log(stepData);
            return await appDataRepo.eop_update_step_item(dbName, stepData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_update_category(dbName, categoriesData) {
            console.log('--eop_update_category--');
            console.log(categoriesData);
            return await appDataRepo.eop_update_category(dbName, categoriesData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_delete_designation(dbName, designationData) {
            console.log('--eop_delete_designation--');
            console.log(designationData);
            return await appDataRepo
                .eop_delete_designation(dbName, designationData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
        async eop_delete_department(dbName, departmentData) {
            console.log('--eop_delete_department--');
            console.log(departmentData);
            return await appDataRepo
                .eop_delete_department(dbName, departmentData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
        async eop_delete_role(dbName, roleData) {
            console.log('--eop_delete_role--');
            console.log(roleData);
            return await appDataRepo.eop_delete_role(dbName, roleData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_delete_eopUser(dbName, eopUserData) {
            console.log('--Delete_eopUser--');
            console.log(eopUserData);
            return await appDataRepo.eop_delete_eopUser(dbName, eopUserData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async eop_delete_category(id) {
            console.log('-APP-data-service-eop_delete_category--');
            console.log(id);
            return await appDataRepo.eop_delete_category(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_show_single_category(id) {
            console.log('-APP-data-service-eop_show_single_category--');
            console.log(id);
            return await appDataRepo.eop_show_single_category(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_single_user(id) {
            console.log('-APP-data-service-eop_single_user--');
            console.log(id);
            return await appDataRepo.eop_single_user(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async eop_update_department(dbName, departmentsData) {
            console.log('--eop_add_departments--');
            console.log(departmentsData);
            return await appDataRepo
                .eop_update_department(dbName, departmentsData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
        async eop_update_designation(dbName, designationData) {
            console.log('--eop_add_designations--');
            console.log(designationData);
            return await appDataRepo
                .eop_update_designation(dbName, designationData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
        async eop_show_single_department(id) {
            console.log('-APP-data-service-eop_show_single_department--');
            console.log(id);
            return await appDataRepo.eop_show_single_department(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_show_single_designation(id) {
            console.log('-APP-data-service-eop_show_single_designation--');
            console.log(id);
            return await appDataRepo.eop_show_single_designation(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async eop_role(dbName, roleData) {
            console.log('--eop_role--');
            console.log(roleData);
            return await appDataRepo.eop_role(dbName, roleData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_user_designation(dbName, designationData) {
            console.log('--eop_user_designation--');
            console.log(designationData);
            return await appDataRepo
                .eop_user_designation(dbName, designationData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
        async eop_user_department(dbName, departmentData) {
            console.log('--eop_user_department--');
            console.log(departmentData);
            return await appDataRepo.eop_user_department(dbName, departmentData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_add_categories(dbName, categoriesData) {
            console.log('--eop_add_categories--');
            console.log(categoriesData);
            return await appDataRepo.eop_add_categories(dbName, categoriesData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_step_num(dbName, step_data) {
            console.log('--eop_add_step num--');
            console.log(step_data);
            return await appDataRepo.eop_step_num(dbName, step_data).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_step_item(dbName, step_data) {
            console.log('--eop_add_step num--');
            console.log(step_data);
            return await appDataRepo.eop_step_item(dbName, step_data).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_user_registration(dbName, formData) {
            console.log('--eop_user_registration--');
            console.log(formData);
            return await appDataRepo.eop_user_registration(dbName, formData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_user_logIn(dbName, loginData) {
            console.log('--eop_user_logIn--');
            console.log(loginData);
            return await appDataRepo.eop_user_logIn(dbName, loginData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_forgot_password(dbName, forgetEmail) {
            console.log('--eop_forgot_password--');
            console.log(forgetEmail);
            return await appDataRepo.eop_forgot_password(dbName, forgetEmail).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_admin_user_logIn(dbName, loginData) {
            console.log('--eop_admin_user_logIn--');
            console.log(loginData);
            return await appDataRepo.eop_admin_user_logIn(dbName, loginData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_show_categories() {
            return await appDataRepo.eop_show_categories().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_show_categories_admin() {
            return await appDataRepo.eop_show_categories_admin().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_show_role(dbName) {
            return await appDataRepo.eop_show_role(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_show_user_designation(dbName) {
            return await appDataRepo.eop_show_user_designation(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async eop_show_user_department(dbName) {
            return await appDataRepo.eop_show_user_department(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async reason_of_death(dbName) {
            return await appDataRepo.reason_of_death(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async place_of_death(dbName) {
            return await appDataRepo.place_of_death(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_show_steps(id) {
            return await appDataRepo.eop_show_steps(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async submited_applications(dbName, params, fetchData) {
            console.log('--submited_applications--');
            console.log(params);
            console.log(fetchData);
            return await appDataRepo.submited_applications(dbName, params, fetchData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_configuraion() {
            return await appDataRepo.eop_configuraion().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async categories_applications_report(dbName, fetchData) {
            console.log('--categories_applications_report--');
            console.log(fetchData);
            return await appDataRepo
                .categories_applications_report(dbName, fetchData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
        async css_track_and_monitor(dbName, fetchData) {
            console.log('--css_track_and_monitor_report--');
            console.log(fetchData);
            return await appDataRepo.css_track_and_monitor(dbName, fetchData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async applications_report(dbName, fetchData) {
            console.log('--applications_report--');
            console.log(fetchData);
            return await appDataRepo.applications_report(dbName, fetchData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async death_noc_report(dbName, fetchData) {
            console.log('--death_noc_report--');
            console.log(fetchData);
            return await appDataRepo.death_noc_report(dbName, fetchData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_show_role_permissions(id) {
            return await appDataRepo.eop_show_role_permissions(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_check_role_permission(id) {
            return await appDataRepo.eop_check_role_permission(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_myInbox(id) {
            return await appDataRepo.eop_myInbox(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_myInbox_count(id) {
            return await appDataRepo.eop_myInbox_count(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_show_approval_workflow(id) {
            return await appDataRepo.eop_show_approval_workflow(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_application_comments(id) {
            return await appDataRepo.eop_application_comments(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async css_portal_pieChart(dbName) {
            return await appDataRepo.css_portal_pieChart(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async CSRFToken(req) {
            return await appDataRepo.CSRFToken(req).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async css_portal_barChart(dbName) {
            return await appDataRepo.css_portal_barChart(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_voucher_list(dbName) {
            return await appDataRepo.eop_voucher_list(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_voucher(id) {
            return await appDataRepo.eop_voucher(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_show_single_step(id) {
            console.log('-APP-data-service-eop_show_single_step--');
            console.log(id);
            return await appDataRepo.eop_show_single_step(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_show_category(id) {
            console.log('-APP-data-service-eop_show_category--');
            console.log(id);
            return await appDataRepo.eop_show_category(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_show_single_item(id) {
            console.log('-APP-data-service-eop_show_single_item--');
            console.log(id);
            return await appDataRepo.eop_show_single_item(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_get_form_data(id) {
            console.log('-APP-data-service-eop_get_form_data--');
            console.log(id);
            return await appDataRepo.eop_get_form_data(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_single_user_listing(id) {
            return await appDataRepo.eop_single_user_listing(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_single_role_listing(id) {
            return await appDataRepo.eop_single_role_listing(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async submited_application(id) {
            return await appDataRepo.submited_application(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_user(dbName) {
            return await appDataRepo.eop_user(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async eop_registered_user(dbName) {
            return await appDataRepo.eop_registered_user(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async collectionDataByLang(
            dbName,
            language,
            collection,
            sortBy,
            sortType,
            field,
            value,
            filterType,
            limit
        ) {
            let lang = 'EN';
            let query = {};
            let sorter = {};

            if (language) {
                lang = language.toUpperCase();
            }

            query['active'] = true; // Filter active records

            if (filterType && parseInt(filterType) === 1 && field && value) {
                const queryKey = 'fieldData.EN.' + field;
                query[queryKey] = value;
            } else if (field && value) {
                const queryKey = 'fieldData.' + lang + '.' + field;
                query[queryKey] = value;
            }

            if (sortBy) {
                if (sortType && sortType.toUpperCase() === 'DESC') {
                    sorter = { [sortBy]: -1 };
                } else {
                    sorter = { [sortBy]: 1 };
                }
            }

            const data = await this.broker.call('web-router.appServerGetCollectionData', {
                dbName: dbName,
                collectionName: collection,
                sorter: sorter,
                query: query,
                limit: limit,
            });

            return await appDataRepo.collectionDataByLang(data, lang).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });

            // this.broker
            //     .call('web-router.appServerGetCollectionData', {
            //         dbName: dbName,
            //         collectionName: collection,
            //         sorter: sorter,
            //         query: query,
            //     })
            //     .then((data) => {
            //         return appDataRepo.collectionDataByLang(data).catch((error) => {
            //             return errorHandlerService.errorHandler(error);
            //         });
            //     })
            //     .catch((err) => {
            //         next(err);
            //     });
        },

        async kuwaitiBanksHoldingSummary(dbName, collection) {
            let query = {};
            query['active'] = true; // Filter active records

            const data = await this.broker.call('web-router.appServerGetCollectionData', {
                dbName: dbName,
                collectionName: collection,
                sorter: {},
                query: query,
            });

            return await appDataRepo.kuwaitiBanksHoldingSummary(data).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async kuwaitiBanksHoldingDetail(dbName, language, collection, year, month) {
            let query = {};
            query['active'] = true; // Filter active records

            if (year) {
                query['fieldData.EN.year'] = year;

                if (month) {
                    query['fieldData.EN.month'] = month;
                }
            }

            let lang = 'EN';
            if (language) {
                lang = language.toUpperCase();
            }

            const data = await this.broker.call('web-router.appServerGetCollectionData', {
                dbName: dbName,
                collectionName: collection,
                sorter: {},
                query: query,
            });

            return await appDataRepo.kuwaitiBanksHoldingDetail(data, lang).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async marketMakers(dbName, language, marketMakersCollection, securitiesCollection) {
            let lang = 'EN';
            if (language) {
                lang = language.toUpperCase();
            }

            const marketMakersData = await this.broker.call(
                'web-router.appServerGetCollectionData',
                {
                    dbName: dbName,
                    collectionName: marketMakersCollection,
                    sorter: {},
                    query: {},
                }
            );

            const securitiesData = await this.broker.call('web-router.appServerGetCollectionData', {
                dbName: dbName,
                collectionName: securitiesCollection,
                sorter: {},
                query: {},
            });

            return await appDataRepo
                .marketMakers(marketMakersData, securitiesData, lang)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async contactUs(name, email, mobileNo, message, contactUsType) {
            return await appDataRepo
                .contactUs(name, email, mobileNo, message, contactUsType)
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
