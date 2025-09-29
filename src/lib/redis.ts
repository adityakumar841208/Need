import { createClient, RedisClientType } from "redis";

declare global {
  // eslint-disable-next-line no-var
  var __redisClient: RedisClientType | undefined;
}

let isRedisConnected = false;
let redisConnectionFailed = false;
let lastConnectionAttempt = 0;
const CONNECTION_RETRY_INTERVAL = 60000; // 1 minute

async function connect(): Promise<RedisClientType | null> {
  // If Redis connection failed recently, don't retry immediately
  if (redisConnectionFailed && Date.now() - lastConnectionAttempt < CONNECTION_RETRY_INTERVAL) {
    return null;
  }

  try {
    if (!global.__redisClient) {
      const client = createClient({
        url: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
        socket: {
          connectTimeout: 5000, // 5 second timeout
          lazyConnect: true,
        },
        retry_delay_on_failure: function(options) {
          return Math.min(options.attempt * 100, 3000);
        }
      });

      client.on("connect", () => {
        console.log("✅ Redis connected");
        isRedisConnected = true;
        redisConnectionFailed = false;
      });

      client.on("error", (err) => {
        console.error("❌ Redis Client Error:", err);
        isRedisConnected = false;
        redisConnectionFailed = true;
        lastConnectionAttempt = Date.now();
      });

      client.on("end", () => {
        console.warn("⚠️ Redis disconnected");
        isRedisConnected = false;
      });

      await client.connect();
      global.__redisClient = client as RedisClientType;
      isRedisConnected = true;
      redisConnectionFailed = false;
    } else if (!global.__redisClient.isOpen) {
      await global.__redisClient.connect();
      isRedisConnected = true;
      redisConnectionFailed = false;
    }

    return global.__redisClient;
  } catch (err) {
    console.error("❌ Failed to connect Redis:", err);
    isRedisConnected = false;
    redisConnectionFailed = true;
    lastConnectionAttempt = Date.now();
    return null;
  }
}

// ✅ Safe wrapper - returns null if Redis is unavailable
export async function getJson<T>(key: string): Promise<T | null> {
  if (redisConnectionFailed && Date.now() - lastConnectionAttempt < CONNECTION_RETRY_INTERVAL) {
    return null; // Skip Redis entirely if it failed recently
  }

  try {
    const r = await connect();
    if (!r || !isRedisConnected) return null;

    const raw = await r.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (err) {
    console.error("❌ Redis get failed:", err);
    redisConnectionFailed = true;
    lastConnectionAttempt = Date.now();
    return null;
  }
}

// ✅ Safe wrapper - silently fails if Redis is unavailable
export async function setJson(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  if (redisConnectionFailed && Date.now() - lastConnectionAttempt < CONNECTION_RETRY_INTERVAL) {
    return; // Skip Redis entirely if it failed recently
  }

  try {
    const r = await connect();
    if (!r || !isRedisConnected) return;

    await r.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    console.error("❌ Redis set failed:", err);
    redisConnectionFailed = true;
    lastConnectionAttempt = Date.now();
  }
}

// Optional: Export function to check Redis status
export function isRedisAvailable(): boolean {
  return isRedisConnected && !redisConnectionFailed;
}