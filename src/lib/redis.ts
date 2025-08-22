import { createClient, RedisClientType } from "redis";

declare global {
  // eslint-disable-next-line no-var
  var __redisClient: RedisClientType | undefined;
}

let isRedisConnected = false;

async function connect(): Promise<RedisClientType | null> {
  try {
    if (!global.__redisClient) {
      const client = createClient({
        url: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
      });

      client.on("connect", () => {
        console.log("✅ Redis connected");
        isRedisConnected = true;
      });

      client.on("error", (err) => {
        console.error("❌ Redis Client Error:", err);
        isRedisConnected = false;
      });

      client.on("end", () => {
        console.warn("⚠️ Redis disconnected");
        isRedisConnected = false;
      });

      await client.connect();
      global.__redisClient = client as RedisClientType;
      isRedisConnected = true;
    } else if (!global.__redisClient.isOpen) {
      await global.__redisClient.connect();
      isRedisConnected = true;
    }

    return global.__redisClient;
  } catch (err) {
    console.error("❌ Failed to connect Redis:", err);
    isRedisConnected = false;
    return null;
  }
}

// ✅ Safe wrapper to check availability before get
export async function getJson<T>(key: string): Promise<T | null> {
  const r = await connect();
  if (!r || !isRedisConnected) return null;

  try {
    const raw = await r.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (err) {
    console.error("❌ Redis get failed:", err);
    return null;
  }
}

// ✅ Safe wrapper to check availability before set
export async function setJson(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  const r = await connect();
  if (!r || !isRedisConnected) return;

  try {
    await r.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    console.error("❌ Redis set failed:", err);
  }
}