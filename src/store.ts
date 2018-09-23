import { createStore } from './MagicStore/index';
export interface ITodo {
  title: string;
  completed: boolean;
}

export interface ITodoList {
 [uid: string]: ITodo
}

export interface IState {
  newTodoTitle: string;
  todos: ITodoList;
  filter: string;
  editingUid: string;
}

const store = createStore<IState>({
  newTodoTitle: '',
  todos: {},
  filter: 'all',
  editingUid: '',
});

export const { Provider, connect, ...actions } = store;
