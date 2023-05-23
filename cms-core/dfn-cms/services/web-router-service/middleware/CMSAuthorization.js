const cache = require('cache');
const url = require('url');
const err = { err: 'not permitted to see the content' };
const logger = require('../logger/logger').logger;

exports.cmsAccessControl = async function (req, res, next) {
    let urlPath = url.parse(req.url).pathname;
    let method = String(req.method);
    let sessionId;
    let query;

    if (method == 'DELETE') {
        sessionId = req.body.sessionId;
        query = JSON.stringify(req.body);
    } else {
        sessionId = req.query.sessionId;
        query = JSON.stringify(req.query);
    }
    logger.info(
        'Message received to Authorization Middleware session id : ' +
            sessionId +
            ', url path : ' +
            urlPath +
            ', type : ' +
            req.method
    );
    if (urlPath.includes('/api/')) {
        let urlPartsCount = urlPath.match(/[/]/g);
        if (urlPartsCount.length <= 1) {
            logger.info(
                'No need authorization Request url : ' + urlPath + ', session id : ' + sessionId
            );
            next();
        } else {
            if (urlPath.charAt(urlPath.length - 1) == '/') {
                urlPath = urlPath.substring(0, urlPath.length - 1);
            }
            let urlParts = urlPath.split('/');
            let lastPath = urlParts.pop();
            let requestPath;
            if (lastPath.includes('.')) {
                requestPath = urlParts.join('/');
            } else {
                requestPath = urlPath;
            }

            let isAvailable = await cache.getCache().isExists('cms-permissions', requestPath);
            if (isAvailable) {
                let requestWebsite;
                if (method == 'DELETE') {
                    requestWebsite = req.body.websiteName;
                } else {
                    requestWebsite = req.query.websiteName;
                }
                if (
                    urlPath === '/api/cms/permission' ||
                    urlPath === '/api/websites' ||
                    urlPath === '/api/users/logout'
                ) {
                    next();
                }
                let session = await cache.getCache().getValueFromCacheH('cms-user-sessions', sessionId);
                let results = await cache
                    .getCache()
                    .getValueFromCacheH('cms-permissions', requestPath);
                let sessionJson;
                let userWebsites;
                let userRoles;
                if (session) {
                    sessionJson = JSON.parse(session);
                    userWebsites = sessionJson.websites;
                    userRoles = sessionJson.roles;
                }
                logger.info(
                    'Session validation : ' +
                        sessionId +
                        ', url path : ' +
                        urlPath +
                        ', session : ' +
                        session +
                        ', permissions for website : ' +
                        results +
                        ', userWebsites : ' +
                        userWebsites +
                        ', userRoles : ' +
                        userRoles +
                        ', requestWebsite : ' +
                        requestWebsite
                );

                if (userWebsites && userRoles && userWebsites.includes(requestWebsite)) {
                    let roles = results.split(',');
                    logger.info('roles : ' + roles);
                    const found = roles.some((r) => userRoles.indexOf(r) >= 0);
                    if (found) {
                        logger.info(
                            'Authorization success dbName :' +
                                requestWebsite +
                                ', request path : ' +
                                requestPath +
                                ', request user : ' +
                                req.user +
                                ', available role :' +
                                roles
                        );
                        next();
                    } else {
                        logger.info(
                            'Authorization failed User dont have permission to access this url : ' +
                                requestPath +
                                ', available role :' +
                                roles +
                                ', database name :' +
                                requestWebsite
                        );
                        res.send(err);
                    }
                } else {
                    logger.info(
                        'user dont have access this website :' +
                            requestWebsite +
                            ', user website : ' +
                            userWebsites +
                            ', session id : ' +
                            sessionId +
                            ', url path : ' +
                            urlPath +
                            ', session : ' +
                            session
                    );
                }
            } else {
                logger.info(
                    'No need authorization to access this url ' +
                        requestPath +
                        ', type : ' +
                        req.method
                );
                next();
            }
        }
    } else {
        logger.info(
            'Url path not start with api ' +
                urlPath 
                
        );
        next();
    }
};
