"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = void 0;
const RedisConnector = require("./lib/RedisConnector");
function getCache() {
    // if (Configuration.cache_type === Configuration.REDIS) {
    return RedisConnector;
    // }
}
exports.getCache = getCache;
