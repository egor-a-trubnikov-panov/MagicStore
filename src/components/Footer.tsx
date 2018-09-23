import * as React from 'react';
import { default as classnames } from 'classnames';
import { ICounts } from '../interfaces';

const filters: string[] = ['All', 'Active', 'Completed'];

interface IFooter {
  filter: string;
  counts: ICounts;
  filterClicked: (filter: string) => void;
  clearCompletedClicked: () => void;
}

export const Footer: React.SFC<IFooter> = ({
  filter,
  counts,
  filterClicked,
  clearCompletedClicked,
}) => {
  const renderFilter = (filterName: string) => {
    const handleClick = () => filterClicked(filterName.toLowerCase());
    return (
      <li key={filterName}>
        <a
          onClick={handleClick}
          className={classnames({
            selected: filter === filterName.toLowerCase(),
          })}
        >
          {filterName}
        </a>
      </li>
    );
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>
          {counts.remaining} {counts.remaining === 1 ? 'item' : 'items'} left
        </strong>
      </span>
      <ul className="filters">{filters.map(renderFilter)}</ul>
      {!!counts.completed && (
        <button className="clear-completed" onClick={clearCompletedClicked}>
          Clear completed ({counts.completed})
        </button>
      )}
    </footer>
  );
};
