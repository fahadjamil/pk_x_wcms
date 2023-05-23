const logger = require('../../logger/logger').logger;
const mssqlDbDriver = require('universal-db-driver').DBPersistanceByType('mssql', logger);
const mongodbDriver = require('universal-db-driver').DBPersistance('mongo', logger);
const ObjectID = require('mongodb').ObjectID;
const emailValidator = require('email-validator');
const { responseCodes, contactUsTypes, emailAddresses } = require('../../constants/constants');
const storedProcedures = require('../../constants/db-queries').storedProcedures;
const utils = require('../../utility/utils');
const bcrypt = require('bcrypt');
const moment = require('moment');

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'consularsectionriyadh@gmail.com',
    // key: '477be34b311a0dede21501a274be41b9-835621cf-a5432dcf', //sandbox5f7b44e08ad443d48683c35d88ac29d5.mailgun.org
    key: 'fbc47ebe1e891d7a5b744420397a3b60-1b3a03f6-9ba44fa4', //mg.pakistaninksa.com
});

const send_mail = (email, subject, htmlData) => {
    mg.messages
        .create('mg.pakistaninksa.com', {
            from: 'consularsectionriyadh@gmail.com',
            to: email,
            subject: subject,
            html: htmlData,
        })
        .then((msg) => console.log(msg)) // logs response data
        .catch((err) => console.error(err)); // logs any error
};

