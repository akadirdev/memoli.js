import { ICache } from '../cache';
import { InMemoryCache } from '../cache/in-memory.cache';
import { RedisCache } from '../cache/redis.cache';
import { CacheSource, MemoliOptions } from '../interfaces/memoli.interface';

export const generateCacheSource = async (
  memoliOptions: MemoliOptions<CacheSource>
): Promise<ICache> => {
  if (memoliOptions.cacheSource === 'redis') {
    const redisCache = new RedisCache(memoliOptions.redisOptions);
    await redisCache.initialize();
    return redisCache;
  } else if (memoliOptions.cacheSource === 'in-memory') {
    const inMemoryCache = new InMemoryCache(memoliOptions.inMemoryCacheOptions);
    await inMemoryCache.initialize();
    return inMemoryCache;
  } else {
    throw new Error(`cacheSource is not acceptable`);
  }
};