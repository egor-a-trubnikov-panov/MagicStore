import * as React from "react";

interface IProps {
  name: string;
}

export default ({ name }: IProps) => <h1>Hello {name}!</h1>;
