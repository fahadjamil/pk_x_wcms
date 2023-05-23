import * as cache from 'cache';
import * as url from 'url';
const path = require('path');


export let accessControl = async function (req, res, next) {
    let urlPath: string = url.parse(req.url).pathname;
    console.log("+==========+"+urlPath);
    let roleId: string;
    if (!urlPath.includes('/api/') && !urlPath.includes('page-data.json') && (urlPath.includes('/en/') || urlPath.includes('/ar/'))) {
        let urlPartsCount: string[] = urlPath.match(/[/]/g);
        if (urlPartsCount.length <= 1) {
            next();
        } else {
            if (urlPath.charAt(urlPath.length - 1) == '/') {
                urlPath = urlPath.substring(0, urlPath.length - 1);
            }
            let urlParts: string[] = urlPath.split('/');
            let lastPath: string = urlParts.pop();
            let requestPath: string;
            //if (/[.]/.test(lastPath)) {
            if (lastPath.includes('.')) {
                requestPath = urlParts.join('/');
            } else {
                requestPath = urlPath;
            }
            console.log("urlPath ===: "+urlPath);    
            requestPath  = requestPath.substring(3);

            if (await cache.getCache().isExists('content-serve', requestPath)) {
                if (!req.user) {
                    roleId = '1';
                } else {
                    roleId = req.user.role_id.toString();
                }
                console.log("roleId ====: "+roleId)
                let results: string = await cache
                    .getCache()
                    .getValueFromCacheH('content-serve', requestPath);
                let roles: string[] = results.split(',');
                console.log('=====roles ' + roles + ', roleId ' + roleId);
                if (roles.includes(roleId)) {
                    next();
                } else {
                    res.status(403);
                    res.sendFile(path.join(__dirname+'/error-pages/403.html'));
                }
            } else {
                console.log("No need access control for this url");
                next();
            }
        }
    } else {
        console.log("Api call" + urlPath);
        next();
    }
    //next();
};
