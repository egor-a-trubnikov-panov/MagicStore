import { createStore } from "./MagicStore/index";

const store = createStore({
  count: 0,
  other: 5
});

export const { Provider, connect, set, inc, nullify } = store;
