import { Fn, FnArgs } from '../types/function.type';
import { InMemoryCacheOptions } from './in-memory-cache.interface';
import { RedisOptions } from './redis.interface';

type RedisCacheSource = 'redis';
type InMemoryCacheSource = 'in-memory';

export type CacheSource = RedisCacheSource | InMemoryCacheSource;

interface BaseMemoliOptions<T extends CacheSource> {
  cacheSource: T;
}

interface MemoliOptionsWithRedis<T extends CacheSource>
  extends BaseMemoliOptions<T> {
  redisOptions?: RedisOptions;
}

interface MemoliOptionsWithInMemory<T extends CacheSource>
  extends BaseMemoliOptions<T> {
  inMemoryCacheOptions?: InMemoryCacheOptions;
}

export type MemoliOptions<T extends CacheSource> = T extends RedisCacheSource
  ? MemoliOptionsWithRedis<T>
  : T extends InMemoryCacheSource
  ? MemoliOptionsWithInMemory<T>
  : never;

export interface MemorizeOptions<T, ReturnType> {
  klass?: T;
  fn: Fn<ReturnType>;
  args: FnArgs[];
}
