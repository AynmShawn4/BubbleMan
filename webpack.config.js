var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/java/app.js',

	output: {
		path: path.join(__dirname, './dist/'),
		filename: 'bundle.js',
		publicPath: '/dist/'
	},

	module:{
		loaders: [{
			test: /.jsx?$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: ['es2015', 'react']
			}
		},
		{	
			test: /\.(jpe?g|png|gif|svg)$/i, 
		 	loader: "file-loader"
		},
		{
	    	test: /\.css$/,
	    	loaders: ["style-loader","css-loader"]
	    }
		]
	},
}