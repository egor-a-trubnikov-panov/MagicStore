import * as R from "ramda";

const notEquals = R.curry((a, b) => R.not(R.equals(a, b)));
const notIs = R.curry((Class, value) => R.not(R.is(Class, value)));
const notIsNil = R.compose(
  R.not,
  R.isNil
);
const notIsEmpty = R.compose(
  R.not,
  R.isEmpty
);
const notIsEmptyNil = R.converge(R.and, [notIsEmpty, notIsNil]);
const includes = R.curry((item: any, list: any[]) =>
  R.gte(R.indexOf(item, list), 0)
);
const notIncludes = R.curry((item: any, list: any[]) =>
  R.not(includes(item, list))
);
const indexMap = R.addIndex(R.map);
const toLowerHead = R.converge(R.concat, [
  R.compose(
    R.toLower,
    R.head
  ),
  R.tail
]);
const toUpperHead = R.converge(R.concat, [
  R.compose(
    R.toUpper,
    R.head
  ),
  R.tail
]);

const setTo = R.curry((lens: any, newValue: any, data: any) => {
  if (PF.is(Number, lens)) {
    return R.set(R.lensIndex(lens), newValue, data);
  }
  if (PF.is(String, lens)) {
    return R.set(R.lensProp(lens), newValue, data);
  }
  return R.set(R.lensPath(lens), newValue, data);
});

const overTo = R.curry((lens: any, getNewValue: any, data: any) => {
  if (PF.is(Number, lens)) {
    return R.over(R.lensIndex(lens), getNewValue, data);
  }
  if (PF.is(String, lens)) {
    return R.over(R.lensProp(lens), getNewValue, data);
  }
  return R.over(R.lensPath(lens), getNewValue, data);
});

const stopRange = R.curry((min: number, max: number, count: number): number => {
  if (R.gte(count, min)) {
    if (R.lte(count, max)) {
      return count;
    }
    return max;
  }
  return min;
});

const lastIndex = (array: any[]): number => R.length(array) - 1;

export type Arity1Fn = (a: any) => any;
export type pathForLens = any[] | string | number;
interface IPF extends R.Static {
  __: any;
  notEquals<T>(a: T, b: T): boolean;
  notEquals<T>(a: T): (b: T) => boolean;

  notIs(ctor: any, val: any): boolean;
  notIs(ctor: any): (val: any) => boolean;

  notIsNil(value: any): boolean;

  notIsEmpty(value: any): boolean;

  notIsEmptyNil(value: any): boolean;

  includes<T>(a: T, b: T[]): boolean;

  notIncludes<T>(a: T, b: T[]): boolean;

  indexMap<T, U>(fn: (x: T, id: number) => U, list: ReadonlyArray<T>): U[];

  toLowerHead<T>(list: ReadonlyArray<T>): T | undefined;
  toLowerHead(list: string): string;

  toUpperHead<T>(list: ReadonlyArray<T>): T | undefined;
  toUpperHead(list: string): string;

  setTo<T, U>(lens: pathForLens, newValue: U, data: T): T;
  setTo<U>(lens: pathForLens, newValue: U): <T>(data: T) => T;
  setTo(lens: pathForLens): <T, U>(newValue: U, data: T) => T;

  overTo<T>(lens: pathForLens, fn: Arity1Fn, value: T): T;
  overTo<T>(lens: pathForLens, fn: Arity1Fn, value: T[]): T[];
  overTo(lens: pathForLens, fn: Arity1Fn): <T>(value: T) => T;
  overTo(lens: pathForLens, fn: Arity1Fn): <T>(value: T[]) => T[];
  overTo(lens: pathForLens): <T>(fn: Arity1Fn, value: T) => T;
  overTo(lens: pathForLens): <T>(fn: Arity1Fn, value: T[]) => T[];

  stopRange(min: number, max: number, count: number): number;
  stopRange(min: number, max: number): (count: number) => number;
  stopRange(min: number): (max: number, count: number) => number;

  lastIndex(array: any[]): number;
}

export const PF: IPF = {
  ...R,
  notEquals,
  notIs,
  notIsEmpty,
  notIsNil,
  notIsEmptyNil,
  includes,
  notIncludes,
  indexMap,
  toLowerHead,
  toUpperHead,
  lastIndex,
  setTo,
  overTo,
  stopRange,
  // @ts-ignore
  __: R.__
};
