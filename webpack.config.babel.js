import '@babel/polyfill';
const path = require('path');

module.exports = {
	entry: {
		main: [
			'@babel/polyfill',
			'./src/index.js',
		]
	},
	mode: 'development',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'lib')
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
			}
		}]
	},
};