/* eslint-disable @typescript-eslint/no-explicit-any */

// In-memory fallback store
const memoryStore = new Map<string, { value: string; expiresAt: number | null }>();

// Redis client type - we'll use dynamic typing to avoid import errors
type RedisClientType = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ex?: string, seconds?: number): Promise<'OK'>;
  del(key: string): Promise<number>;
  ping(): Promise<'PONG'>;
  connect(): Promise<void>;
  on(event: string, callback: (err?: Error) => void): void;
  quit(): Promise<void>;
};

// Try to load ioredis, fall back gracefully if unavailable
let redisClient: RedisClientType | null = null;
let useMemoryFallback = false;

async function initRedis(): Promise<void> {
  try {
    // Attempt to dynamically require ioredis
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Redis = require('ioredis');
    
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times: number) {
        if (times > 3) {
          return null; // Stop retrying
        }
        return Math.min(times * 100, 3000);
      },
      lazyConnect: true,
    }) as unknown as RedisClientType;

    redisClient.on('error', (err?: Error) => {
      console.warn('[Redis] Connection error, using in-memory fallback:', err?.message);
      useMemoryFallback = true;
    });

    redisClient.on('connect', () => {
      console.log('[Redis] Connected successfully');
      useMemoryFallback = false;
    });

    // Test connection
    await redisClient.connect();
    await redisClient.ping();
  } catch (error) {
    console.warn('[Redis] Redis unavailable, using in-memory fallback:', 
      error instanceof Error ? error.message : 'Unknown error');
    useMemoryFallback = true;
    redisClient = null;
  }
}

// Initialize Redis connection (non-blocking)
initRedis().catch(() => {
  useMemoryFallback = true;
});

/**
 * Get a value from Redis or memory store
 */
export async function get(key: string): Promise<string | null> {
  if (useMemoryFallback || !redisClient) {
    const item = memoryStore.get(key);
    if (!item) return null;
    
    // Check expiration
    if (item.expiresAt !== null && item.expiresAt < Date.now()) {
      memoryStore.delete(key);
      return null;
    }
    return item.value;
  }

  try {
    const value = await redisClient.get(key);
    return value;
  } catch (error) {
    console.warn('[Redis] Get error, falling back to memory:', 
      error instanceof Error ? error.message : 'Unknown error');
    
    // Fallback to memory on error
    const item = memoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt !== null && item.expiresAt < Date.now()) {
      memoryStore.delete(key);
      return null;
    }
    return item.value;
  }
}

/**
 * Set a value in Redis or memory store
 */
export async function set(
  key: string, 
  value: string, 
  options?: { ex?: number }
): Promise<void> {
  const expiresAt = options?.ex 
    ? Date.now() + (options.ex * 1000) 
    : null;

  if (useMemoryFallback || !redisClient) {
    memoryStore.set(key, { value, expiresAt });
    return;
  }

  try {
    if (options?.ex) {
      await redisClient.set(key, value, 'EX', options.ex);
    } else {
      await redisClient.set(key, value);
    }
  } catch (error) {
    console.warn('[Redis] Set error, falling back to memory:', 
      error instanceof Error ? error.message : 'Unknown error');
    
    // Fallback to memory on error
    memoryStore.set(key, { value, expiresAt });
  }
}

/**
 * Delete a key from Redis or memory store
 */
export async function del(key: string): Promise<void> {
  if (useMemoryFallback || !redisClient) {
    memoryStore.delete(key);
    return;
  }

  try {
    await redisClient.del(key);
  } catch (error) {
    console.warn('[Redis] Del error, falling back to memory:', 
      error instanceof Error ? error.message : 'Unknown error');
    
    // Fallback to memory on error
    memoryStore.delete(key);
  }
}

/**
 * Check if using in-memory fallback
 */
export function isUsingFallback(): boolean {
  return useMemoryFallback;
}

export default { get, set, del, isUsingFallback };
