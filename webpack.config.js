const webpack = require('webpack');
const merge = require('webpack-merge').merge;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';
/**
 * @type {webpack.Configuration}
 */
const base = {
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              transform: {
                react: {
                  runtime: 'automatic',
                  development: isDevelopment,
                  refresh: isDevelopment,
                },
              },
              parser: {
                syntax: 'typescript',
                decorator: true,
              },
            },
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/i,
        type: 'url-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // conditionNames: ['@feature-hub:bundler', '...'],
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.REACT_VERSION': JSON.stringify('^18.2.0'),
    }),
  ].filter(Boolean),
};

/**
 * @type {webpack.Configuration[]}
 */
const config = [
  merge(base, {
    entry: {},
    output: {
      publicPath: 'auto',
      filename: 'feature-app.bundle.js',
    },
    plugins: [
      new ReactRefreshWebpackPlugin(),
      new webpack.container.ModuleFederationPlugin({
        name: '__feature_hub_feature_app_module_container__',
        exposes: {
          featureAppModule: './src/feature-app',
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: '^18.2.0' },
          'react-dom': { singleton: true, eager: true, requiredVersion: '^18.2.0' },
        },
      }),
    ],
  }),
  merge(base, {
    entry: './src/index.tsx',
    output: {
      filename: 'bundle.js',
      publicPath: '/',
    },
    devServer: {
      port: 9000,
      hot: true,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    plugins: [
      new ReactRefreshWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './index.html',
      }),
      new webpack.container.ModuleFederationPlugin({
        shared: {
          react: { singleton: true, eager: true, requiredVersion: '^18.2.0' },
          'react-dom': { singleton: true, eager: true, requiredVersion: '^18.2.0' },
        },
      }),
    ],
  }),
];

module.exports = config;
