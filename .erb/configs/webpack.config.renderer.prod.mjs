/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import { EsbuildPlugin } from 'esbuild-loader';
import baseConfig from './webpack.config.base.mjs';
import webpackPaths from './webpack.paths.mjs';
import checkNodeEnv from '../scripts/check-node-env.js';
import deleteSourceMaps from '../scripts/delete-source-maps.js';

checkNodeEnv('production');
deleteSourceMaps();

/**
 * @type {typeof import("webpack").Configuration }
 */
const configuration = {
  devtool: 'source-map',

  mode: 'production',

  target: ['web', 'electron-renderer'],

  entry: [path.join(webpackPaths.srcRendererPath, 'index.tsx')],

  output: {
    path: webpackPaths.distRendererPath,
    publicPath: './',
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
    library: { type: 'module' },
  },

  experiments: {
    outputModule: true,
  },

  module: {
    rules: [
      {
        test: /\.s?(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
        include: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.s?(a|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: /\.module\.s?(c|a)ss$/,
      },
      //Font Loader
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // Images
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        resourceQuery: { not: [/url/] },
        type: 'asset/resource',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/inline',
        resourceQuery: /url/,
      },
      // SVG
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] },
        use: ['@svgr/webpack'],
      },
    ],
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
    minimizer: [
      new EsbuildPlugin({
        css: true,
      }),
    ],
  },

  plugins: [
    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
    }),

    new webpack.ProvidePlugin({
      React: 'react',
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
      analyzerPort: 8889,
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(webpackPaths.srcRendererPath, 'index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      isBrowser: false,
      isDevelopment: process.env.NODE_ENV !== 'production',
      scriptLoading: 'module',
    }),

    new webpack.DefinePlugin({
      'process.type': '"renderer"',
    }),
  ],
};

export default merge(baseConfig, configuration);
