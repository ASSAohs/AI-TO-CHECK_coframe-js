const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: true
        }
      }),
    ],
  },
  entry: './lib/coframe.js',
  output: {
    filename: 'coframe.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Coframejs',
    libraryTarget: 'var',
  },
  mode: 'production',
  
};