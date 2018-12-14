import * as React from 'react';

interface IMapPropsResult {
  [key: string]: any;
}

type Selectors = (props: any) => IMapPropsResult;

export type Connect = (mapProps: Selectors) => (WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>;

export function createConnect(Consumer) {
  return (
    mapProps: Selectors,
  ) => WrappedComponent => {
    const RenderComponent: React.FunctionComponent = props => <WrappedComponent {...props} />;
    const ConnectedComponent: React.FunctionComponent = props => (
      <Consumer>
        {() => {
          return (
            <RenderComponent
              {...props}
              {...mapProps(props)}
            />
          );
        }}
      </Consumer>
    );

    ConnectedComponent.displayName = `Connect(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Unknown'})`;

    return ConnectedComponent;
  };
}
