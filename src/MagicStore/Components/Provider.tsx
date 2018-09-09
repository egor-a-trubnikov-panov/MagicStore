import * as React from 'react';
import { IState } from '../index';

interface IProps {
  children: React.ReactNode;
  initialState: {};
}

type CreateProvider = (
  setProvider: (prop: any) => any,
  Provider: React.ComponentType<any>,
  initialState: IState
) => React.ComponentType<any>;

export const createProvider: CreateProvider = (
  setProvider,
  Provider,
  initialState
) =>
  class EnhancedProvider extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      this.state = props.initialState || initialState;
      setProvider(this);
    }

    public render() {
      return <Provider value={this.state}>{this.props.children}</Provider>;
    }
  };
