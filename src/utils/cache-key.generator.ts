import { CACHE_KEY_PREFIX } from '../constants/memoli.contast';
import { FnArgs } from '../types/function.type';
import { createHash } from 'crypto';

const parseObject = (arg: object): object[] => {
  const references = Object.keys(arg).reduce((acc, key) => {
    const value = arg[key as keyof object];
    if (typeof value === 'object') {
      acc.push({ [key]: parseObject(value) });
    } else {
      acc.push({ [key]: value });
    }
    return acc;
  }, [] as object[]);

  references.sort((curr, next) =>
    Object.keys(curr)[0].localeCompare(Object.keys(next)[0])
  );

  return references;
};

export const generateCacheKey = (
  fnName: string,
  ...fnArgs: FnArgs[]
): string => {
  const references: object[] = [];

  fnArgs.forEach((fnArg) => {
    if ('object' === typeof fnArg) {
      references.push(...parseObject(fnArg));
    } else {
      references.push(fnArg);
    }
  });
  const referenceKey = JSON.stringify(references);

  const keyHash = createHash('sha1').update(referenceKey).digest('base64');

  return [CACHE_KEY_PREFIX, fnName, keyHash].join(':');
};
