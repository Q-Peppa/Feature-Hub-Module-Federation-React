# Copilot Instructions for Feature Hub Module Federation Demo

## Project Architecture

This is a **Feature Hub + Webpack Module Federation** demo showcasing micro-frontends. The project demonstrates how to use Feature Hub framework to implement micro-frontend architecture with dynamic module loading.

- **Single-package structure**: Unlike traditional monorepos, this demo uses a simplified single-package setup
- **Webpack Module Federation**: Uses Webpack 5's native Module Federation for bundling and loading remote modules
- **Feature Hub orchestration**: `@feature-hub/core` manages feature app lifecycle, loading, and communication
- **React 19**: Modern React with automatic JSX transform (no React imports needed)

## Critical Patterns

### Feature Hub Integration

- Feature apps are loaded via `FeatureAppLoader` component with explicit `src` URLs pointing to bundled JavaScript files
- Feature Hub context is provided through `FeatureHubContextProvider` wrapping the app with a `featureAppManager`
- Module loader uses `@feature-hub/module-loader-federation` for webpack federation support
- Logger is stubbed out with `emptyLogger` (see [src/index.tsx](src/index.tsx#L8-L14))

### Feature App Definition

Feature apps export a `FeatureAppDefinition<ReactFeatureApp>` with a `create` method that returns an object with a `render` function. The `env` parameter provides Feature Hub environment context including config and services (see [src/feature-app.tsx](src/feature-app.tsx)).

### Module Federation Setup

- **Webpack configuration exports array**: `webpack.config.js` exports two configs - one for remote feature app, one for integrator host
- **Singleton enforcement**: React and React-DOM are configured as `singleton: true` with version `^19.2.0` to prevent multiple instances
- **Remote bundle loading**: Integrator loads `/feature-app.bundle.js` (served by webpack dev server)
- **Development server**: Integrator runs on port 9000 with HMR enabled and CORS headers for cross-origin requests

## Build & Development Workflow

### Package Manager

**Always use pnpm** (v8.11.0). Never use npm or yarn. The project uses `packageManager` field in package.json.

### Key Commands

```bash
pnpm start          # Start development server on http://localhost:9000
pnpm build          # Build for production
pnpm type-check     # Run TypeScript type checking
pnpm lint           # Run ESLint
pnpm lint:fix       # Fix ESLint issues automatically
pnpm format         # Format code with Prettier
pnpm ci             # CI pipeline (lint + format + type-check)
```

### Pre-commit Automation

- **Husky** manages Git hooks with pre-commit validation
- **lint-staged** runs ESLint fix and Prettier on staged files automatically
- Manual formatting: `pnpm format` or `pnpm format:check`

## Code Quality Standards

### TypeScript

- **No tsconfig.json**: TypeScript compilation handled by SWC loader in webpack
- **SWC compilation**: Uses `@swc/loader` with automatic JSX transform and React Fast Refresh in development
- **Type checking**: Run `pnpm type-check` for TypeScript validation

### ESLint (Flat Config)

- Uses ESLint 9+ flat config format in [eslint.config.mjs](eslint.config.mjs)
- Combines TypeScript, React, and React Hooks plugins
- Strict type imports: `prefer: 'type-imports'` for cleaner imports
- Underscore prefix ignores unused vars: `^_` pattern
- `no-undef` disabled (TypeScript handles undefined variables)
- React version set to `19.2.3` in ESLint config

### Prettier

- Single quotes, semicolons, trailing commas for ES5
- 100 character line width, 2 space tabs
- Arrow parens always required

## Webpack Configuration

The project uses **Webpack 5** with **Module Federation**:

### Configuration Structure

1. **Remote Feature App Config** (first in array)
   - Empty entry point (modules exposed via federation)
   - Exposes `featureAppModule` from `./src/feature-app`
   - Outputs `feature-app.bundle.js`
   - Container name: `__feature_hub_feature_app_module_container__`

2. **Integrator Host Config** (second in array)
   - Entry: `./src/index.tsx`
   - Outputs `bundle.js` to `/` public path
   - Dev server on port 9000 with HMR and CORS
   - Consumes remote modules via federation

### Key Implementation Details

- **SWC Loader**: Fast TypeScript/JSX compilation with React Fast Refresh
- **React Refresh**: `@pmmmwh/react-refresh-webpack-plugin` enables HMR for React components
- **Shared modules**: React and React-DOM as singletons (^19.2.0)
- **Development optimizations**: Hot reloading, history API fallback, cross-origin headers

## Project Structure

```
src/
├── index.tsx      # Integrator entry point with Feature Hub setup
├── feature-app.tsx # Remote Feature App definition
└── App.tsx        # Remote Feature App UI component
```

## External Dependencies

- **@feature-hub/\*** - Core framework for micro-frontend orchestration
- **webpack 5** - Module Federation native support
- **React 19** - Modern React with automatic JSX transform
- **SWC** - Fast TypeScript/JavaScript compilation
