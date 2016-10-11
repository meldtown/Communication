import path from 'path'
import DefinePlugin from 'webpack/lib/DefinePlugin'
import LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin'
import ProvidePlugin from 'webpack/lib/ProvidePlugin'
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin'
import HotModuleReplacementPlugin from 'webpack/lib/HotModuleReplacementPlugin'
import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const isProduction = 'production' === (process.env.NODE_ENV = process.argv.indexOf('-p') === -1 ? 'development' : 'production')

const plugins = [
	new LoaderOptionsPlugin({options: {context: __dirname, postcss: [autoprefixer]}}),
	new CommonsChunkPlugin('commons'),
	new ProvidePlugin({
		ko: 'knockout',
		$: 'jquery'
	})
]

export default (app) => ({
	devtool: isProduction ? 'source-map' : 'eval',
	entry: {
		hub: './entry/hub.js'
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
	plugins: isProduction
		? plugins.concat([new ExtractTextPlugin('[name].css')])
		: plugins.concat([new DefinePlugin({api: '"http://localhost:8181"'}), new HotModuleReplacementPlugin()]),
	devServer: {
		hot: true,
		historyApiFallback: {
			rewrites: [
				{from: /.*/, to: `/entry/${app}.html`}
			]
		}
	}
})