import dotenv = require('dotenv');
dotenv.config();
export const LOGIN_STRATEGY = process.env.LOGIN_STRATEGY;
export const REDIS_HOST = process.env.REDIS_HOST;
