var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackDevServer =  require('webpack-dev-server');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var  isProduction = process.env.NODE_ENV === 'production';
var glob =require('glob');
// 获取入口文件

var entrys = {};
glob.sync("./src/js/*.js").forEach(function(name){
    entrys[path.basename(name, '.js')] = name;
});

var config = {

    entry: entrys,
    output:{
       path: __dirname + '/build/',    //打包文件存放的绝对路径
       publicPath: '/',  //网站运行时访问路径
       filename:isProduction ? 'js/[name].[hash:8].js':'js/[name].js', //打包后文件名
       chunkFilename: 'chunk/[name].chunk.js' 
    },
    //module 
    module:{
        loaders:[
            {
              test: /\.css$/,
              use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
              })
            },
            {
              test: /\.less$/,
              use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'less-loader']
              })
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
            }]
    },
    //所用的plugins
    plugins:[
      new webpack.ProvidePlugin({ //加载jq
          $: 'jquery',
          jQuery: 'jquery'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name:'vendor',
        filename: isProduction ? 'js/vendor.[hash].js':'js/vendor.js',
        minChunks:3
      }),
      new ExtractTextPlugin(isProduction ? 'css/[name].[hash].css':'css/[name].css'),
      isProduction ? new UglifyJsPlugin({ //压缩代码
          compress: {
              warnings: false
          },
          except: ['$super', '$', 'exports', 'require'] //排除关键字
      }) : function(){},

      new webpack.HotModuleReplacementPlugin() // 热加载
    ],
    
    devtool: isProduction ? false : 'source-map',
    devServer: {
      host:'localhost',
      port:9292,
      hot: true,
      contentBase: './',
      // publicPath: '/build/',
      inline: true ,
      historyApiFallback: true,
      noInfo: false,
      //代理后端请求
      proxy: {
        "/api": {
          target: "http://localhost:9292",
          pathRewrite: {"^/api" : ""}
        }
      }
    }
};

module.exports = config;

  var chunks = Object.keys(entrys);
    chunks.forEach(function ( pathname ) {

      if( pathname == 'vendor'){
           return;
      }
      var conf ={
        filename:'./view/' + pathname + '.html', //生成的html存放路径，相对path
        template: './src/page/' + pathname +'.html',
        inject: 'false', //js插入的位置 false(body)
        minify: {
          removeComments: true, //移除html中的注释
          collapseWhitespace: false //删除空白符与换行符
        }
      };
      if( pathname in config.entry) {
        conf.chunks = ['vendor', pathname];
        conf.hash = false;
        conf.inject = 'body';
      }
     config.plugins.push(new HtmlWebpackPlugin(conf));

    });
