import Redis from "ioredis";
import { env } from "./env.js";

let redis = null;

export function getRedisClient() {
  if (!env.redisUrl) return null;
  if (!redis) {
    redis = new Redis(env.redisUrl, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false
    });

    redis.on("error", (error) => {
      console.warn("Redis unavailable:", error.message);
    });
  }
  return redis;
}
