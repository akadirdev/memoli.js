import { Memoli } from '../modules/memoli';

export async function inMemoryCacheUsage() {
  const memoli = await Memoli.initialize({
    cacheSource: 'in-memory',
    inMemoryCacheOptions: {
      stdTTL: 10,
      checkperiod: 5,
    },
  });

  const cache = memoli.cache!;

  const result1 = await cache.set('key-1', { value: 'value-1' });
  console.log('result1: ', result1);

  const result2 = await cache.get('key-1');
  console.log('result2: ', result2);

  const result3 = await cache.del('key-1');
  console.log('result3: ', result3);

  const result4 = await cache.get('key-1');
  console.log('result4: ', result4);

  await memoli.quit();
}
