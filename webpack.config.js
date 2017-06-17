var isProduction = process.argv.indexOf('-p') !== -1;
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var nodeExternals = require('webpack-node-externals');

// component configurations
var componentConfig = {
  target: 'node', // in order to ignore built-in modules like path, fs, etc. 
  externals: [nodeExternals({
    whitelist: [/ng-idle/]
  })], // in order to ignore all modules in node_modules folder except ng-idle
  context: __dirname,
  devtool: "inline-sourcemap",
  entry: "./src/index.ts",
  output: {
    path: __dirname + "/dist",
    filename: "./angular-session-timeout.js"
  },
  module: {
    preLoaders: [
      { 
        test: /\.js$/, 
        loader: 'baggage?[file].html&[file].css',
        exclude: /index\.html/
      }
    ],
    loaders: [
      {
        test:/\.ts$/,
        loader: 'ts!tslint'
      },
      {
        test: /\.html$/,
        loader: 'ngtemplate!html',
        exclude: /index\.html/
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
    }),
  ]
};

// examples configurations
var exampleConfig = {
  context: __dirname,
  devtool: "inline-sourcemap",
  entry: {
    app:"./examples/src/index.ts",
    vendor: "./examples/src/vendor.ts",
  },
  output: {
    path: __dirname + "/examples/dist",
    filename: "./app.js"
  },
  module: {
    loaders: [
      {
        test:/\.ts$/,
        loader: 'ts!tslint'
      },
      {
        test: /\.html$/,
        loader: 'ngtemplate!html',
        exclude: /index\.html/
      },
      {
        test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', ['css', 'postcss', 'sass']),
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader'
      }
    ]
  },
  postcss() {
    return [autoprefixer];
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
    new HtmlWebpackPlugin({
      template: './examples/src/index.html'
    }),
    new ExtractTextPlugin('./style.css', {
          allChunks: true
      })
  ]
};

// production configurations
if (isProduction || process.env.NODE_ENV === 'production'){
  componentConfig.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  );
  componentConfig.devtool = null;
  
  exampleConfig.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  );
  exampleConfig.devtool = null;
}

// build
module.exports = [componentConfig, exampleConfig];