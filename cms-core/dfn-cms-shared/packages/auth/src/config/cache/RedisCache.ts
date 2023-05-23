import { RedisOptions } from 'ioredis';
import * as connectRedis from 'connect-redis';
import * as Redis from 'ioredis';
import { REDIS_HOST } from '../Config';

//const { REDIS_PORT = process.env.REDIS_PORT, REDIS_HOST = process.env.REDIS_HOST } = process.env;

export const REDIS_OPTIONS: RedisOptions = {
    port: +6379,
    host: REDIS_HOST,
};

export class RStore {
    public static getStore(session) {
        const RedisStore = connectRedis(session);
        const client = new Redis(REDIS_OPTIONS);
        // const client = new Redis({
        //   sentinels: [
        //     { host: 'localhost', port: 5000 },
        //     { host: 'localhost', port: 5001 },
        //     { host: 'localhost', port: 5002 },
        //   ],
        //   name: 'mymaster',
        // });
        const store = new RedisStore({ client });
        return store;
    }
}
