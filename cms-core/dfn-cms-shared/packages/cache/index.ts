import RedisConnector = require('./lib/RedisConnector');

export function getCache() {
    // if (Configuration.cache_type === Configuration.REDIS) {
    return RedisConnector;
    // }
}
