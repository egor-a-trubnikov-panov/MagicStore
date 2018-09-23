import * as React from 'react';

interface INewTodo {
  title: string;
  titleChanged: (title: string) => void;
  submitted: () => void;
}

export const NewTodo: React.SFC<INewTodo> = ({
  title,
  titleChanged,
  submitted,
}) => {
  const handleSubmit = e => {
    e.preventDefault();
    submitted();
  };
  const handleChange = e => titleChanged(e.target.value);
  return (
    <form id="todo-form" onSubmit={handleSubmit}>
      <input
        className="new-todo"
        autoComplete="off"
        placeholder="What needs to be done?"
        value={title || ''}
        onChange={handleChange}
      />
    </form>
  );
};
