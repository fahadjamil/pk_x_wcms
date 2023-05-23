"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllKeys = exports.deleteFromCash = exports.addToCacheH = exports.addToCache = exports.getValueFromCacheH = exports.isHashExists = exports.isExists = void 0;
const Redis = require("ioredis");
const Config_1 = require("../config/Config");
const REDIS_OPTIONS = JSON.parse(Config_1.REDIS_HOST);
let client;
function getCacheConnection() {
    if (client) {
        return client;
    }
    else {
        console.log('Redis connection created ' + Config_1.REDIS_HOST);
        client = new Redis(REDIS_OPTIONS);
        return client;
    }
}
async function isExists(hash, key) {
    return await getCacheConnection().hexists(hash, key);
}
exports.isExists = isExists;
async function isHashExists(hash) {
    return await getCacheConnection().exists(hash);
}
exports.isHashExists = isHashExists;
async function getValueFromCacheH(hash, key) {
    return await getCacheConnection().hget(hash, key);
}
exports.getValueFromCacheH = getValueFromCacheH;
function addToCache(hash, key) {
    let results = getCacheConnection().hset(hash, key, '');
    results.then(function (result) {
        if (result === 1) {
            return true;
        }
        else {
            return false;
        }
    });
}
exports.addToCache = addToCache;
function addToCacheH(hash, key, value) {
    let results = getCacheConnection().hset(hash, key, value);
    results.then(function (result) {
        if (result === 1) {
            return true;
        }
        else {
            return false;
        }
    });
}
exports.addToCacheH = addToCacheH;
async function deleteFromCash(hash) {
    return await getCacheConnection().del(hash);
}
exports.deleteFromCash = deleteFromCash;
async function getAllKeys() {
    return await getCacheConnection().keys('*');
}
exports.getAllKeys = getAllKeys;
