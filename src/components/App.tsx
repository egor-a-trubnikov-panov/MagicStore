import * as React from 'react';
import { ConNewTodo } from '../containers/NewTodo';
import { ConList } from '../containers/List';
import { ConFooter } from '../containers/Footer';
import { ICounts } from '../interfaces';

interface IApp {
  counts: ICounts;
}

export const App: React.SFC<IApp> = ({ counts }) => (
  <div id="todoapp-wrapper">
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <ConNewTodo />
      </header>

      {Boolean(counts.visible) && <ConList />}
      {Boolean(counts.total) && <ConFooter />}
    </section>
    <footer className="info">
      <p>Double-click to edit a todo</p>
      <p>
        Credits:
        <a href="http://chaos.com">Egor Trubnikov-Panov</a>,
      </p>
      <p>
        Part of <a href="http://todomvc.com">TodoMVC</a>
      </p>
    </footer>
  </div>
);
