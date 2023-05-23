import * as passportJwt from 'passport-jwt';
import * as fs from 'fs';
import * as path from 'path';
import * as passport from 'passport';
import { SessionStrategy } from './SessionStrategy';
import * as db from 'universal-db-driver';

const daf = db.DBPersistance();

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const pathToKey = path.join(__dirname, '../../', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
};

export class JWTStrategy {
    public static loginStrategy(app, passport, session) {
        passport.use(
            new JwtStrategy(options, async function (jwt_payload, done) {
                console.log(jwt_payload);

                let data = await daf.FindOne({ email: jwt_payload.sub }, 'users', 'cms');

                if (data) {
                    done(null, data);
                } else {
                    done('No Data');
                }
                //todo error handle
            })
        );
        SessionStrategy.loginStrategy(app, passport, session);
        app.use(passport.initialize());
    }

    public static authMiddleware = function (req, res, next) {
        passport.authenticate('jwt', { session: false }, function (err, user, info) {
            // If authentication failed, `user` will be set to false. If an exception occurred, `err` will be set.
            if (err || !user) {
                // PASS THE ERROR OBJECT TO THE NEXT ROUTE i.e THE APP'S COMMON ERROR HANDLING MIDDLEWARE
                return next(info);
            } else {
                return next();
            }
        })(req, res, next);
    };
}
