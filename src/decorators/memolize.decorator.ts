/* eslint-disable @typescript-eslint/no-explicit-any */
import { Memoli } from '../modules/memoli';

export function memolize() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    const memoli = Memoli.getMemoli();

    descriptor.value = async function (...args: any[]) {
      if (memoli) {
        return memoli.memolize({
          klass: this,
          fn: originalMethod,
          args,
        });
      } else {
        return originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}
