import * as React from 'react';
import { default as classnames } from 'classnames';

interface ITodo {
  uid: string;
  isEditing: boolean;
  todo: {
    completed: boolean;
    title: string;
    editedTitle: string;
  };
  todoDoubleClicked: (uid: string) => void;
  newTitleChanged: ({ uid, title }) => void;
  newTitleSubmitted: (uid: string) => void;
  toggleCompletedChanged: (uid: string) => void;
  removeTodoClicked: (uid: string) => void;
}

export const Todo: React.SFC<ITodo> = ({
  uid,
  isEditing,
  todo,
  todoDoubleClicked,
  newTitleChanged,
  newTitleSubmitted,
  toggleCompletedChanged,
  removeTodoClicked,
}) => {
  const handleCheck = () => toggleCompletedChanged(uid);
  const handleChange = e => newTitleChanged({ uid, title: e.target.value });
  const handleDoubleClick = () => todoDoubleClicked(uid);
  const handleClick = () => removeTodoClicked(uid);
  const handleBlur = () => newTitleSubmitted(uid);
  const handleSubmit = e => {
    e.preventDefault();
    newTitleSubmitted(uid);
  };

  return (
    <li
      className={classnames({
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          onChange={handleCheck}
          checked={todo.completed}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={handleClick} />
      </div>
      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            autoFocus={true}
            className="edit"
            value={isEditing ? todo.editedTitle : todo.title}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </form>
      )}
    </li>
  );
};
