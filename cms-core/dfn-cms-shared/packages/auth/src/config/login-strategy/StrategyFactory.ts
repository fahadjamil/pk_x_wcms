import { SessionStrategy } from './SessionStrategy';
import { JWTStrategy } from './JWTStrategy';

export class StrategyFactory {
    public static getInstant(type) {
        if (type === 'SESSION') {
            return SessionStrategy;
        } else if (type === 'JWT') {
            return JWTStrategy;
        } else {
            console.log('Unknown type LOGIN_STRATEGY in .env file');
        }
    }
}
