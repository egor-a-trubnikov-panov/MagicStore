import * as React from "react";

type Props = {
  renderComponent: ({}) => React.ReactNode;
};

export class Prevent extends React.PureComponent<Props> {
  render() {
    const { renderComponent, ...rest } = this.props;
    return renderComponent(rest);
  }
}
