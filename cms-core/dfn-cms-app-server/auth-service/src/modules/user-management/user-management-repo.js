const logger = require('../../logger/logger').logger;
const dbDriver = require('universal-db-driver').DBPersistanceByType('mssql', logger);
const { responseCodes, loginActivationStatus } = require('../../constants/constants');
const { dbQueries, storedProcedures } = require('../../constants/db-queries');
const utils = require('../../utility/utils');
const { HOST_NAME } = require('../../config/config');

async function userDetailsByEmail(email) {
    if (!email) {
        logger.error(
            `User Management Repo - User Details By Email - Parameter Validation Error (Email Address Required) - Email: ${email}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Email address required',
            data: [],
        };
    } else {
        try {
            const selectUserDetailParams = [{ param: 'email', value: email }];
            const userDetailsByEmailQuery = dbQueries.userDetailsByEmail.replace('@email', email);

            const users = await dbDriver.executeQuery(
                userDetailsByEmailQuery,
                selectUserDetailParams
            );

            if (users === -1) {
                logger.error(
                    `User Management Repo - User Details By Email - Execute Query DB Error - Query: userDetailsByEmail, Email: ${email}`
                );
                return {
                    code: responseCodes.exception,
                    message: 'Database connection error',
                    data: [],
                };
            } else if (users && users.recordset[0]) {
                logger.info(
                    `User Management Repo - User Details By Email - Execute Query Success (Get User Data By Email) - Query: userDetailsByEmail, Email: ${email}`
                );
                return {
                    code: responseCodes.success,
                    message: 'Get user details success',
                    data: users.recordset,
                };
            } else {
                logger.error(
                    `User Management Repo - User Details By Email - Validation Error (User Details Not Available) - Email: ${email}`
                );
                return {
                    code: responseCodes.validationError,
                    message: 'User details not available',
                    data: [],
                };
            }
        } catch (error) {
            logger.error(`User Management Repo - User Details By Email - ${error}`);
            return { code: responseCodes.exception, message: 'Transaction error', data: [] };
        }
    }
}

async function userDetailsByName(name) {
    if (!name) {
        logger.error(
            `User Management Repo - User Details By Email - Parameter Validation Error (Email Address Required) - Email: ${name}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Login name required',
            data: [],
        };
    } else {
        try {
            const selectUserDetailParams = [{ param: 'name', value: name }];
            const userDetailsByNameQuery = dbQueries.userDetailsByName.replace('@name', name);

            const users = await dbDriver.executeQuery(
                userDetailsByNameQuery,
                selectUserDetailParams
            );

            if (users === -1) {
                logger.error(
                    `User Management Repo - User Details By Name - Execute Query DB Error - Query: userDetailsByName, Name: ${name}`
                );
                return {
                    code: responseCodes.exception,
                    message: 'Database connection error',
                    data: [],
                };
            } else if (users && users.recordset[0]) {
                logger.info(
                    `User Management Repo - User Details By Name - Execute Query Success (Get User Data By Name) - Query: userDetailsByName, Name: ${name}`
                );
                return {
                    code: responseCodes.success,
                    message: 'Get user details success',
                    data: users.recordset,
                };
            } else {
                logger.error(
                    `User Management Repo - User Details By Name - Validation Error (User Details Not Available) - Name: ${name}`
                );
                return {
                    code: responseCodes.validationError,
                    message: 'User details not available',
                    data: [],
                };
            }
        } catch (error) {
            logger.error(`User Management Repo - User Details By Name - ${error}`);
            return { code: responseCodes.exception, message: 'Transaction error', data: [] };
        }
    }
}

