import { Actions, IState } from "../index";

type InitializedMiddlewares = (type: Actions, payload: any, state: any) => void;

type Devtools = (initialState: IState, self: any) => InitializedMiddlewares;

let id = 0;

export const devtoolsCreator: Devtools = (initialState, self) => {
  // @ts-ignore
  const reduxDevTools = window.devToolsExtension;

  const instanceID = id;
  id += 1;

  const name = `MagicStore - ${instanceID}`;
  const features = {
    jump: true
  };

  const devTools = reduxDevTools.connect({ name, features });

  interface IData {
    type: string;
    payload: any;
    state: any;
  }

  devTools.subscribe((data: IData) => {
    switch (data.type) {
      case "START":
        devTools.init(initialState);
        break;
      case "RESET":
        self.setState(initialState);
        break;
      case "DISPATCH":
        switch (data.payload.type) {
          case "JUMP_TO_STATE":
          case "JUMP_TO_ACTION": {
            self.setState(JSON.parse(data.state));
            break;
          }
          default:
            break;
        }
        break;
      default:
        break;
    }
  });

  return (type, payload, state) => {
    devTools.send({ type, ...payload }, state, {}, instanceID);
  };
};
