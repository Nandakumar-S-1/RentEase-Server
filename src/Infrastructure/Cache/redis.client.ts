import { logger } from 'shared/log/logger';
import { createClient } from 'redis';

// Build URL — if no password is set (local Docker), use plain redis://host:port
const host = process.env.REDIS_HOST || 'localhost';
const port = process.env.REDIS_PORT || '6379';
const username = process.env.REDIS_USERNAME;
const password = process.env.REDIS_PASSWORD;

const redisUrl =
    password
        ? `redis://${username}:${password}@${host}:${port}`
        : `redis://${host}:${port}`;

export const redisClient = createClient({ url: redisUrl });

redisClient.on('connect', () => {
    logger.info('Redis connecting...');
});

redisClient.on('ready', () => {
    logger.info('Redis ready');
});

redisClient.on('error', (err) => {
    logger.error({ err }, '-------------FULL REDIS ERROR:');
});

export async function connectToRedis() {
    try {
        await redisClient.connect();
        logger.info('Redis connected successfully');

        await redisClient.set('test-key', 'hello', { EX: 60 });
        const value = await redisClient.get('test-key');
        logger.info({ value }, 'Redis test OK');
    } catch (err) {
        logger.error({ err }, 'Redis connection failed');
        throw err;
    }
}
