import * as React from 'react';
import { Prevent } from '../Components/Prevent';
import { sel, ISellector } from './sellector';

interface IMapPropsResult<IState> {
  [key: string]: any;
}

type MapStateAndPropsToProps<IState> = (
  selectorFromState: ISellector,
  selectorFromProps: ISellector
) => IMapPropsResult<IState>;

export type Connect<IState> = (
  mapStateAndPropsToProps: MapStateAndPropsToProps<IState>
) => (WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>;

type TConsumer<IState> = React.ComponentType<{
  children: (state: IState | void) => React.ReactNode;
}>;

export function createConnect<IState>(Consumer: TConsumer<IState>) {
  return (
    mapStateAndPropsToProps: MapStateAndPropsToProps<IState>
  ) => WrappedComponent => {
    const renderComponent: React.SFC = props => <WrappedComponent {...props} />;
    const ConnectedComponent: React.SFC = props => (
      <Consumer>
        {(state: IState) => {
          return (
            <Prevent
              renderComponent={renderComponent}
              {...props}
              {...mapStateAndPropsToProps(sel(state), sel(props))}
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
