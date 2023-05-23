import RedisConnector = require('./lib/RedisConnector');
import { Configuration } from './../src/config/Configuration';

export function getCache() {
    console.log('initiate');
    if (Configuration.cache_type === Configuration.REDIS) {
        return RedisConnector;
    }
}
