import * as React from 'react';

interface INewTodo {
  title: string;
  titleChanged: (title: string) => void;
  submitted: () => void;
}

export class NewTodo extends React.PureComponent<INewTodo> {
  public render() {
    const { title } = this.props;
    return (
      <form id="todo-form" onSubmit={this.handleSubmit}>
        <input
          className="new-todo"
          autoComplete="off"
          placeholder="What needs to be done?"
          value={title || ''}
          onChange={this.handleChange}
        />
      </form>
    );
  }

  private handleSubmit = e => {
    e.preventDefault();
    this.props.submitted();
  };

  private handleChange = e => this.props.titleChanged(e.target.value);
}
