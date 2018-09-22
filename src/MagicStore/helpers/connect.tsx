import * as React from 'react';
import { Prevent } from '../Components/Prevent';
import { sel, ISellector } from './sellector';

type MapStateToProps<IState> = (
  sellector: ISellector,
  state: IState
) => { [key: string]: ISellector };

export type Connect<IState> = (
  mapStateToProps: MapStateToProps<IState>,
  mapActionsToProps?: { [key: string]: (props: any) => any }
) => (WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>;

type TConsumer<IState> = React.ComponentType<{
  children: (state: IState | void) => React.ReactNode;
}>;

export function createConnect<IState>(Consumer: TConsumer<IState>) {
  return (
    mapStateToProps: MapStateToProps<IState>,
    actionMap = {}
  ) => WrappedComponent => {
    const renderComponent: React.SFC = props => <WrappedComponent {...props} />;
    const ConnectedComponent: React.SFC = props => (
      <Consumer>
        {(state: IState) => {
          const filteredState = {
            // @ts-ignore
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
}
