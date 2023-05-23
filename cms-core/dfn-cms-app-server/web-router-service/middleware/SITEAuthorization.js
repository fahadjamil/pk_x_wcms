const cache = require('cache');
const url = require('url');
const path = require('path');
const logger = require('../logger/logger').logger;

exports.siteAccessControl = async function (req, res, next) {
    let urlPath = url.parse(req.url).pathname;
    logger.info('URL Path : ' + urlPath);
    let roleFromSession;
    if (
        !urlPath.includes('/api/') &&
        !urlPath.includes('page-data.json') &&
        (urlPath.includes('/en/') || urlPath.includes('/ar/'))
    ) {
        let urlPartsCount = urlPath.match(/[/]/g);
        if (urlPartsCount.length <= 1) {
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
            requestPath = requestPath.substring(3);

            if (await cache.getCache().isExists('site-permissions', requestPath)) {
                let sessionId = getCookies(req)['bk_session'];
                logger.info('session id : ' + sessionId);
                if (sessionId && sessionId !== {}) {
                    let roleFromCache = await cache
                        .getCache()
                        .getValueFromCacheH('site-user-sessions', sessionId);
                    logger.info('roleFromSession : ' + roleFromSession + ', Session id : ' + sessionId);
                    if(roleFromCache){
                        roleFromSession = roleFromCache.split(',');
                    }else{
                        roleFromSession = ['1'];
                    }
                } else {
                    roleFromSession = ['1'];
                }
                let results = await cache
                    .getCache()
                    .getValueFromCacheH('site-permissions', requestPath);
                let rolesFromPermission = results.split(',');
                logger.info('URL Path : ' + urlPath + ', rolesFromPermission : ' + rolesFromPermission + ', roleFromSession : ' + roleFromSession);
                const found = rolesFromPermission.some((r) => roleFromSession.includes(r));
                if (found) {
                    logger.info(
                        'URL Path have access : ' +
                            urlPath +
                            ', rolesFromPermission : ' +
                            rolesFromPermission +
                            ', roleFromSession : ' +
                            roleFromSession
                    );
                    next();
                } else {
                    logger.info('No permission to access this :' + urlPath);
                    if (sessionId) {
                        res.status(403);
                        res.sendFile(path.join(__dirname + '/error-pages/403.html'));
                    } else {
                        res.redirect('/en/login');
                    }
                }
            } else {
                logger.info('No need permissions for access this url :' + urlPath);
                next();
            }
        }
    } else {
        logger.info('Api call : ' + urlPath);
        next();
    }
};

var getCookies = function (request) {
    var cookies = {};
    request.headers &&
        request.headers.cookie &&
        request.headers.cookie.split(';').forEach(function (cookie) {
            var parts = cookie.match(/(.*?)=(.*)$/);
            cookies[parts[1].trim()] = (parts[2] || '').trim();
        });
    return cookies;
};
