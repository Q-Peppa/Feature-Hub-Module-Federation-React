import { createRoot } from 'react-dom/client';
import type { Logger } from '@feature-hub/core';
import { createFeatureHub } from '@feature-hub/core';
import { FeatureHubContextProvider, FeatureAppLoader } from '@feature-hub/react';
import { loadFederatedModule } from '@feature-hub/module-loader-federation';
import { Activity } from 'react';
import { createGlobalStateService, GLOBAL_STATE_SERVICE_ID } from './services/globalStateService';
function noop() {}
const emptyLogger: Logger = {
  info: noop,
  warn: noop,
  error: noop,
  trace: noop,
  debug: noop,
};
export type FeatureAppConfig = {
  foo: string;
};
// Create the Feature Hub and configure it to use the federation loader.
const { featureAppManager } = createFeatureHub('demo:integrator', {
  moduleLoader: loadFederatedModule,
  logger: emptyLogger,
  featureServiceDefinitions: [
    {
      id: GLOBAL_STATE_SERVICE_ID,
      create() {
        const ans = () => ({ featureService: createGlobalStateService({ sharedCount: 10000 }) });
        return {
          '1.0.0': ans,
        };
      },
    },
  ],
});

function App() {
  return (
    <FeatureHubContextProvider value={{ featureAppManager }}>
      <div style={{ padding: 16, border: '2px solid gray' }}>
        <h1>Integrator (Vite + Feature Hub)</h1>
        <FeatureAppLoader<FeatureAppConfig>
          featureAppId="demo:remote1"
          featureAppName={'Remote1FeatureApp'}
          src={'/feature-app.bundle.js'}
          onError={console.error}
          config={{
            foo: 'bar', // ok
          }}
        >
          {({ featureAppNode, loading, error }) => {
            if (error) {
              return (
                <div style={{ background: '#ffcccc' }}>
                  <h2>Error loading remote feature app:</h2>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <pre>{(error as any).message}</pre>
                </div>
              );
            }

            return (
              <>
                <Activity mode={loading ? 'visible' : 'hidden'}>
                  <h2>Loading remote feature app...</h2>
                </Activity>
                <div
                  style={{
                    display: loading ? 'none' : 'block',
                  }}
                >
                  {featureAppNode}
                </div>
              </>
            );
          }}
        </FeatureAppLoader>
      </div>
    </FeatureHubContextProvider>
  );
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element not found');
}
const root = createRoot(rootEl);
root.render(<App />);
