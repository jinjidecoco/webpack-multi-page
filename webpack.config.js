var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const isProduction = process.env.NODE_ENV === 'production';

var glob =require('glob');
var entrys = {};
glob.sync("./src/js/*.js").forEach(function(name){
    entrys[path.basename(name, '.js')] = name;
});
var chunks = Object.keys(entrys);
module.exports ={
   entry: entrys,
   output:{
     path: __dirname + '/build/',
     filename: 'js/[name].js',
     publicPath: '/static/',
     chunkFilename: 'chunk/[name].chunk.js'
   },
   module:{
       loaders:[
            {
              test: /\.css$/,
              loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
              test: /\.less$/,
              loader: ExtractTextPlugin.extract('css-loader!less-loader')
            },
            {
               test: /\.js$/,
               loader: 'babel-loader',
               exclude: /node_modules/,
               query:{
                 presets: ['es2015']
               }
            },
            {
               test:/\.html$/,
               loader: "html-loader?attrs=img:src img:data-src"
            },
            {
              test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: 'file-loader?name=./fonts/[name].[ext]'
            },
            {
              //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
              //如下配置，将小于8192byte的图片转成base64码
              test: /\.(png|jpg|gif)$/,
              loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
            }
         ]
       },

       plugins:[
          new webpack.ProvidePlugin({ //加载jq
              $: 'jquery',
              jQuery: 'jquery'
          }),
          new webpack.optimize.CommonsChunkPlugin({
            name:'vendor',
            filename: isProduction ? 'js/vendor.[hash:8].js':'js/vendor.js',
            minChunks:3
          }),
          new ExtractTextPlugin(isProduction ? 'css/[name].[hash:8].css':'css/[name].css'),

          isProduction ? new UglifyJsPlugin({ //压缩代码
              compress: {
                  warnings: false
              },
              except: ['$super', '$', 'exports', 'require'] //排除关键字
          }) : function(){}
       ],
       devtool: isProduction ? false : 'source-map',
       devServer: {
          hot: true,
	        publicPath: '/',
	        historyApiFallback: true,
	        stats: "errors-only",
          noInfo: false
      }
          // devServer: {
          //    contentBase: './src/',
          //    historyApiFallback: true,
          //    hot: true,
          //   //  port: defaultSettings.port,
          //    publicPath: '/assets/',
          //    noInfo: false
          // }
};

chunks.forEach(function(pathname){
  if( pathname == 'vendor'){
    return;
  }
  var conf ={
    filename:pathname + '.html',
    template: './src/view/' + pathname +'.html',
    inject: 'body',
    minify: {
      removeComments: true,
      collapseWhitespace: false
    }
  };
 if( pathname in module.exports.entry) {
    conf.chunks = ['vendor', pathname];
    conf.hash = false;
  }
   module.exports.plugins.push(new  HtmlWebpackPlugin(conf));
});
