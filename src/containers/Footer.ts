import { connect, actions, select } from '../store';
import { Footer } from '../components/Footer';
import { getCounts } from '../helpers/getCounts';

export const ConFooter = connect(props => ({
  filter: select`filter`,
  counts: getCounts(select`todos`),
  filterClicked: (filterName: string) => {
    actions.set`filter`(filterName).run();
  },
  clearCompletedClicked: () => {
    actions
      .set`todos`(select`todos(completed = true)`)
      .run();
  },
}))(Footer);
