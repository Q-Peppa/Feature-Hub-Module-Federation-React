import type { FeatureAppEnvironment, FeatureServices } from '@feature-hub/core';
import * as React from 'react';
import type { FeatureAppConfig } from '.';
import { useEffect } from 'react';
import type { GlobalStateServiceType, InitialStateType } from './services/globalStateService';
import { GLOBAL_STATE_SERVICE_ID } from './services/globalStateService';

interface AppProps {
  env?: FeatureAppEnvironment<FeatureServices, FeatureAppConfig>;
  done?: (value: void) => void;
  reject?: (err: Error) => void;
}

export default function App({ env, done, reject }: AppProps) {
  const [count, setCount] = React.useState(0);
  const service = env?.featureServices[GLOBAL_STATE_SERVICE_ID] as GlobalStateServiceType;
  const [sharedState, setSharedState] = React.useState<InitialStateType>(service?.getState);

  useEffect(() => {
    setTimeout(() => {
      const num = Math.random();
      if (num < 0.8) {
        done?.();
      } else {
        reject?.(new Error('Simulated load failure in remote feature app'));
      }
    }, 2000);
  }, [done, reject]);

  useEffect(() => {
    if (service) {
      const unsubscribe = service.subscribe((newState) => {
        setSharedState(newState);
      });
      return () => {
        unsubscribe();
      };
    }
    return undefined;
  }, [service]);

  return (
    <div style={{ padding: 16, border: '2px solid blue', margin: 8 }}>
      <h2>Remote Feature</h2>
      <p>这是一个远程 React Feature App，通过 Module Federation 加载</p>
      <div style={{ marginTop: 16 }}>
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Shared Global State (from Feature Hub service)</h3>
        <div>Shared: {sharedState ? JSON.stringify(sharedState) : 'not available'}</div>
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => {
              service?.update((s) => ({ sharedCount: (s.sharedCount || 0) + 1 }));
            }}
          >
            Increment Shared
          </button>
        </div>
      </div>
      {env && (
        <details style={{ marginTop: 16 }}>
          <summary>Feature Hub Environment</summary>
          <pre style={{ fontSize: 12, overflow: 'auto' }}>{JSON.stringify(env, null, 2)}</pre>
        </details>
      )}
    </div>
  );
}
