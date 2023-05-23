const path = require('path');

module.exports = {
  entry: './lib/index.js',
  output: {
    filename: 'coframe.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Coframe',
    libraryTarget: 'var',
  },
  mode: 'production',
};