const randomString = (length, chars) => {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

async function collectionDataByLang(data, lang) {
    let resultJson = JSON.parse(data);
    let processedResultJson = [];

    /*
    for (var i = 0; i < resultJson.length; i++) {
        const resultItem = resultJson[i];
        const dataEn = resultItem.fieldData.EN ? resultItem.fieldData.EN : {};
        const dataAr = resultItem.fieldData.AR ? resultItem.fieldData.AR : {};
        let mergedData = {};

        if (lang === 'EN') {
            mergedData = Object.assign(dataAr, dataEn);
        } else {
            mergedData = Object.assign(dataEn, dataAr);
        }

        resultJson[i].fieldData = mergedData;
    }
    */

    for (var i = 0; i < resultJson.length; i++) {
        const resultItem = resultJson[i];
        const dataEn = resultItem.fieldData.EN ? resultItem.fieldData.EN : {};
        const dataAr = resultItem.fieldData.AR ? resultItem.fieldData.AR : {};

        if (lang === 'EN') {
            if (
                resultItem.fieldData.EN &&
                resultItem.fieldData.EN.entry_name &&
                resultItem.fieldData.EN.entry_name !== ''
            ) {
                resultItem.fieldData = dataEn;
                processedResultJson.push(resultItem);
            }
        } else {
            if (
                resultItem.fieldData.AR &&
                resultItem.fieldData.AR.entry_name &&
                resultItem.fieldData.AR.entry_name !== ''
            ) {
                let mergedData = Object.assign(dataEn, dataAr);
                resultItem.fieldData = mergedData;
                processedResultJson.push(resultItem);
            }
        }
    }

    return processedResultJson;
}

async function getUserPermissions(userId) {
    try {
        const permissionsQuery = [
            { $match: { user_id: userId } },
            {
                $lookup: {
                    from: 'eop_role_permissions',
                    localField: 'role_id',
                    foreignField: 'role_id',
                    as: 'role_permissions',
                },
            },
            { $unwind: { path: '$role_permissions', preserveNullAndEmptyArrays: false } },
        ];
        return await mongodbDriver.aggregate('eop_user_roles', 'embassy', permissionsQuery);
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function haveResourcePermissions(userId, resourceId) {
    try {
        const permissionsQuery = [
            {
                $lookup: {
                    from: 'eop_role_permissions',
                    localField: 'role_id',
                    foreignField: 'role_id',
                    as: 'role_permissions',
                },
            },
            { $unwind: '$role_permissions' },
            {
                $match: {
                    $and: [{ user_id: userId }, { 'role_permissions.resource_id': resourceId }],
                },
            },
        ];
        const permissions = await mongodbDriver.aggregate(
            'eop_user_roles',
            'embassy',
            permissionsQuery
        );
        if (permissions.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_user_registration(dbName, formData) {
    try {
        console.log('--formData - forms-repo--');
        console.log(formData);

        if (formData.password !== formData.confirm_password) {
            return {
                status: 'failed',
                message:
                    'Password & Confirm Password do not match.',
                message_ar:
                    'كلمة المرور وتأكيد كلمة المرور غير متطابقين.',
                message_ur:
                    'پاس ورڈ اور کنفرم پاس ورڈ مماثل نہیں ہیں۔.',
            };
        }

        const hash = bcrypt.hashSync(formData.password, 10);
        console.log(hash);
        formData.password = hash;
        delete formData.confirm_password;

        const alreadyInDb = await mongodbDriver.findAll(
            { $or: [{ email: formData.email }, { cnic: formData.cnic }] },
            {},
            'users-eop',
            'embassy'
        );
        console.log('Already in database or not');
        console.log(alreadyInDb);
        console.log(alreadyInDb.length);

        if (alreadyInDb.length == 0) {
            const formsResults = await mongodbDriver.insertOne(formData, 'users-eop', 'embassy');
            const template = await mongodbDriver.FindOne({}, 'eop_configuraion_emails', 'embassy');
            console.log(template.registration_email_body);
            template.registration_email_body = template.registration_email_body.replace(
                /{{name}}/g,
                formData.first_name
            );
            send_mail(
                [formData.email],
                template.registration_email_subject,
                template.registration_email_body
            );
            return {
                status: 'success',
                message:
                    'You have successfully registered, please proceed to log in to submit your application.',
                message_ar: 'لقد قمت بالتسجيل بنجاح ، يرجى المتابعة لتسجيل الدخول لتقديم طلبك.',
                message_ur:
                    'آپ نے کامیابی سے رجسٹریشن کر لی ہے، براہ کرم اپنی درخواست جمع کرانے کے لیے لاگ ان کرنے کے لیے آگے بڑھیں۔',
            };
        } else {
            return {
                status: 'failed',
                message:
                    'Existing registered account found with the provided Email address or CNIC, please login using your existing credentials.',
                message_ar:
                    'تم العثور على حساب مسجل موجود بعنوان البريد الإلكتروني المقدم أو CNIC ، يرجى تسجيل الدخول باستخدام بريدك الإلكتروني الحالي وكلمة المرور.',
                message_ur:
                    'ایک موجودہ رجسٹرڈ اکاؤنٹ فراہم کردہ ای میل ایڈریس یا CNIC کے ساتھ پایا جاتا ہے، براہ کرم اپنا موجودہ ای میل اور پاس ورڈ استعمال کرکے لاگ ان کریں۔',
            };
        }
    } catch (error) {
        // logger.info('Form creation failed');
        // logger.info(error);
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_user_logIn(dbName, formData) {
    try {
        if (!formData.email || formData.email == '') {
            return {
                status: 'Login Error',
                message: 'Invalid/Empty Email Address',
                message_ar: 'عنوان بريد إلكتروني غير صالح / فارغ',
            };
        }
        if (!formData.password || formData.password == '') {
            return {
                status: 'Login Error',
                message: 'Invalid/Empty Password',
                message_ar: 'كلمة المرور غير صحيحة / فارغة',
            };
        }

        console.log('--formData - eop_user_logIn--');
        console.log(formData);
        const sessionId = utils.createUUID();

        const formsResults = await mongodbDriver.FindOne(
            { email: formData.email },
            'users-eop',
            'embassy'
        );

        if (formsResults) {
            if (bcrypt.compareSync(formData.password, formsResults.password)) {
                console.log('--eop_user_logIn-- success');
                return {
                    status: 'success',
                    message: 'Login successful.',
                    message_ar: 'تم تسجيل الدخول بنجاح',
                    user_data: { formsResults },
                    sessionId: { sessionId },
                };
            } else {
                console.log('--eop_user_logIn-- fail - password mismatch');
                return {
                    status: 'Error',
                    message: 'Invalid Password. Access Denied.',
                    message_ar: 'رمز مرور خاطئ. تم الرفض.',
                };
            }
        } else {
            console.log('--eop_user_logIn-- fail - email mismatch');
            return {
                status: 'Error',
                message: 'Invalid Email Address. Access Denied.',
                message_ar: 'عنوان البريد الإلكتروني غير صالح. تم الرفض.',
            };
        }
    } catch (error) {
        // logger.info('Login failed');
        // logger.info(error);
        console.log('--eop_user_logIn--');
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_forgot_password(dbName, forgetEmail) {
    try {
        const Results = await mongodbDriver.FindOne(
            { email: forgetEmail.email },
            'users-eop',
            'embassy'
        );
        if (Results) {
            console.log('User data');
            console.log(Results);
            var rString = randomString(
                8,
                '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
            );
            console.log('rString');
            console.log(rString);
            const template = await mongodbDriver.FindOne({}, 'eop_configuraion_emails', 'embassy');
            template.forgot_password_email_body = template.forgot_password_email_body.replace(
                /{{name}}/g,
                Results.first_name
            );
            template.forgot_password_email_body = template.forgot_password_email_body.replace(
                '{{password}}',
                rString
            );
            send_mail(
                [forgetEmail.email],
                template.forgot_password_email_subject,
                template.forgot_password_email_body
            );
            const hash = bcrypt.hashSync(rString, 10);
            const Update = await mongodbDriver.update(
                { _id: Results._id },
                {
                    _id: Results._id,
                    first_name: Results.first_name,
                    last_name: Results.last_name,
                    gender: Results.gender,
                    email: Results.email,
                    mobile: Results.mobile,
                    cnic: Results.cnic,
                    passport_number: Results.passport_number,
                    iqama_number: Results.iqama_number,
                    password: hash,
                    current_city: Results.current_city,
                    current_state: Results.current_state,
                    current_country: Results.current_country,
                    current_postal_code: Results.current_postal_code,
                    current_address: Results.current_address,
                    permanent_city: Results.permanent_city,
                    permanent_state: Results.permanent_state,
                    permanent_country: Results.permanent_country,
                    permanent_postal_code: Results.permanent_postal_code,
                    permanent_address: Results.permanent_address,
                    father_name: Results.father_name,
                    profession: Results.profession,
                    account_holder: Results.account_holder,
                    dependent_value: Results.dependent_value,
                    problem: Results.problem,
                },
                'users-eop',
                'embassy',
                {}
            );

            return {
                status: 'success',
                message:
                    'Password is send to your email address.Kindly check your email and login with that password',
                message_ar:
                    'يتم إرسال كلمة المرور إلى عنوان بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني وتسجيل الدخول باستخدام كلمة المرور هذه',
            };
        } else {
            return {
                status: 'Error',
                message: 'There is no user against this email.',
                message_ar: 'لا يوجد مستخدم ضد هذا البريد الإلكتروني',
            };
        }
    } catch (error) {
        console.log('--eop_user_logIn--');
        console.log(error);
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_admin_user_logIn(dbName, formData) {
    try {
        if (!formData.email || formData.email == '') {
            return {
                status: 'Login Error',
                message: 'Invalid/Empty Email Address',
                message_ar: 'عنوان بريد إلكتروني غير صالح / فارغ',
            };
        }
        if (!formData.password || formData.password == '') {
            return {
                status: 'Login Error',
                message: 'Invalid/Empty Password',
                message_ar: 'كلمة المرور غير صحيحة / فارغة',
            };
        }

        console.log('--formData - eop_admin_user_logIn--');
        console.log(formData);

        const sessionId = utils.createUUID();

        const formsResults = await mongodbDriver.FindOne(
            { email: formData.email },
            'users-admin',
            'embassy'
        );

        if (formsResults) {
            if (bcrypt.compareSync(formData.password, formsResults.password)) {
                return {
                    status: 'success',
                    message: 'Login successful.',
                    message_ar: 'تم تسجيل الدخول بنجاح',
                    user_data: formsResults,
                    sessionId: { sessionId },
                };
            } else {
                console.log('--eop_admin_user_logIn-- fail - password mismatch');
                return {
                    status: 'Error',
                    message: 'Invalid Password. Access Denied.',
                    message_ar: 'رمز مرور خاطئ. تم الرفض.',
                };
            }
        } else {
            console.log('--eop_admin_user_logIn-- fail - email mismatch');
            return {
                status: 'Error',
                message: 'Invalid Email Address. Access Denied.',
                message_ar: 'عنوان البريد الإلكتروني غير صالح. تم الرفض.',
            };
        }
    } catch (error) {
        // logger.info('Login failed');
        // logger.info(error);
        console.log('---exception - eop_admin_user_logIn--');
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_user(dbName) {
    try {
        const Users = await mongodbDriver.findAll({}, {}, 'users-admin', 'embassy');
        return {
            status: 'success',
            user_data: { Users },
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_registered_user(dbName) {
    try {
        const RegisteredUsers = await mongodbDriver.findAll({}, {}, 'users-eop', 'embassy');
        return {
            status: 'success',
            user_data: { RegisteredUsers },
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_role(dbName, roleData) {
    try {
        console.log('--roleData - forms-repo--');
        console.log(roleData);

        const roleResults = await mongodbDriver.insertOne(
            {
                role_name: roleData.item_data.role_name,
                role_desc: roleData.item_data.role_desc,
                is_deleted: roleData.item_data.is_deleted,
            },
            'eop_roles',
            'embassy'
        );
        return {
            status: 'success',
            message: 'User Role Added successful.',
            message_ar: 'تمت إضافة دور المستخدم بنجاح.',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_user_designation(dbName, designationData) {
    try {
        console.log('--designationData - forms-repo--');
        console.log(designationData);

        const designationResults = await mongodbDriver.insertOne(
            {
                designation_name: designationData.item_data.designation_name,
                designation_desc: designationData.item_data.designation_desc,
                is_deleted: designationData.item_data.is_deleted,
            },
            'eop_designations',
            'embassy'
        );
        return {
            status: 'success',
            message: 'Designation Added successful.',
            message_ar: 'تمت إضافة دور المستخدم بنجاح.',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_user_department(dbName, departmentData) {
    try {
        console.log('--departmentData - forms-repo--');
        console.log(departmentData);

        const departmentResults = await mongodbDriver.insertOne(
            {
                department_name: departmentData.item_data.department_name,
                department_desc: departmentData.item_data.department_desc,
                is_deleted: departmentData.item_data.is_deleted,
            },
            'eop_departments',
            'embassy'
        );
        return {
            status: 'success',
            message: 'Department Added successfully.',
            message_ar: 'تمت إضافة دور المستخدم بنجاح.',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_application_submissions(dbName, applicationData) {
    try {
        console.log('--eop_application_submissions--applicationData--');
        console.log(JSON.stringify(applicationData));

        applicationData.category = ObjectID(applicationData.category);
        applicationData.submit_user = ObjectID(applicationData.submit_user);
        applicationData.submit_time = new Date();
        applicationData.status = 'new';
        applicationData.is_deleted = 'N';
        applicationData.is_archived = 'N';

        //TODO: may need to check permissions using haveResourcePermissions function in future
        // const gotPermissions = haveResourcePermissions(applicationData.submit_user, ObjectID("62a5a55d38720939dbb12326"));

        //for now, check if admin user & allow multiple submissions if so
        const isAdminUser = await mongodbDriver.FindOne(
            {
                _id: applicationData.submit_user,
            },
            'users-admin',
            'embassy'
        );

        const existing = await mongodbDriver.FindOne(
            {
                category: applicationData.category,
                submit_user: applicationData.submit_user,
                status: { $in: ['new', 'open'] }, //find any new or open application
            },
            'eop_application_submissions',
            'embassy'
        );

        const config = await mongodbDriver.FindOne({}, 'eop_configuraion', 'embassy');

        //if Death NOC application then check for Passport No. duplication
        if (config.noc_category_id.toString() === applicationData.category.toString()) {
            let passport_item = applicationData.items.find(
                (i) => i.item_id === config.noc_passport_id.toString()
            );
            // console.log('--applicationData--passport--');
            // console.log(passport_item);
            // console.log(passport_item.data.en);

            const existingPassport = await mongodbDriver.aggregate(
                'eop_application_submissions',
                'embassy',
                [
                    {
                        $match: {
                            $and: [
                                { category: applicationData.category },
                                {
                                    items: {
                                        $elemMatch: {
                                            $or: [
                                                {
                                                    'data.en': passport_item.data.en,
                                                },
                                                {
                                                    data: passport_item.data.en,
                                                },
                                            ],
                                        },
                                    },
                                },
                                {
                                    status: { $in: ['new', 'open'] },
                                },
                            ],
                        },
                    },
                ]
            );

            // console.log('--existingPassport--');
            // console.log(JSON.stringify(existingPassport));

            if (existingPassport.length > 0) {
                return {
                    status: 'Error',
                    message:
                        'We already have an existing in-progress application with this Passport No. ' +
                        passport_item.data.en +
                        ', please contact us for further inquiry with your existing application reference number: ' +
                        existingPassport[0].reference_number,
                    message_ar:
                        'لدينا بالفعل طلب قيد التقدم مع رقم جواز السفر هذا ' +
                        passport_item.data.en +
                        '، يرجى الاتصال بنا لمزيد من الاستفسار مع الرقم المرجعي الحالي للتطبيق' +
                        existingPassport[0].reference_number,
                    message_ur:
                        'ہمارے پاس پہلے سے ہی اس پاسپورٹ نمبر ' +
                        passport_item.data.en +
                        ' کے ساتھ ایک موجودہ جاری درخواست موجود ہے، براہ کرم اپنے موجودہ درخواست کے حوالہ نمبر کے ساتھ مزید استفسار کے لیے ہم سے رابطہ کریں۔' +
                        existingPassport[0].reference_number,
                };
            }
        }

        // console.log('Existing Object');
        // console.log(JSON.stringify(existing));

        //if existing submission found & user is not admin user then return error, else proceed with insertion
        if (existing && !isAdminUser) {
            return {
                status: 'Error',
                message:
                    'We already have an existing in-progress application from you in this category, please contact us for further inquiry with your existing application reference number: ' +
                    existing.reference_number,
                message_ar:
                    'لدينا بالفعل طلب قيد التقدم منك في هذه الفئة ، يرجى الاتصال بنا لمزيد من الاستفسار مع الرقم المرجعي الحالي للتطبيق الخاص بك: ' +
                    existing.reference_number,
                message_ur:
                    'اس زمرے میں ہمارے پاس پہلے سے ہی آپ کی طرف سے ایک موجودہ جاری درخواست ہے، براہ کرم اپنے موجودہ درخواست کے حوالہ نمبر کے ساتھ مزید استفسار کے لیے ہم سے رابطہ کریں: ' +
                    existing.reference_number,
            };
        } else {
            const assign_role = await mongodbDriver.FindOne(
                {
                    category: applicationData.category,
                    step_number: 1,
                },
                'eop_approval_workflow',
                'embassy'
            );
            console.log('Assign- Role');
            console.log(assign_role);
            if (assign_role) {
                applicationData.assigned_role = assign_role.role;
                applicationData.workflow_step = assign_role._id;
            } else {
                applicationData.assigned_role = '';
                applicationData.workflow_step = '';
            }

            const lastSubmission = await mongodbDriver.findAll(
                {},
                { reference_number: -1 },

                'eop_application_submissions',
                'embassy',
                1
            );
            console.log('lastSubmission');
            console.log(lastSubmission);
            if (lastSubmission) {
                applicationData.reference_number = lastSubmission[0].reference_number + 1;
            } else {
                applicationData.reference_number = 1;
            }
            console.log('Application Data');
            console.log(applicationData);

            applicationData.items.forEach((element) => {
                element.item_id = ObjectID(element.item_id);
            });

            applicationData.assigned_user = '';

            const applicationResults = await mongodbDriver.insertOne(
                applicationData,
                'eop_application_submissions',
                'embassy'
            );
            console.log('Application Submited Data');
            console.log(applicationData);
            let time = new Date();

            const application_status = await mongodbDriver.insertOne(
                {
                    application_id: applicationData._id,
                    assigned_role: applicationData.assigned_role,
                    assigned_user: '',
                    status: applicationData.status,
                    category: applicationData.category,
                    workflow_step: applicationData.workflow_step,
                    update_time: time,
                    comments: '',
                    action: 'new application submission',
                    modified_by: '',
                },
                'eop_approval_workflow_trail',
                'embassy'
            );

            //dispatch email only if application category is not Death NOC -- Death NOC submission is only allowed by admin user - no need to dispatch email
            if (config.noc_category_id.toString() !== applicationData.category.toString()) {
                const emaildata = await mongodbDriver.FindOne(
                    { _id: ObjectID(applicationData.submit_user) },
                    'users-eop',
                    'embassy'
                );

                if (emaildata) {
                    const template = await mongodbDriver.FindOne(
                        {},
                        'eop_configuraion_emails',
                        'embassy'
                    );
                    template.submitted_application_email_subject =
                        template.submitted_application_email_subject.replace(
                            /{{ref_no}}/g,
                            applicationData.reference_number
                        );
                    template.submitted_application_email_body =
                        template.submitted_application_email_body.replace(
                            /{{ref_no}}/g,
                            applicationData.reference_number
                        );
                    template.submitted_application_email_body =
                        template.submitted_application_email_body.replace(
                            /{{name}}/g,
                            emaildata.first_name
                        );
                    send_mail(
                        [emaildata.email],
                        template.submitted_application_email_subject,
                        template.submitted_application_email_body
                    );
                }
            }

            //check if fee is applicable - if so create a voucher entry, otherwise return success message
            if (applicationData.category_fee != 'undefined' && applicationData.category_fee > 0) {
                const lastVoucher = await mongodbDriver.findAll(
                    {},
                    { voucher_number: -1 },
                    'eop_payment_voucher',
                    'embassy',
                    1
                );
                console.log('LastVoucher');
                console.log(lastVoucher);
                if (lastVoucher.length > 0) {
                    applicationData.voucher_number = lastVoucher[0].voucher_number + 1;
                } else {
                    applicationData.voucher_number = 1;
                }

                console.log('applicationData.voucher_number');
                console.log(applicationData.voucher_number);

                const voucher = await mongodbDriver.insertOne(
                    {
                        application_id: applicationData._id,
                        category: applicationData.category,
                        amount: applicationData.category_fee,
                        voucher_number: applicationData.voucher_number,
                        application_reference_number: applicationData.reference_number,
                        is_paid: 'N',
                        creation_date: time,
                    },
                    'eop_payment_voucher',
                    'embassy'
                );
                console.log('Voucher_id');
                console.log(voucher.insertedId);

                //dispatch vocuher email
                if (config.noc_category_id.toString() !== applicationData.category.toString()) {
                    const emaildata = await mongodbDriver.FindOne(
                        { _id: ObjectID(applicationData.submit_user) },
                        'users-eop',
                        'embassy'
                    );

                    if (emaildata) {
                        const template = await mongodbDriver.FindOne(
                            {},
                            'eop_configuraion_emails',
                            'embassy'
                        );
                        const category = await mongodbDriver.FindOne(
                            { _id: ObjectID(applicationData.category.toString()) },
                            'eop_categories',
                            'embassy'
                        );

                        template.voucher_email_subject = template.voucher_email_subject.replace(
                            /{{ref_no}}/g,
                            applicationData.reference_number
                        );

                        template.voucher_email_body = template.voucher_email_body.replace(
                            /{{ref_no}}/g,
                            applicationData.reference_number
                        );

                        template.voucher_email_body = template.voucher_email_body.replace(
                            /{{name}}/g,
                            emaildata.first_name
                        );

                        template.voucher_email_body = template.voucher_email_body.replace(
                            /{{category}}/g,
                            category.category_name
                        );

                        template.voucher_email_body = template.voucher_email_body.replace(
                            /{{voucher_no}}/g,
                            applicationData.voucher_number
                        );

                        template.voucher_email_body = template.voucher_email_body.replace(
                            /{{issue_date}}/g,
                            moment(time).format('DD-MM-YYYY')
                        );

                        template.voucher_email_body = template.voucher_email_body.replace(
                            /{{item_desc}}/g,
                            'Application Fee (' + category.category_name + ')'
                        );

                        template.voucher_email_body = template.voucher_email_body.replace(
                            /{{item_price}}/g,
                            applicationData.category_fee + ' SAR'
                        );

                        template.voucher_email_body = template.voucher_email_body.replace(
                            /{{total_amount}}/g,
                            applicationData.category_fee + ' SAR'
                        );

                        send_mail(
                            [emaildata.email],
                            template.voucher_email_subject,
                            template.voucher_email_body
                        );
                    }
                }

                return {
                    status: 'success',
                    reference_number: applicationData.reference_number,
                    voucher_number: applicationData.voucher_number,
                    voucher_id: voucher.insertedId,
                    voucher_creation_date: time,
                    message: 'Application submitted successfully.',
                    message_ar: 'تم تقديم الطلب بنجاح.',
                };
            } else {
                return {
                    status: 'success',
                    reference_number: applicationData.reference_number,
                    message: 'Application submitted successfully.',
                    message_ar: 'تم تقديم الطلب بنجاح.',
                };
            }
        }
    } catch (error) {
        console.log('--eop_application_submissions--');
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_edit_application(dbName, applicationData) {
    try {
        console.log('--eop_application_submissions--applicationData--');
        console.log(JSON.stringify(applicationData));
        console.log(applicationData.items);
        const existing = await mongodbDriver.FindOne(
            { _id: ObjectID(applicationData.id) },
            'eop_application_submissions',
            'embassy'
        );
        if (existing) {
            console.log('--eop_application_submissions--Existing--');
            console.log(existing);
            const application_status = await mongodbDriver.insertOne(
                {
                    application_id: existing._id,
                    submit_user: existing.submit_user,
                    category: existing.category,
                    category_fee: existing.category_fee,
                    items: existing.items,
                    submit_time: existing.submit_time,
                    status: existing.status,
                    assigned_role: existing.assign_role,
                    workflow_step: existing.workflow_step,
                    reference_number: existing.reference_number,
                    assigned_user: existing.assigned_user,
                    update_by: ObjectID(applicationData.update_by),
                    is_deleted: existing.is_deleted,
                    is_archived: existing.is_archived,
                    log_date: new Date(),
                },
                'eop_submitted_application_logs',
                'embassy'
            );
            let Arr = [];
            existing.items.forEach(function (item) {
                let _item = applicationData.items.find(
                    (x) => x.item_id === item.item_id.toString()
                );
                if (_item) {
                    Arr.push({
                        item_id: ObjectID(item.item_id),
                        type: _item.type,
                        data: _item.data,
                    });
                } else {
                    Arr.push({ item_id: ObjectID(item.item_id), type: item.type, data: item.data });
                }
            });
            console.log('--eop_application_submissions--arter loop Existing--');
            console.log(existing);

            const appUpdate = await mongodbDriver.update(
                { _id: ObjectID(applicationData.id) },
                {
                    $set: {
                        items: Arr,
                    }
                },
                'eop_application_submissions',
                'embassy',
                {}
            );
            return {
                status: 'success',
                message: 'Application Data Update successful',
                message_ar: 'تم تحديث بيانات التطبيق بنجاح',
            };
        } else {
            return {
                status: 'failed',
                message: 'There is no existing Application.',
                message_ar: 'لا يوجد تطبيق موجودs',
            };
        }
    } catch (error) {
        console.log('--eop_application_submissions--');
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_add_user(dbName, userData) {
    try {
        console.log('--userData - forms-repo--');
        console.log(userData);

        if (userData.password !== userData.confirm_password) {
            return {
                status: 'failed',
                message:
                    'Password & Confirm Password do not match.',
                message_ar:
                    'كلمة المرور وتأكيد كلمة المرور غير متطابقين.',
                message_ur:
                    'پاس ورڈ اور کنفرم پاس ورڈ مماثل نہیں ہیں۔.',
            };
        }

        const hash = bcrypt.hashSync(userData.password, 10);
        console.log(hash);
        userData.password = hash;
        delete userData.confirm_password;
        userData.designation = ObjectID(userData.designation);
        userData.department = ObjectID(userData.department);
        let Role = [];
        Role = JSON.parse(userData.role_data);
        delete userData.role_data;
        console.log(typeof Role);

        const userResults = await mongodbDriver.insertOne(userData, 'users-admin', 'embassy');

        let Arr = [];
        Role.forEach((item) => {
            console.log(item);
            console.log(userData._id);
            if (item.item_enabled == true) {
                Arr.push({ user_id: userData._id, role_id: ObjectID(item._id) });
            }
        });
        console.log('after pushing role to array');
        console.log(Arr);
        const userRoleData = await mongodbDriver.insertMany(Arr, 'eop_user_roles', 'embassy');

        return {
            status: 'success',
            message: 'User And Roles Are Added successful.',
            message_ar: 'تمت إضافة المستخدم والأدوار بنجاح',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_add_role_permissions(dbName, permissionData) {
    try {
        console.log('--permissionData - forms-repo--');
        console.log(permissionData);
        permissionData.item_data = JSON.parse(permissionData.item_data);

        var roleId = permissionData.item_data[0].role_id;
        const deleteResponse = await mongodbDriver.deleteMany(
            { role_id: ObjectID(roleId) },
            'eop_role_permissions',
            'embassy'
        );

        permissionData.item_data.forEach((item) => {
            item.role_id = ObjectID(item.role_id);
            item.permission_id = ObjectID(item.permission_id);
            item.resource_id = ObjectID(item.resource_id);
        });

        const userRoleData = await mongodbDriver.insertMany(
            permissionData.item_data,
            'eop_role_permissions',
            'embassy'
        );

        return {
            status: 'success',
            message: 'Role permissions Are Added successful',
            message_ar: 'تمت إضافة أذونات الدور بنجاح',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_approval_workflow(dbName, stepData) {
    try {
        console.log('--stepData - forms-repo--');
        console.log(stepData);
        stepData.step_data = JSON.parse(stepData.step_data);
        console.log('--after paresing - forms-repo--');
        console.log(stepData);
        let number = 1;
        const deletesteps = await mongodbDriver.deleteMany(
            { category: ObjectID(stepData.step_data[0].category) },
            'eop_approval_workflow',
            'embassy',
            {}
        );

        stepData.step_data.forEach((item) => {
            delete item._id;
            item.step_number = number;
            item.role = ObjectID(item.role);
            item.category = ObjectID(item.category);
            number = number + 1;
        });

        const Approval_Workflow_Step = await mongodbDriver.insertMany(
            stepData.step_data,
            'eop_approval_workflow',
            'embassy'
        );

        return {
            status: 'success',
            message: 'Approval workflow steps Are Added successful',
            message_ar: 'تمت إضافة خطوات سير عمل الموافقة بنجاح',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_payment_getway(dbName, paymentData) {
    try {
        console.log('--paymentData - forms-repo--');
        console.log(paymentData);
        if (paymentData.res.detailResponseCode === '000') {
            paymentData.res.log_date = new Date();
            const logs = await mongodbDriver.insertOne(
                paymentData.res,
                'eop_payments_logs',
                'embassy'
            );
            const payments = await mongodbDriver.insertOne(
                {
                    voucher_id: ObjectID(paymentData.voucher_id),
                    payment_mode: 'Online',
                    order_id: paymentData.res.orderId,
                },
                'eop_payments',
                'embassy'
            );
            let time = new Date();
            const existingVoucher = await mongodbDriver.FindOne(
                { _id: ObjectID(paymentData.voucher_id) },
                'eop_payment_voucher',
                'embassy'
            );
            if (existingVoucher) {
                const voucherUpdate = await mongodbDriver.update(
                    { _id: ObjectID(paymentData.voucher_id) },
                    {
                        application_id: existingVoucher.application_id,
                        category: existingVoucher.category,
                        amount: existingVoucher.amount,
                        voucher_number: existingVoucher.voucher_number,
                        application_reference_number: existingVoucher.application_reference_number,
                        is_paid: 'Y',
                        creation_date: existingVoucher.creation_date,
                        payment_date: time,
                    },
                    'eop_payment_voucher',
                    'embassy',
                    {}
                );

                if (voucherUpdate.nModified > 0) {
                    const applicationData = await mongodbDriver.FindOne(
                        { _id: ObjectID(existingVoucher.application_id) },
                        'eop_application_submissions',
                        'embassy'
                    );

                    const emaildata = await mongodbDriver.FindOne(
                        { _id: ObjectID(applicationData.submit_user) },
                        'users-eop',
                        'embassy'
                    );

                    if (emaildata) {
                        const template = await mongodbDriver.FindOne(
                            {},
                            'eop_configuraion_emails',
                            'embassy'
                        );
                        const category = await mongodbDriver.FindOne(
                            { _id: ObjectID(applicationData.category.toString()) },
                            'eop_categories',
                            'embassy'
                        );

                        template.payment_email_subject = template.payment_email_subject.replace(
                            /{{ref_no}}/g,
                            applicationData.reference_number
                        );

                        template.payment_email_body = template.payment_email_body.replace(
                            /{{ref_no}}/g,
                            applicationData.reference_number
                        );

                        template.payment_email_body = template.payment_email_body.replace(
                            /{{name}}/g,
                            emaildata.first_name
                        );

                        template.payment_email_body = template.payment_email_body.replace(
                            /{{category}}/g,
                            category.category_name
                        );

                        template.payment_email_body = template.payment_email_body.replace(
                            /{{voucher_no}}/g,
                            existingVoucher.voucher_number
                        );

                        template.payment_email_body = template.payment_email_body.replace(
                            /{{total_amount}}/g,
                            applicationData.category_fee + ' SAR'
                        );

                        template.payment_email_body = template.payment_email_body.replace(
                            /{{payment_status}}/g,
                            'Payment Successful'
                        );

                        send_mail(
                            [emaildata.email],
                            template.payment_email_subject,
                            template.payment_email_body
                        );
                    }

                    return {
                        status: 'success',
                        message: 'Payment processed successfully',
                        message_ar: 'تمت معالجة الدفع بنجاح',
                    };
                } else {
                    return {
                        status: 'failed',
                        message: 'Payment processing error - Error updating voucher status.',
                        message_ar: 'خطأ في معالجة الدفع - خطأ في تحديث حالة الإيصال.',
                    };
                }
            } else {
                return {
                    status: 'failed',
                    message: 'Payment processing error - Voucher ID not found.',
                    message_ar: 'خطأ في معالجة الدفع - لم يتم العثور على معرّف الإيصال.',
                };
            }
        } else {
            paymentData.res.log_date = new Date();
            const logs = await mongodbDriver.insertOne(
                paymentData.res,
                'eop_payments_logs',
                'embassy'
            );
            return {
                status: 'failed',
                message: 'Payment processing failed or cancelled by user',
                message_ar: 'فشل معالجة الدفع أو إلغاؤها من قبل المستخدم',
            };
        }
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_mark_read(dbName, markData) {
    try {
        console.log('--eop_mark_read--');
        console.log(markData);
        const existing_status = await mongodbDriver.FindOne(
            { application_id: ObjectID(markData.application_id), user_id: ObjectID(markData.user_id) },
            'eop_application_inbox_status',
            'embassy'
        );
        if (!existing_status) {
            const markRead = await mongodbDriver.insertOne(
                {
                    user_id: ObjectID(markData.user_id),
                    application_id: ObjectID(markData.application_id),
                },
                'eop_application_inbox_status',
                'embassy'
            );
            return {
                status: 'success',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_mark_unread(dbName, markData) {
    try {
        console.log('--eop_mark_unread--');
        console.log(markData);
        const existing_status = await mongodbDriver.FindOne(
            { application_id: ObjectID(markData.application_id), user_id: ObjectID(markData.user_id) },
            'eop_application_inbox_status',
            'embassy'
        );
        if (existing_status) {
            const markRead = await mongodbDriver.deleteOne(
                {
                    _id: existing_status._id,
                },
                'eop_application_inbox_status',
                'embassy'
            );
            return {
                status: 'success',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_mark_paid(dbName, paymentData) {
    try {
        console.log('--paymentData - forms-repo--');
        console.log(paymentData);
        const voucherUpdate = await mongodbDriver.update(
            { _id: ObjectID(paymentData.id) },
            {
                $set: {
                    is_paid: 'Y',
                    payment_date: new Date(),
                    receipt_no: paymentData.receiptNo,
                    comments: paymentData.comments,
                }
            },
            'eop_payment_voucher',
            'embassy',
            {}
        );
        if (voucherUpdate) {
            const paymentInsert = await mongodbDriver.insertOne(
                {
                    voucher_id: ObjectID(paymentData.id),
                    payment_mode: 'Offline',
                    payment_date: new Date(),
                    receipt_no: paymentData.receiptNo,
                    comments: paymentData.comments,
                },
                'eop_payments',
                'embassy'
            );

            if (paymentInsert) {
                return {
                    status: 'success',
                    message: 'Voucher has been marked as Paid',
                    message_ar: 'تم تعليم القسيمة على أنها مدفوعة',
                };
            }
            else {
                return {
                    status: 'failed',
                    message: 'Error updating payment status.',
                    message_ar: 'خطأ في تحديث حالة الدفع.',
                };
            }
        }
        else {
            return {
                status: 'failed',
                message: 'Error updating voucher status.',
                message_ar: 'خطأ في تحديث حالة الإيصال.',
            };
        }

    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_mark_refund(dbName, refundData) {
    try {
        console.log('--refundData - forms-repo--');
        console.log(refundData);

        const voucherUpdate = await mongodbDriver.findOneAndUpdate(
            { _id: ObjectID(refundData.id) },
            {
                $set: {
                    is_refunded: 'Y',
                    refund_date: Date(),
                    comments_refund: refundData.comments,
                }
            },
            'eop_payment_voucher',
            'embassy',
            {}
        );

        if (voucherUpdate) {

            const paymentUpdate = await mongodbDriver.findOneAndUpdate(
                { voucher_id: ObjectID(refundData.id) },
                {
                    $set: {
                        is_refunded: 'Y',
                        refund_date: new Date(),
                        comments_refund: refundData.comments,
                    }
                },
                'eop_payments',
                'embassy',
                {}
            );

            if (paymentUpdate) {
                return {
                    status: 'success',
                    message: 'Voucher has been marked for Refund',
                    message_ar: 'تم وضع علامة على القسيمة لاسترداد الأموال',
                };
            }
            else {
                return {
                    status: 'failed',
                    message: 'Error updating payment status.',
                    message_ar: 'خطأ في تحديث حالة الدفع.',
                };
            }
        }
        else {
            return {
                status: 'failed',
                message: 'Error updating voucher status.',
                message_ar: 'خطأ في تحديث حالة الإيصال.',
            };
        }

    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_application_pick(dbName, pickData) {
    try {
        console.log('--pickData - forms-repo--');
        console.log(pickData);
        let filterId = pickData.id;

        const existing_status = await mongodbDriver.FindOne(
            { application_id: ObjectID(filterId), user_id: ObjectID(pickData.assigned_user) },
            'eop_application_inbox_status',
            'embassy'
        );
        if (!existing_status) {
            const markRead = await mongodbDriver.insertOne(
                {
                    user_id: ObjectID(pickData.assigned_user),
                    application_id: ObjectID(filterId),
                },
                'eop_application_inbox_status',
                'embassy'
            );
        }


        const existing = await mongodbDriver.FindOne(
            { _id: ObjectID(filterId) },
            'eop_application_submissions',
            'embassy'
        );
        if (existing) {
            const appUpdate = await mongodbDriver.update(
                { _id: ObjectID(filterId) },
                {
                    $set: {
                        status: 'open',
                        assigned_user: ObjectID(pickData.assigned_user),
                    }
                },
                'eop_application_submissions',
                'embassy',
                {}
            );
            let time = new Date();
            const application_status = await mongodbDriver.insertOne(
                {
                    application_id: ObjectID(filterId),
                    assigned_role: existing.assigned_role,
                    assigned_user: ObjectID(pickData.assigned_user),
                    status: 'open',
                    category: existing.category,
                    workflow_step: existing.workflow_step,
                    update_time: time,
                    comments: pickData.comments,
                    action: 'picked',
                    modified_by: ObjectID(pickData.modified_by),
                },
                'eop_approval_workflow_trail',
                'embassy'
            );
            const emaildata = await mongodbDriver.FindOne(
                { _id: existing.submit_user },
                'users-eop',
                'embassy'
            );
            if (emaildata) {
                const template = await mongodbDriver.FindOne({}, 'eop_configuraion_emails', 'embassy');
                template.application_status_email_subject =
                    template.application_status_email_subject.replace(
                        /{{ref_no}}/g,
                        existing.reference_number
                    );
                template.application_status_email_body = template.application_status_email_body.replace(
                    /{{name}}/g,
                    emaildata.first_name
                );
                template.application_status_email_body = template.application_status_email_body.replace(
                    /{{ref_no}}/g,
                    existing.reference_number
                );
                template.application_status_email_body = template.application_status_email_body.replace(
                    /{{status}}/g,
                    'Open - In Progress'
                );
                template.application_status_email_body = template.application_status_email_body.replace(
                    /{{reason_details}}/g,
                    ''
                );
                send_mail(
                    [emaildata.email],
                    template.application_status_email_subject,
                    template.application_status_email_body
                );
            }
            return {
                status: 'success',
                message: 'Application is assigned to you successfuly',
                message_ar: 'تم تعيين التطبيق لك بنجاح',
            };
        } else {
            return {
                status: 'failed',
                message: 'Error loading existing application data. Please try again.',
                message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
            };
        }
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_application_reject(dbName, rejectData) {
    try {
        console.log('--rejectData - forms-repo--');
        console.log(rejectData);
        let filterId = rejectData.id;
        const existing = await mongodbDriver.FindOne(
            { _id: ObjectID(filterId), status: 'open' },
            'eop_application_submissions',
            'embassy'
        );
        console.log('existing data');
        console.log(existing);
        if (existing) {

            let time = new Date();

            const appUpdate = await mongodbDriver.findOneAndUpdate(
                { _id: ObjectID(filterId) },
                {
                    $set: {
                        status: 'rejected',
                        update_time: time,
                        modified_by: ObjectID(rejectData.modified_by),
                    }
                },
                'eop_application_submissions',
                'embassy',
                {}
            );

            const application_status = await mongodbDriver.insertOne(
                {
                    application_id: ObjectID(filterId),
                    assigned_role: existing.assigned_role,
                    assigned_user: existing.assigned_user,
                    status: 'rejected',
                    category: existing.category,
                    workflow_step: existing.workflow_step,
                    update_time: time,
                    comments: rejectData.comments,
                    action: 'status change - rejected',
                    modified_by: ObjectID(rejectData.modified_by),
                },
                'eop_approval_workflow_trail',
                'embassy'
            );
            const emaildata = await mongodbDriver.FindOne(
                { _id: existing.submit_user },
                'users-eop',
                'embassy'
            );
            if (emaildata) {
                const template = await mongodbDriver.FindOne({}, 'eop_configuraion_emails', 'embassy');
                template.application_status_email_subject =
                    template.application_status_email_subject.replace(
                        /{{ref_no}}/g,
                        existing.reference_number
                    );
                template.application_status_email_body = template.application_status_email_body.replace(
                    /{{name}}/g,
                    emaildata.first_name
                );
                template.application_status_email_body = template.application_status_email_body.replace(
                    /{{ref_no}}/g,
                    existing.reference_number
                );
                template.application_status_email_body = template.application_status_email_body.replace(
                    /{{status}}/g,
                    'Rejected'
                );
                template.application_status_email_body = template.application_status_email_body.replace(
                    /{{reason_details}}/g,
                    '<strong>Reason/comments:</strong> ' + rejectData.comments + '<br>'
                );
                send_mail(
                    [emaildata.email],
                    template.application_status_email_subject,
                    template.application_status_email_body
                );
            }
            return {
                status: 'success',
                message: 'Application is rejected by you successfuly',
                message_ar: 'تم رفض التطبيق من قبلك بنجاح ',
            };
        } else {
            return {
                status: 'failed',
                message: 'Error loading existing application data. Please try again.',
                message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
            };
        }
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_application_approved(dbName, approvedData) {
    try {
        console.log('--approvedData - forms-repo--');
        console.log(approvedData);
        let filterId = approvedData.id;
        const existing = await mongodbDriver.FindOne(
            { _id: ObjectID(filterId), status: 'open' },
            'eop_application_submissions',
            'embassy'
        );
        console.log('existing data');
        console.log(existing);
        if (existing) {

            let time = new Date();

            const appUpdate = await mongodbDriver.findOneAndUpdate(
                { _id: ObjectID(filterId), status: 'open' },
                {
                    $set: {
                        status: 'approved',
                        update_time: time,
                        modified_by: ObjectID(approvedData.modified_by),
                    }
                },
                'eop_application_submissions',
                'embassy',
                {}
            );

            console.log('--appUpdate - approved--');
            console.log(appUpdate);

            const application_status = await mongodbDriver.insertOne(
                {
                    application_id: ObjectID(filterId),
                    assigned_role: existing.assigned_role,
                    assigned_user: existing.assigned_user,
                    status: 'approved',
                    category: existing.category,
                    workflow_step: existing.workflow_step,
                    update_time: time,
                    comments: approvedData.comments,
                    action: 'status change - approved',
                    modified_by: ObjectID(approvedData.modified_by),
                },
                'eop_approval_workflow_trail',
                'embassy'
            );
            if (appUpdate && application_status) {
                const emaildata = await mongodbDriver.FindOne(
                    { _id: existing.submit_user },
                    'users-eop',
                    'embassy'
                );
                if (emaildata) {
                    const template = await mongodbDriver.FindOne(
                        {},
                        'eop_configuraion_emails',
                        'embassy'
                    );
                    template.application_status_email_subject =
                        template.application_status_email_subject.replace(
                            /{{ref_no}}/g,
                            existing.reference_number
                        );
                    template.application_status_email_body =
                        template.application_status_email_body.replace(
                            /{{name}}/g,
                            emaildata.first_name
                        );
                    template.application_status_email_body =
                        template.application_status_email_body.replace(
                            /{{ref_no}}/g,
                            existing.reference_number
                        );
                    template.application_status_email_body =
                        template.application_status_email_body.replace(/{{status}}/g, 'Approved');
                    template.application_status_email_body =
                        template.application_status_email_body.replace(
                            /{{reason_details}}/g,
                            '<strong>Comments:</strong> ' + approvedData.comments + '<br>'
                        );
                    send_mail(
                        [emaildata.email],
                        template.application_status_email_subject,
                        template.application_status_email_body
                    );
                }
                return {
                    status: 'success',
                    message: 'Application is Approved by you successfuly',
                    message_ar: 'تمت الموافقة على التطبيق من قبلك بنجاح',
                };
            }
        } else {
            return {
                status: 'failed',
                message: 'Error loading existing application data. Please try again.',
                message_ar: 'الرجاء معاودة المحاولة في وقت لاحق',
            };
        }
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_application_askinfo(dbName, appData) {
    try {
        console.log('--appData - eop_application_askinfo--');
        console.log(appData);
        let filterId = appData.id;
        const existing = await mongodbDriver.FindOne(
            { _id: ObjectID(filterId), status: 'open' },
            'eop_application_submissions',
            'embassy'
        );
        console.log('existing data');
        console.log(existing);
        if (existing) {

            let time = new Date();

            const appUpdate = await mongodbDriver.findOneAndUpdate(
                { _id: ObjectID(filterId) },
                {
                    $set: {
                        status: 'review',
                        update_time: time,
                        modified_by: ObjectID(appData.modified_by),
                    }
                },
                'eop_application_submissions',
                'embassy',
                {}
            );

            console.log('--appUpdate - review--');
            console.log(appUpdate);

            const application_status = await mongodbDriver.insertOne(
                {
                    application_id: ObjectID(filterId),
                    assigned_role: existing.assigned_role,
                    assigned_user: existing.assigned_user,
                    status: 'review',
                    category: existing.category,
                    workflow_step: existing.workflow_step,
                    update_time: time,
                    comments: appData.comments,
                    action: 'status change - review',
                    modified_by: ObjectID(appData.modified_by),
                },
                'eop_approval_workflow_trail',
                'embassy'
            );
            if (appUpdate && application_status) {
                const emaildata = await mongodbDriver.FindOne(
                    { _id: existing.submit_user },
                    'users-eop',
                    'embassy'
                );
                if (emaildata) {
                    const template = await mongodbDriver.FindOne(
                        {},
                        'eop_configuraion_emails',
                        'embassy'
                    );
                    template.application_status_email_subject =
                        template.application_status_email_subject.replace(
                            /{{ref_no}}/g,
                            existing.reference_number
                        );
                    template.application_status_email_body =
                        template.application_status_email_body.replace(
                            /{{name}}/g,
                            emaildata.first_name
                        );
                    template.application_status_email_body =
                        template.application_status_email_body.replace(
                            /{{ref_no}}/g,
                            existing.reference_number
                        );
                    template.application_status_email_body =
                        template.application_status_email_body.replace(/{{status}}/g, 'Review');
                    template.application_status_email_body =
                        template.application_status_email_body.replace(
                            /{{reason_details}}/g,
                            '<strong>Additional information is required related to your application, please check the comments below for details.</strong><br><br><strong>Comments:</strong> ' +
                            appData.comments +
                            '<br>'
                        );
                    send_mail(
                        [emaildata.email],
                        template.application_status_email_subject,
                        template.application_status_email_body
                    );
                }
                return {
                    status: 'success',
                    message: 'Application status changed to review, email sent to user',
                    message_ar:
                        'تم تغيير حالة التطبيق للمراجعة ، تم إرسال البريد الإلكتروني إلى المستخدم',
                };
            }
        } else {
            return {
                status: 'failed',
                message: 'Error loading existing application data. Please try again.',
                message_ar: 'الرجاء معاودة المحاولة في وقت لاحق',
            };
        }
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_application_review_update(dbName, appData) {
    try {
        console.log('-- eop_application_review_update --appData --');
        console.log(appData);
        const existing = await mongodbDriver.FindOne(
            { _id: ObjectID(appData.id) },
            'eop_application_submissions',
            'embassy'
        );
        console.log('existing data');
        console.log(existing);

        if (appData.updatesObject.assigned_role) {
            appData.updatesObject.assigned_role = ObjectID(appData.updatesObject.assigned_role);
        }
        if (appData.updatesObject.assigned_user) {
            appData.updatesObject.assigned_user = ObjectID(appData.updatesObject.assigned_user);
        }
        if (appData.updatesObject.workflow_step) {
            appData.updatesObject.workflow_step = ObjectID(appData.updatesObject.workflow_step);
        }

        if (existing) {

            let time = new Date();

            // appData.updatesObject.action = appData.action;
            appData.updatesObject.update_time = time;
            appData.updatesObject.modified_by = ObjectID(appData.modified_by);

            if (appData.updatesObject) {
                const appUpdate = await mongodbDriver.findOneAndUpdate(
                    { _id: ObjectID(appData.id) },
                    { $set: appData.updatesObject },
                    'eop_application_submissions',
                    'embassy',
                    {}
                );

                console.log('--appUpdate - eop_application_review_update--');
                console.log(appUpdate);

            }

            const workflow_trail = await mongodbDriver.insertOne(
                {
                    application_id: ObjectID(appData.id),
                    assigned_role: existing.assigned_role,
                    assigned_user: existing.assigned_user,
                    status: existing.status,
                    category: existing.category,
                    workflow_step: existing.workflow_step,
                    update_time: time,
                    comments: appData.comments,
                    action: appData.action,
                    modified_by: ObjectID(appData.modified_by),
                },
                'eop_approval_workflow_trail',
                'embassy'
            );
            return {
                status: 'success',
                message: 'Application updated successfuly',
                message_ar: 'تم تحديث التطبيق بنجاح',
                message_ur: 'درخواست کامیابی کے ساتھ اپ ڈیٹ ہو گئی ہے۔',
            };
        } else {
            return {
                status: 'failed',
                message: 'Error loading existing application data. Please try again.',
                message_ar: 'الرجاء معاودة المحاولة في وقت لاحق',
            };
        }
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_add_categories(dbName, categoriesData) {
    try {
        console.log('--categoriesData - forms-repo--');
        console.log(categoriesData);
        categoriesData.department = ObjectID(categoriesData.department);

        const categoriesResults = await mongodbDriver.insertOne(
            categoriesData,
            'eop_categories',
            'embassy'
        );
        return {
            status: 'success',
            message: 'Categories Added successful.',
            message_ar: 'تمت إضافة الفئات بنجاح',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_step_num(dbName, step_data) {
    try {
        console.log('--categoriesData - forms-repo--');
        console.log(step_data);
        const category = ObjectID(step_data.category);
        const Euser = ObjectID(step_data.entry_user);
        const Auser = ObjectID(step_data.approver_user);
        const des = step_data.step_description;
        let data = {};
        data.step_number = step_data.step_number;
        data.category = category;
        data.entry_user = Euser;
        data.approver_user = Auser;
        data.step_description = des;
        console.log('After making objects');
        console.log(data);

        const categoriesResults = await mongodbDriver.insertOne(data, 'eop_steps', 'embassy');
        console.log(data);
        return {
            status: 'success',
            message: 'Step Number Added successful.',
            message_ar: 'تمت إضافة الفئات بنجاح',
            step_data: data,
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_step_item(dbName, step_data) {
    try {
        console.log('--categoriesData - forms-repo--');
        console.log(step_data);
        step_data.item_data = JSON.parse(step_data.item_data);
        console.log('jason');
        console.log(step_data.item_data);
        step_data.item_data.forEach((item) => {
            item.step_id = ObjectID(item.step_id);
            if (item.item_enabled == true) {
                item.item_enabled = 'Y';
            } else {
                item.item_enabled = 'N';
            }
        });

        console.log('after objectify');
        console.log(step_data.item_data);
        const categoriesResults = await mongodbDriver.insertMany(
            step_data.item_data,
            'eop_step_items',
            'embassy'
        );
        console.log(step_data.item_data);
        return {
            status: 'success',
            message: 'Step item Added successful.',
            message_ar: 'تمت إضافة الفئات بنجاح',
            step_data: step_data.item_data,
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_update_category(dbName, categoriesData) {
    try {
        const filterId = categoriesData.id;
        const data = await mongodbDriver.FindOne(
            { _id: ObjectID(filterId) },
            'eop_categories',
            'embassy'
        );
        console.log('already data');
        console.log(data);

        if (categoriesData.is_deleted) {
            const categoriesResults = await mongodbDriver.update(
                { _id: ObjectID(filterId) },
                {
                    $set: {
                        is_deleted: categoriesData.is_deleted,
                    }
                },
                'eop_categories',
                'embassy',
                ''
            );
            return {
                status: 'success',
                message: 'Category Deleted successful.',
                message_ar: 'تمت إضافة الفئات بنجاح',
            };
        } else {
            const categoriesResults = await mongodbDriver.update(
                { _id: ObjectID(filterId) },
                {
                    $set: {
                        category_name: categoriesData.category_name,
                        category_fee: categoriesData.category_fee,
                        department: ObjectID(categoriesData.department),
                        category_description: categoriesData.category_description,
                        terms: categoriesData.terms,
                        prerequisites: categoriesData.prerequisites,
                        is_enabled: categoriesData.is_enabled,
                    }
                },
                'eop_categories',
                'embassy',
                ''
            );
            return {
                status: 'success',
                message: 'Category Updated successful.',
                message_ar: 'تمت إضافة الفئات بنجاح',
            };
        }
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_delete_designation(dbName, designationData) {
    try {
        const filterId = designationData.id;
        const data = await mongodbDriver.FindOne(
            { _id: ObjectID(filterId) },
            'eop_designations',
            'embassy'
        );

        const DesignationResults = await mongodbDriver.update(
            { _id: ObjectID(filterId) },
            {
                $set: {
                    is_deleted: designationData.is_deleted,
                }
            },
            'eop_designations',
            'embassy',
            ''
        );
        return {
            status: 'success',
            message: 'Designation Deleted successful.',
            message_ar: 'تمت إضافة الفئات بنجاح',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_delete_department(dbName, departmentData) {
    try {
        const filterId = departmentData.id;
        const data = await mongodbDriver.FindOne(
            { _id: ObjectID(filterId) },
            'eop_departments',
            'embassy'
        );

        const departmentResults = await mongodbDriver.update(
            { _id: ObjectID(filterId) },
            {
                $set: {
                    is_deleted: departmentData.is_deleted,
                }
            },
            'eop_departments',
            'embassy',
            ''
        );
        return {
            status: 'success',
            message: 'Department Deleted successful.',
            message_ar: 'تمت إضافة الفئات بنجاح',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_delete_role(dbName, roleData) {
    try {
        const filterId = roleData.id;
        const data = await mongodbDriver.FindOne(
            { _id: ObjectID(filterId) },
            'eop_roles',
            'embassy'
        );

        const roleResults = await mongodbDriver.update(
            { _id: ObjectID(filterId) },
            {
                role_name: data.role_name,
                role_desc: data.role_desc,
                is_deleted: roleData.is_deleted,
            },
            'eop_roles',
            'embassy',
            ''
        );
        return {
            status: 'success',
            message: 'Role Deleted successful.',
            message_ar: 'تمت إضافة الفئات بنجاح',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_delete_eopUser(dbName, eopUserData) {
    try {
        const filterId = eopUserData.id;
        const userData = await mongodbDriver.FindOne(
            { _id: ObjectID(filterId) },
            'users-admin',
            'embassy'
        );

        const eopUserResults = await mongodbDriver.update(
            { _id: ObjectID(filterId) },
            {
                designation: userData.designation,
                department: userData.department,
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                mobile_number: userData.mobile_number,
                password: userData.password,
                is_deleted: eopUserData.is_deleted,
            },
            'users-admin',
            'embassy',
            ''
        );
        return {
            status: 'success',
            message: 'Admin User Deleted successful.',
            message_ar: 'تمت إضافة الفئات بنجاح',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_update_department(dbName, departmentsData) {
    try {
        const filterId = departmentsData.id;

        const departmentsResults = await mongodbDriver.update(
            { _id: ObjectID(filterId) },
            {
                department_name: departmentsData.department_name,
                department_desc: departmentsData.department_desc,
                is_deleted: departmentsData.is_deleted,
            },
            'eop_departments',
            'embassy',
            ''
        );
        return {
            status: 'success',
            message: 'Department Deleted Successfully.',
            message_ar: 'تم حذف القسم بنجاح.',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_update_designation(dbName, designationData) {
    try {
        const filterId = designationData.id;

        const designationResults = await mongodbDriver.update(
            { _id: ObjectID(filterId) },
            {
                designation_name: designationData.designation_name,
                designation_desc: designationData.designation_desc,
                is_deleted: designationData.is_deleted,
            },
            'eop_designations',
            'embassy',
            ''
        );
        return {
            status: 'success',
            message: 'Designation Updated Successfully.',
            message_ar: 'تم حذف القسم بنجاح.',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_update_user_role(dbName, userData) {
    try {
        console.log('--userData - forms-repo--');
        console.log(userData);
        const filterId = userData.id;
        let Role = [];
        Role = JSON.parse(userData.role_data);
        delete userData.role_data;

        userData.designation = ObjectID(userData.designation);
        userData.department = ObjectID(userData.department);

        if (userData.password) {
            if (userData.password !== userData.confirm_password) {
                return {
                    status: 'failed',
                    message:
                        'Password & Confirm Password do not match.',
                    message_ar:
                        'كلمة المرور وتأكيد كلمة المرور غير متطابقين.',
                    message_ur:
                        'پاس ورڈ اور کنفرم پاس ورڈ مماثل نہیں ہیں۔.',
                };
            }

            const hash = bcrypt.hashSync(userData.password, 10);
            console.log(hash);
            userData.password = hash;
            delete userData.confirm_password;
            const categoriesResults = await mongodbDriver.update(
                { _id: ObjectID(filterId) },
                {
                    $set: {
                        designation: userData.designation,
                        department: userData.department,
                        email: userData.email,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        mobile_number: userData.mobile_number,
                        password: userData.password
                    }
                },
                'users-admin',
                'embassy',
                ''
            );

        }
        else {
            const categoriesResults = await mongodbDriver.update(
                { _id: ObjectID(filterId) },
                {
                    $set: {
                        designation: userData.designation,
                        department: userData.department,
                        email: userData.email,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        mobile_number: userData.mobile_number
                    }
                },
                'users-admin',
                'embassy',
                ''
            );
        }
        const deleteRoles = await mongodbDriver.deleteMany(
            { user_id: ObjectID(filterId) },
            'eop_user_roles',
            'embassy',
            ''
        );

        let Arr = [];
        Role.forEach((item) => {
            console.log(item);
            console.log(filterId);
            if (item.item_enabled == true) {
                Arr.push({ user_id: ObjectID(filterId), role_id: ObjectID(item.role_id) });
            }
        });
        console.log('after pushing role to array');
        console.log(Arr);
        const NewRolesData = await mongodbDriver.insertMany(Arr, 'eop_user_roles', 'embassy');


        return {
            status: 'success',
            message: 'step data Updated successful.',
            message_ar: 'تمت إضافة الفئات بنجاح',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_update_step_num(dbName, stepData) {
    try {
        const filterId = stepData.id;
        const data = await mongodbDriver.FindOne(
            { _id: ObjectID(filterId) },
            'eop_steps',
            'embassy'
        );

        stepData.category = ObjectID(stepData.category);
        stepData.entry_user = ObjectID(stepData.entry_user);
        stepData.approver_user = ObjectID(stepData.approver_user);

        const categoriesResults = await mongodbDriver.update(
            { _id: ObjectID(filterId) },
            {
                $set: {
                    step_number: stepData.step_number,
                    category: stepData.category,
                    entry_user: stepData.entry_user,
                    approver_user: stepData.approver_user,
                    step_description: stepData.step_description,
                }
            },
            'eop_steps',
            'embassy',
            ''
        );
        return {
            status: 'success',
            message: 'step data Updated successful.',
            message_ar: 'تمت إضافة الفئات بنجاح',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_update_item(dbName, itemData) {
    try {
        console.log('--eop_update_item--itemData--');
        console.log(itemData);

        const filterId = itemData.id;
        const data = await mongodbDriver.FindOne(
            { _id: ObjectID(filterId) },
            'eop_step_items',
            'embassy'
        );

        const categoriesResults = await mongodbDriver.update(
            { _id: ObjectID(filterId) },
            {
                item_name: itemData.name,
                item_helptext: itemData.helptext,
                item_type: itemData.type,
                validation: itemData.val,
                required: itemData.req,
                step_id: ObjectID(data.step_id),
                item_enabled: data.item_enabled,
                enable_arabic: itemData.enable,
                dropdown_values_eng: itemData.eng,
                dropdown_values_arb: itemData.arb,
                date_convert: itemData.changeDate,
                autotranslate: itemData.autotranslate,
                download_text: itemData.download_text,
                download_file: itemData.download_file,
                multiline: itemData.multiline,
                item_order: itemData.item_order,
            },
            'eop_step_items',
            'embassy',
            ''
        );
        return {
            status: 'success',
            message: 'step data Updated successful.',
            message_ar: 'تمت إضافة الفئات بنجاح',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_update_step_item(dbName, stepData) {
    try {
        console.log('--eop_update_step_item--');
        console.log(stepData.itemdata);
        console.log(stepData.stepId);

        let arr = [];
        arr = JSON.parse(stepData.itemdata);
        console.log(arr);

        arr.forEach((item) => {
            if (item._id) {
                item._id = ObjectID(item._id);
                item.step_id = ObjectID(item.step_id);
                const categoriesResults = mongodbDriver.update(
                    { _id: ObjectID(item._id) },
                    {
                        _id: item._id,
                        step_id: item.step_id,
                        item_enabled: item.item_enabled,
                        item_order: item.item_order,
                        item_name: item.item_name,
                        item_type: item.item_type,
                        multiline: item.multiline,
                        item_helptext: item.item_helptext,
                        validation: item.validation,
                        required: item.required,
                        enable_arabic: item.enable_arabic,
                        dropdown_values_eng: item.dropdown_values_eng,
                        dropdown_values_arb: item.dropdown_values_arb,
                        date_convert: item.date_convert,
                    },
                    'eop_step_items',
                    'embassy',
                    ''
                );
            } else {
                item.step_id = ObjectID(item.step_id);
                const categoriesResults = mongodbDriver.insertOne(
                    {
                        step_id: item.step_id,
                        item_enabled: item.item_enabled,
                        item_order: item.item_order,
                        item_name: item.item_name,
                        item_type: item.item_type,
                        multiline: item.multiline,
                        item_helptext: item.item_helptext,
                        validation: item.validation,
                        required: item.required,
                        enable_arabic: item.enable_arabic,
                        dropdown_values_eng: item.dropdown_values_eng,
                        dropdown_values_arb: item.dropdown_values_arb,
                        date_convert: item.date_convert,
                    },
                    'eop_step_items',
                    'embassy'
                );
            }
        });

        const query = [
            { $match: { _id: ObjectID(stepData.stepId) } },
            {
                $lookup: {
                    from: 'eop_step_items',
                    localField: '_id',
                    foreignField: 'step_id',
                    as: 'items',
                },
            },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'entry_user',
                    foreignField: '_id',
                    as: 'entry_user',
                },
            },
            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'approver_user',
                    foreignField: '_id',
                    as: 'approver_user',
                },
            },
            {
                $project: {
                    _id: 0,
                    'userCategory._id': 0,
                    'userItems._id': 0,
                    'entryUser._id': 0,
                    'approverUser._id': 0,
                },
            },
        ];
        const updatedData = await mongodbDriver.aggregate('eop_steps', 'embassy', query);

        // console.log(arr);

        return {
            status: 'success',
            stepData: updatedData,
            message: 'Items data updated successfully.',
            message_ar: 'تم تحديث بيانات العناصر بنجاح',
        };
    } catch (error) {
        console.log(error);

        return {
            status: 'failed',
            message: 'Something unexpected has occurred. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_show_categories() {
    try {
        const showCategories = await mongodbDriver.findAll(
            { is_deleted: 'N', is_enabled: 'Y' },
            {},
            'eop_categories',
            'embassy'
        );
        return {
            status: 'success',
            user_data: { showCategories },
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_show_categories_admin() {
    try {
        const showCategories = await mongodbDriver.findAll(
            { is_deleted: 'N' },
            {},
            'eop_categories',
            'embassy'
        );
        return {
            status: 'success',
            user_data: { showCategories },
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_show_role(dbName) {
    try {
        const showRoles = await mongodbDriver.findAll(
            { is_deleted: 'N' },
            {},
            'eop_roles',
            'embassy'
        );
        return {
            status: 'success',
            user_data: showRoles,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_get_pages(dbName) {
    try {
        const showPages = await mongodbDriver.findAll({}, {}, 'pages', 'embassy');
        return {
            status: 'success',
            pages: showPages,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_get_permissions(dbName) {
    try {
        const Permissions_data = await mongodbDriver.findAll({}, {}, 'eop_permissions', 'embassy');
        return {
            status: 'success',
            permissions: Permissions_data,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_get_resources(dbName) {
    try {
        const Resources_data = await mongodbDriver.findAll({}, {}, 'eop_resources', 'embassy');
        return {
            status: 'success',
            Resources: Resources_data,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_role_listing(dbName) {
    try {
        const query = [
            { $match: { is_deleted: 'N' } },
            {
                $lookup: {
                    from: 'eop_user_roles',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'user_roles',
                },
            },
            {
                $lookup: {
                    from: 'eop_roles',
                    localField: 'user_roles.role_id',
                    foreignField: '_id',
                    as: 'user_roles.role_id',
                },
            },
            {
                $lookup: {
                    from: 'eop_designations',
                    localField: 'designation',
                    foreignField: '_id',
                    as: 'designation',
                },
            },
            {
                $lookup: {
                    from: 'eop_departments',
                    localField: 'department',
                    foreignField: '_id',
                    as: 'department',
                },
            },
            { $unwind: { path: '$designation', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
        ];
        const data = await mongodbDriver.aggregate('users-admin', 'embassy', query);
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_single_user_listing(id) {
    try {
        const query = [
            { $match: { _id: ObjectID(id) } },
            {
                $lookup: {
                    from: 'eop_user_roles',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'user_roles',
                },
            },
            {
                $lookup: {
                    from: 'eop_roles',
                    localField: 'user_roles.role_id',
                    foreignField: '_id',
                    as: 'user_roles.role_id',
                },
            },
            {
                $lookup: {
                    from: 'eop_designations',
                    localField: 'designation',
                    foreignField: '_id',
                    as: 'designation',
                },
            },
            {
                $lookup: {
                    from: 'eop_departments',
                    localField: 'department',
                    foreignField: '_id',
                    as: 'department',
                },
            },
            { $unwind: { path: '$designation', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
        ];
        const data = await mongodbDriver.aggregate('users-admin', 'embassy', query);
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_single_role_listing(id) {
    try {
        const data = await mongodbDriver.FindOne({ _id: ObjectID(id) }, 'eop_roles', 'embassy');
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function submited_application(id) {
    try {
        const query = [
            { $match: { _id: ObjectID(id) } },
            {
                $lookup: {
                    from: 'users-eop',
                    localField: 'submit_user',
                    foreignField: '_id',
                    as: 'submit_user',
                },
            },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $lookup: {
                    from: 'eop_step_items',
                    localField: 'items.item_id',
                    foreignField: '_id',
                    let: {
                        id: '$_id',
                    },
                    pipeline: [
                        {
                            $sort: {
                                item_order: 1,
                            },
                        },
                    ],

                    as: 'documents',
                },
            },
            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'assigned_user',
                    foreignField: '_id',
                    as: 'assigned_user',
                },
            },
            {
                $lookup: {
                    from: 'eop_payment_voucher',
                    localField: '_id',
                    foreignField: 'application_id',
                    as: 'voucher',
                },
            },
            { $unwind: { path: '$voucher', preserveNullAndEmptyArrays: true } },
        ];
        const data = await mongodbDriver.aggregate('eop_application_submissions', 'embassy', query);
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_show_user_designation(dbName) {
    try {
        const showDesignations = await mongodbDriver.findAll(
            { is_deleted: 'N' },
            {},
            'eop_designations',
            'embassy'
        );
        return {
            status: 'success',
            user_data: showDesignations,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_show_user_department(dbName) {
    try {
        const showDepartments = await mongodbDriver.findAll(
            { is_deleted: 'N' },
            {},
            'eop_departments',
            'embassy'
        );
        return {
            status: 'success',
            user_data: showDepartments,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function reason_of_death(dbName) {
    try {
        const config = await mongodbDriver.FindOne({}, 'eop_configuraion', 'embassy');
        console.log('config');
        console.log(config.noc_reason_id);
        const Result = await mongodbDriver.FindOne(
            { _id: config.noc_reason_id },
            'eop_step_items',
            'embassy'
        );
        console.log('Result data');
        console.log(Result.dropdown_values_eng);
        return {
            status: 'success',
            Result_data: Result.dropdown_values_eng,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function place_of_death(dbName) {
    try {
        const config = await mongodbDriver.FindOne({}, 'eop_configuraion', 'embassy');
        console.log('config');
        console.log(config.noc_place_id);

        const Result = await mongodbDriver.FindOne(
            { _id: config.noc_place_id },
            'eop_step_items',
            'embassy'
        );
        console.log('Result data');
        console.log(Result.dropdown_values_eng);
        return {
            status: 'success',
            Result_data: Result.dropdown_values_eng,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_show_single_category(id) {
    const query = [
        { $match: { _id: ObjectID(id) } },
        {
            $lookup: {
                from: 'eop_departments',
                localField: 'department',
                foreignField: '_id',
                as: 'department',
            },
        },
        { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
    ];
    const data = await mongodbDriver.aggregate('eop_categories', 'embassy', query);
    return {
        status: 'success',
        find_data: data,
    };
}
async function eop_single_user(id) {
    try {
        const data = await mongodbDriver.FindOne({ _id: ObjectID(id) }, 'users-eop', 'embassy');
        return {
            status: 'success',
            user_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function eop_show_single_department(id) {
    console.log('--app data repo (id)--');
    console.log(id);
    const data = await mongodbDriver.FindOne({ _id: ObjectID(id) }, 'eop_departments', 'embassy');
    console.log('--app data repo (result data)--');
    console.log(data);
    return {
        status: 'success',
        find_data: data,
    };
}
async function eop_show_single_designation(id) {
    console.log('--app data repo (id)--');
    console.log(id);
    const data = await mongodbDriver.FindOne({ _id: ObjectID(id) }, 'eop_designations', 'embassy');
    console.log('--app data repo (result data)--');
    console.log(data);
    return {
        status: 'success',
        find_data: data,
    };
}

async function eop_show_single_step(id) {
    console.log('app_data_repo');
    console.log(ObjectID(id));
    try {
        const query = [
            { $match: { _id: ObjectID(id) } },
            {
                $lookup: {
                    from: 'eop_step_items',
                    localField: '_id',
                    foreignField: 'step_id',
                    as: 'items',
                },
            },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'entry_user',
                    foreignField: '_id',
                    as: 'entry_user',
                },
            },
            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'approver_user',
                    foreignField: '_id',
                    as: 'approver_user',
                },
            },
            {
                $project: {
                    _id: 0,
                    'userCategory._id': 0,
                    'userItems._id': 0,
                    'entryUser._id': 0,
                    'approverUser._id': 0,
                },
            },
        ];
        const data = await mongodbDriver.aggregate('eop_steps', 'embassy', query);
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_show_category(id) {
    console.log('app_data_repo');
    console.log(ObjectID(id));
    try {
        const data = await mongodbDriver.FindOne(
            { category: ObjectID(id) },
            'eop_steps',
            'embassy'
        );
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_show_single_item(id) {
    try {
        const data = await mongodbDriver.FindOne(
            { _id: ObjectID(id) },
            'eop_step_items',
            'embassy'
        );
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_get_form_data(id) {
    try {
        const query = [
            { $match: { category: ObjectID(id) } },
            {
                $lookup: {
                    from: 'eop_step_items',
                    localField: '_id',
                    foreignField: 'step_id',
                    let: {
                        id: '$_id',
                    },
                    pipeline: [
                        {
                            $sort: {
                                item_order: 1,
                            },
                        },
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$$id', '$step_id'],
                                },
                            },
                        },
                    ],

                    as: 'items',
                },
            },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $sort: { step_number: 1, _id: 1 } },
        ];
        const data = await mongodbDriver.aggregate('eop_steps', 'embassy', query);
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_show_steps(id) {
    try {
        const query = [
            { $match: { category: ObjectID(id) } },
            {
                $lookup: {
                    from: 'eop_step_items',
                    localField: '_id',
                    foreignField: 'step_id',
                    as: 'items',
                },
            },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $project: {
                    _id: 0,
                    'userCategory._id': 0,
                    'userItems._id': 0,
                },
            },
            { $sort: { step_number: 1, _id: 1 } },
        ];
        const data = await mongodbDriver.aggregate('eop_steps', 'embassy', query);
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function submited_applications(dbName, params, fetchData) {
    console.log('--submited_applications - applications_report-- fetchData');
    console.log(fetchData);

    var to_date = new Date(fetchData.to_date);
    to_date.setDate(to_date.getDate() + 1);
    // to_date = to_date.toString().split("T")[0];
    const config = await mongodbDriver.FindOne({}, 'eop_configuraion', 'embassy');

    console.log('--to_date--');
    console.log(to_date);
    try {
        let query1 = [
            {
                $match: {
                    user_id: ObjectID(fetchData.login_user)
                }
            },
            {
                $lookup: {
                    from: 'eop_role_permissions',
                    localField: 'role_id',
                    foreignField: 'role_id',
                    pipeline: [{ $match: { type: { $eq: 'category' } } }],
                    as: 'role_permissions',
                },
            },
            { $unwind: { path: '$role_permissions', preserveNullAndEmptyArrays: false } },
            {
                $project: {
                    role_permissions: '$role_permissions.resource_id',
                    id: 1
                }
            }
        ];
        const permission_data = await mongodbDriver.aggregate('eop_user_roles', 'embassy', query1);
        console.log('--permission_data--');
        console.log(permission_data);

        let allowedCategories = permission_data.map(element => ObjectID(element.role_permissions));
        console.log('--allowedCategories--');
        console.log(allowedCategories);

        let query = [
            {
                $match: {
                    $and: [
                        {
                            submit_time: {
                                $gte: new Date(fetchData.from_date),
                                $lte: new Date(to_date),
                            },
                        },
                        { is_deleted: 'N' },
                        { is_archived: 'N' },
                        { category: { $in: allowedCategories } }
                    ],
                },
            },
            {
                $lookup: {
                    from: 'users-eop',
                    localField: 'submit_user',
                    foreignField: '_id',
                    pipeline: [{ $match: { cnic: { $regex: fetchData.cnic, $options: 'i' } } }],
                    as: 'submit_user_normal',
                },
            },
            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'submit_user',
                    foreignField: '_id',
                    as: 'submit_user_admin',
                },
            },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $project: {
                    _id: 1,
                    submit_user: 1,
                    category: 1,
                    items: 1,
                    submit_time: 1,
                    status: 1,
                    assigned_role: 1,
                    workflow_step: 1,
                    reference_number: 1,
                    assigned_user: 1,
                    submit_user_normal: 1,
                    submit_user_admin: 1,
                    submit_user: {
                        $cond: [
                            { $gt: [{ $size: '$submit_user_normal' }, 0] },
                            '$submit_user_normal',
                            '$submit_user_admin',
                        ],
                    },
                },
            },
            { $sort: { reference_number: -1 } },
            { $unwind: { path: '$submit_user', preserveNullAndEmptyArrays: false } },
        ];

        if (fetchData.status != 'all' && fetchData.category != 'all') {
            query[0].$match.$and[0].category = ObjectID(fetchData.category);
            query[0].$match.$and[0].status = fetchData.status;
        }
        if (fetchData.category != 'all') {
            query[0].$match.$and[0].category = ObjectID(fetchData.category);
        }
        if (fetchData.status != 'all') {
            query[0].$match.$and[0].status = fetchData.status;
        }

        if (fetchData.name != 'all') {
            query[0].$match.$and.push({
                items: {
                    $elemMatch: {
                        $or: [
                            {
                                'data.en': { $regex: fetchData.name, $options: 'i' },
                            },
                            {
                                data: { $regex: fetchData.name, $options: 'i' },
                            },
                        ],
                    },
                },
            });
        }
        if (fetchData.aqama_no != 'all') {
            query[0].$match.$and.push({
                items: {
                    $elemMatch: {
                        $or: [
                            {
                                'data.en': fetchData.aqama_no,
                            },
                            {
                                data: fetchData.aqama_no,
                            },
                        ],
                    },
                },
            });
        }
        if (fetchData.passport_no != 'all') {
            query[0].$match.$and.push({
                items: {
                    $elemMatch: {
                        $or: [
                            {
                                'data.en': fetchData.passport_no,
                            },
                            {
                                data: fetchData.passport_no,
                            },
                        ],
                    },
                },
            });
        }

        //add conditional param for category_id if available
        if (params && params.category_id) {
            query.append({ $match: { category: ObjectID(params.category_id) } });
        }

        console.log('--submited_applications--query--');
        console.log(JSON.stringify(query));

        const data = await mongodbDriver.aggregate('eop_application_submissions', 'embassy', query);
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_configuraion(dbName) {
    try {
        const configData = await mongodbDriver.findAll({}, {}, 'eop_configuraion', 'embassy');
        return {
            status: 'success',
            find_data: configData,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function categories_applications_report(dbName, fetchData) {
    console.log('--categories_applications_report-- fetchData');
    console.log(fetchData);

    var to_date = new Date(fetchData.to_date);
    to_date.setDate(to_date.getDate() + 1);
    // to_date = to_date.toString().split("T")[0];

    console.log('--to_date--');
    console.log(to_date);

    let query;
    try {
        query = [
            {
                $match: {
                    $and: [
                        {
                            submit_time: {
                                $gte: new Date(fetchData.from_date),
                                $lte: new Date(to_date),
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'users-eop',
                    localField: 'submit_user',
                    foreignField: '_id',
                    as: 'submit_user',
                },
            },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: { path: '$category' } },

            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'assigned_user',
                    foreignField: '_id',
                    as: 'assigned_user',
                },
            },
            {
                $lookup: {
                    from: 'eop_approval_workflow',
                    localField: 'workflow_step',
                    foreignField: '_id',
                    as: 'workflow_step',
                },
            },

            {
                $group: { _id: '$category.category_name', applications: { $push: '$$ROOT' } },
            },
        ];
        if (fetchData.status != 'all' && fetchData.category != 'all') {
            query[0].$match.$and[0].category = ObjectID(fetchData.category);
            query[0].$match.$and[0].status = fetchData.status;
        }
        if (fetchData.category != 'all') {
            query[0].$match.$and[0].category = ObjectID(fetchData.category);
        }
        if (fetchData.status != 'all') {
            query[0].$match.$and[0].status = fetchData.status;
        }
        const data = await mongodbDriver.aggregate('eop_application_submissions', 'embassy', query);
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function css_track_and_monitor(dbName, fetchData) {
    console.log('--css_track_and_monitor--');
    console.log(fetchData);
    let query;
    try {
        query = [
            {
                $match: {
                    $and: [
                        {
                            update_time: {
                                $gte: new Date(fetchData.from_date),
                                $lte: new Date(fetchData.to_date),
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'assigned_user',
                    foreignField: '_id',
                    as: 'assigned_user',
                },
            },
            { $unwind: { path: '$assigned_user', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'eop_application_submissions',
                    localField: 'application_id',
                    foreignField: '_id',
                    as: 'application_id',
                },
            },
            { $unwind: { path: '$application_id', preserveNullAndEmptyArrays: false } },
            {
                $lookup: {
                    from: 'users-eop',
                    localField: 'application_id.submit_user',
                    foreignField: '_id',
                    as: 'submit_user',
                },
            },
            { $unwind: { path: '$submit_user', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'modified_by',
                    foreignField: '_id',
                    as: 'modified_by',
                },
            },
            { $unwind: { path: '$modified_by', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: false } },
            { $group: { _id: '$assigned_user.department', applications: { $push: '$$ROOT' } } },
            {
                $lookup: {
                    from: 'eop_departments',
                    localField: '_id',
                    foreignField: '_id',
                    as: '_id',
                },
            },
            { $unwind: { path: '$_id', preserveNullAndEmptyArrays: false } },
        ];
        if (fetchData.status != 'all' && fetchData.category != 'all') {
            query[0].$match.$and[0].category = ObjectID(fetchData.category);
            query[0].$match.$and[0].status = fetchData.status;
        }
        if (fetchData.category != 'all') {
            query[0].$match.$and[0].category = ObjectID(fetchData.category);
        }
        if (fetchData.status != 'all') {
            query[0].$match.$and[0].status = fetchData.status;
        }

        console.log('--query--');
        console.log(JSON.stringify(query));

        const data = await mongodbDriver.aggregate('eop_approval_workflow_trail', 'embassy', query);
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function applications_report(dbName, fetchData) {
    console.log('--fetchData - forms-repo--');
    console.log(fetchData);
    let query;
    try {
        query = [
            {
                $match: {
                    $and: [
                        {
                            submit_time: {
                                $gte: new Date(fetchData.from_date),
                                $lte: new Date(fetchData.to_date),
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'users-eop',
                    localField: 'submit_user',
                    foreignField: '_id',
                    as: 'submit_user',
                },
            },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'assigned_user',
                    foreignField: '_id',
                    as: 'assigned_user',
                },
            },
            {
                $lookup: {
                    from: 'eop_approval_workflow',
                    localField: 'workflow_step',
                    foreignField: '_id',
                    as: 'workflow_step',
                },
            },
        ];
        if (fetchData.status != 'all' && fetchData.category != 'all') {
            query[0].$match.$and[0].category = ObjectID(fetchData.category);
            query[0].$match.$and[0].status = fetchData.status;
        }
        if (fetchData.category != 'all') {
            query[0].$match.$and[0].category = ObjectID(fetchData.category);
        }
        if (fetchData.status != 'all') {
            query[0].$match.$and[0].status = fetchData.status;
        }

        console.log('--query--');
        console.log(JSON.stringify(query));

        const data = await mongodbDriver.aggregate('eop_application_submissions', 'embassy', query);
        console.log('data');
        console.log(data);
        let Arr = [];
        data.forEach((element) => {
            Arr.push({
                reference_number: element.reference_number,
                submitted_by: element.submit_user[0]
                    ? element.submit_user[0].first_name + ' ' + element.submit_user[0].last_name
                    : '',
                cnic: element.submit_user[0] ? element.submit_user[0].cnic : '',
                category: element.category[0] ? element.category[0].category_name : '',
                submit_time: element.submit_time,
                status: element.status,
                workflow: element.workflow_step[0] ? element.workflow_step[0].step_name : '',
                assigned_user: element.assigned_user[0]
                    ? element.assigned_user[0].first_name + ' ' + element.assigned_user[0].last_name
                    : '',
            });
        });
        console.log('data After');
        console.log(Arr);

        return {
            status: 'success',
            find_data: Arr,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function death_noc_report(dbName, fetchData) {
    console.log('--fetchData - death_noc_report--');
    console.log(fetchData);

    const config = await mongodbDriver.FindOne({}, 'eop_configuraion', 'embassy');
    // console.log('--config--');
    // console.log(config);

    let query;
    try {
        query = [
            {
                $match: {
                    $and: [
                        { category: ObjectID(config.noc_category_id) },
                        {
                            submit_time: {
                                $gte: new Date(fetchData.from_date),
                                $lte: new Date(fetchData.to_date),
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'users-eop',
                    localField: 'submit_user',
                    foreignField: '_id',
                    as: 'submit_user',
                },
            },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'assigned_user',
                    foreignField: '_id',
                    as: 'assigned_user',
                },
            },
            {
                $lookup: {
                    from: 'eop_approval_workflow',
                    localField: 'workflow_step',
                    foreignField: '_id',
                    as: 'workflow_step',
                },
            },
            { $unwind: { path: '$submit_user', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$assigned_user', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$workflow_step', preserveNullAndEmptyArrays: true } },
            { $sort: { submit_time: -1, _id: 1 } },
        ];

        if (fetchData.status && fetchData.status != '' && fetchData.status != 'all') {
            query[0].$match.$and[0].status = fetchData.status;
        }

        if (
            fetchData.reason_of_death &&
            fetchData.reason_of_death != '' &&
            fetchData.reason_of_death != 'all'
        ) {
            query[0].$match.$and.push({
                items: {
                    $elemMatch: {
                        item_id: config.noc_reason_id,
                        'data.en': fetchData.reason_of_death,
                    },
                },
            });
        }

        if (
            fetchData.place_of_death &&
            fetchData.place_of_death != '' &&
            fetchData.place_of_death != 'all'
        ) {
            query[0].$match.$and.push({
                items: {
                    $elemMatch: {
                        item_id: config.noc_place_id,
                        'data.en': fetchData.place_of_death,
                    },
                },
            });
        }

        if (
            fetchData.burial_place &&
            fetchData.burial_place != '' &&
            fetchData.burial_place != 'all'
        ) {
            query[0].$match.$and.push({
                items: {
                    $elemMatch: {
                        item_id: config.noc_burial_type_id,
                        data: fetchData.burial_place,
                    },
                },
            });
        }

        if (fetchData.name && fetchData.name != '') {
            query[0].$match.$and.push({
                items: {
                    $elemMatch: {
                        item_id: config.noc_name_id,
                        'data.en': { $regex: fetchData.name, $options: 'i' },
                    },
                },
            });
        }
        if (fetchData.aqama_no && fetchData.aqama_no != '') {
            query[0].$match.$and.push({
                items: {
                    $elemMatch: {
                        item_id: config.noc_aqama_id,
                        'data.en': fetchData.aqama_no,
                    },
                },
            });
        }
        if (fetchData.passport_no && fetchData.passport_no != '') {
            query[0].$match.$and.push({
                items: {
                    $elemMatch: {
                        item_id: config.noc_passport_id,
                        'data.en': fetchData.passport_no,
                    },
                },
            });
        }

        console.log('--query--');
        console.log(JSON.stringify(query));

        const data = await mongodbDriver.aggregate('eop_application_submissions', 'embassy', query);

        console.log('--data--');
        console.log(JSON.stringify(data));

        let results = [];
        data.forEach((element) => {
            results.push({
                _id: element._id,
                reference_number: element.reference_number,
                name: element.items.find(
                    (i) => i.item_id.toString() == config.noc_name_id.toString()
                )
                    ? element.items.find(
                        (i) => i.item_id.toString() == config.noc_name_id.toString()
                    ).data.en
                    : '',
                relative_name: element.items.find(
                    (i) => i.item_id.toString() == config.noc_relative_name_id.toString()
                )
                    ? element.items.find(
                        (i) => i.item_id.toString() == config.noc_relative_name_id.toString()
                    ).data.en
                    : '',
                date_of_death: element.items.find(
                    (i) => i.item_id.toString() == config.noc_date_of_death_id.toString()
                )
                    ? moment(
                        element.items.find(
                            (i) => i.item_id.toString() == config.noc_date_of_death_id.toString()
                        ).data.en,
                        'YYYY-MM-DD'
                    ).format('DD/MM/YYYY')
                    : '',
                passport_no: element.items.find(
                    (i) => i.item_id.toString() == config.noc_passport_id.toString()
                )
                    ? element.items.find(
                        (i) => i.item_id.toString() == config.noc_passport_id.toString()
                    ).data.en
                    : '',
                aqama_no: element.items.find(
                    (i) => i.item_id.toString() == config.noc_aqama_id.toString()
                )
                    ? element.items.find(
                        (i) => i.item_id.toString() == config.noc_aqama_id.toString()
                    ).data.en
                    : '',
                place_of_death: element.items.find(
                    (i) => i.item_id.toString() == config.noc_place_id.toString()
                )
                    ? element.items.find(
                        (i) => i.item_id.toString() == config.noc_place_id.toString()
                    ).data.en
                    : '',
                reason_of_death: element.items.find(
                    (i) => i.item_id.toString() == config.noc_reason_id.toString()
                )
                    ? element.items.find(
                        (i) => i.item_id.toString() == config.noc_reason_id.toString()
                    ).data.en
                    : '',
                burial_place: element.items.find(
                    (i) => i.item_id.toString() == config.noc_burial_type_id.toString()
                )
                    ? element.items.find(
                        (i) => i.item_id.toString() == config.noc_burial_type_id.toString()
                    ).data == 'Local'
                        ? 'KSA'
                        : 'Pakistan'
                    : '',
                category: element.category[0] ? element.category[0].category_name : '',
                submit_time: element.submit_time,
                status: element.status,
                workflow: element.workflow_step ? element.workflow_step.step_name : '',
                assigned_user: element.assigned_user
                    ? element.assigned_user.first_name + ' ' + element.assigned_user.last_name
                    : '',
            });
        });

        // console.log('--results--');
        // console.log(JSON.stringify(results));

        return {
            status: 'success',
            find_data: results,
        };
    } catch (error) {
        console.log('--error--');
        console.log(error);
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_show_role_permissions(id) {
    console.log('app_data_repo');
    console.log(ObjectID(id));
    try {
        const data = await mongodbDriver.findAll(
            { role_id: ObjectID(id) },
            {},
            'eop_role_permissions',
            'embassy'
        );
        return {
            status: 'success',
            permission_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_check_role_permission(id) {
    console.log('app_data_repo');
    console.log(ObjectID(id));
    try {
        const query = [
            { $match: { user_id: ObjectID(id) } },
            {
                $lookup: {
                    from: 'eop_role_permissions',
                    localField: 'role_id',
                    foreignField: 'role_id',
                    as: 'role_permissions',
                },
            },
            { $unwind: { path: '$role_permissions', preserveNullAndEmptyArrays: false } },
        ];
        const data = await mongodbDriver.aggregate('eop_user_roles', 'embassy', query);
        return {
            status: 'success',
            permission_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_myInbox(id) {
    try {
        let userId = ObjectID(id);
        console.log('--app_data_repo--eop_myInbox--');
        console.log(userId);

        const query = [
            {
                $lookup: {
                    from: 'eop_user_roles',
                    pipeline: [{ $match: { user_id: userId } }],
                    localField: 'assigned_role',
                    foreignField: 'role_id',
                    as: 'user_roles',
                },
            },
            { $unwind: { path: '$user_roles' } },
            {
                $lookup: {
                    from: 'users-eop',
                    localField: 'submit_user',
                    foreignField: '_id',
                    as: 'submit_user_normal',
                    pipeline: [
                        {
                            $project: {
                                first_name: '$first_name',
                                last_name: '$last_name',
                                email: '$email',
                                problem: '$problem',
                            },
                        },
                    ],
                },
            },
            { $unwind: { path: '$submit_user_normal', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'submit_user',
                    foreignField: '_id',
                    as: 'submit_user_admin',
                },
            },
            { $unwind: { path: '$submit_user_admin', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category_detail',
                    pipeline: [{ $project: { category_name: '$category_name' } }],
                },
            },
            { $unwind: { path: '$category_detail' } },

            {
                $lookup: {
                    from: 'eop_roles',
                    localField: 'assigned_role',
                    foreignField: '_id',
                    as: 'assigned_role_detail',
                },
            },
            { $unwind: { path: '$assigned_role_detail' } },

            {
                $lookup: {
                    from: 'eop_approval_workflow',
                    localField: 'workflow_step',
                    foreignField: '_id',
                    as: 'workflow_step_detail',
                },
            },
            { $unwind: { path: '$workflow_step_detail' } },

            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'assigned_user',
                    foreignField: '_id',
                    as: 'assigned_user_detail',
                },
            },
            { $unwind: { path: '$assigned_user_detail', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'eop_application_inbox_status',
                    pipeline: [{ $match: { user_id: userId } }],
                    localField: '_id',
                    foreignField: 'application_id',
                    as: 'inbox_status',
                },
            },
            { $unwind: { path: '$inbox_status', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    category: 1,
                    category_fee: 1,
                    items: 1,
                    submit_time: 1,
                    status: 1,
                    is_deleted: 1,
                    is_archived: 1,
                    assigned_role: 1,
                    workflow_step: 1,
                    reference_number: 1,
                    assigned_user: 1,
                    user_roles: 1,
                    category_detail: 1,
                    assigned_role_detail: 1,
                    workflow_step_detail: 1,
                    assigned_user_detail: 1,
                    inbox_status: 1,
                    submit_user: {
                        $ifNull: ['$submit_user_normal', '$submit_user_admin', '$submit_user_normal'],
                    },
                },
            },

            { $sort: { submit_time: -1, _id: 1 } },
        ];

        console.log('--query--');
        console.log(query);

        const data = await mongodbDriver.aggregate('eop_application_submissions', 'embassy', query);

        console.log('--query--data--');
        console.log(data);

        return {
            status: 'success',
            myInbox_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_myInbox_count(id) {
    try {
        let userId = ObjectID(id);
        console.log('--app_data_repo--eop_myInbox_count--');
        console.log(userId);
        const query = [
            {
                $lookup: {
                    from: 'eop_user_roles',
                    pipeline: [{ $match: { user_id: userId } }],
                    localField: 'assigned_role',
                    foreignField: 'role_id',
                    as: 'user_roles',
                },
            },
            { $unwind: { path: '$user_roles' } },
            {
                $lookup: {
                    from: 'users-eop',
                    localField: 'submit_user',
                    foreignField: '_id',
                    as: 'submit_user_normal',
                    pipeline: [
                        {
                            $project: {
                                first_name: '$first_name',
                                last_name: '$last_name',
                                email: '$email',
                                problem: '$problem',
                            },
                        },
                    ],
                },
            },
            { $unwind: { path: '$submit_user_normal', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'submit_user',
                    foreignField: '_id',
                    as: 'submit_user_admin',
                },
            },
            { $unwind: { path: '$submit_user_admin', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category_detail',
                    pipeline: [{ $project: { category_name: '$category_name' } }],
                },
            },
            { $unwind: { path: '$category_detail' } },

            {
                $lookup: {
                    from: 'eop_roles',
                    localField: 'assigned_role',
                    foreignField: '_id',
                    as: 'assigned_role_detail',
                },
            },
            { $unwind: { path: '$assigned_role_detail' } },

            {
                $lookup: {
                    from: 'eop_approval_workflow',
                    localField: 'workflow_step',
                    foreignField: '_id',
                    as: 'workflow_step_detail',
                },
            },
            { $unwind: { path: '$workflow_step_detail' } },

            {
                $lookup: {
                    from: 'users-admin',
                    localField: 'assigned_user',
                    foreignField: '_id',
                    as: 'assigned_user_detail',
                },
            },
            { $unwind: { path: '$assigned_user_detail', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'eop_application_inbox_status',
                    pipeline: [{ $match: { user_id: userId } }],
                    localField: '_id',
                    foreignField: 'application_id',
                    as: 'inbox_status',
                },
            },
            { $unwind: { path: '$inbox_status', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    category: 1,
                    category_fee: 1,
                    items: 1,
                    submit_time: 1,
                    status: 1,
                    is_deleted: 1,
                    is_archived: 1,
                    assigned_role: 1,
                    workflow_step: 1,
                    reference_number: 1,
                    assigned_user: 1,
                    user_roles: 1,
                    category_detail: 1,
                    assigned_role_detail: 1,
                    workflow_step_detail: 1,
                    assigned_user_detail: 1,
                    inbox_status: 1,
                    submit_user: {
                        $ifNull: ['$submit_user_normal', '$submit_user_admin', '$submit_user_normal'],
                    },
                },
            },

            { $sort: { submit_time: -1, _id: 1 } },
            { $match: { inbox_status: { $exists: false } } },

            { $count: "inbox_count" },
        ];

        console.log('--query--');
        console.log(query);

        const data = await mongodbDriver.aggregate('eop_application_submissions', 'embassy', query);

        console.log('--query--data--');
        console.log(data);

        return {
            status: 'success',
            myInbox_count: data[0].inbox_count,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_show_approval_workflow(id) {
    console.log('app_data_repo');
    console.log(ObjectID(id));
    const query = [
        {
            $match: { category: ObjectID(id) }
        },
        {
            $lookup: {
                from: 'eop_categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
            },
        },
        { $unwind: '$category' }
    ];
    try {
        const data = await mongodbDriver.aggregate('eop_approval_workflow', 'embassy', query);
        return {
            status: 'success',
            approval_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_application_comments(id) {
    console.log('app_data_repo');
    console.log(ObjectID(id));
    const query = [
        {
            $match: {
                application_id: ObjectID(id),
            },
        },
        {
            $lookup: {
                from: 'users-admin',
                localField: 'modified_by',
                foreignField: '_id',
                as: 'modified_by',
            },
        },
    ];
    try {
        const data = await mongodbDriver.aggregate('eop_approval_workflow_trail', 'embassy', query);
        return {
            status: 'success',
            comment_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function css_portal_barChart(dbName) {
    try {
        const query = [
            {
                $project: {
                    category: 1,
                    new: {
                        $cond: [{ $eq: ['$status', 'new'] }, 1, 0],
                    },
                    open: {
                        $cond: [{ $eq: ['$status', 'open'] }, 1, 0],
                    },
                    review: {
                        $cond: [{ $eq: ['$status', 'review'] }, 1, 0],
                    },
                    approved: {
                        $cond: [{ $eq: ['$status', 'approved'] }, 1, 0],
                    },
                    rejected: {
                        $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0],
                    },
                },
            },
            {
                $group: {
                    _id: '$category',
                    new: { $sum: '$new' },
                    open: { $sum: '$open' },
                    review: { $sum: '$review' },
                    approved: { $sum: '$approved' },
                    rejected: { $sum: '$rejected' },
                },
            },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: '_id.category',
                },
            },
            { $unwind: '$_id.category' },
        ];
        const data = await mongodbDriver.aggregate('eop_application_submissions', 'embassy', query);
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_voucher_list(dbName) {
    try {
        const query = [
            {
                $lookup: {
                    from: 'eop_application_submissions',
                    localField: 'application_id',
                    foreignField: '_id',
                    as: 'application_id',
                },
            },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $lookup: {
                    from: 'users-eop',
                    localField: 'application_id.submit_user',
                    foreignField: '_id',
                    as: 'submit_user',
                },
            },
            { $unwind: { path: '$category' } },
            { $unwind: { path: '$application_id' } },
            { $unwind: { path: '$submit_user' } },
        ];
        const data = await mongodbDriver.aggregate('eop_payment_voucher', 'embassy', query);
        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function eop_voucher(id) {
    try {
        let VoucherId = ObjectID(id);
        console.log('--app_data_repo--eop_voucher--');
        console.log(VoucherId);
        const query = [
            { $match: { _id: VoucherId } },
            {
                $lookup: {
                    from: 'eop_application_submissions',
                    localField: 'application_id',
                    foreignField: '_id',
                    as: 'application_id',
                },
            },
            {
                $lookup: {
                    from: 'eop_categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $lookup: {
                    from: 'users-eop',
                    localField: 'application_id.submit_user',
                    foreignField: '_id',
                    as: 'submit_user',
                },
            },
            {
                $lookup: {
                    from: 'eop_payments',
                    localField: '_id',
                    foreignField: 'voucher_id',
                    as: 'payments',
                },
            },
            { $unwind: { path: '$category' } },
            { $unwind: { path: '$application_id' } },
            { $unwind: { path: '$submit_user' } },
        ];

        console.log('--query--');
        console.log(query);

        const data = await mongodbDriver.aggregate('eop_payment_voucher', 'embassy', query);

        console.log('--query--data--');
        console.log(data);

        return {
            status: 'success',
            find_data: data,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function css_portal_pieChart(dbName) {
    try {
        const countResult = await mongodbDriver.aggregate(
            'eop_application_submissions',
            'embassy',
            [
                { $match: { is_deleted: 'N', is_archived: 'N' } },
                {
                    $facet: {
                        statusCount: [{ $unwind: '$status' }, { $sortByCount: '$status' }],
                    },
                },
            ]
        );
        return {
            status: 'success',
            countData: countResult[0].statusCount,
        };
    } catch (error) {
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}
async function CSRFToken(req) {
    return { csrfToken: 'req.csrfToken()' };
}
async function eop_delete_category(id) {
    try {
        console.log('app_data_repo');
        console.log(ObjectID(id));

        const data = await mongodbDriver.deleteOne(
            { _id: ObjectID(id) },
            'eop_categories',
            'embassy',
            ''
        );

        return {
            status: 'deleted the record successfuly',
        };
    } catch (error) {
        console.log(error);
        return {
            status: 'failed',
            message: 'Something unexpected has occured. Please try again.',
            message_ar: 'حدث شيء غير متوقع. الرجاء معاودة المحاولة في وقت لاحق.',
        };
    }
}

async function kuwaitiBanksHoldingSummary(data, lang) {
    let dataJson = JSON.parse(data);
    let response = [];

    for (var i = 0; i < dataJson.length; i++) {
        const data = dataJson[i].fieldData.EN ? dataJson[i].fieldData.EN : {};

        let index = response.findIndex((x) => x.year === data.year);
        if (index > -1) {
            if (!response[index].months.find((y) => y === data.month)) {
                response[index].months.push(data.month);
            }
        } else {
            response.push({ year: data.year, months: [data.month] });
        }
    }

    return response;
}

async function kuwaitiBanksHoldingDetail(data, lang) {
    let dataJson = JSON.parse(data);
    let response = [];

    for (var i = 0; i < dataJson.length; i++) {
        const resultItem = dataJson[i];
        const dataEn = resultItem.fieldData.EN ? resultItem.fieldData.EN : {};
        const dataAr = resultItem.fieldData.AR ? resultItem.fieldData.AR : {};
        let mergedData = {};

        if (lang === 'EN') {
            mergedData = Object.assign(dataAr, dataEn);
        } else {
            mergedData = Object.assign(dataEn, dataAr);
        }

        response.push(mergedData);
    }

    return response;
}

async function marketMakers(marketMakersData, securitiesData, lang) {
    let marketMakersJson = JSON.parse(marketMakersData);
    let securitiesJson = JSON.parse(securitiesData);
    let marketMakersResponse = [];
    let securitiesResponse = [];

    for (var i = 0; i < marketMakersJson.length; i++) {
        const resultItem = marketMakersJson[i];
        const dataEn = resultItem.fieldData.EN ? resultItem.fieldData.EN : {};
        const dataAr = resultItem.fieldData.AR ? resultItem.fieldData.AR : {};
        let mergedData = {};

        if (lang === 'EN') {
            mergedData = Object.assign(dataAr, dataEn);
        } else {
            mergedData = Object.assign(dataEn, dataAr);
        }

        marketMakersResponse.push(mergedData);
    }

    for (var i = 0; i < securitiesJson.length; i++) {
        const resultItem = securitiesJson[i];
        const dataEn = resultItem.fieldData.EN ? resultItem.fieldData.EN : {};
        const dataAr = resultItem.fieldData.AR ? resultItem.fieldData.AR : {};
        let mergedData = {};

        if (lang === 'EN') {
            mergedData = Object.assign(dataAr, dataEn);
        } else {
            mergedData = Object.assign(dataEn, dataAr);
        }
        securitiesResponse.push(mergedData);
    }

    return { market_makers: marketMakersResponse, securities: securitiesResponse };
}

// TODO: Remove this function
async function contactUs(name, email, mobileNo, message, contactUsType) {
    if (!name || !email || !mobileNo || !message) {
        logger.error(
            'App Data Repo - Web Contact Us - Parameter Validation Error (All Fields Required) - Name: ${name}, Email: ${email}, MobileNo: ${mobileNo}, Message: ${message}, ContactUsType: ${contactUsType}'
        );
        return { code: responseCodes.validationError, message: 'All fields are required' };
    } else if (!emailValidator.validate(email)) {
        logger.error(
            'App Data Repo - Web Contact Us - Parameter Validation Error (Invalid Email Address) - Name: ${name}, Email: ${email}, MobileNo: ${mobileNo}, Message: ${message}, ContactUsType: ${contactUsType}'
        );
        return { code: responseCodes.validationError, message: 'Enter a valid email address' };
    } else if (!/^[a-zA-Z0-9*[\]|\\,.?: -]*$/.test(message)) {
        logger.error(
            'App Data Repo - Web Contact Us - Parameter Validation Error (Invalid Message) - Name: ${name}, Email: ${email}, MobileNo: ${mobileNo}, Message: ${message}, ContactUsType: ${contactUsType}'
        );
        return {
            code: responseCodes.validationError,
            message: 'Message contains invalid characters',
        };
    } else {
        let emailSubject = '';
        let emailBody = '';
        let emailTo = '';
        let emailReply = '';
        let emailBCC = '';

        if (contactUsType && parseInt(contactUsType) === contactUsTypes.investorRelations) {
            emailSubject = 'Investor Relation';
            emailBody = utils.generateWebContactUsEmailBody(
                name,
                'investor relation',
                mobileNo,
                email,
                message
            );
            emailTo = emailAddresses.investorRelations;
        } else if (contactUsType && parseInt(contactUsType) === contactUsTypes.whistleblowing) {
            emailSubject = 'Whistleblowing';
            emailBody = utils.generateWebContactUsEmailBody(
                name,
                'whistleblowing',
                mobileNo,
                email,
                message
            );
            emailTo = emailAddresses.whistleblowing;
        } else if (contactUsType && parseInt(contactUsType) === contactUsTypes.informationCenter) {
            emailSubject = 'Website Feedback';
            emailBody = utils.generateWebContactUsEmailBody(
                name,
                'feedback',
                mobileNo,
                email,
                message
            );
            emailTo = emailAddresses.info;
            emailBCC = emailAddresses.applicationAlert;
            emailReply = email;
        } else if (contactUsType && parseInt(contactUsType) === contactUsTypes.mobile) {
            emailSubject = 'Mobile Feedback';
            emailBody = utils.generateMobileContactUsEmailBody(email, message);
            emailTo = emailAddresses.info;
            emailBCC = emailAddresses.applicationAlert;
        }

        const params = [
            { param: 'emailFrom', value: 'mailer@boursakuwait.com.kw' },
            { param: 'emailTo', value: emailTo },
            { param: 'emailCC', value: '' },
            { param: 'emailBCC', value: emailBCC ? emailBCC : '' },
            { param: 'emailReply', value: emailReply },
            { param: 'subject', value: emailSubject },
            { param: 'body', value: emailBody },
            { param: 'mailSource', value: '' },
            { param: 'hasBLOB', value: '' },
            { param: 'emailToSendTime', value: '' },
        ];

        const sendEmailResult = await mssqlDbDriver.executeProcedure(
            storedProcedures.addEmail,
            params
        );

        if (sendEmailResult !== -1 && sendEmailResult.recordset[0]) {
            logger.info(
                'App Data Repo - WebContact Us - Execute Procedure Success (Add Contact Us Email Success) - Procedure: addEmail, FromEmail: mailer@boursakuwait.com.kw, ToEmails: ${emailTo}, EmailReply: ${emailReply}, Subject: ${emailSubject}, EmailBody: ${emailBody}'
            );
            return { code: responseCodes.success, message: 'Contact us request sent' };
        } else {
            logger.error(
                'App Data Repo - WebContact Us - Execute Procedure Error (Add Contact Us Email Error) - Procedure: addEmail, FromEmail: mailer@boursakuwait.com.kw, ToEmails: ${emailTo}, EmailReply: ${emailReply}, Subject: ${emailSubject}, EmailBody: ${emailBody}'
            );
            return { code: responseCodes.actionFailed, message: 'Send request error' };
        }
    }
}

// TODO: Rename as contactUs
async function contactUsNew(name, email, mobileNo, message, contactUsType) {
    // TODO: Contact us type validation
    if (
        contactUsType &&
        parseInt(contactUsType) !== contactUsTypes.mobile &&
        (!name || !email || !mobileNo || !message)
    ) {
        logger.error(
            'App Data Repo - Contact Us - Parameter Validation Error (All Fields Required) - Name: ${name}, Email: ${email}, MobileNo: ${mobileNo}, Message: ${message}, ContactUsType: ${contactUsType}'
        );
        return { code: responseCodes.validationError, message: 'All fields are required' };
    } else if (
        contactUsType &&
        parseInt(contactUsType) === contactUsTypes.mobile &&
        (!email || !message)
    ) {
        logger.error(
            'App Data Repo - Contact Us - Parameter Validation Error (All Fields Required) - Email: ${email}, Message: ${message}, ContactUsType: ${contactUsType}'
        );
        return { code: responseCodes.validationError, message: 'All fields are required' };
    } else if (!emailValidator.validate(email)) {
        logger.error(
            'App Data Repo - Contact Us - Parameter Validation Error (Invalid Email Address) - Name: ${name}, Email: ${email}, MobileNo: ${mobileNo}, Message: ${message}, ContactUsType: ${contactUsType}'
        );
        return { code: responseCodes.validationError, message: 'Enter a valid email address' };
    } else {
        let emailSubject = '';
        let emailBody = '';
        let emailTo = '';
        let emailReply = '';
        let emailBCC = '';

        if (contactUsType && parseInt(contactUsType) === contactUsTypes.investorRelations) {
            emailSubject = 'Investor Relation';
            emailBody = utils.generateWebContactUsEmailBody(
                name,
                'investor relation',
                mobileNo,
                email,
                message
            );
            emailTo = 'ir@boursakuwait.com.kw';
        } else if (contactUsType && parseInt(contactUsType) === contactUsTypes.whistleblowing) {
            emailSubject = 'Whistleblowing';
            emailBody = utils.generateWebContactUsEmailBody(
                name,
                'whistleblowing',
                mobileNo,
                email,
                message
            );
            emailTo = 'whistleblowing@boursakuwait.com.kw';
        } else if (contactUsType && parseInt(contactUsType) === contactUsTypes.informationCenter) {
            emailSubject = 'Website Feedback';
            emailBody = utils.generateWebContactUsEmailBody(
                name,
                'feedback',
                mobileNo,
                email,
                message
            );
            emailTo = 'info@boursakuwait.com.kw , applicationalerts@boursakuwait.com.kw';
            emailReply = email;
        } else if (contactUsType && parseInt(contactUsType) === contactUsTypes.mobile) {
            emailSubject = 'Mobile Feedback';
            emailBody = utils.generateMobileContactUsEmailBody(email, message);
            emailTo = 'info@boursakuwait.com.kw , applicationalerts@boursakuwait.com.kw';
        }

        const params = [
            { param: 'emailFrom', value: 'mailer@boursakuwait.com.kw' },
            { param: 'emailTo', value: emailTo },
            { param: 'emailCC', value: '' },
            { param: 'emailBCC', value: '' },
            { param: 'emailReply', value: emailReply },
            { param: 'subject', value: emailSubject },
            { param: 'body', value: emailBody },
            { param: 'mailSource', value: '' },
            { param: 'hasBLOB', value: '' },
            { param: 'emailToSendTime', value: '' },
        ];

        const sendEmailResult = await mssqlDbDriver.executeProcedure(
            storedProcedures.addEmail,
            params
        );

        if (sendEmailResult !== -1 && sendEmailResult.recordset[0]) {
            logger.info(
                'App Data Repo - Contact Us - Execute Procedure Success (Add Contact Us Email Success) - Procedure: addEmail, FromEmail: mailer@boursakuwait.com.kw, ToEmails: ${emailTo}, EmailReply: ${emailReply}, Subject: ${emailSubject}, EmailBody: ${emailBody}'
            );
            return { code: responseCodes.success, message: 'Contact us request sent' };
        } else {
            logger.error(
                'App Data Repo - Contact Us - Execute Procedure Error (Add Contact Us Email Error) - Procedure: addEmail, FromEmail: mailer@boursakuwait.com.kw, ToEmails: ${emailTo}, EmailReply: ${emailReply}, Subject: ${emailSubject}, EmailBody: ${emailBody}'
            );
            return { code: responseCodes.actionFailed, message: 'Send request error' };
        }
    }
}

module.exports = {
    collectionDataByLang: collectionDataByLang,
    kuwaitiBanksHoldingSummary: kuwaitiBanksHoldingSummary,
    kuwaitiBanksHoldingDetail: kuwaitiBanksHoldingDetail,
    marketMakers: marketMakers,
    contactUs: contactUs,
    eop_user_registration: eop_user_registration,
    eop_user_logIn: eop_user_logIn,
    eop_admin_user_logIn: eop_admin_user_logIn,
    eop_add_categories: eop_add_categories,
    eop_show_categories: eop_show_categories,
    eop_show_categories_admin: eop_show_categories_admin,
    eop_show_single_category: eop_show_single_category,
    eop_update_category: eop_update_category,
    eop_delete_category: eop_delete_category,
    eop_user: eop_user,
    eop_step_num: eop_step_num,
    eop_step_item: eop_step_item,
    eop_show_steps: eop_show_steps,
    eop_show_single_step: eop_show_single_step,
    eop_update_step_num: eop_update_step_num,
    eop_update_step_item: eop_update_step_item,
    eop_role: eop_role,
    eop_user_department: eop_user_department,
    eop_user_designation: eop_user_designation,
    eop_show_role: eop_show_role,
    eop_show_user_designation: eop_show_user_designation,
    eop_show_user_department: eop_show_user_department,
    eop_add_user: eop_add_user,
    eop_role_listing: eop_role_listing,
    eop_update_user_role: eop_update_user_role,
    eop_single_user_listing: eop_single_user_listing,
    eop_single_role_listing: eop_single_role_listing,
    eop_get_form_data: eop_get_form_data,
    eop_application_submissions: eop_application_submissions,
    submited_applications: submited_applications,
    submited_application: submited_application,
    css_portal_pieChart: css_portal_pieChart,
    css_portal_barChart: css_portal_barChart,
    eop_show_single_item: eop_show_single_item,
    eop_update_item: eop_update_item,
    eop_get_pages: eop_get_pages,
    eop_add_role_permissions: eop_add_role_permissions,
    eop_show_role_permissions: eop_show_role_permissions,
    eop_show_single_department: eop_show_single_department,
    eop_show_single_designation: eop_show_single_designation,
    eop_update_department: eop_update_department,
    eop_delete_department: eop_delete_department,
    eop_approval_workflow: eop_approval_workflow,
    eop_show_approval_workflow: eop_show_approval_workflow,
    eop_show_category: eop_show_category,
    eop_update_designation: eop_update_designation,
    eop_myInbox: eop_myInbox,
    eop_application_pick: eop_application_pick,
    eop_application_reject: eop_application_reject,
    eop_application_approved: eop_application_approved,
    eop_application_askinfo: eop_application_askinfo,
    eop_application_comments: eop_application_comments,
    eop_application_review_update: eop_application_review_update,
    eop_get_permissions: eop_get_permissions,
    eop_get_resources: eop_get_resources,
    eop_single_user: eop_single_user,
    eop_check_role_permission: eop_check_role_permission,
    eop_registered_user: eop_registered_user,
    eop_delete_designation: eop_delete_designation,
    eop_delete_role: eop_delete_role,
    eop_delete_eopUser: eop_delete_eopUser,
    applications_report: applications_report,
    categories_applications_report: categories_applications_report,
    css_track_and_monitor: css_track_and_monitor,
    CSRFToken: CSRFToken,
    eop_payment_getway: eop_payment_getway,
    eop_voucher_list: eop_voucher_list,
    eop_voucher: eop_voucher,
    eop_mark_paid: eop_mark_paid,
    eop_mark_refund: eop_mark_refund,
    death_noc_report: death_noc_report,
    reason_of_death: reason_of_death,
    place_of_death: place_of_death,
    eop_edit_application: eop_edit_application,
    eop_configuraion: eop_configuraion,
    eop_forgot_password: eop_forgot_password,
    eop_myInbox_count: eop_myInbox_count,
    eop_mark_read: eop_mark_read,
    eop_mark_unread: eop_mark_unread,
};
