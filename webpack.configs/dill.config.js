const merge = require( 'webpack-merge' );
const devServer = require( '../build-utils/webpackDevServer.config' );
const path = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const baseConfig = require( './base.config' );
const { dependencies } = require( '../package' );
const dist = path.join( __dirname, '..', 'dll' );

const dillConf = ( { mode, es5 = false, aggressize = false } = {} ) => ( {
    // devtool: 'eval',
    mode: 'development',
    target: 'electron-renderer',
    context: path.join( __dirname, '..' ),

    externals: [ 'fsevents', 'crypto-browserify' ],
    entry: {
        renderer: Object.keys( dependencies || {} )
    },
    mode: mode !== 'prod' ? 'development' : 'production',
    output: {
        library: 'renderer',
        path: dist,
        filename: '[name].dev.dll.js',
        libraryTarget: 'var'
    },
    plugins: [
        new webpack.DllPlugin( {
            path: path.join( dist, '[name].json' ),
            name: '[name]'
        } ),
        new webpack.LoaderOptionsPlugin( {
            debug: true,
            options: {
                context: path.join( __dirname, '..', 'src', 'app' ),
                output: {
                    path: path.join( __dirname, '..', 'dll' )
                }
            }
        } )
    ]
} )
module.exports = ( env ) => merge( baseConfig( env ), dillConf( env ) )
