import { logger } from '@shared/Log/logger';
import { createClient } from 'redis';

export const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    // tls: true,
  },
});

redisClient.on('error', (err) => {
  logger.error('FULL REDIS ERROR:', err);
});

export async function connectToRedis() {
  await redisClient.connect();
  logger.error('Redis connected successfully');
}

// import { logger } from "@shared/Enums/Log/logger";
// import { createClient } from "redis";

// export const redisClient = createClient({
//     url:process.env.REDIS_URL,
// })

// redisClient.on('error',(err)=>{
//     console.log('redis error',err)
//     // logger.info('redis error',err)
// })

// export async function connectToRedis() {
//     await redisClient.connect()
//     console.log('redis connected succesfuly')
//     // logger.info('redis connected succesfuly')
// }
