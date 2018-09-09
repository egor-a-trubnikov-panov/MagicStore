import * as React from "react";

import { createProvider } from "./Components/Provider";
import { Connect, createConnect } from "./helpers/connect";
import { devtoolsCreator } from "./helpers/devtools";
import { getPathFromTemplateString } from "./helpers/templateStringParser";
import { PF } from "../pureFunctions";

export type State = { [key: string]: any };

type TSetState = (
  state: (prevState: any, props: any) => any,
  callback?: () => void
) => void;

interface IProviderValue {
  setState: TSetState;
  initializedMiddlewares: any[];
}

export type Actions =
  | "nullify"
  | "concat"
  | "extend"
  | "toggle"
  | "set"
  | "inc"
  | "dec";

export interface IActions {
  nullify: (path: TemplateStringsArray, ...args: any[]) => void;
  concat: (path: TemplateStringsArray, ...args: any[]) => (list: any[]) => void;
  extend: (
    path: TemplateStringsArray,
    ...args: any[]
  ) => (object: object) => void;
  toggle: (path: TemplateStringsArray, ...args: any[]) => void;
  set: (path: TemplateStringsArray, ...args: any[]) => (value: any) => void;
  inc: (path: TemplateStringsArray, ...args: any[]) => void;
  dec: (path: TemplateStringsArray, ...args: any[]) => void;
}
interface Ipipe extends IActions {
  run: () => State;
}

export interface IActionsAndPipe extends IActions {
  pipe: Ipipe;
}

type StoreMutator = (path: string[]) => any;

type TMutateState = (type: string, path: string[], result: State) => any;

const defaultMiddlewares =
  process.env.NODE_ENV === "development" &&
  typeof window !== "undefined" &&
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

    const setState: TSetState = (state, callback) =>
      self.setState(state, callback);

    providerValue = {
      setState,
      initializedMiddlewares
    };
  };

  let state = initialState;

  const setStateWrapper: TMutateState = (type, path, result) => {
    if (!providerValue) {
      console.error("<Provider /> is not initialized yet");
      return;
    }

    state = { ...state, ...result };
    const newState = { ...state, ...result };

    const runMidleware = (middleware: any) =>
      middleware(type, { result, path }, newState);

    providerValue.setState(state, () => {
      providerValue.initializedMiddlewares.forEach(runMidleware);
    });
    return state;
  };

  const pipeSetStateWrapper: TMutateState = (type, path, result) => {
    if (!providerValue) {
      console.error("<Provider /> is not initialized yet");
      return;
    }

    state = { ...state, ...result };
    const newState = { ...state, ...result };

    const runMidleware = (middleware: any) =>
      middleware(type, { result, path }, newState);
  };

  function toPath(mutator: StoreMutator) {
    return (templateData: TemplateStringsArray, ...args: any[]) =>
      mutator(getPathFromTemplateString(templateData, ...args));
  }

  const resolverConstruct = (stateMutator: TMutateState): TMutateState => (
    type,
    path,
    result
  ) => {
    return result.then
      ? result.then((result: any) => stateMutator(type, path, result))
      : stateMutator(type, path, result);
  };

  const defaultStateMutator: TMutateState = resolverConstruct(setStateWrapper);
  const pipeStateMutator: TMutateState = resolverConstruct(pipeSetStateWrapper);

  const mutators = {
    nullify: (callback: TMutateState) =>
      toPath((path: string[]) =>
        callback("nullify", path, PF.setTo(path, null, state))
      ),
    concat: (callback: TMutateState) =>
      toPath((path: string[]) => (list: any[]) =>
        callback(
          "nullify",
          path,
          PF.overTo(path, PF.flip(PF.concat)(list), state)
        )
      ),
    extend: (callback: TMutateState) =>
      toPath((path: string[]) => (object: object) =>
        callback("nullify", path, PF.overTo(path, PF.merge(object), state))
      ),
    toggle: (callback: TMutateState) =>
      toPath((path: string[]) =>
        callback("nullify", path, PF.overTo(path, PF.not, state))
      ),
    set: (callback: TMutateState) =>
      toPath((path: string[]) => (value: any) =>
        callback("nullify", path, PF.setTo(path, value, state))
      ),
    inc: (callback: TMutateState) =>
      toPath((path: string[]) =>
        callback("nullify", path, PF.overTo(path, PF.inc, state))
      ),
    dec: (callback: TMutateState) =>
      toPath((path: string[]) =>
        callback("nullify", path, PF.overTo(path, PF.dec, state))
      )
  };

  interface PipeListItem {
    type: string;
    path: string[];
    result: State;
  }
  let pipeList: PipeListItem[] = [];

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
        pipeList.forEach((item: PipeListItem) => {
          pipeStateMutator(item.type, item.path, item.result);
        });

        providerValue.setState(state, () => {
          providerValue.initializedMiddlewares.forEach(runMidleware);
        });
        pipeList = [];
        return state;
      }
    }
  };

  function piper(type: string, path: string[], result: State) {
    pipeList.push({ type, path, result });
    return actions.pipe;
  }

  const Provider = createProvider(setProvider, context.Provider, initialState);
  const connect = createConnect(context.Consumer);

  return {
    Provider,
    connect,
    ...actions
  };
};
