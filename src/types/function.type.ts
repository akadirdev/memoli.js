/* eslint-disable @typescript-eslint/no-explicit-any */
export type FnArgs =
  | object
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | any;

export type Fn<ReturnType> = (...args: FnArgs[]) => ReturnType;
