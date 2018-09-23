import { filter, keys } from 'ramda';
import { ITodo, ITodoList } from '../store';
import { ICounts } from '../interfaces';

export const getCounts = (todos: ITodoList): ICounts => ({
  visible: keys<ITodoList>(todos).length,
  total: keys<ITodoList>(todos).length,
  completed: keys(filter((todo: ITodo) => todo.completed, todos)).length,
  remaining: keys(filter((todo: ITodo) => !todo.completed, todos)).length,
});
