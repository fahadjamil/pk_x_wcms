const logger = require('../../logger/logger').logger;
const dbDriver = require('universal-db-driver').DBPersistanceByType('mssql', logger);
const { responseCodes, loginActivationStatus } = require('../../constants/constants');
const { dbQueries, storedProcedures } = require('../../constants/db-queries');
const utils = require('../../utility/utils');
const cache = require('cache');
const subscriptionMapping = require('../../config/subscription-mapping.json');
const { HOST_NAME } = require('../../config/config');

async function startServer() {
    updateSubscriptionMappingCache();
}

async function updateSubscriptionMappingCache() {
    for (var key in subscriptionMapping) {
        if (subscriptionMapping.hasOwnProperty(key)) {
            cache.getCache().addToCacheH('subscription-mapping', key, subscriptionMapping[key]);
        }
    }
}

async function register(name, email, password, password2, lang, prodId) {
    if (!name || !email || !password || !password2) {
        logger.error(
            `Auth Repo - Register - Parameter Validation Error (All Fields Required) - Name: ${name}, Email: ${email}, Password: ${password}, Password2: ${password2}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Please enter all fields',
            message_ar: 'جميع البيانات مطلوبة',
        };
    } else if (password != password2) {
        logger.error(
            `Auth Repo - Register - Parameter Validation Error (Passwords Do Not Match) - Name: ${name}, Email: ${email}, Password: ${password}, Password2: ${password2}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Passwords do not match',
            message_ar: 'كلمات السر غير متطابقة',
        };
    } else if (password.length < 6) {
        logger.error(
            `Auth Repo - Register - Parameter Validation Error (Passwords Length Less Than 6) - Name: ${name}, Email: ${email}, Password: ${password}, Password2: ${password2}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Password must be at least 6 characters',
            message_ar: 'يجب أن تكون كلمة السر مكونة من 6 أحرف على الأقل.',
        };
    } else if (!validateEmail(email)) {
        logger.error(
            `Auth Repo - Register - Parameter Validation Error (Invalid Email Address) - Name: ${name}, Email: ${email}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Enter a valid email address',
            message_ar: 'البريد الالكتروني خاطئ',
        };
    } else {
        try {
            const selectUserParams = [{ param: 'email', value: email }];
            const users = await dbDriver.executeQuery(
                dbQueries.selectUserByEmail,
                selectUserParams
            );

            if (users === -1) {
                logger.error(
                    `Auth Repo - Register - Execute Query DB Error - Query: selectUserByEmail, Email: ${email}, ProdId: ${prodId}`
                );
                return { code: responseCodes.exception, message: 'Database connection error' };
            } else if (!users.recordset[0]) {
                const selectLoginParams = [{ param: 'email', value: email }];
                const logins = await dbDriver.executeQuery(
                    dbQueries.selectLoginsByLoginName,
                    selectLoginParams
                );

                if (logins === -1) {
                    logger.error(
                        `Auth Repo - Register - Execute Query DB Error - Query: selectLoginsByLoginName, Email: ${email}, ProdId: ${prodId}`
                    );
                    return { code: responseCodes.exception, message: 'Database connection error' };
                } else if (!logins.recordset[0]) {
                    const createUserParams = [
                        { param: 'name', value: name },
                        { param: 'email', value: email },
                    ];
                    const createUserResult = await dbDriver.executeQuery(
                        dbQueries.createUser,
                        createUserParams
                    );

                    if (createUserResult && createUserResult !== -1) {
                        logger.info(
                            `Auth Repo - Register - Execute Query Success (User Creation) - Query: createUser, Name: ${name}, Email: ${email}, ProdId: ${prodId}`
                        );

                        const selectUserParams = [{ param: 'email', value: email }];
                        const userResult = await dbDriver.executeQuery(
                            dbQueries.selectUserByEmail,
                            selectUserParams
                        );
                        const userId = userResult.recordset[0].S01_ID;

                        const windowTypeResult = await dbDriver.executeQuery(
                            dbQueries.selectWindowTypes,
                            []
                        );

                        const windowTypes = windowTypeResult.recordset[0].M29_WINDOW_TYPES;
                        const exchangePara = windowTypeResult.recordset[0].M29_EXCHANGE_PARA;

                        const activationCode = Math.floor(
                            100000000000000000 + Math.random() * 900000000000000000
                        ).toString();

                        const createLoginParams = [
                            { param: 'userId', value: userId },
                            { param: 'email', value: email },
                            { param: 'password', value: password },
                            { param: 'windowTypes', value: windowTypes },
                            { param: 'exchangePara', value: exchangePara },
                            { param: 'activationCode', value: activationCode },
                            { param: 'activationStatus', value: loginActivationStatus.pending },
                            { param: 'prodId', value: prodId },
                        ];
                        const createLoginResult = await dbDriver.executeQuery(
                            dbQueries.createLogin,
                            createLoginParams
                        );

                        if (createLoginResult && createLoginResult !== -1) {
                            logger.info(
                                `Auth Repo - Register - Execute Query Success (Login Creation) - Query: createLogin, UserId: ${userId}, Email: ${email}, ActivationCode: ${activationCode}, ProdId: ${prodId}`
                            );

                            let language = 'en';
                            if (lang) {
                                language = lang.toLowerCase();
                            }

                            const activationUrl =
                                HOST_NAME + '/' + language + '/activate-account#' + activationCode;
                            const emailBody = utils.generateAccountActivationEmailBody(
                                name,
                                activationUrl
                            );

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
                                    `Auth Repo - Register - Execute Procedure Success (Add Activation Email) - Procedure: addEmail, FromEmail: mailer@boursakuwait.com.kw, ToEmail: ${email}, Subject: Welcome to Boursa Kuwait, EmailBody: ${emailBody}, ProdId: ${prodId}`
                                );
                            } else {
                                logger.error(
                                    `Auth Repo - Register - Execute Procedure Error (Add Activation Email) - Procedure: addEmail, FromEmail: mailer@boursakuwait.com.kw, ToEmail: ${email}, Subject: Welcome to Boursa Kuwait, EmailBody: ${emailBody}, ProdId: ${prodId}`
                                );
                            }
                            return {
                                code: responseCodes.success,
                                message: 'User successfully registered',
                            };
                        } else {
                            logger.error(
                                `Auth Repo - Register - Execute Query Error (Login Creation) - Query: createLogin, UserId: ${userId}, Email: ${email}, ActivationCode: ${activationCode}, ProdId: ${prodId}`
                            );
                            // Rallback user creation
                            const deleteUserParams = [{ param: 'userId', value: userId }];
                            const deleteUserResult = await dbDriver.executeQuery(
                                dbQueries.deleteUserByUserId,
                                deleteUserParams
                            );

                            if (deleteUserResult && deleteUserResult !== -1) {
                                logger.info(
                                    `Auth Repo - Register - Execute Query Success (Rallback User Creation) - Query: deleteUserByUserId, UserId: ${userId}, ProdId: ${prodId}`
                                );
                            } else {
                                logger.error(
                                    `Auth Repo - Register - Execute Query Success (Rallback User Creation) - Query: deleteUserByUserId, UserId: ${userId}, ProdId: ${prodId}`
                                );
                            }

                            return {
                                code: responseCodes.actionFailed,
                                message: 'Crete login error',
                            };
                        }
                    } else {
                        logger.error(
                            `Auth Repo - Register - Execute Query Error (User Creation) - Query: createUser, Name: ${name}, Email: ${email}, ProdId: ${prodId}`
                        );
                        return { code: responseCodes.actionFailed, message: 'Crete user error' };
                    }
                } else {
                    logger.error(
                        `Auth Repo - Register - Validation Error (Login Name[Email] Already Exists) - Email: ${email}, ProdId: ${prodId}`
                    );
                    return {
                        code: responseCodes.validationError,
                        message: 'Login name(email) already exist',
                        message_ar: 'اسم المستخدم (البريد الالكتروني) موجود بالفعل',
                    };
                }
            } else {
                logger.error(
                    `Auth Repo - Register - Validation Error (Email Address Already Exists) - Email: ${email}, ProdId: ${prodId}`
                );
                return {
                    code: responseCodes.validationError,
                    message: 'Email address already exists',
                    message_ar: 'عنوان هذا البريد الالكتروني موجود بالفعل',
                };
            }
        } catch (error) {
            logger.error(`Auth Repo - Register Error - ${error} , ProdId: ${prodId}`);
            return { code: responseCodes.exception, message: 'Transaction Error' };
        }
    }
}

