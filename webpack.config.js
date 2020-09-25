// MIT LICENSE

/**
 * Requires
 */

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv').config();
const AssetsPlugin = require('assets-webpack-plugin');
const { minify } = require('html-minifier');
const glob = require('glob');
const Package = require('./package.json');

/**
 * Environment
 */

dotenv.parsed.PACKAGE_VERSION = Package.version;
const isEnvDevelopment = process.env.ENV === 'development';
const useDevTool = false;

/**
 * Formatters
 */

const modifyJSON = (buffer) => {
	let manifestString = buffer.toString();

	// Replace variables
	manifestString = manifestString.replace(/%CDN_URL%/g, process.env.CDN_URL);

	// Add values
	const manifest = JSON.parse(manifestString);
	manifest.version = Package.version;

	// Pretty print to JSON
	manifestString = JSON.stringify(manifest, null, 4);
	return manifestString;
};

const minifyEJS = (buffer) => minify(buffer.toString(), {
	removeComments: true,
	collapseWhitespace: true,
	useShortDoctype: true,
	removeRedundantAttributes: true,
	removeEmptyAttributes: true,
	removeStyleLinkTypeAttributes: true,
	keepClosingSlash: true,
	minifyJS: true,
	minifyCSS: true,
	minifyURLs: true,
});

const generateEJSCopyParams = () => {
	const files = glob.sync('views/**/*.ejs', null);
	return files.map((file) => ({
		from: file,
		to: file,
		force: true,
		transform(content) {
			return minifyEJS(content);
		}
	}));
};

/**
 * Configuration
 */

module.exports = function () {

	// Generate EJS params
	const ejsParams = generateEJSCopyParams();

	// Build configuration
	const configuration = {
		mode: isEnvDevelopment ? 'development' : 'production',
		entry: {
			error_404: `${__dirname}/src/js/entry/404.js`,
			error_500: `${__dirname}/src/js/entry/500.js`,
			home: `${__dirname}/src/js/entry/home.js`,
		},
		output: {
			path: `${__dirname}/build/`,
			filename: (isEnvDevelopment) ? 'js/[name].bundle.min.js' : 'js/[name].bundle.[chunkhash].min.js',
			publicPath: '/public/',
		},
		...(isEnvDevelopment ? {
			...(useDevTool ? {
				devtool: 'inline-source-map'
			} : undefined),
			devServer: {
				contentBase: [
					`${__dirname}/views/**`,
					`${__dirname}/src/external/**`,
					`${__dirname}/src/img/**`
				],
				hot: false,
				watchContentBase: true,
				liveReload: true,
				writeToDisk: true,
				publicPath: '/public/',
				port: 3000,
				proxy: {
					context: [
						'**',
						'!/public/js/**',
						'!/public/css/**',
						'!/public/fonts/**',
						'!/public/external/manifest.json'
					],
					target: 'http://localhost:1337',
					secure: false
				},
			},
			watchOptions: {
				ignored: ['node_modules']
			}
		} : undefined),
		module: {
			rules: [
				{
					test: /\.css$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								hmr: isEnvDevelopment,
								reloadAll: true,
							},
						},
						'css-loader',
					],
				},
				{
					test: /\.(gif|png|jpg|ico)$/,
					loaders: ['url-loader'],
				},
				{
					test: /\.ejs$/,
					use: {
						loader: 'ejs-compiled-loader',
						options: {
							htmlmin: false,
						}
					}
				},
				{
					test: /\.m?js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						},
					},
				},
			],
		},
		plugins: [

			// Define HMR plugins
			isEnvDevelopment && new webpack.optimize.OccurrenceOrderPlugin(),
			isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
			isEnvDevelopment && new webpack.NoEmitOnErrorsPlugin(),

			// Define asset build plugins
			new webpack.DefinePlugin({
				'process.env': JSON.stringify({
					PACKAGE_VERSION: Package.version,
					ENV: process.env.ENV,
					APP_ID: process.env.APP_ID,
					CDN_URL: process.env.CDN_URL
				}),
			}),
			new AssetsPlugin({
				path: `${__dirname}/config`,
				fullPath: false,
				entrypoints: true,
			}),
			new MiniCssExtractPlugin({
				filename: isEnvDevelopment ? 'css/[name].bundle.css' : 'css/[name].bundle.[chunkhash].css',
			}),
			new CopyPlugin({
				patterns: [
					!isEnvDevelopment && { from: 'src/img', to: 'img' },
					!isEnvDevelopment && { from: 'src/external', to: 'external' },
					isEnvDevelopment && { from: 'src/external/sitemap.xml', to: './external/' },
					...(!isEnvDevelopment ? ejsParams : []),
					{
						from: 'src/external/manifest.json',
						to: './external/',
						force: true,
						transform(content) {
							return modifyJSON(content);
						}
					}
				].filter(Boolean)
			})
		].filter(Boolean)
	};

	// Return config
	return configuration;
};
