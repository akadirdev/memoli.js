import { Memoli } from '../memoli';

class FakeService {
  async fakeMethod({ param1, param2 }: { param1: string; param2: number }) {
    console.log(`param1: ${param1}, param2: ${param2}`);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
      param1,
      param2,
    };
  }
}

export async function classFunctionUsage() {
  const memoli = await Memoli.initialize({
    cacheSource: 'redis',
    redisOptions: {
      ttl: 15,
    },
  });

  const fakeService = new FakeService();

  // result1: result data from function call
  const result1 = await memoli.memolize({
    fn: fakeService.fakeMethod,
    args: [{ param1: 'fake', param2: 3 }],
  });
  console.log('result1', result1);

  // result2: result data from cache without function call
  const result2 = await memoli.memolize({
    fn: fakeService.fakeMethod,
    args: [{ param1: 'fake', param2: 3 }],
  });
  console.log('result2', result2);

  await memoli.quit();
}
