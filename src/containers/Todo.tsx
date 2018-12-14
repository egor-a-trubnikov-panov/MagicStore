import { connect, actions, select } from '../store';
import { Todo } from '../components/Todo';

export const ConTodo = connect((props) => ({
  todo: select`todos.${props.uid}`,
  todoDoubleClicked: (uid: string) => {
    actions
      .set`todos.${uid}.editedTitle`(select`todos.${uid}.title`)
      .set`editingUid`(uid)
      .run();
  },
  newTitleChanged: ({ uid, title }) => {
    actions
      .set`todos.${uid}.editedTitle`(title)
      .run();
  },
  newTitleSubmitted: (uid: string) => {
    if (select`todos.${uid}.editedTitle`) {
      actions
        .set`todos.${uid}.title`(select`todos.${uid}.editedTitle`)
        .set`todos.${uid}.editedTitle`('')
        .set`editingUid`(null)
        .run();
    }
  },
  toggleCompletedChanged: (uid: string) => {
    actions.toggle`todos.${uid}.completed`.run();
  },
  removeTodoClicked: (uid: string) => {
    actions.remove`todos.${uid}`.run();
  },
}))(Todo);
