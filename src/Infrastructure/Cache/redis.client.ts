import { logger } from '@shared/Log/logger';
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
  await redisClient.connect();
  logger.info('Redis connected successfully');

  await redisClient.set('test-key', 'hello', { EX: 60 });
  const value = await redisClient.get('test-key');
  logger.info({ value }, 'Redis Test Value');
}

// export const redisClient = createClient({
//   username: process.env.REDIS_USERNAME,
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: Number(process.env.REDIS_PORT),
//     tls: true,
//   },
//     tls:{
//      rejectUnauthorized:false //Without this, Redis Cloud often silently fails SSL handshake.
//   }
// });

// redisClient.on('connect',()=>{
//   logger.info('redis connecting')
// })

// redisClient.on('ready', () => {
//   logger.info('Redis ready');
// })

// redisClient.on('error', (err) => {
//   logger.error({err},'FULL REDIS ERROR:');
// });
