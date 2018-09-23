import { connect } from '../store';
import { App } from '../components/App';
import { getCounts } from '../helpers/getCounts';

export const ConApp = connect(selState => ({
  counts: getCounts(selState`todos`),
}))(App);
