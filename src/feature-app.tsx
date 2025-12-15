import type { FeatureAppDefinition, FeatureServices } from '@feature-hub/core';
import type { ReactFeatureApp } from '@feature-hub/react';
import App from './App';
import type { FeatureAppConfig } from '.';
import { GLOBAL_STATE_SERVICE_ID } from './services/globalStateService';

const featureAppDefinition: FeatureAppDefinition<
  ReactFeatureApp,
  FeatureServices,
  FeatureAppConfig
> = {
  dependencies: {
    featureServices: {
      [GLOBAL_STATE_SERVICE_ID]: '^1.0.0',
    },
  },
  create: (env) => {
    const { promise: loadingPromise, resolve, reject } = Promise.withResolvers<void>();
    return {
      loadingPromise: loadingPromise,
      render() {
        return <App env={env} done={resolve} reject={reject} />;
      },
    };
  },
};

export default featureAppDefinition;
