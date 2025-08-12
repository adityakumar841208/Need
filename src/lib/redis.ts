import { createClient, RedisClientType } from 'redis';

declare global {
  // eslint-disable-next-line no-var
  var __redisClient: RedisClientType | undefined;
}

async function connect(): Promise<RedisClientType> {
  if (!global.__redisClient) {
    const client = createClient({
      url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
    });
    client.on('error', (err) => console.error('Redis Client Error:', err));
    await client.connect();
    global.__redisClient = client as RedisClientType;
  } else if (!global.__redisClient.isOpen) {
    await global.__redisClient.connect();
  }
  return global.__redisClient;
}

export async function getJson<T>(key: string): Promise<T | null> {
  const r = await connect();
  const raw = await r.get(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function setJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const r = await connect();
  await r.set(key, JSON.stringify(value), { EX: ttlSeconds });
}