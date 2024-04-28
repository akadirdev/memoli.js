import { ICache } from '../caches';
import {
  CacheSource,
  MemoliOptions,
  MemorizeOptions,
} from '../interfaces/memoli.interface';
import { generateCacheKey } from '../utils/cache-key.generator';
import { generateCacheSource } from '../utils/cache.generator';

export class Memoli {
  private static isInitialized: boolean = false;
  private static _memoli?: Memoli;
  private static _cache?: ICache;

  private constructor(private _memoliOpts: MemoliOptions<CacheSource>) {}

  static async initialize(memoliOptions: MemoliOptions<CacheSource>) {
    if (!this._memoli) {
      this._cache = await generateCacheSource(memoliOptions);

      if (!this._cache) {
        throw new Error('Memoli initialization failed!');
      }

      this._memoli = new Memoli(memoliOptions);
      this.isInitialized = true;
      if (memoliOptions.debugMode) {
        console.log(`> memoli: initialized successfully`);
      }
    }

    return this._memoli;
  }

  /**
   * It returns memoli instance if it is already initialized otherwise it will return undefined
   */
  static getMemoli() {
    return this._memoli;
  }

  async quit() {
    await Memoli._cache?.quit().then(() => {
      delete Memoli._memoli;
      Memoli.isInitialized = false;
    });
  }

  public get cache(): ICache | undefined {
    return Memoli._cache;
  }

  public async memolize<T, ArgsType, ReturnType>({
    klass,
    fn,
    args,
  }: MemorizeOptions<T, ArgsType, ReturnType>): Promise<ReturnType> {
    const { _cache, isInitialized } = Memoli;

    if (!isInitialized) {
      return fn.apply(klass ?? this, args);
    }

    const fnName = fn.name;

    const key = generateCacheKey(fnName, ...args);
    this.debug(`> memoli:memolize:cache:key: `, key);

    const cachedResult = await _cache?.get<ReturnType>(key);
    this.debug(`> memoli:memolize:cachedResult: `, cachedResult);
    if (cachedResult) return cachedResult;

    const result = await fn.apply(klass ?? this, args);
    this.debug(`> memoli:memolize:functionResult: `, result);
    _cache?.set<ReturnType>(key, result);

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private debug(...log: any[]) {
    if (this._memoliOpts.debugMode) {
      console.log(...log);
    }
  }
}
