
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
var fs = require('fs');

var exec = require('child_process').exec;

for (var i in config.entry) {
 // 每个入口文件加入 client websocket 热加载脚本
 config.entry[i].concat([
  		"webpack-dev-server/client?localhost:9292/",
  		"webpack/hot/dev-server"
   ]);
}
// config.module.loaders.unshift({
//  test: /\.jsx?$/,
//  loader: 'react-hot',
//  exclude: /node_modules/
// });
config.plugins.push(new webpack.HotModuleReplacementPlugin());


fs.watch('./src/view/', function() {
  exec(' webpack --progress --hide-modules --watch', function(err, stdout, stderr) {
    if (err) {
      console.log(stderr);
    } else {
      console.log(stdout);
    }
  });
});

var app = new WebpackDevServer(webpack(config), {
   publicPath:         config.output.publicPath,
   hot:                true,
   historyApiFallback: true,
   stats:              { colors: true }
 });

app.listen(9292, 'localhost', function (err, result) {
  if (err) {
     console.log(err);
  }
 console.log('Listening at http://localhost:9292/view');
});
