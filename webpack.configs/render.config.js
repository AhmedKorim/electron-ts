const merge = require( 'webpack-merge' );
const devServer = require( '../build-utils/webpackDevServer.config' );
const path = require( 'path' );
const baseConfig = require( './base.config' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const renderConf = ( { mode, es5 = false, aggressize = false } = {} ) => ( {
    watch: true,
    target: "electron-main",
    node: {
        __dirname: false,
        __filename: false
    },
    devtool: 'source-map',
    entry: './src/main.ts',
    mode: 'production',
    optimization: {
        minimizer: [ new TerserPlugin( {
            parallel: true,
            sourceMap: true,
            cache: true
        } ) ]
    },
    output: {
        path: path.join( __dirname, '..', 'dist', ),
        filename: '[name].bundle.js',
        chunkFilename: "[name].chunk.js",
        publicPath: '/',
    },
} )
module.exports = ( env ) => merge( baseConfig( env ), renderConf( env ) )
