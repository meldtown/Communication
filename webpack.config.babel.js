import path from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const isProduction = 'production' === (process.env.NODE_ENV = process.argv.indexOf('-p') === -1 ? 'development' : 'production')

const plugins = [
	new webpack.LoaderOptionsPlugin({options: {context: __dirname, postcss: [autoprefixer]}}),
	new webpack.optimize.CommonsChunkPlugin('commons'),
	new webpack.ProvidePlugin({
		ko: 'knockout',
		$: 'jquery'
	})
]

export default (app) => ({
	devtool: isProduction ? 'source-map' : 'eval',
	entry: {
		app1: './entry/app1.js'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
		publicPath: '/dist/',
		library: '[name]'
	},
	module: {
		loaders: [
			{test: /\.html$/, loader: 'html'},
			{test: /\.js$/, loader: 'babel', exclude: /node_modules/},
			{
				test: /\.s?css$/,
				loader: isProduction ? ExtractTextPlugin.extract({
					fallbackLoader: 'style',
					loader: 'css?sourceMap!postcss!sass?sourceMap'
				}) : 'style!css?sourceMap!postcss!sass?sourceMap'
			}
		]
	},
	plugins: isProduction ? plugins.concat([new ExtractTextPlugin('[name].css')]) : plugins.concat([new webpack.HotModuleReplacementPlugin()]),
	devServer: {
		hot: true,
		historyApiFallback: {
			rewrites: [
				{from: /.*/, to: `/entry/${app}.html`}
			]
		}
	}
})