import { DEFAULT_IN_MEMORY_CACHE_OPTIONS } from '../constants/in-memory-cache.constant';
import { InMemoryCacheOptions } from '../interfaces/in-memory-cache.interface';
import { ICache } from './cache';

import * as NodeCache from 'node-cache';

export class InMemoryCache implements ICache {
  private _client?: NodeCache;

  constructor(
    private _options: InMemoryCacheOptions = DEFAULT_IN_MEMORY_CACHE_OPTIONS
  ) {}

  async initialize() {
    if (!this._client) {
      this._client = new NodeCache.default(this._options);
    }
  }

  async quit() {
    this._client?.close();
  }

  async set<T>(key: string, value: T): Promise<T | undefined> {
    if (!this._client) return;

    const result = this._client.set(key, value);
    if (!result) return;

    return value;
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this._client?.get(key);
  }

  async del(key: string): Promise<boolean> {
    if (!this._client) return false;

    const result = this._client.del(key);

    return result === 1;
  }
}
