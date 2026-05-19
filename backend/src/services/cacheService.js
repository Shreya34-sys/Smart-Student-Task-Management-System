import { getRedisClient } from "../config/redis.js";

const memoryCache = new Map();

export async function getCache(key) {
  const redis = getRedisClient();
  if (redis) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  const cached = memoryCache.get(key);
  if (!cached || cached.expiresAt < Date.now()) return null;
  return cached.value;
}

export async function setCache(key, value, ttlSeconds = 300) {
  const redis = getRedisClient();
  if (redis) {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    return;
  }

  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
}

export async function clearCacheByPrefix(prefix) {
  const redis = getRedisClient();
  if (redis) {
    const keys = await redis.keys(`${prefix}*`);
    if (keys.length) await redis.del(keys);
    return;
  }

  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) memoryCache.delete(key);
  }
}
