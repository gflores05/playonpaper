const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    libraryTarget: 'commonjs',
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  target: 'node',
  mode: 'development',
  devtool: false,
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new TsConfigPathsPlugin({
        configFile: 'tsconfig.json'
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        loader: require.resolve(`ts-loader`),
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          configFile: 'tsconfig.json'
        }
      }
    ]
  }
};
