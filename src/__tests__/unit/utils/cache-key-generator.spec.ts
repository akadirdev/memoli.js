import { faker } from '@faker-js/faker';
import { generateCacheKey } from '../../../utils/cache-key.generator';

describe('generateCacheKey', () => {
  it('should equal keys if function called with same fn name and args', () => {
    const fnName = faker.string.alpha();
    const fnParams1 = [
      {
        name: faker.string.sample(),
        surname: faker.string.sample(),
        age: faker.number.int({ min: 18, max: 130 }),
        isAdult: faker.datatype.boolean(),
        address: {
          country: {
            name: faker.location.country(),
            countryCode: faker.location.countryCode(),
          },
          city: faker.location.city(),
          zipcode: faker.location.zipCode(),
        },
        fakeFn1: () => {
          console.log('fakeFn1');
        },
      },
      faker.number.int({ min: 0, max: 18 }),
      () => {
        console.log('fakeFn2');
      },
    ];

    const result1 = generateCacheKey(fnName, ...fnParams1);
    const result2 = generateCacheKey(fnName, ...fnParams1);

    expect(result1).toEqual(result2);
    expect(result1).toMatch(new RegExp(`^memoli:${fnName}:?`));
  });

  it('should equal keys if function called with same fn name and replaced args', () => {
    const fnName = faker.string.alpha();

    const name = faker.string.sample();
    const surname = faker.string.sample();

    const fnParams1 = [
      {
        name,
        surname,
      },
    ];

    const fnParams2 = [
      {
        surname,
        name,
      },
    ];

    const result1 = generateCacheKey(fnName, ...fnParams1);
    const result2 = generateCacheKey(fnName, ...fnParams2);

    expect(result1).toEqual(result2);
    expect(result1).toMatch(new RegExp(`^memoli:${fnName}:?`));
  });
});
