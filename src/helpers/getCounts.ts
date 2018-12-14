import { keys } from 'ramda';
import { ITodo, ITodoList, select } from '../store';
import { ICounts } from '../interfaces';

export const getCounts = (todos: ITodoList): ICounts => ({
  visible: keys(todos).length,
  total: keys(todos).length,
  completed: select<ITodo[]>`todos(completed = true)`.length,
  remaining: select<ITodo[]>`todos(completed = false)`.length,
});
