import type { FeatureAppEnvironment, FeatureServices } from '@feature-hub/core';
import * as React from 'react';
import type { FeatureAppConfig } from '.';
import { useEffect } from 'react';

interface AppProps {
  env?: FeatureAppEnvironment<FeatureServices, FeatureAppConfig>;
  done?: (value: void) => void;
  reject?: (err: Error) => void;
}

export default function App({ env, done, reject }: AppProps) {
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    setTimeout(() => {
      const num = Math.random();
      if (num < 0.5) {
        done?.();
      } else {
        reject?.(new Error('Simulated load failure in remote feature app'));
      }
    }, 2000);
  }, [done, reject]);

  return (
    <div style={{ padding: 16, border: '2px solid blue', margin: 8 }}>
      <h2>Remote Feature</h2>
      <p>这是一个远程 React Feature App，通过 Module Federation 加载</p>
      <div style={{ marginTop: 16 }}>
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
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
