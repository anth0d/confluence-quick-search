/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    background: path.join(__dirname, './src/', 'background.ts'),
    search: path.join(__dirname, './src/', 'search.ts'),
    main: path.join(__dirname, './src/', 'index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].js'
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial'
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: '@svgr/webpack',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new CopyPlugin(
      [
        { from: '.', to: '.' }
      ],
      {
        context: 'public'
      }
    ),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          excludeChunks: [
            'background',
            'search',
          ],
          inject: true,
          template: 'public/index.html',
        },
        {
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        },
      )
    )
  ]
};
