const path = require('path');

module.exports = options => ({
  target: 'node',
  devtool: options.dev ? 'cheap-module-eval-source-map' : 'hidden-source-map',
  context: path.resolve(__dirname, './src'),
  entry: {
    index: './index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './lib'),
    library: 'tall',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: [['es2015', { modules: false }]] },
        }],
      },
    ],
  },
});
