import { connect, actions, ITodo } from '../store';
import { Footer } from '../components/Footer';
import { filter } from 'ramda';
import { getCounts } from '../helpers/getCounts';

export const ConFooter = connect(selState => ({
  filter: selState`filter`,
  counts: getCounts(selState`todos`),
  filterClicked: (filterName: string) => {
    actions.set`filter`(filterName).run();
  },
  clearCompletedClicked: () => {
    actions.set`todos`(
      filter((todo: ITodo) => !todo.completed)(selState`todos`)
    ).run();
  },
}))(Footer);
