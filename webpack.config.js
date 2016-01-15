var path = require('path');
var webpack = require('webpack');

/*add this plugin for a performance boost
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': '"production"',
    }
  })
]*/

module.exports = {
  devtool: 'eval',
  entry: [
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"',
      }
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /(^|\.)worker\.js$/,
      loaders: ['worker-loader'],
      exclude: /node_modules/
    }, {
      test: /\.(js|jsx|babel)$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.css?$/,
      loaders: ['style', 'raw']
    }]
  }
};
