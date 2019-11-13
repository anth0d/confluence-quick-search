const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: path.join(__dirname, './src/', 'background.ts'),
    search: path.join(__dirname, './src/', 'search.ts')
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
        exclude: /node_modules/
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
    )
  ]
};
