import * as React from 'react';

import { createProvider } from './Components/Provider';
import { Connect, createConnect } from './helpers/connect';
import { devtoolsCreator } from './helpers/devtools';
import { getPathFromTemplateString } from './helpers/templateStringParser';
import { set, over, lensPath, flip, concat, merge, not, inc, dec } from 'ramda';

export interface IState {
  [key: string]: any;
}

type TSetState = (
  state: (prevState: any, props: any) => any,
  callback?: () => void
) => void;

interface IProviderValue {
  setState: TSetState;
  initializedMiddlewares: any[];
}

export type Actions =
  | 'nullify'
  | 'concat'
  | 'extend'
  | 'toggle'
  | 'set'
  | 'inc'
  | 'dec';

export interface IActions {
  nullify: (path: TemplateStringsArray, ...args: any[]) => IState;
  concat: (
    path: TemplateStringsArray,
    ...args: any[]
  ) => (list: any[]) => IState;
  extend: (
    path: TemplateStringsArray,
    ...args: any[]
  ) => (object: object) => IState;
  toggle: (path: TemplateStringsArray, ...args: any[]) => IState;
  set: (path: TemplateStringsArray, ...args: any[]) => (value: any) => IState;
  inc: (path: TemplateStringsArray, ...args: any[]) => IState;
  dec: (path: TemplateStringsArray, ...args: any[]) => IState;
}

export interface IPipeActions {
  nullify: (path: TemplateStringsArray, ...args: any[]) => Ipipe;
  concat: (
    path: TemplateStringsArray,
    ...args: any[]
  ) => (list: any[]) => Ipipe;
  extend: (
    path: TemplateStringsArray,
    ...args: any[]
  ) => (object: object) => Ipipe;
  toggle: (path: TemplateStringsArray, ...args: any[]) => Ipipe;
  set: (path: TemplateStringsArray, ...args: any[]) => (value: any) => Ipipe;
  inc: (path: TemplateStringsArray, ...args: any[]) => Ipipe;
  dec: (path: TemplateStringsArray, ...args: any[]) => Ipipe;
}

interface Ipipe extends IPipeActions {
  run: () => IState;
}

export interface IActionsAndPipe extends IActions {
  pipe: Ipipe;
}

type StoreMutator = (path: string[]) => any;

type TMutateState = (type: string, path: string[], result: IState) => any;

const defaultMiddlewares =
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined' &&
  // @ts-ignore
  window.devToolsExtension
    ? [devtoolsCreator]
    : [];

interface ICreatedFuncs extends IActionsAndPipe {
  Provider: React.ComponentType<any>;
  connect: Connect;
}

export const createStore = (
  initialState: any,
  middlewares = []
): ICreatedFuncs => {
  // @ts-ignore
  const context = React.createContext();

  let providerValue: IProviderValue;

  const setProvider = (self: React.PureComponent) => {
    const midlewaresList = [...middlewares, ...defaultMiddlewares];

    const setMidleware = (middleware: any) => middleware(initialState, self);

    const initializedMiddlewares = midlewaresList.map(setMidleware);

    const setState: TSetState = (newState, callback) =>
      self.setState(newState, callback);

    providerValue = {
      setState,
      initializedMiddlewares,
    };
  };

  let state = initialState;

  const setStateWrapper: TMutateState = (type, path, result) => {
    if (!providerValue) {
      console.error('<Provider /> is not initialized yet');
      return state;
    }

    state = { ...state, ...result };
    const newState = { ...state };

    const runMidleware = (middleware: any) =>
      middleware(type, { result, path }, newState);

    providerValue.setState(state, () => {
      providerValue.initializedMiddlewares.forEach(runMidleware);
    });
    return state;
  };

  const pipeSetStateWrapper = (
    type: string,
    path: string[],
    result: IState,
    accumulator: IState
  ): IState => {
    if (!providerValue) {
      console.error('<Provider /> is not initialized yet');
      return state;
    }

    state = { ...state, ...accumulator, ...result };
    const newState = { ...state };

    const runMidleware = (middleware: any) =>
      middleware(type, { result, path }, newState);

    providerValue.initializedMiddlewares.forEach(runMidleware);
    return newState;
  };

  function toPath(mutator: StoreMutator) {
    return (templateData: TemplateStringsArray, ...args: any[]) =>
      mutator(getPathFromTemplateString(templateData, ...args));
  }

  const resolverConstruct = (stateMutator: any) => (
    type: string,
    path: string[],
    result: IState,
    accumulator?: IState
  ) => {
    return result.then
      ? result.then((resolvedResult: any) =>
          stateMutator(type, path, resolvedResult, accumulator)
        )
      : stateMutator(type, path, result, accumulator);
  };

  const defaultStateMutator: TMutateState = resolverConstruct(setStateWrapper);
  const pipeStateMutator = resolverConstruct(pipeSetStateWrapper);

  const mutators = {
    nullify: (callback: TMutateState) =>
      toPath((path: string[]) =>
        callback('nullify', path, set(lensPath(path), null, state))
      ),
    concat: (callback: TMutateState) =>
      toPath((path: string[]) => (list: any[]) =>
        callback(
          'concat',
          path,
          over(lensPath(path), flip(concat)(list), state)
        )
      ),
    extend: (callback: TMutateState) =>
      toPath((path: string[]) => (object: object) =>
        callback('extend', path, over(lensPath(path), merge(object), state))
      ),
    toggle: (callback: TMutateState) =>
      toPath((path: string[]) =>
        callback('toggle', path, over(lensPath(path), not, state))
      ),
    set: (callback: TMutateState) =>
      toPath((path: string[]) => (value: any) =>
        callback('set', path, set(lensPath(path), value, state))
      ),
    inc: (callback: TMutateState) =>
      toPath((path: string[]) =>
        callback('inc', path, over(lensPath(path), inc, state))
      ),
    dec: (callback: TMutateState) =>
      toPath((path: string[]) =>
        callback('dec', path, over(lensPath(path), dec, state))
      ),
  };

  interface IPipeListItem {
    type: string;
    path: string[];
    result: IState;
  }
  let pipeList: IPipeListItem[] = [];

  const actions: IActionsAndPipe = {
    nullify: mutators.nullify(defaultStateMutator),
    concat: mutators.concat(defaultStateMutator),
    extend: mutators.extend(defaultStateMutator),
    toggle: mutators.toggle(defaultStateMutator),
    set: mutators.set(defaultStateMutator),
    inc: mutators.inc(defaultStateMutator),
    dec: mutators.dec(defaultStateMutator),
    pipe: {
      nullify: mutators.nullify(piper),
      concat: mutators.concat(piper),
      extend: mutators.extend(piper),
      toggle: mutators.toggle(piper),
      set: mutators.set(piper),
      inc: mutators.inc(piper),
      dec: mutators.dec(piper),
      run: () => {
        pipeList.reduce(
          (accumulator, currentValue: IPipeListItem) => {
            return pipeStateMutator(
              currentValue.type,
              currentValue.path,
              currentValue.result,
              accumulator
            );
          },
          { ...state }
        );
        providerValue.setState(state);
        pipeList = [];
        return state;
      },
    },
  };

  function piper(type: string, path: string[], result: IState): Ipipe {
    pipeList.push({ type, path, result });
    return actions.pipe;
  }

  const Provider = createProvider(setProvider, context.Provider, initialState);
  const connect = createConnect(context.Consumer);

  return {
    Provider,
    connect,
    ...actions,
  };
};
