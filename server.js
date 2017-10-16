var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');

for( var i in config.entry){
  config.entry[i].concat([
 		"webpack-dev-server/client?http://127.0.0.1:9292/",
 		"webpack/hot/only-dev-server"
  ]
 	);
}
config.plugins.push(new webpack.HotModuleReplacementPlugin());

new WebpackDevServer(webpack(config),{
  publicPath: config.output.publicPath,
 	hot: true,
 	historyApiFallback: true,
 	stats: { colors: true }
}).listen(9292, 'localhost', function (err, result) {
 	if (err) {
 	    console.log(err);
 	}
 	console.log('server start');
});
