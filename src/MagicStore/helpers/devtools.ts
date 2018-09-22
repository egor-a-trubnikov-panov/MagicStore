import { Actions } from '../index';

type InitializedMiddlewares = (type: Actions, payload: any, state: any) => void;

let id = 0;

export const devtoolsCreator = <IState>(
  initialState: IState,
  self: any
): InitializedMiddlewares => {
  // @ts-ignore
  const reduxDevTools = window.devToolsExtension;

  const instanceID = id;
  id += 1;

  const name = `MagicStore - ${instanceID}`;
  const features = {
    jump: true,
  };

  const devTools = reduxDevTools.connect({ name, features });

  interface IData {
    type: string;
    payload: any;
    state: any;
  }

  function dispatch(data) {
    switch (data.payload.type) {
      case 'JUMP_TO_STATE':
      case 'JUMP_TO_ACTION': {
        self.setState(JSON.parse(data.state));
        break;
      }
      default:
        break;
    }
  }

  devTools.subscribe(
    (data: IData): void => {
      switch (data.type) {
        case 'START':
          devTools.init(initialState);
          break;
        case 'RESET':
          self.setState(initialState);
          break;
        case 'DISPATCH':
          dispatch(data);
          break;
      }
    }
  );

  return (type, payload, state) => {
    devTools.send({ type, ...payload }, state, {}, instanceID);
  };
};
