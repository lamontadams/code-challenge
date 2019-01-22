var path = require('path');
var ZipPlugin = require('zip-webpack-plugin');
var lambdaName = "draw-timeseries-plot";

//nodegit has a binary blog that breaks packaging with webpack - leaving this here for archival purposes, but IT DOES NOT WORK
module.exports = {
    entry: './src/' + lambdaName +'.ts',
    target: 'node',
    mode: 'production',
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
      extensions: [ '.tsx', '.ts', '.js' ]
    },

    output: {
      libraryTarget: 'commonjs',
      filename: lambdaName + '.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new ZipPlugin({
          // OPTIONAL: defaults to the Webpack output path (above)
          // can be relative (to Webpack output path) or absolute
          path: '../../',
     
          // OPTIONAL: defaults to the Webpack output filename (above) or,
          // if not present, the basename of the path
          filename: lambdaName + '.zip',
        })
      ]
  };