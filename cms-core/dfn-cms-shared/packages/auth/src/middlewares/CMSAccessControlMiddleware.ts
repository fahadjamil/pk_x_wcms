import * as cache from 'cache';
import { Http2ServerRequest } from 'http2';
import * as url from 'url';
const err = { err: 'not permitted to see the content' };

export let cmsAccessControl = async function (req, res, next) {
    
    let urlPath: string = url.parse(req.url).pathname;
    console.log('============'+urlPath);
    if (urlPath === '/api/users/login') {
        console.log('its login request');
        next();
    }
    let sessionId = req.query.sessionId;
    let requestWebsite = req.query.dbName; //we have to send from client side
    let session: string = await cache.getCache().getValueFromCacheH('cms-user-sessions', sessionId);
    if (session) {
        let sessionJson = JSON.parse(session);
        console.log(
            'url Path : ' +
                urlPath +
                ', session  : ' +
                session +
                ', session json : ' +
                JSON.stringify(sessionJson)
        );
        let query = JSON.stringify(req.query);
        let userWebsites = sessionJson.websites;
        let userRoles = sessionJson.roles;
        const queryString = url.parse(req.url).query;

        console.log('userWebsite : ' + userWebsites + ', request website : '+requestWebsite+', userRole : ' + userRoles+', query string : '+queryString);
        if(urlPath === '/api/cms/permission' || urlPath === '/api/websites' ||urlPath === '/api/users/logout'){
            next();
        }
        
        
        // if (userWebsites.includes(requestWebsite)) {
            if(true){

            let jsonQueryString;
            if (queryString) {
                jsonQueryString = JSON.parse(
                    '{"' + queryString.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
                    function (key, value) {
                        return key === '' ? value : decodeURIComponent(value);
                    }
                );
            }
            let dbName;
            let body;
            let header;
            header = JSON.stringify(req.headers);

            console.log('header : =================' + header);
            console.log('header : =================' + query);

            if (
                jsonQueryString &&
                jsonQueryString.hasOwnProperty('dbName') &&
                req.method == 'GET'
            ) {
                dbName = jsonQueryString.dbName;
            } else {
                body = JSON.stringify(req.body, null, 2);
                dbName = JSON.parse(body)['dbName'];
            }

            let roleId: string;
            if (urlPath.includes('/api/')) {
                let urlPartsCount: string[] = urlPath.match(/[/]/g);
                if (urlPartsCount.length <= 1) {
                    console.log(
                        'No need authorization Request url : ' +
                            urlPath +
                            ', db name : ' +
                            dbName +
                            ', Query string : ' +
                            JSON.stringify(req.body, null, 2)
                    );
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

                    // if (requestPath === '/api/updateDocumentWorkflow') {
                    //     const collectionName = req.body.collectionName;
                    //     const workflow = req.body.workflow;
                    //     requestPath = collectionName + '/' + workflow;
                    // }

                    // if (requestPath === '/api/updatePageWorkflow') {
                    //     const workflow = req.body.pageWorkflow;
                    //     requestPath = 'page/' + '/' + workflow;
                    // }

                    // if(requestPath === '/api/custom-collections/new/create'){
                    //     const customCollection = req.body.collection;
                    //     requestPath = '/api/custom-collections/new/create/' + customCollection;
                    // }

                    //todo when add new workflow services need to handle here


























                    
                    if (await cache.getCache().isExists('cms-permissions', requestPath)) {
                        // if (!req.user) {
                        //     roleId = '5f59dbda167038b571bc967a';
                        // } else {
                        //     roleId = req.user._id.toString();
                        // }
                        let results: string = await cache
                            .getCache()
                            .getValueFromCacheH('cms-permissions', requestPath);
                        let roles: string[] = results.split(',');
                        const found = roles.some((r) => userRoles.indexOf(r) >= 0);
                        if (found) {
                            console.log(
                                'Authorization success dbName :' +
                                    dbName +
                                    ', request path : ' +
                                    requestPath +
                                    ', request user : ' +
                                    req.user +
                                    ', roleId : ' +
                                    roleId +
                                    ', available role :' +
                                    roles +
                                    ', Query string : ' +
                                    JSON.stringify(req.body, null, 2)
                            );
                            next();
                        } else {
                            console.log(
                                'Authorization failed User dont have permission to access this url : ' +
                                    requestPath +
                                    ', roleId : ' +
                                    roleId +
                                    ', available role :' +
                                    roles +
                                    ', database name :' +
                                    dbName +
                                    ', Query string : ' +
                                    JSON.stringify(req.body, null, 2)
                            );
                            res.send(err);
                        }
                    } else {
                        console.log(
                            'No need authorization to access this url ' +
                                requestPath +
                                ', database name :' +
                                dbName +
                                ', Query string : ' +
                                JSON.stringify(req.body, null, 2) +
                                ', type : ' +
                                req.method
                        );
                        next();
                    }
                }
            } else {
                console.log(
                    'Url path not start with api ' +
                        urlPath +
                        ', Query string : ' +
                        JSON.stringify(req.body, null, 2)
                );
                next();
            }
        } else {
            //user dont have access this website
        }
    } else {
        console.log('invalid session ' + sessionId + ', url path : ' + urlPath);
    }

    //next();
};
