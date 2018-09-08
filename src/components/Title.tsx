import * as React from "react";
interface ITitleProps {
  text: string;
  count: number;
  other: number;
}
export const Title: React.SFC<ITitleProps> = props => {
  console.log("render");
  return (
    <h2>
      {props.text} {props.count} {props.other}
    </h2>
  );
};
