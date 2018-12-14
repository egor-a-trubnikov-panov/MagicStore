import * as React from 'react';

import { createProvider } from './Components/Provider';
import { Connect, createConnect } from './helpers/connect';
import { devtoolsCreator } from './helpers/devtools';
import { getPathFromTemplateString } from './helpers/templateStringParser';
import {
  set,
  over,
  lensPath,
  flip,
  concat,
  merge,
  not,
  inc,
  dec,
  omit,
  init,
  last,
  remove,
  is,
  ifElse,
} from 'ramda';
import { ISellector, selectorCreator } from './helpers/ISellector';
import { globalStateKey } from './helpers/constants';

type TSetState = (
  state: (prevState: any, props: any) => any,
  piper?: () => void,
) => void;

interface IProviderValue {
  setState: TSetState;
  initializedMiddlewares: any[];
}

export type Actions =
  | 'nullify'
  | 'concat'
  | 'extend'
  | 'remove'
  | 'toggle'
  | 'set'
  | 'inc'
  | 'dec';

export interface IActionsChain<IState> extends IActions<IState> {
  run: () => IState;
}

export interface IActions<IState> {
  concat: (
    path: TemplateStringsArray,
    ...args: any[]
  ) => (list: any[]) => IActionsChain<IState>;
  extend: (
    path: TemplateStringsArray,
    ...args: any[]
  ) => (object: object) => IActionsChain<IState>;
  remove: (path: TemplateStringsArray, ...args: any[]) => IActionsChain<IState>;
  toggle: (path: TemplateStringsArray, ...args: any[]) => IActionsChain<IState>;
  set: (
    path: TemplateStringsArray,
    ...args: any[]
  ) => (value: any) => IActionsChain<IState>;
  inc: (path: TemplateStringsArray, ...args: any[]) => IActionsChain<IState>;
  dec: (path: TemplateStringsArray, ...args: any[]) => IActionsChain<IState>;
}

type StoreMutator = (path: string[]) => any;

const defaultMiddlewares =
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined' &&
  // @ts-ignore
  window.devToolsExtension
    ? [devtoolsCreator]
    : [];

interface ICreatedFuncs<IState> extends IActions<IState> {
  Provider: React.ComponentType<any>;
  connect: Connect;
  select: ISellector;
}

export const createStore = <IState>(
  initialState: IState,
  middlewares = [],
): ICreatedFuncs<IState> => {
  // @ts-ignore
  const context = React.createContext();

  let providerValue: IProviderValue;

  const stateForSelect = new Map();
  stateForSelect.set(globalStateKey, initialState);

  const setProvider = (self: React.PureComponent) => {
    const midlewaresList = [...middlewares, ...defaultMiddlewares];

    const setMidleware = (middleware: any) => middleware(initialState, self);

    const initializedMiddlewares = midlewaresList.map(setMidleware);

    const setState: TSetState = (newState) => {
      stateForSelect.set(globalStateKey, self.state);
      self.setState(newState);
    };

    providerValue = {
      setState,
      initializedMiddlewares,
    };
  };

  let state = initialState;

  const setStateWrapper = (
    type: string,
    path: string[],
    value: any,
    accumulator: IState,
  ): IState => {
    if (!providerValue) {
      console.error('<Provider /> is not initialized yet');
      return state;
    }

    const newState = mutators[type](accumulator, path, value);

    const runMidleware = (middleware: any) =>
      middleware(`${type}: ${path.join('.')}`, { value, path }, newState);

    providerValue.initializedMiddlewares.forEach(runMidleware);
    return newState;
  };

  function toPath(mutator: StoreMutator) {
    return (templateData: TemplateStringsArray, ...args: any[]) =>
      mutator(getPathFromTemplateString(templateData, ...args));
  }

  enum MutatorType {
    Concat = 'concat',
    Extend = 'extend',
    Remove = 'remove',
    Toggle = 'toggle',
    Set = 'set',
    Inc = 'inc',
    Dec = 'dec',
  }

  const mutators = {
    concat: (accumulator: IState, path: string[], list: any[]) =>
      over(lensPath(path), flip(concat)(list), accumulator),
    extend: (accumulator: IState, path: string[], object: object) =>
      over(lensPath(path), merge(object), accumulator),
    remove: (accumulator: IState, path: string[]) =>
      over(
        lensPath(init(path)),
        ifElse(
          is(Array),
          remove(Number(last(path)), 1),
          omit([last(path) || '']),
        ),
        accumulator,
      ),
    toggle: (accumulator: IState, path: string[]) =>
      over(lensPath(path), not, accumulator),
    set: (accumulator: IState, path: string[], value: any) =>
      set(lensPath(path), value, accumulator),
    inc: (accumulator: IState, path: string[]) =>
      over(lensPath(path), inc, accumulator),
    dec: (accumulator: IState, path: string[]) =>
      over(lensPath(path), dec, accumulator),
  };

  interface IPipeListItem {
    type: MutatorType;
    path: string[];
    value: any;
  }

  let pipeList: IPipeListItem[] = [];

  const actions: IActions<IState> = {
    concat: toPath((path: string[]) => (list: any[]) =>
      piper(MutatorType.Concat, path, list),
    ),
    extend: toPath((path: string[]) => (object: object) =>
      piper(MutatorType.Extend, path, object),
    ),
    remove: toPath((path: string[]) => piper(MutatorType.Remove, path)),
    toggle: toPath((path: string[]) => piper(MutatorType.Toggle, path)),
    set: toPath((path: string[]) => (value: any) =>
      piper(MutatorType.Set, path, value),
    ),
    inc: toPath((path: string[]) => piper(MutatorType.Inc, path)),
    dec: toPath((path: string[]) => piper(MutatorType.Dec, path)),
  };

  const run = (): IState => {
    const newState = pipeList.reduce(
      (accumulator, currentValue: IPipeListItem) =>
        setStateWrapper(
          currentValue.type,
          currentValue.path,
          currentValue.value,
          accumulator,
        ),
      { ...Object(state) },
    );

    state = newState;
    providerValue.setState(newState);
    pipeList = [];
    return state;
  };

  function piper(
    type: MutatorType,
    path: string[],
    value?: any,
  ): IActionsChain<IState> {
    pipeList.push({ type, path, value });
    return { ...actions, run };
  }

  const Provider = createProvider(setProvider, context.Provider, initialState);
  const connect = createConnect(context.Consumer);

  return {
    Provider,
    connect,
    select: selectorCreator(stateForSelect),
    ...actions,
  };
};
