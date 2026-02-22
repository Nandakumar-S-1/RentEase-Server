import { IRedisCache } from '@application/Interfaces/Services/IRedisCacheService';
import { redisClient } from './redis.client';

export class RedisCacheService implements IRedisCache {
  async set(key: string, value: string, ttl: number): Promise<void> {
    await redisClient.set(key, value, {
      EX: ttl,
    });
  }
  async get(key: string): Promise<string | null> {
    return await redisClient.get(key);
  }
  async delete(key: string): Promise<void> {
    await redisClient.del(key);
  }
}