async function activateAccount(activationCode, prodId) {
    if (!activationCode) {
        logger.error(
            `Auth Repo - Activate Account - Parameter Validation Error (Activation Code Empty) - ActivationCode: ${activationCode}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Activation code cannot be empty',
            message_ar: 'Activation code cannot be empty',
        };
    } else {
        try {
            const selectLoginParams = [{ param: 'activationCode', value: activationCode }];
            const logins = await dbDriver.executeQuery(
                dbQueries.selectLoginsByActivationCode,
                selectLoginParams
            );

            if (logins === -1) {
                logger.error(
                    `Auth Repo - Activate Account - Execute Query DB Error - Query: selectLoginsByActivationCode, ActivationCode: ${activationCode}, ProdId: ${prodId}`
                );
                return { code: responseCodes.exception, message: 'Database connection error' };
            } else if (logins && logins.recordset[0]) {
                const loginId = logins.recordset[0].S02_LOGIN_ID;
                const status = logins.recordset[0].S02_TYPE_BIT;

                if (status && status === loginActivationStatus.pending) {
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
                            `Auth Repo - Activate Account - Execute Query Success (Account Activated) - Query: activateLogin, LoginId: ${loginId}, OldStatus: ${status}, ActivationCode: ${activationCode}, ProdId: ${prodId}`
                        );

                        return {
                            code: responseCodes.success,
                            message: 'Congratulations! Your account has been activated',
                            message_ar: 'تهانينا! تم تنشيط حسابك',
                        };
                    } else {
                        logger.error(
                            `Auth Repo - Activate Account - Execute Query Error (Account Activation Fail) - Query: activateLogin, LoginId: ${loginId}, OldStatus: ${status}, ActivationCode: ${activationCode}, ProdId: ${prodId}`
                        );

                        return {
                            code: responseCodes.actionFailed,
                            message: 'Account activation error',
                            message_ar: 'Account activation error',
                        };
                    }
                } else if (
                    status &&
                    (status === loginActivationStatus.active ||
                        status === loginActivationStatus.suspended ||
                        status === loginActivationStatus.expired)
                ) {
                    logger.info(
                        `Auth Repo - Activate Account - Validation Error (Account Already Activated) - LoginId: ${loginId}, OldStatus: ${status}, ActivationCode: ${activationCode}, ProdId: ${prodId}`
                    );

                    // return {
                    //     code: responseCodes.validationError,
                    //     message: 'Account already activated',
                    //     message_ar: 'Account already activated',
                    // };

                    // Temporary fix for website refresh issue
                    return {
                        code: responseCodes.success,
                        message: 'Congratulations! Your account has been activated',
                        message_ar: 'تهانينا! تم تنشيط حسابك',
                    };
                } else {
                    logger.error(
                        `Auth Repo - Activate Account - Error - LoginId: ${loginId}, OldStatus: ${status}, ActivationCode: ${activationCode}, ProdId: ${prodId}`
                    );

                    return {
                        code: responseCodes.actionFailed,
                        message: 'Account activation error',
                        message_ar: 'Account activation error',
                    };
                }
            } else {
                logger.error(
                    `Auth Repo - Activate Account - Execute Query Validation Error (Invalid Activation Code) - Query: selectLoginsByActivationCode, ActivationCode: ${activationCode}, ProdId: ${prodId}`
                );

                return {
                    code: responseCodes.actionFailed,
                    message: 'Account activation error',
                    message_ar: 'Account activation error',
                };
            }
        } catch (error) {
            logger.error(`Auth Repo - Activate Account Error - ${error}, ProdId: ${prodId}`);
            return { code: responseCodes.exception, message: 'Transaction Error' };
        }
    }
}

async function login(email, password, prodId) {
    if (!email || !password) {
        // TODO: Check prodId as required
        logger.error(
            `Auth Repo - Login - Parameter Validation Error (Email & Password Cannot Be Empty) - Email: ${email}, Password: ${password}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Email & password cannot be empty',
            message_ar: 'لا يمكن ان يكون البريد الالكتروني وكلمة السر فارغان',
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
                    `Auth Repo - Login - Execute Query DB Error - Query: selectLoginsByLoginName, Email: ${email}, ProdId: ${prodId}`
                );
                return { code: responseCodes.exception, message: 'Database connection error' };
            } else if (logins && logins.recordset[0]) {
                const pword = logins.recordset[0].S02_PASSWORD;
                const userId = logins.recordset[0].S02_USER_ID;
                const loginId = logins.recordset[0].S02_LOGIN_ID;
                const failedAttempts = logins.recordset[0].S02_FAILED_ATTEMPTS;
                const resetPword = logins.recordset[0].S02_RESET;
                const typeBit = logins.recordset[0].S02_TYPE_BIT;

                if (typeBit && typeBit === loginActivationStatus.active) {
                    const selectUserParams = [{ param: 'userId', value: userId }];
                    const userResult = await dbDriver.executeQuery(
                        dbQueries.selectUserById,
                        selectUserParams
                    );

                    if (userResult === -1) {
                        logger.error(
                            `Auth Repo - Login - Execute Query DB Error - Query: selectUserById, UserId: ${userId}, Email: ${email}, ProdId: ${prodId}`
                        );
                        return {
                            code: responseCodes.exception,
                            message: 'Database connection error',
                        };
                    } else if (userResult.recordset && userResult.recordset[0]) {
                        const userName = userResult.recordset[0].S01_FIRSTNAME;
                        // TODO: Check for lock status
                        if (pword === password) {
                            if (failedAttempts > 0) {
                                const clearFailedAttemptParams = [{ param: 'email', value: email }];
                                await dbDriver.executeQuery(
                                    dbQueries.clearFailedAttempts,
                                    clearFailedAttemptParams
                                );
                            }

                            let reset = 0;
                            if (resetPword && resetPword === 1) {
                                reset = 1;
                            }

                            const subsArray = [1];
                            /*
                        const subsArray = [];
                        let subsString = '';
                        const subscriptionParams = [{ param: 'loginId', value: loginId }];
                        const subscriptionResult = await dbDriver.executeQuery(
                            dbQueries.selectUserActiveSubscriptions,
                            subscriptionParams
                        );

                        if (subscriptionResult && subscriptionResult !== -1) {
                            if (!(await cache.getCache().isHashExists('subscription-mapping'))) {
                                await updateSubscriptionMappingCache();
                            }

                            for (
                                let index = 0;
                                index < subscriptionResult.recordset.length;
                                index++
                            ) {
                                subsArray.push(
                                    parseInt(subscriptionResult.recordset[index].PRODUCT_ID)
                                );

                                let role = await cache
                                    .getCache()
                                    .getValueFromCacheH(
                                        'subscription-mapping',
                                        subscriptionResult.recordset[index].PRODUCT_ID
                                    );

                                if (role && role !== '') {
                                    if (subsString !== '') {
                                        subsString = subsString + ',' + role;
                                    } else {
                                        subsString = role;
                                    }
                                }
                            }
                        }
                        */

                            const sessionId = utils.createUUID();

                            const createSessionParams = [
                                { param: 'userId', value: userId },
                                { param: 'loginId', value: loginId },
                                { param: 'sessionId', value: sessionId },
                                { param: 'loginName', value: email },
                                { param: 'prodId', value: prodId },
                            ];
                            const createSessionResult = await dbDriver.executeQuery(
                                dbQueries.createUserSession,
                                createSessionParams
                            );

                            if (createSessionResult && createSessionResult !== -1) {
                                logger.info(
                                    `Auth Repo - Login - Execute Query Success (Login Success) - Query: createUserSession, UserId: ${userId}, LoginId: ${loginId}, SessionId: ${sessionId}, LoginName(Email): ${email}, Reset: ${reset}, Subscriptions: ${subsArray}, ProdId: ${prodId}`
                                );

                                const selectSessionParams = [
                                    { param: 'loginName', value: email },
                                    { param: 'prodId', value: prodId },
                                    { param: 'sessionId', value: sessionId },
                                ];

                                const sessions = await dbDriver.executeQuery(
                                    dbQueries.selectUserActiveOldSessions,
                                    selectSessionParams
                                );

                                if (sessions === -1) {
                                    logger.error(
                                        `Auth Repo - Login - Execute Query DB Error - Query: selectUserActiveOldSessions, LoginName(Email): ${email}, ProdId: ${prodId}, SessionId(New): ${sessionId}`
                                    );
                                } else if (sessions.recordset && sessions.recordset.length > 0) {
                                    const invalidateSessionResult = await dbDriver.executeQuery(
                                        dbQueries.invalidateUserOldSessions,
                                        selectSessionParams
                                    );

                                    if (invalidateSessionResult && invalidateSessionResult !== -1) {
                                        logger.info(
                                            `Auth Repo - Login - Execute Query Success (Invalidate Old Sessions) - Query: invalidateUserOldSessions, LoginName(Email): ${email}, ProdId: ${prodId}, SessionId(New): ${sessionId}`
                                        );

                                        addKillableSessions(
                                            sessions.recordset,
                                            email,
                                            prodId,
                                            sessionId,
                                            'Login'
                                        );
                                    } else {
                                        logger.error(
                                            `Auth Repo - Login - Execute Query Error (Invalidate Old Sessions) - Query: invalidateUserOldSessions, LoginName(Email): ${email}, ProdId: ${prodId}, SessionId(New): ${sessionId}`
                                        );
                                    }
                                } else {
                                    logger.info(
                                        `Auth Repo - Login - Execute Query Success (Active Old Sessions Not Available) - Query: selectUserActiveOldSessions - LoginName(Email): ${email}, ProdId: ${prodId}, SessionId(New): ${sessionId}`
                                    );
                                }

                                // cache.getCache().addToCacheH('site-user-sessions', sessionId, subsString);

                                return {
                                    code: responseCodes.success,
                                    login: loginId,
                                    name: userName,
                                    session: sessionId,
                                    reset: reset,
                                    subscriptions: subsArray,
                                    message: 'Authentication success',
                                };
                            } else {
                                logger.error(
                                    `Auth Repo - Login - Execute Query Error (Login Failed) - Query: createUserSession, UserId: ${userId}, LoginId: ${loginId}, SessionId: ${sessionId}, LoginName: ${loginName}, Reset: ${reset}, Subscriptions: ${subsArray}, Email: ${email}, ProdId: ${prodId}`
                                );

                                return { code: responseCodes.actionFailed, message: 'Login error' };
                            }
                        } else {
                            logger.error(
                                `Auth Repo - Login - Validation Error (Invalid Password) - Email: ${email}, Password(Wrong): ${password}, ProdId: ${prodId}`
                            );

                            // TODO: Lock account when failed attempts exceed
                            // Account locked due to exceeding invalid password attempts
                            const updateFailedAttemptParams = [{ param: 'email', value: email }];
                            await dbDriver.executeQuery(
                                dbQueries.updateFailedAttempts,
                                updateFailedAttemptParams
                            );

                            return {
                                code: responseCodes.validationError,
                                message: 'Invalid email address or password',
                                message_ar: 'بريد إلكتروني غير صحيح أو كلمة سر غير صحيحة',
                            };
                        }
                    } else {
                        logger.error(
                            `Auth Repo - Login - Execute Query Error - Query: selectUserById, UserId: ${userId}, Email: ${email}, ProdId: ${prodId}`
                        );
                        return { code: responseCodes.actionFailed, message: 'Login error' };
                    }
                } else if (typeBit && typeBit === loginActivationStatus.pending) {
                    logger.info(
                        `Auth Repo - Login - Validation Error (Account Status Pending) - Email: ${email}, UserId: ${userId}, LoginId: ${loginId}, ProdId: ${prodId}`
                    );

                    return {
                        code: responseCodes.validationError,
                        message: 'Please activate your account to use Boursa Kuwait services',
                        message_ar: 'يرجى تفعيل حسابك لاستخدام خدمات بورصة الكويت',
                    };
                } else if (typeBit && typeBit === loginActivationStatus.suspended) {
                    logger.info(
                        `Auth Repo - Login - Validation Error (Account Status Suspended) - Email: ${email}, UserId: ${userId}, LoginId: ${loginId}, ProdId: ${prodId}`
                    );

                    return {
                        code: responseCodes.validationError,
                        message: 'Your account has been suspended',
                        message_ar: 'Your account has been suspended',
                    };
                } else if (typeBit && typeBit === loginActivationStatus.expired) {
                    logger.info(
                        `Auth Repo - Login - Validation Error (Account Status Expired) - Email: ${email}, UserId: ${userId}, LoginId: ${loginId}, ProdId: ${prodId}`
                    );

                    return {
                        code: responseCodes.validationError,
                        message: 'Your account has expired',
                        message_ar: 'Your account has expired',
                    };
                } else {
                    logger.error(
                        `Auth Repo - Login - Error (Invalid Activation Status) - Status(Invalid): ${typeBit}, Email: ${email}, UserId: ${userId}, LoginId: ${loginId}, ProdId: ${prodId}`
                    );
                    return { code: responseCodes.actionFailed, message: 'Login error' };
                }
            } else {
                logger.error(
                    `Auth Repo - Login - Validation Error (Invalid Username [Email]) - Email: ${email}, ProdId: ${prodId}`
                );

                return {
                    code: responseCodes.validationError,
                    message: 'Invalid email address or password',
                    message_ar: 'بريد إلكتروني غير صحيح أو كلمة سر غير صحيحة',
                };
            }
        } catch (error) {
            logger.error(`Auth Repo - Login Error - ${error}, ProdId: ${prodId}`);
            return { code: responseCodes.exception, message: 'Transaction Error' };
        }
    }
}

