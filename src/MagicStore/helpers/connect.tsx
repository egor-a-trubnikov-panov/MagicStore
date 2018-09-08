import * as React from "react";
import { Prevent } from "../Components/Prevent";
import { State } from "../index";
import { sel, ISellector } from "./sellector";

type MapStateToProps = (
  sellector: (state: State) => ISellector,
  state: State
) => State;

export type Connect = (
  mapStateToProps: MapStateToProps,
  actionMap?: { [key: string]: (props: any) => any }
) => (WrappedComponent: React.ComponentType<{}>) => React.ComponentType<{}>;

type Consumer = React.ComponentType<{
  children: (state: State | void) => React.ReactNode;
}>;

export type CreateConnect = (consumer: Consumer) => Connect;

export const createConnect: CreateConnect = Consumer => (
  mapStateToProps: MapStateToProps,
  actionMap = {}
) => WrappedComponent => {
  const renderComponent: React.SFC = props => <WrappedComponent {...props} />;
  const ConnectedComponent: React.SFC = props => (
    <Consumer>
      {(state: State = {}) => {
        const filteredState = {
          ...mapStateToProps(sel(state), state),
          ...actionMap
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
    "Unknown"})`;

  return ConnectedComponent;
};
