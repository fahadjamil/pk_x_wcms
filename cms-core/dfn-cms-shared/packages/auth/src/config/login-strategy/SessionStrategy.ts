import session = require('express-session');
import { REDIS_OPTIONS, RStore } from '../cache/RedisCache';
import { SESSION_OPTIONS } from '../SessionInit';
import { LOGIN_STRATEGY } from '../Config';

import * as db from 'universal-db-driver';

const daf = db.DBPersistance();

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const customFields = {
    usernameField: 'email',
    passwordField: 'password',
};

const verifyCallback = async (username, password, done) => {
    let data = await daf.FindOne({ email: username }, 'users', 'cms');
    if (!data) {
        return done(null, false, { message: 'That email is not registered' });
    }
    // Match password
    bcrypt.compare(password, data.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
            return done(null, data);
        } else {
            return done(null, false, { message: 'Password incorrect' });
        }
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

export class SessionStrategy {
    public static loginStrategy(app, passport, session) {
        passport.use(strategy);

        passport.serializeUser((user, done) => {
            done(null, user);
        });

        passport.deserializeUser((user, done) => {
            done(null, user);
        });

        if (LOGIN_STRATEGY === 'SESSION') {
            this.appLogin(app, passport, session);
        }
    }

    public static appLogin(app, passport, session) {
        /**
         * -------------- SESSION SETUP ----------------
         */
        const store = RStore.getStore(session);
        app.use(session({ ...SESSION_OPTIONS, store }));

        /**
         * -------------- PASSPORT AUTHENTICATION ----------------
         */
        app.use(passport.initialize());
        app.use(passport.session());
    }
}