async function logout(email, prodId, sessionId) {
    if (!email || !prodId) {
        logger.error(
            `Auth Repo - Logout - Parameter Validation Error (Email and Product Id Required) - Email: ${email}, ProdId: ${prodId}, SessionId: ${sessionId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Email and Product Id Required',
            message_ar: 'Email and Product Id Required',
        };
    } else {
        try {
            const selectSessionParams = [
                { param: 'loginName', value: email },
                { param: 'prodId', value: prodId },
            ];

            const sessions = await dbDriver.executeQuery(
                dbQueries.selectUserActiveSessions,
                selectSessionParams
            );

            if (sessions === -1) {
                logger.error(
                    `Auth Repo - Logout - Execute Query DB Error - Query: selectUserActiveSessions, Email: ${email}, ProdId: ${prodId}, SessionId: ${sessionId}`
                );
                return { code: responseCodes.exception, message: 'Database connection error' };
            } else if (sessions.recordset && sessions.recordset.length > 0) {
                const invalidateSessionResult = await dbDriver.executeQuery(
                    dbQueries.invalidateUserSessions,
                    selectSessionParams
                );

                if (invalidateSessionResult && invalidateSessionResult !== -1) {
                    logger.info(
                        `Auth Repo - Logout - Execute Query Success (Logout Success) - Query: invalidateUserSessions, LoginName(Email): ${email}, ProdId: ${prodId}, SessionId: ${sessionId}`
                    );

                    addKillableSessions(sessions.recordset, email, prodId, sessionId, 'Logout');

                    return {
                        code: responseCodes.success,
                        email: email,
                        session: sessionId,
                        message: 'Logout success',
                    };
                } else {
                    logger.error(
                        `Auth Repo - Logout - Execute Query Error (Logout Failed) - Query: invalidateUserSessions, LoginName(Email): ${email}, ProdId: ${prodId}, SessionId: ${sessionId}` // LoginId: ${loginId}
                    );
                    return { code: responseCodes.actionFailed, message: 'Logout error' };
                }
            } else {
                logger.error(
                    `Auth Repo - Logout - Validation Error (Active Sessions Not Available) - Email: ${email}, ProdId: ${prodId}, SessionId: ${sessionId}`
                );
                return {
                    code: responseCodes.validationError,
                    message: 'Active sessions not available',
                    message_ar: 'Active sessions not available',
                };
            }
        } catch (error) {
            logger.error(`Auth Repo - Logout Error - ${error}, Email: ${email}, ProdId: ${prodId}`);
            return { code: responseCodes.exception, message: 'Transaction Error' };
        }
    }
}

async function addKillableSessions(sessions, email, prodId, sessionId, action) {
    for (let i = 0; i < sessions.length; i++) {
        const userId = sessions[i].S15_USER_ID;
        const loginId = sessions[i].S15_LOGIN_ID;
        const oldSessionId = sessions[i].S15_SESSION_ID;
        const loginTime = sessions[i].S15_LOGIN_TIME;
        const userType = sessions[i].S15_USERTYPE;

        const killableSessionParams = [
            { param: 'userId', value: userId },
            { param: 'loginId', value: loginId },
            { param: 'sessionId', value: oldSessionId },
            { param: 'loginName', value: email },
            { param: 'loginTime', value: loginTime },
            { param: 'userType', value: userType },
        ];
        const killableSessionResult = await dbDriver.executeQuery(
            dbQueries.insertKillableSession,
            killableSessionParams
        );

        if (killableSessionResult && killableSessionResult !== -1) {
            logger.info(
                `Auth Repo - ${action} - Execute Query Success (Killable Session Added) - Query: insertKillableSession, UserId: ${userId}, LoginId: ${loginId}, SessionId(Old): ${oldSessionId}, SessionId(Current): ${sessionId}, LoginName(Email): ${email}, ProdId: ${prodId}`
            );
        } else {
            logger.error(
                `Auth Repo - ${action} - Execute Query Error (Killable Session Add Error) - Query: insertKillableSession, UserId: ${userId}, LoginId: ${loginId}, SessionId(Old): ${oldSessionId}, SessionId(Current): ${sessionId}, LoginName(Email): ${email}, ProdId: ${prodId}`
            );
        }
    }
}

async function changePassword(userName, oldPassword, newPassword, newPassword2, prodId) {
    if (!userName || !oldPassword || !newPassword || !newPassword2) {
        logger.error(
            `Auth Repo - Change Password - Parameter Validation Error (All Fields Required) - UserName(Email): ${userName}, OldPassword: ${oldPassword}, NewPassword: ${newPassword}, NewPassword2: ${newPassword2}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'All fields are required',
            message_ar: 'جميع البيانات مطلوبة',
        };
    } else if (newPassword !== newPassword2) {
        logger.error(
            `Auth Repo - Change Password - Parameter Validation Error (New Password Mismatch) - UserName(Email): ${userName}, OldPassword: ${oldPassword}, NewPassword: ${newPassword}, NewPassword2: ${newPassword2}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'New password mismatch',
            message_ar: 'كلمة السر الجديدة غير متطابقة',
        };
    } else if (oldPassword === newPassword) {
        logger.error(
            `Auth Repo - Change Password - Parameter Validation Error (Old & New Passwords Cannot Be Same) - UserName(Email): ${userName}, OldPassword: ${oldPassword}, NewPassword: ${newPassword}, NewPassword2: ${newPassword2}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Old and new passwords cannot be the same',
            message_ar: 'لا يسمح بتطابق كلمة السر القديمة والجديدة',
        };
    } else if (newPassword.length < 6) {
        logger.error(
            `Auth Repo - Change Password - Parameter Validation Error (Passwords Length Less Than 6) - UserName(Email): ${userName}, OldPassword: ${oldPassword}, NewPassword: ${newPassword}, NewPassword2: ${newPassword2}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Password must be at least 6 characters',
            message_ar: 'يجب أن تكون كلمة السر مكونة من 6 أحرف على الأقل.',
        };
    } else {
        try {
            const selectLoginParams = [{ param: 'email', value: userName }];
            const logins = await dbDriver.executeQuery(
                dbQueries.selectLoginsByLoginName,
                selectLoginParams
            );

            if (logins === -1) {
                logger.error(
                    `Auth Repo - Change Password - Execute Query DB Error - Query: selectLoginsByLoginName, Email: ${userName}, ProdId: ${prodId}`
                );
                return { code: responseCodes.exception, message: 'Database connection error' };
            } else if (logins && logins.recordset[0]) {
                const savedPassword = logins.recordset[0].S02_PASSWORD;

                if (savedPassword === oldPassword) {
                    const updateLoginPasswordParams = [
                        { param: 'newPassword', value: newPassword },
                        { param: 'userName', value: userName },
                        { param: 'oldPassword', value: oldPassword },
                    ];
                    const updatePasswordResult = await dbDriver.executeQuery(
                        dbQueries.updateLoginPasswordByOldPword,
                        updateLoginPasswordParams
                    );

                    if (updatePasswordResult && updatePasswordResult !== -1) {
                        logger.info(
                            `Auth Repo - Change Password - Execute Query Success (Password Update Success) - Query: updateLoginPasswordByOldPword, UserName(Email): ${userName}, ProdId: ${prodId}`
                        );
                        return {
                            code: responseCodes.success,
                            message: 'Password update successful',
                        };
                    } else {
                        logger.error(
                            `Auth Repo - Change Password - Execute Query Error (Password Update Error) - Query: updateLoginPasswordByOldPword, UserName(Email): ${userName}, ProdId: ${prodId}`
                        );
                        return {
                            code: responseCodes.actionFailed,
                            message: 'Password update error',
                        };
                    }
                } else {
                    logger.error(
                        `Auth Repo - Change Password - Validation Error (Invalid Old Password) - Email: ${userName}, OldPassword(Wrong): ${oldPassword}, ProdId: ${prodId}`
                    );
                    return {
                        code: responseCodes.validationError,
                        message: 'Invalid old password',
                        message_ar: 'كلمة السر القديمة خاطئة',
                    };
                }
            } else {
                logger.error(
                    `Auth Repo - Change Password - Validation Error (Invalid Username [Email]) - Email: ${userName}, ProdId: ${prodId}`
                );
                return {
                    code: responseCodes.validationError,
                    message: 'Invalid user name(email)',
                    message_ar: 'اسم المستخدم غير صالح (البريد الالكتروني)',
                };
            }
        } catch (error) {
            logger.error(`Auth Repo - Change Password Error - ${error}, ProdId: ${prodId}`);
            return { code: responseCodes.exception, message: 'Transaction Error' };
        }
    }
}

async function forgotPassword(email, prodId) {
    if (!email) {
        logger.error(
            `Auth Repo - Forgot Password - Parameter Validation Error (Email Address Required) - Email: ${email}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Email address required',
            message_ar: 'يرجى ادخال بريدك الالكتروني',
        };
    } else if (!validateEmail(email)) {
        logger.error(
            `Auth Repo - Forgot Password - Parameter Validation Error (Invalid Email Address) - Email: ${email}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Invalid email address',
            message_ar: 'البريد الالكتروني خاطئ',
        };
    } else {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000);

            const selectLoginParams = [{ param: 'email', value: email }];
            const logins = await dbDriver.executeQuery(
                dbQueries.selectLoginsByLoginName,
                selectLoginParams
            );

            if (logins === -1) {
                logger.error(
                    `Auth Repo - Forgot Password - Execute Query DB Error - Query: selectLoginsByLoginName, Email: ${email}, ProdId: ${prodId}`
                );
                return { code: responseCodes.exception, message: 'Database connection error' };
            } else if (logins && logins.recordset[0]) {
                const updateLoginOtpParams = [
                    { param: 'otp', value: otp },
                    { param: 'email', value: email },
                ];
                const updateOtpResult = await dbDriver.executeQuery(
                    dbQueries.updateLoginOTP,
                    updateLoginOtpParams
                );

                if (updateOtpResult && updateOtpResult !== -1) {
                    logger.info(
                        `Auth Repo - Forgot Password - Execute Query Success (OTP Update Success) - Query: updateLoginOTP, Email: ${email}, OTP: ${otp}, ProdId: ${prodId}`
                    );

                    // ************** Send Email Using Gmail Service **************
                    /*var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'dfn.bkwebtest@gmail.com',
                        pass: '1qaz2wsx@',
                    },
                });

                var mailOptions = {
                    from: 'dfn.bkwebtest@gmail.com',
                    to: email,
                    subject: 'DFN BK Web OTP',
                    text: 'Your OTP Code is [' + otp + ']',
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });*/
                    // ************** Send Email Using Gmail Service **************

                    const emailBody = utils.generateResetPasswordEmailBody(otp);

                    const params = [
                        { param: 'emailFrom', value: 'mailer@boursakuwait.com.kw' },
                        { param: 'emailTo', value: email },
                        { param: 'emailCC', value: '' },
                        { param: 'emailBCC', value: '' },
                        { param: 'emailReply', value: '' },
                        { param: 'subject', value: 'Reset Password' },
                        { param: 'body', value: emailBody },
                        { param: 'mailSource', value: '' },
                        { param: 'hasBLOB', value: '' },
                        { param: 'emailToSendTime', value: '' },
                    ];

                    const addEmailResult = await dbDriver.executeProcedure(
                        storedProcedures.addEmail,
                        params
                    );

                    if (addEmailResult && addEmailResult.recordset[0]) {
                        logger.info(
                            `Auth Repo - Forgot Password - Execute Procedure Success (Add OTP Email) - Procedure: addEmail, FromEmail: mailer@boursakuwait.com.kw, ToEmail: ${email}, Subject: Reset Password, EmailBody: ${emailBody}, ProdId: ${prodId}`
                        );
                        return {
                            code: responseCodes.success,
                            message: 'OTP code sent to email address [' + email + ']',
                        };
                    } else {
                        logger.error(
                            `Auth Repo - Forgot Password - Execute Procedure Error (Add OTP Email) - Procedure: addEmail, FromEmail: mailer@boursakuwait.com.kw, ToEmail: ${email}, Subject: Reset Password, EmailBody: ${emailBody}, ProdId: ${prodId}`
                        );
                        return { code: responseCodes.actionFailed, message: 'Send email error' };
                    }
                } else {
                    logger.error(
                        `Auth Repo - Forgot Password - Execute Query Error (OTP Update Error) - Query: updateLoginOTP, Email: ${email}, OTP: ${otp}, ProdId: ${prodId}`
                    );
                    return { code: responseCodes.actionFailed, message: 'Generate OTP error' };
                }
            } else {
                logger.error(
                    `Auth Repo - Forgot Password - Validation Error (Login Not Found For Email Address) - Email: ${email}, ProdId: ${prodId}`
                );
                return {
                    code: responseCodes.validationError,
                    message: 'Login not found for your email address',
                    message_ar: 'لم يتم العثور على تسجيل الدخول لعنوان بريدك الإلكتروني',
                };
            }
        } catch (error) {
            logger.error(`Auth Repo - Forgot Password Error - ${error}, ProdId: ${prodId}`);
            return { code: responseCodes.exception, message: 'Transaction Error' };
        }
    }
}

async function otpValidation(email, otp, newPassword, newPassword2, prodId) {
    if (!email || !otp || !newPassword || !newPassword2) {
        logger.error(
            `Auth Repo - OTP Validation - Parameter Validation Error (All Fields Required) - Email: ${email}, OTP: ${otp}, NewPassword: ${newPassword}, NewPassword2: ${newPassword2}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'All fields are required',
            message_ar: 'جميع البيانات مطلوبة',
        };
    } else if (newPassword !== newPassword2) {
        logger.error(
            `Auth Repo - OTP Validation - Parameter Validation Error (New Password Mismatch) - Email: ${email}, OTP: ${otp}, NewPassword: ${newPassword}, NewPassword2: ${newPassword2}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'New password mismatch',
            message_ar: 'كلمة السر الجديدة غير متطابقة',
        };
    } else if (newPassword.length < 6) {
        logger.error(
            `Auth Repo - OTP Validation - Parameter Validation Error (Passwords Length Less Than 6) - Email: ${email}, OTP: ${otp}, NewPassword: ${newPassword}, NewPassword2: ${newPassword2}, ProdId: ${prodId}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Password must be at least 6 characters',
            message_ar: 'يجب أن تكون كلمة السر مكونة من 6 أحرف على الأقل',
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
                    `Auth Repo - OTP Validation - Execute Query DB Error - Query: selectLoginsByLoginName, Email: ${email}, ProdId: ${prodId}`
                );
                return { code: responseCodes.exception, message: 'Database connection error' };
            } else if (logins.recordset[0]) {
                const savedOtp = logins.recordset[0].S02_OTP;

                if (parseInt(savedOtp) === parseInt(otp)) {
                    const updateLoginPasswordParams = [
                        { param: 'newPassword', value: newPassword },
                        { param: 'email', value: email },
                        { param: 'otp', value: otp },
                    ];
                    const updatePasswordResult = await dbDriver.executeQuery(
                        dbQueries.updateLoginPasswordByOTP, // TODO: Clear OTP code
                        updateLoginPasswordParams
                    );

                    if (updatePasswordResult && updatePasswordResult !== -1) {
                        logger.info(
                            `Auth Repo - OTP Validation - Execute Query Success (Password Update Success) - Query: updateLoginPasswordByOTP, Email: ${email}, OTP: ${otp}, ProdId: ${prodId}`
                        );
                        return {
                            code: responseCodes.success,
                            message: 'Password update successful',
                        };
                    } else {
                        logger.error(
                            `Auth Repo - OTP Validation - Execute Query Error (Password Update Error) - Query: updateLoginPasswordByOTP, Email: ${email}, OTP: ${otp}, ProdId: ${prodId}`
                        );
                        return {
                            code: responseCodes.actionFailed,
                            message: 'Password update error',
                        };
                    }
                } else {
                    logger.error(
                        `Auth Repo - OTP Validation - Validation Error (Wrong OTP code) - Email: ${email}, OTP(Wrong): ${otp}, ProdId: ${prodId}`
                    );
                    return {
                        code: responseCodes.validationError,
                        message: 'Wrong OTP code',
                        message_ar: 'رمز التحقق خطأ',
                    };
                }
            } else {
                logger.error(
                    `Auth Repo - OTP Validation - Validation Error (Login Not Found For Email Address) - Email: ${email}, ProdId: ${prodId}`
                );
                return {
                    code: responseCodes.validationError,
                    message: 'Invalid username(email)',
                    message_ar: 'اسم المستخدم غير صالح (البريد الالكتروني)',
                };
            }
        } catch (error) {
            logger.error(`Auth Repo - OTP Validation Error - ${error}, ProdId: ${prodId}`);
            return { code: responseCodes.exception, message: 'Transaction Error' };
        }
    }
}

