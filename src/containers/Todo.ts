import { connect, actions } from '../store';
import { Todo } from '../components/Todo';

export const ConTodo = connect((selState, selProp) => ({
  todo: selState`todos.${selProp`uid`}`,
  todoDoubleClicked: (uid: string) => {
    actions.set`todos.${uid}.editedTitle`(selState`todos.${uid}.title`)
      .set`editingUid`(uid).run();
  },
  newTitleChanged: ({ uid, title }) => {
    actions.set`todos.${uid}.editedTitle`(title).run();
  },
  newTitleSubmitted: (uid: string) => {
    if (selState`todos.${uid}.editedTitle`) {
      actions.set`todos.${uid}.title`(selState`todos.${uid}.editedTitle`)
        .set`todos.${uid}.editedTitle`('').nullify`editingUid`.run();
    }
  },
  toggleCompletedChanged: (uid: string) => {
    actions.toggle`todos.${uid}.completed`.run();
  },
  removeTodoClicked: (uid: string) => {
    actions.remove`todos.${uid}`.run();
  },
}))(Todo);
