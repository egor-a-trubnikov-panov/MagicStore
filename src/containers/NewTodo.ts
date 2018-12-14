import { connect, actions, select } from '../store';
import { NewTodo } from '../components/NewTodo';
import * as uuid from 'uuid';

export const ConNewTodo = connect(props => {
  console.log(select`newTodoTitle`);
  return {
    title: select`newTodoTitle`,
    titleChanged: (title: string) => {
      actions.set`newTodoTitle`(title).run();
    },
    submitted: () => {
      const uid = uuid.v4();
      actions
        .set`todos.${uid}.title`(select`newTodoTitle`)
        .set`todos.${uid}.completed`(false)
        .set`newTodoTitle`('')
        .run();
    },
  }
})(NewTodo);
