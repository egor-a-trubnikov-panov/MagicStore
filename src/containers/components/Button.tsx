import * as React from "react";
interface IButtonProps {
  count: number;
  increment: () => any;
}

export const Button: React.SFC<IButtonProps> = props => (
  <button onClick={props.increment}>кнопка {props.count}</button>
);
