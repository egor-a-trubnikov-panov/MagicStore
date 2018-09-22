import * as React from 'react';

interface IProps {
  children: React.ReactNode;
  initialState: {};
}

type AnyFunc = (prop: any) => any;

export const createProvider = (
  setProvider: AnyFunc,
  Provider: React.ComponentType<any>,
  initialState: any
): React.ComponentType<any> =>
  class EnhancedProvider extends React.PureComponent<IProps, any> {
    constructor(props: IProps) {
      super(props);
      this.state = props.initialState || initialState;
      setProvider(this);
    }

    public render() {
      return <Provider value={this.state}>{this.props.children}</Provider>;
    }
  };