async function userDetailsByStatus(status) {
    if (!status) {
        logger.error(
            `User Management Repo - User Details By Login Status - Parameter Validation Error (Email Address Required) - Status: ${status}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Login status required',
            data: [],
        };
    } else {
        try {
            const selectUserDetailParams = [{ param: 'status', value: status.join(', ') }];
            const userDetailsByStatusQuery = dbQueries.userDetailsByStatus.replace('@status', status.join(', '));
            
            const users = await dbDriver.executeQuery(
                userDetailsByStatusQuery,
                selectUserDetailParams
            );

            if (users === -1) {
                logger.error(
                    `User Management Repo - User Details By Status - Execute Query DB Error - Query: userDetailsByStatus, Status: ${status}`
                );
                return {
                    code: responseCodes.exception,
                    message: 'Database connection error',
                    data: [],
                };
            } else if (users && users.recordset[0]) {
                logger.info(
                    `User Management Repo - User Details By Status - Execute Query Success (Get User Data By Status) - Query: userDetailsByStatus, Status: ${status}`
                );
                return {
                    code: responseCodes.success,
                    message: 'Get user details success',
                    data: users.recordset,
                };
            } else {
                logger.error(
                    `User Management Repo - User Details By Status - Validation Error (User Details Not Available) - Status: ${status}`
                );
                return {
                    code: responseCodes.validationError,
                    message: 'User details not available',
                    data: [],
                };
            }
        } catch (error) {
            logger.error(`User Management Repo - User Details By Status - ${error}`);
            return { code: responseCodes.exception, message: 'Transaction error', data: [] };
        }
    }
}

async function userDetailsByRegDate(fromDate, toDate) {
    
    if (!fromDate && !toDate) {
        logger.error(
            `User Management Repo - User Details By Reg Date - Parameter Validation Error (Registered Date Required) - fromDate: ${fromDate}, todate: ${toDate}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Registered date required',
            data: [],
        };
    } else {
        try {
            const selectUserDetailParams = [{ param: 'fromDate', value: fromDate },{ param: 'toDate', value: toDate }];
            const users = await dbDriver.executeQuery(
                dbQueries.userDetailsByRegDate,
                selectUserDetailParams
            );

            if (users === -1) {
                logger.error(
                    `User Management Repo - User Details By Reg Date - Execute Query DB Error - Query: userDetailsByRegDate, fromDate: ${fromDate}, todate: ${toDate}`
                );
                return {
                    code: responseCodes.exception,
                    message: 'Database connection error',
                    data: [],
                };
            } else if (users && users.recordset[0]) {
                logger.info(
                    `User Management Repo - User Details By Reg Date - Execute Query Success (Get User Data By Registered Date) - Query: userDetailsByRegDate, fromDate: ${fromDate}, todate: ${toDate}`
                );
                return {
                    code: responseCodes.success,
                    message: 'Get user details success',
                    data: users.recordset,
                };
            } else {
                logger.error(
                    `User Management Repo - User Details By Reg Date - Validation Error (User Details Not Available) - RegDate: fromDate: ${fromDate}, todate: ${toDate}`
                );
                return {
                    code: responseCodes.validationError,
                    message: 'User details not available',
                    data: [],
                };
            }
        } catch (error) {
            logger.error(`User Management Repo - User Details By Reg Date - ${error}`);
            return { code: responseCodes.exception, message: 'Transaction error', data: [] };
        }
    }
}

