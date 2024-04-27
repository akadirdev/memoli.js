import { ICache } from './cache/cache';
import { CacheSource, MemoliOptions } from './interfaces/memoli.interface';
import { Fn, FnArgs } from './types/function.type';
import { generateCacheKey } from './utils/cache-key.generator';
import { generateCacheSource } from './utils/cache.generator';

export class Memoli {
  private static _memoli: Memoli;

  private static _cache?: ICache;

  private constructor(private _memoliOpts: MemoliOptions<CacheSource>) {}

  static async initialize(memoliOptions: MemoliOptions<CacheSource>) {
    if (!this._memoli) {
      this._cache = await generateCacheSource(memoliOptions);
      this._memoli = new Memoli(memoliOptions);
    }

    return this._memoli;
  }

  async quit() {
    await Memoli._cache?.quit();
  }

  public get cache(): ICache | undefined {
    return Memoli._cache;
  }

  public async memolize<ReturnType>(
    fn: Fn<ReturnType>,
    ...args: FnArgs[]
  ): Promise<ReturnType> {
    const { _cache } = Memoli;

    const fnName = fn.name;

    const key = generateCacheKey(fnName, ...args);
    console.log('memoli:memolize:cache:key: ', key);

    const cachedResult = await _cache?.get<ReturnType>(key);
    console.log('memoli:memolize:cachedResult: ', cachedResult);
    if (cachedResult) return cachedResult;

    const result = await fn.apply(this, args);
    console.log('memoli:memolize:result: ', result);
    _cache?.set<ReturnType>(key, result);

    return result;
  }
}
