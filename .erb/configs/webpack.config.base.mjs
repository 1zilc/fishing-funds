/**
 * Base webpack config used across other specific configs
 */

import webpack from 'webpack';
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';
import webpackPaths from './webpack.paths.mjs';
import pkg from '../../release/app/package.json' assert { type: 'json' };

/**
 * @type {typeof import("webpack").Configuration }
 */
const configuration = {
  externals: [...Object.keys(pkg.externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        use: {
          loader: 'worker-loader',
          options: {
            filename: '[name].js',
            inline: 'fallback',
          },
        },
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          target: 'esnext',
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: [webpackPaths.srcPath, 'node_modules'],
    // There is no need to add aliases here, the paths in tsconfig get mirrored
    plugins: [new TsconfigPathsPlugins()],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};

export default configuration;
