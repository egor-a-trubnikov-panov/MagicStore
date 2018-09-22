import { createStore } from './MagicStore/index';

export interface IState {
  count: number;
  other: number;
  [key: string]: any;
}

const store = createStore<IState>({
  count: 0,
  other: 5,
});

export const { Provider, connect, ...actions } = store;
