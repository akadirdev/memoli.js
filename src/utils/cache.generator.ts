import { ICache, InMemoryCache, RedisCache } from '../caches';
import { CacheSource, MemoliOptions } from '../interfaces/memoli.interface';

export const generateCacheSource = async (
  memoliOptions: MemoliOptions<CacheSource>
): Promise<ICache | undefined> => {
  if (memoliOptions.cacheSource === 'redis') {
    const redisCache = new RedisCache(memoliOptions.redisOptions);

    return await redisCache
      .initialize()
      .then(() => redisCache)
      .catch((reason) => {
        console.log('redis connection issue: ', reason);
        return undefined;
      });
  } else if (memoliOptions.cacheSource === 'in-memory') {
    const inMemoryCache = new InMemoryCache(memoliOptions.inMemoryCacheOptions);

    return await inMemoryCache
      .initialize()
      .then(() => inMemoryCache)
      .catch((reason) => {
        console.log('node-cache setup issue: ', reason);
        return undefined;
      });
  } else {
    throw new Error(`CacheSource is not acceptable!`);
  }
};
