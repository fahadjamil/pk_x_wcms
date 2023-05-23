import * as express from 'express';
import * as passport from 'passport';
import * as session from 'express-session';
import { StrategyFactory } from './config/login-strategy/StrategyFactory';
import { accessControl } from './middlewares/AccessControlMiddleware';
import { cmsAccessControl } from './middlewares/CMSAccessControlMiddleware';
import { loadFeaturesData } from './initial-data/PermissionInitData';
import { LOGIN_STRATEGY } from './config/Config';

// loadFeaturesData();

// const app = express();

let initializeAuthService = (app, type) => {
    //app.use(express.json());
    //app.use(express.urlencoded({ extended: true }));
    console.log(LOGIN_STRATEGY);
    StrategyFactory.getInstant(LOGIN_STRATEGY).loginStrategy(app, passport, session);
    //app.use(StrategyFactory.getInstant(process.env.LOGIN_STRATEGY).authMiddleware);
    if(type === "CMS"){
        app.use(cmsAccessControl);
    }else if ("SITE"){
    app.use(accessControl);
    }
    /**
     * -------------- ROUTES ----------------
     */
    app.use('/api', require('./routes/AuthService'));

    //testing purpose
    // app.listen(3200, () => console.log(`Example app listening at http://localhost:3200`));
};

module.exports.initializeAuthService = initializeAuthService;
