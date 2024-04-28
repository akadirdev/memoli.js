# memoli.js

Cache the results of async/sync functions. When you call the function with the same parameters, `memoli` will fetch the previous result for you. Saving time has never been easier..

`memoli` uses redis and node-cache(for in-memory) caching solutions in background. Which one do you prefer is your choose. `memoli` provides a interface for all options of redis and node-cache.

> `memoli` is compatible with v4 and higher version of redis and v5 and higher version of node-cache

Also, `memoli.cache` provides cache API's like: `get`, `set`, `del`, ..
Therefore, you can use caching functionality directly.

## Installation

Install `memoli` with prefered cache solution:

```bash
npm i memoli redis
```

```bash
npm i memoli node-cache
```

Add below to `compilerOptions` in `tsconfig.json` for decorator usages (OPTIONAL):

```json
"experimentalDecorators": true
```

## Usage

First of all, initialize `memoli`:

```typescript
const memoli = await Memoli.initialize({
  cacheSource: 'redis', // 'redis' or 'in-memory'
  // redisOptions: Includes Redis' own options
  redisOptions: {
    ttl: 5, // 5 sec
  },
});
```

`memoli` have `memolize` function for wrapping the function calls and cache them.

### Singular Functions

For example, you have following function declaration:

```typescript
async function getHospitalFromHospitalService(id: number): Promise<Hospital> {
  return hospitalService.getHospital(id); // async function call
}
```

And calling this function like this:

```typescript
const hospital = await getHospitalFromHospitalService(1);
```

if you wrap this function call with `memolize` function, you can get result from cache for next function calls:

```typescript
const hospital = await memoli.memolize({
  fn: getHospitalFromHospitalService,
  args: [1],
});
```

`memoli` creates a cache key from your function name and given function parameters. Then, stores your function call result with this cache key. Thus, next function call with same parameters will be returned from cache.

### Class Functions

if you are using class functions like this:

```typescript
class HospitalServiceCaller {
  // ...
  async getHospitalFromHospitalService(id: number): Promise<Hospital> {
    return hospitalService.getHospital(id); // async function call
  }
  // ...
}
```

You need to give one more parameter called `klass` to `memolize` function:

```typescript
const hospitalServiceCaller = new HospitalServiceCaller();

const hospital = await memoli.memolize({
  klass: hospitalServiceCaller,
  fn: hospitalServiceCaller.getHospitalFromHospitalService,
  args: [1],
});
```

### Decorator Usage for Class Functions

`memoli` provides `memolize` decorator to make things easier:

```typescript
class HospitalServiceCaller {
  // ...
  @memolize()
  async getHospitalFromHospitalService(id: number): Promise<Hospital> {
    return hospitalService.getHospital(id); // async function call
  }
  // ...
}
```

With `memolize` decorator, you can use function calls as you used before:

```typescript
const hospital = await hospitalServiceCaller.getHospitalFromHospitalService(1);
```

### Sync Functions

`memoli` supports sync function result caching as well.

### Cache API

`memoli` provides usage of cache functionality directly with `cache` property:

```typescript
const memoli = await Memoli.initialize({
  cacheSource: 'redis',
  redisOptions: {
    ttl: 10,
  },
});

const cache = memoli.cache!;

const result1 = await cache.set('key-1', { value: 'value-1' });
console.log(result1); // { value: 'value-1' }

const result2 = await cache.get('key-1');
console.log(result2); // { value: 'value-1' }

const result3 = await cache.del('key-1');
console.log(result3); // true

const result4 = await cache.get('key-1');
console.log(result4); // undefined

await memoli.quit();
```

### Examples

To reach all provided code samples, visit [examples](https://github.com/akadirdev/memoli.js/tree/master/src/examples 'examples')

## License

Copyright © 2024 Dedeloper.

This project is licensed under the MIT License - see the [LICENSE file](https://github.com/akadirdev/memoli.js/blob/master/LICENSE.md 'LICENSE') for details.
