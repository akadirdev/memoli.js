/* eslint-disable @typescript-eslint/no-explicit-any */
import { Memoli } from '../memoli';

export function memolize() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    const memoli = Memoli.getMemoli();

    descriptor.value = async function (...args: any[]) {
      return memoli.memolize({
        klass: this,
        fn: originalMethod,
        args,
      });
    };

    return descriptor;
  };
}
