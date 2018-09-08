import * as React from "react";
import { State } from "../index";

type Props = { children: React.ReactNode; initialState: {} };

type CreateProvider = (
  setProvider: (prop: any) => any,
  Provider: React.ComponentType<any>,
  initialState: State
) => React.ComponentType<any>;

export const createProvider: CreateProvider = (
  setProvider,
  Provider,
  initialState
) =>
  class EnhancedProvider extends React.PureComponent<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = props.initialState || initialState;
      setProvider(this);
    }

    render() {
      return <Provider value={this.state}>{this.props.children}</Provider>;
    }
  };
