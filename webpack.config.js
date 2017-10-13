var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var glob =require('glob');

var entrys = {};
glob.sync("./src/js/*.js").forEach(function(name){
    entrys[path.basename(name, '.js')] = name;
});

module.exports ={
   entry: entrys,
   output:{
     path: __dirname+'/build/',
     filename: 'js/[name].js',
      publicPath : '.'
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
               loader: "html?attrs=img:src img:data-src"
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
            name:'vendors',
            minChunks:3
          }),
          new ExtractTextPlugin('css/[name].css'),
          new webpack.HotModuleReplacementPlugin()
       ],
   devServer: {
        contentBase: './',
        host: 'localhost',
        port: 9292, //默认8080s
        inline: true, //可以监控js变化
        hot: true, //热启动
    }

}
