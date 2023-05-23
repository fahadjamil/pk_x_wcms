import * as express from 'express';
import * as bcrypt from 'bcryptjs';
import * as passport from 'passport';
import * as emailValidator from 'email-validator';
import * as generateJWT from '../utility/GenerateJWT';
import * as db from 'universal-db-driver';
import { LOGIN_STRATEGY } from '../config/Config';

let daf = db.DBPersistance();

const router = express.Router();
/**
 * -------------- REGISTER SERVICE ----------------
 */
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ message: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ message: 'Password must be at least 6 characters' });
    }

    if (!emailValidator.validate(email)) {
        errors.push({ message: 'Enter valid email address' });
    }

    if (errors.length > 0) {
        res.send(errors);
    } else {
        let data = await daf.FindOne({ email: email }, 'users', 'cms');
        if (data) {
            errors.push({ message: 'Email already exists' });
            res.send(errors);
            return;
        }

        bcrypt.genSalt(10, async (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) throw err;
                var data = {
                    // _id: name,
                    name: name,
                    email: email,
                    password: hash,
                    authType: '1',
                    userGroup: '1',
                };
                let userData = await daf.insertOne(data, 'users', 'cms');
                res.send({ message: 'Registration success', user: userData.ops });
            });
        });
    }
});

/**
 * -------------- LOGIN SERVICE ----------------
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send(info);
        }
        req.logIn(user, async (err) => {
            console.log('abcndm,');

            if (err) {
                console.log(err);
                return next(err);
            }

            let tokenObject;
            if (LOGIN_STRATEGY === 'JWT') {
                tokenObject = generateJWT.issueJWT(user);
            }
            try {
                await daf.insertOne(req.session, 'session', 'cms');
            } catch (error) {
                console.log('session already available');
            }

            return res.send({
                message: 'Login successfully',
                user: user.name,
                date: user.date,
                tokenObject: tokenObject,
            });
        });
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.send('done');
});

router.get('/test1', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'test1 called',
    });
});

router.get('/test2', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'test2 called',
    });
});

router.get('/test3', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'test3 called',
    });
});

export = router;
