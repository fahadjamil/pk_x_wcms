const Redis = require('ioredis');
const EventEmitter = require('events').EventEmitter;

import { Configuration } from '../../src/config/Configuration';

function getCacheConnection() {
    let client;
    if (client === undefined) {
        client = new Redis(Configuration.REDIS_PORT, Configuration.REDIS_HOST);
        return client;
    } else {
        return client;
    }
}

export function isExists(key, value) {
    console.log('is exist methode called');
    let results = getCacheConnection().hexists(key, value);
    let event = new EventEmitter();

    results.then(function (result) {
        console.log(result);
        if (result === 1) {
            event.emit('success', true);
        } else {
            event.emit('success', false);
        }
    });
    return event;
}

export function addToCache(key, value) {
    let event = new EventEmitter();

    let results = getCacheConnection().hset(key, value, '');
    results.then(function (result) {
        if (result === 1) {
            event.emit('success', true);
        } else {
            event.emit('success', false);
        }
    });
    return event;
}
