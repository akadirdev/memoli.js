import { DEFAULT_REDIS_OPTIONS } from '../constants/redis.constant';
import { RedisOptions } from '../interfaces/redis.interface';
import { ICache } from './cache';
import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
  createClient,
} from 'redis';

export class RedisCache implements ICache {
  private _client?: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

  constructor(private _options: RedisOptions = DEFAULT_REDIS_OPTIONS) {}

  async initialize() {
    if (!this._client) {
      this._client = createClient(this._options);
    }
  }

  async quit() {
    await this._client?.quit();
  }

  async set<T>(key: string, value: T): Promise<T | undefined> {
    if (!this._client) return;

    const val = JSON.stringify(value);

    await this._client.set(key, val, {
      EX: this._options.ttl,
    });

    return value;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const val = await this._client?.get(key);

    if (!val) return;

    return JSON.parse(val);
  }

  async del(key: string): Promise<boolean> {
    if (!this._client) return false;

    const removedValue = await this._client.del(key);

    return !!removedValue;
  }
}
