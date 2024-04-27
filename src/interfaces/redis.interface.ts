import { RedisClientOptions } from 'redis';

export type RedisOptions = RedisClientOptions & {
  /**
   * the ttl stored for the item, or undefined if ttls are not used.
   */
  ttl: number;
};
