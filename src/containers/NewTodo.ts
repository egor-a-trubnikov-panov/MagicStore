import { connect, actions } from '../store';
import { NewTodo } from '../components/NewTodo';
import * as uuid from 'uuid';

export const ConNewTodo = connect(selState => ({
  title: selState`newTodoTitle`,

  titleChanged: (title: string) => {
    actions.set`newTodoTitle`(title).run();
  },
  submitted: () => {
    const uid = uuid.v4();
    actions.set`todos.${uid}.title`(selState`newTodoTitle`)
      .set`todos.${uid}.completed`(false).set`newTodoTitle`('').run();
  },
}))(NewTodo);
