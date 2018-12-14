import * as React from 'react';
import { ConTodo } from '../containers/Todo';

interface IList {
  editingUid: string;
  isAllChecked: boolean;
  todosUids: string[];
  toggleAllChanged: () => {};
}

export const List: React.FunctionComponent<IList> = ({
  editingUid,
  isAllChecked,
  todosUids,
  toggleAllChanged,
}) => {
  const renderTodo = (todoUid: string) => (
    <ConTodo key={todoUid} uid={todoUid} isEditing={todoUid === editingUid} />
  );

  return (
    <section className="main">
      <input
        className="toggle-all"
        type="checkbox"
        checked={isAllChecked}
        onChange={toggleAllChanged}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">{todosUids.map(renderTodo)}</ul>
    </section>
  );
};
