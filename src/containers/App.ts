import { connect, select } from '../store';
import { App } from '../components/App';
import { getCounts } from '../helpers/getCounts';

export const ConApp = connect(props => ({
  counts: getCounts(select`todos`),
}))(App);
