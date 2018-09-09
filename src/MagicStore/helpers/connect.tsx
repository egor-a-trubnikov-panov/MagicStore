import * as React from 'react';
import { Prevent } from '../Components/Prevent';
import { IState } from '../index';
import { sel, ISellector } from './sellector';

type MapStateToProps = (
  sellector: (state: IState) => ISellector,
  state: IState
) => IState;

export type Connect = (
  mapStateToProps: MapStateToProps,
  actionMap?: { [key: string]: (props: any) => any }
) => (WrappedComponent: React.ComponentType<{}>) => React.ComponentType<{}>;

type TConsumer = React.ComponentType<{
  children: (state: IState | void) => React.ReactNode;
}>;

export type CreateConnect = (consumer: TConsumer) => Connect;

export const createConnect: CreateConnect = Consumer => (
  mapStateToProps: MapStateToProps,
  actionMap = {}
) => WrappedComponent => {
  const renderComponent: React.SFC = props => <WrappedComponent {...props} />;
  const ConnectedComponent: React.SFC = props => (
    <Consumer>
      {(state: IState = {}) => {
        const filteredState = {
          ...mapStateToProps(sel(state), state),
          ...actionMap,
        };
        return (
          <Prevent
            renderComponent={renderComponent}
            {...props}
            {...filteredState}
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
