"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_HOST = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.REDIS_HOST = process.env.REDIS_HOST;
