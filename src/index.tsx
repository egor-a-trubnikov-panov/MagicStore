import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from './store';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import { ConApp } from './containers/App';

render(
  <Provider>
    <ConApp />
  </Provider>,
  document.getElementById('root')
);
