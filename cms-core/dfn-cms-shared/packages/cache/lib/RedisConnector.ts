import * as Redis from 'ioredis';
import { RedisOptions } from 'ioredis';
import { REDIS_HOST } from '../config/Config';

const REDIS_OPTIONS: RedisOptions = JSON.parse(REDIS_HOST);
let client;


function getCacheConnection() {
    if (client) {
        return client;
    } else {
        console.log('Redis connection created '+REDIS_HOST)
        client = new Redis(REDIS_OPTIONS);
        return client;
    }
}

export async function isExists(hash, key) {
    return await getCacheConnection().hexists(hash, key);
}

export async function isHashExists(hash) {
    return await getCacheConnection().exists(hash);
}

export async function getValueFromCacheH(hash, key) {
    return await getCacheConnection().hget(hash, key);
}

export function addToCache(hash, key) {
    let results = getCacheConnection().hset(hash, key, '');
    results.then(function (result) {
        if (result === 1) {
            return true;
        } else {
            return false;
        }
    });
}

export function addToCacheH(hash, key, value) {
    let results = getCacheConnection().hset(hash, key, value);
    results.then(function (result) {
        if (result === 1) {
            return true;
        } else {
            return false;
        }
    });
}

export async function deleteFromCash(hash) {
    return await getCacheConnection().del(hash);
}

export async function getAllKeys() {
    return await getCacheConnection().keys('*');
}
