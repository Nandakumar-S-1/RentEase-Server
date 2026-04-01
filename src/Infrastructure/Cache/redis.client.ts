import { logger } from 'shared/log/logger';
import { createClient } from 'redis';

export const redisClient = createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

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
        logger.info({ value }, 'Redis Test Value');
    } catch (err) {
        logger.error({ err }, 'Redis connection failed');
    }
}
