import { connect, actions, IState, ITodo } from '../store';
import { List } from '../components/List';
import { keys, filter } from 'ramda';
import { IActionsChain } from '../MagicStore';

export const ConList = connect(selState => ({
  editingUid: selState`editingUid`,
  isAllChecked: keys(selState`todos`).every(
    (uid: string) => selState`todos.${uid}.completed`
  ),
  todosUids: keys(
    filter((todo: ITodo) => {
      switch (selState`filter`) {
        case 'completed':
          return todo.completed;
        case 'active':
          return !todo.completed;
        default:
          return true;
      }
    }, selState`todos`)
  ),
  toggleAllChanged: () => {
    const uidList: string[] = keys<ITodo>(selState`todos`);

    const setCompleted = (act: any, uid: string): IActionsChain<IState> => {
      const { set } = act;
      return set`todos.${uid}.complete`(true);
    };

    const chain: IActionsChain<IState> = uidList.reduce(setCompleted, actions);

    chain.run();
  },
}))(List);