async function resendActivationLink(email, lang) {
    if (!email) {
        logger.error(
            `User Management Repo - Resend Activation Link - Parameter Validation Error (Email Address Required) - Email: ${email}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Email address required',
        };
    } else {
        try {
            const selectUserDetailParams = [{ param: 'email', value: email }];
            const userDetailsByEmailQuery = dbQueries.userDetailsByEmail.replace('@email', email);

            const logins = await dbDriver.executeQuery(
                userDetailsByEmailQuery,
                selectUserDetailParams
            );

            if (logins === -1) {
                logger.error(
                    `User Management Repo - Resend Activation Link - Execute Query DB Error - Query: userDetailsByEmail, Email: ${email}`
                );
                return {
                    code: responseCodes.exception,
                    message: 'Database connection error',
                };
            } else if (logins && logins.recordset[0]) {
                const activationStatus = logins.recordset[0].S02_TYPE_BIT;
                const activationCode = logins.recordset[0].S02_PUBLIC_KEY;
                const name = logins.recordset[0].S01_FIRSTNAME;

                if (activationStatus === loginActivationStatus.pending) {
                    let language = 'en';
                    if (lang) {
                        language = lang.toLowerCase();
                    }

                    const activationUrl =
                        HOST_NAME + '/' + language + '/activate-account#' + activationCode;
                    const emailBody = utils.generateAccountActivationEmailBody(name, activationUrl);

                    const params = [
                        { param: 'emailFrom', value: 'mailer@boursakuwait.com.kw' },
                        { param: 'emailTo', value: email },
                        { param: 'emailCC', value: '' },
                        { param: 'emailBCC', value: '' },
                        { param: 'emailReply', value: '' },
                        { param: 'subject', value: 'Welcome to Boursa Kuwait' },
                        { param: 'body', value: emailBody },
                        { param: 'mailSource', value: '' },
                        { param: 'hasBLOB', value: '' },
                        { param: 'emailToSendTime', value: '' },
                    ];

                    const addEmailResult = await dbDriver.executeProcedure(
                        storedProcedures.addEmail,
                        params
                    );

                    if (addEmailResult && addEmailResult !== -1) {
                        logger.info(
                            `User Management Repo - Resend Activation Link - Execute Procedure Success (Add Activation Email) - Procedure: addEmail, FromEmail: mailer@boursakuwait.com.kw, ToEmail: ${email}, Subject: Welcome to Boursa Kuwait, EmailBody: ${emailBody}`
                        );
                        return {
                            code: responseCodes.success,
                            message: 'Resend activation link success',
                        };
                    } else {
                        logger.error(
                            `User Management Repo - Resend Activation Link - Execute Procedure Error (Add Activation Email) - Procedure: addEmail, FromEmail: mailer@boursakuwait.com.kw, ToEmail: ${email}, Subject: Welcome to Boursa Kuwait, EmailBody: ${emailBody}`
                        );
                        return {
                            code: responseCodes.actionFailed,
                            message: 'Resend activation link error',
                        };
                    }
                } else {
                    logger.info(
                        `User Management Repo - Resend Activation Link - Validation Error (Account Already Activated) - Email(LoginName): ${email}, OldStatus: ${activationStatus}, ActivationCode: ${activationCode}`
                    );
                    return {
                        code: responseCodes.validationError,
                        message: 'Account already activated',
                    };
                }
            } else {
                logger.error(
                    `User Management Repo - Resend Activation Link - Execute Query Validation Error (Login Not Found For Email Address) - Query: userDetailsByEmail, Email: ${email}`
                );
                return {
                    code: responseCodes.actionFailed,
                    message: 'Login not found for your email address',
                };
            }
        } catch (error) {
            logger.error(`User Management Repo - Resend Activation Link - ${error}`);
            return { code: responseCodes.exception, message: 'Transaction error' };
        }
    }
}

async function activateUser(email) {
    if (!email) {
        logger.error(
            `User Management Repo - Activate User - Parameter Validation Error (Email Address Required) - Email: ${email}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Email address required',
        };
    } else {
        try {
            const selectLoginParams = [{ param: 'email', value: email }];
            const logins = await dbDriver.executeQuery(
                dbQueries.selectLoginsByLoginName,
                selectLoginParams
            );

            if (logins === -1) {
                logger.error(
                    `User Management Repo - Activate User - Execute Query DB Error - Query: selectLoginsByLoginName, Email: ${email}`
                );
                return {
                    code: responseCodes.exception,
                    message: 'Database connection error',
                };
            } else if (logins && logins.recordset[0]) {
                const activationStatus = logins.recordset[0].S02_TYPE_BIT;
                const loginId = logins.recordset[0].S02_LOGIN_ID;

                if (activationStatus === loginActivationStatus.pending) {
                    const activateLoginParams = [
                        { param: 'activationStatus', value: loginActivationStatus.active },
                        { param: 'loginId', value: loginId },
                    ];
                    const activateLoginResult = await dbDriver.executeQuery(
                        dbQueries.activateLogin,
                        activateLoginParams
                    );

                    if (activateLoginResult && activateLoginResult !== -1) {
                        logger.info(
                            `User Management Repo - Activate User - Execute Query Success (Account Activated) - Query: activateLogin, Email: ${email}, LoginId: ${loginId}, OldStatus: ${activationStatus}`
                        );

                        return {
                            code: responseCodes.success,
                            message: 'Account activation success',
                        };
                    } else {
                        logger.error(
                            `Auth Repo - Activate Account - Execute Query Error (Account Activation Fail) - Query: activateLogin, Email: ${email}, LoginId: ${loginId}, OldStatus: ${activationStatus}`
                        );

                        return {
                            code: responseCodes.actionFailed,
                            message: 'Account activation error',
                        };
                    }
                } else {
                    logger.info(
                        `User Management Repo - Activate User - Validation Error (Account Already Activated) - Email(LoginName): ${email}, OldStatus: ${activationStatus}`
                    );
                    return {
                        code: responseCodes.validationError,
                        message: 'Account already activated',
                    };
                }
            } else {
                logger.error(
                    `User Management Repo - Activate User - Execute Query Validation Error (Login Not Found For Email Address) - Query: selectLoginsByLoginName, Email: ${email}`
                );
                return {
                    code: responseCodes.actionFailed,
                    message: 'Login not found for your email address',
                };
            }
        } catch (error) {
            logger.error(`User Management Repo - Activate User - ${error}`);
            return { code: responseCodes.exception, message: 'Transaction error' };
        }
    }
}

module.exports = {
    userDetailsByEmail: userDetailsByEmail,
    userDetailsByName: userDetailsByName,
    userDetailsByStatus: userDetailsByStatus,
    userDetailsByRegDate: userDetailsByRegDate,
    resendActivationLink: resendActivationLink,
    activateUser: activateUser,
};
