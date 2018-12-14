import { connect, actions, IState, ITodo, select } from '../store';
import { List } from '../components/List';
import { keys, filter } from 'ramda';
import { IActionsChain } from '../MagicStore';

export const ConList = connect(props => ({
  editingUid: select`editingUid`,
  isAllChecked: keys(select`todos`).every(
    (uid: string) => select`todos.${uid}.completed`,
  ),
  todosUids: keys(
    filter((todo: ITodo) => {
      switch (select`filter`) {
        case 'completed':
          return todo.completed;
        case 'active':
          return !todo.completed;
        default:
          return true;
      }
    }, select`todos`),
  ),
  toggleAllChanged: () => {
    const uidList: string[] = keys<ITodo>(select`todos`);

    const setCompleted = (act: any, uid: string): IActionsChain<IState> => {
      const { set } = act;
      return set`todos.${uid}.complete`(true);
    };

    const chain: IActionsChain<IState> = uidList.reduce(setCompleted, actions);

    chain.run();
  },
}))(List);
