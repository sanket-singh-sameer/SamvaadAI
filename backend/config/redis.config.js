import dotenv from 'dotenv';
dotenv.config();

import { Redis } from '@upstash/redis';

let redis = null;

export const redisClient = () => {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    redis.ping()
      .then(() => console.log('✅ Redis connected successfully'))
      .catch((error) => console.error('❌ Redis connection failed:', error.message));
  }
  return redis;
};

export default redisClient();
