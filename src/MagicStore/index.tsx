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

type StoreMutator = (path: string[]) => any;

type TSetStateWrapper = (type: string, result: State, path: string[]) => void;

const defaultMiddlewares =
  process.env.NODE_ENV === "development" &&
  typeof window !== "undefined" &&
  // @ts-ignore
  window.devToolsExtension
    ? [devtoolsCreator]
    : [];

interface ICreatedFuncs extends IActions {
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

  const setStateWrapper: TSetStateWrapper = (type, result, path) => {
    state = { ...state, ...result };
    const newState = { ...state, ...result };

    const runMidleware = (middleware: any) =>
      middleware(type, { result, path }, newState);

    providerValue.setState(state, () => {
      providerValue.initializedMiddlewares.forEach(runMidleware);
    });
    return state;
  };

  function toPath(mutator: StoreMutator) {
    return (templateData: TemplateStringsArray, ...args: any[]) =>
      mutator(getPathFromTemplateString(templateData, ...args));
  }

  const wrappAction = (type: string, path: string[], result: State) => {
    if (!providerValue) {
      console.error("<Provider /> is not initialized yet");
      return;
    }
    return result.then
      ? result.then((result: any) => setStateWrapper(type, result, path))
      : setStateWrapper(type, result, path);
  };

  function actionResult(actionName: Actions): any {
    switch (actionName) {
      case "nullify":
        return (path: string[]) =>
          wrappAction("nullify", path, PF.setTo(path, null, state));
      case "concat":
        return (path: string[]) => (list: any[]) =>
          wrappAction(
            "concat",
            path,
            PF.overTo(path, PF.flip(PF.concat)(list), state)
          );
      case "extend":
        return (path: string[]) => (object: object) =>
          wrappAction("extend", path, PF.overTo(path, PF.merge(object), state));
      case "toggle":
        return (path: string[]) =>
          wrappAction("toggle", path, PF.overTo(path, PF.not, state));
      case "set":
        return (path: string[]) => (value: any) =>
          wrappAction("set", path, PF.setTo(path, value, state));
      case "inc":
        return (path: string[]) =>
          wrappAction("inc", path, PF.overTo(path, PF.inc, state));
      case "dec":
        return (path: string[]) =>
          wrappAction("dec", path, PF.overTo(path, PF.dec, state));
    }
  }

  function action(actionName: Actions) {
    return toPath(actionResult(actionName));
  }

  const actions: IActions = {
    nullify: action("nullify"),
    concat: action("concat"),
    extend: action("extend"),
    toggle: action("toggle"),
    set: action("set"),
    inc: action("inc"),
    dec: action("dec")
  };

  const Provider = createProvider(setProvider, context.Provider, initialState);
  const connect = createConnect(context.Consumer);

  return {
    Provider,
    connect,
    ...actions
  };
};
