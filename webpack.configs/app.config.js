const merge = require( 'webpack-merge' );
const devServer = require( '../build-utils/webpackDevServer.config' );
const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const baseConfig = require( './base.config' );
const webpack = require( 'webpack' );
const { dependencies: externals } = require( '../package' );

const baseConf = ( { mode, es5 = false, aggressize = false } = {} ) => ( {
    devServer: {
        ...devServer( es5, mode ),

    },
    externals: [ ...Object.keys( externals || {} ) ],
    entry: [
        mode === 'prod' ? './src/index.tsx' : './src/index.hmr.tsx',
        // `webpack-dev-server/client?http://localhost:${ process.env.PORT }/`,
        // 'react-hot-loader/patch',
        // 'webpack/hot/only-dev-server',
    ],
    // plugins: [
    //     new webpack.HotModuleReplacementPlugin( {
    //         multiStep: true
    //     } ),
    //
    //     new webpack.NoEmitOnErrorsPlugin(),
    // ],
    target: "electron-main",
    mode: mode !== 'prod' ? 'development' : 'production',
    output: {
        libraryTarget: 'commonjs2',
        publicPath: `http://localhost:${ process.env.PORT }/dist/`,
        filename: 'renderer.dev.js'
    }
} )
module.exports = ( env ) => merge( baseConfig( env ), baseConf( env ) )
