import * as React from 'react';
import { render } from 'react-dom';
import Hello from './components/Hello';
import { ButtonCont } from './containers/ButtonCont';
import { TitleCont } from './containers/TitleCont';
import { Provider } from './store';

const App: React.SFC<any> = () => {
  return (
    <Provider>
      <Hello name="MagicStore" />
      <TitleCont />
      <ButtonCont />
    </Provider>
  );
};

render(<App />, document.getElementById('root'));
