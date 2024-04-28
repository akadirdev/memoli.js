import { Memoli } from '../modules/memoli';

function sum(a: number, b: number): number {
  return a + b;
}

export async function functionalUsage() {
  const memoli = await Memoli.initialize({
    cacheSource: 'redis',
    redisOptions: {
      ttl: 5, // 5 sec
    },
  });

  // result1: result data from function call
  const result1 = await memoli.memolize({
    fn: sum,
    args: [5, 4],
  });
  console.log('result1', result1);

  // result2: result data from cache without function call
  const result2 = await memoli.memolize({
    fn: sum,
    args: [5, 4],
  });
  console.log('result2', result2);

  await memoli.quit();
}
