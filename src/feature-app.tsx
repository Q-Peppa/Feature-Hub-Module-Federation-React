import type { FeatureAppDefinition, FeatureServices } from '@feature-hub/core';
import type { ReactFeatureApp } from '@feature-hub/react';
import App from './App';
import type { FeatureAppConfig } from '.';

const featureAppDefinition: FeatureAppDefinition<
  ReactFeatureApp,
  FeatureServices,
  FeatureAppConfig
> = {
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
