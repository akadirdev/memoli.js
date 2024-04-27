export interface ICache {
  initialize: () => Promise<void>;
  quit: () => Promise<void>;

  set: <T>(key: string, value: T) => Promise<T | undefined>;
  get: <T>(key: string) => Promise<T | undefined>;
  del: (key: string) => Promise<boolean>;
}
