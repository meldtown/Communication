import path from 'path'
import LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin'
import ProvidePlugin from 'webpack/lib/ProvidePlugin'
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin'
import HotModuleReplacementPlugin from 'webpack/lib/HotModuleReplacementPlugin'
import ContextReplacementPlugin from 'webpack/lib/ContextReplacementPlugin'
import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const isProduction = 'production' === (process.env.NODE_ENV = process.argv.indexOf('-p') === -1 ? 'development' : 'production')

const plugins = [
	new ContextReplacementPlugin(/moment[\\\/]locale/, /^\.\/(ru|uk)$/),
	new LoaderOptionsPlugin({options: {context: __dirname, postcss: [autoprefixer]}}),
	new CommonsChunkPlugin('commons'),
	new ProvidePlugin({
		ko: 'knockout',
		$: 'jquery'
	})
]

export default (app) => ({
	devtool: isProduction ? 'source-map' : 'inline-source-map',
	entry: {
		employer_hub: './entry/employer_hub.js',
		jobsearcher_hub: './entry/jobsearcher_hub.js',
		templates: './entry/templates.js',
		accordion: './entry/accordion.js'
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
		: plugins.concat([new HotModuleReplacementPlugin()]),
	devServer: {
		hot: true,
		host: '0.0.0.0',
		historyApiFallback: {
			rewrites: [
				{from: /.*/, to: `/entry/${app}.html`}
			]
		}
	}
})
