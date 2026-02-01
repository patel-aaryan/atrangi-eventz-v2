import { Redis } from "@upstash/redis";

const restUrl = process.env.UPSTASH_REDIS_REST_URL;
const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!restUrl) {
  throw new Error("UPSTASH_REDIS_REST_URL is not set");
}

if (!restToken) throw new Error("UPSTASH_REDIS_REST_TOKEN is not set");

export const redis = new Redis({ url: restUrl, token: restToken });
