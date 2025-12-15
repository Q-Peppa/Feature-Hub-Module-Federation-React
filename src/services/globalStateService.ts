export const GLOBAL_STATE_SERVICE_ID = 'demo:global-state-service';

type Listener = (state: InitialStateType) => void;
export type InitialStateType = { sharedCount: number };
export type GlobalStateServiceType = {
  getState: () => InitialStateType;
  setState: (next: InitialStateType) => void;
  update: (fn: (s: InitialStateType) => InitialStateType) => void;
  subscribe: (listener: Listener) => () => void;
};
export function createGlobalStateService(
  initialState: InitialStateType = { sharedCount: 0 }
): GlobalStateServiceType {
  let state = initialState;
  const listeners = new Set<Listener>();

  return {
    getState() {
      return state;
    },
    setState(next: InitialStateType) {
      state = next;
      listeners.forEach((l) => l(state));
    },
    update(fn: (s: InitialStateType) => InitialStateType) {
      state = fn(state);
      listeners.forEach((l) => l(state));
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