async function contactUs(email, message) {
    if (!email || !message) {
        logger.error(
            `Auth Repo - Contact Us - Parameter Validation Error (Email Address and Message Required) - Email: ${email}, Message: ${message}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Please enter an email address and message',
            message_ar: 'الرجاء ادخال البريد الالكتروني والرسالة',
        };
    } else if (!validateEmail(email)) {
        logger.error(
            `Auth Repo - Contact Us - Parameter Validation Error (Invalid Email Address) - Email: ${email}, Message: ${message}`
        );
        return {
            code: responseCodes.validationError,
            message: 'Enter a valid email address',
            message_ar: 'البريد الالكتروني خاطئ',
        };
    } else {
        try {
            const emailBody = utils.generateMobileContactUsEmailBody(email, message);

            const params = [
                { param: 'emailFrom', value: 'mailer@boursakuwait.com.kw' },
                {
                    param: 'emailTo',
                    value: 'info@boursakuwait.com.kw , applicationalerts@boursakuwait.com.kw',
                },
                { param: 'emailCC', value: '' },
                { param: 'emailBCC', value: '' },
                { param: 'emailReply', value: '' },
                { param: 'subject', value: 'Mobile Feedback' },
                { param: 'body', value: emailBody },
                { param: 'mailSource', value: '' },
                { param: 'hasBLOB', value: '' },
                { param: 'emailToSendTime', value: '' },
            ];

            const sendEmailResult = await dbDriver.executeProcedure(
                storedProcedures.addEmail,
                params
            );

            if (sendEmailResult !== -1 && sendEmailResult.recordset[0]) {
                logger.info(
                    `Auth Repo - Contact Us - Execute Procedure Success (Add Contact Us Email Success) - Procedure: addEmail, FromEmail: mailer@boursakuwait.com.kw, ToEmails: info@boursakuwait.com.kw,applicationalerts@boursakuwait.com.kw, Subject: Mobile Feedback, EmailBody: ${emailBody}`
                );
                return { code: responseCodes.success, message: 'Contact us request sent' };
            } else {
                logger.error(
                    `Auth Repo - Contact Us - Execute Procedure Error (Add Contact Us Email Error) - Procedure: addEmail, FromEmail: mailer@boursakuwait.com.kw, ToEmails: info@boursakuwait.com.kw,applicationalerts@boursakuwait.com.kw, Subject: Mobile Feedback, EmailBody: ${emailBody}`
                );
                return { code: responseCodes.actionFailed, message: 'Send request error' };
            }
        } catch (error) {
            logger.error(`Auth Repo - Contact Us Error - ${error}`);
            return { code: responseCodes.exception, message: 'Transaction Error' };
        }
    }
}

function validateEmail(email) {
    const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const regx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return regx.test(String(email).toLowerCase());
}

module.exports = {
    startServer: startServer,
    register: register,
    activateAccount: activateAccount,
    login: login,
    logout: logout,
    changePassword: changePassword,
    forgotPassword: forgotPassword,
    otpValidation: otpValidation,
    contactUs: contactUs,
};
