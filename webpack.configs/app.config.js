const merge = require( 'webpack-merge' );
const devServer = require( '../build-utils/webpackDevServer.config' );
const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const baseConfig = require( './base.config' );
const webpack = require( 'webpack' );
const { dependencies: externals } = require( '../package' );
const root = path.join( __dirname, '..' );
const dotenv = require( 'dotenv' ).config( { path: path.join( root, '.env' ) } ).parsed;
const srcDir = path.join( root, dotenv.approot || '' );
const appDir = path.join( srcDir, 'app' );

const dll = path.join( __dirname, '..', 'dll' );
const manifest = path.resolve( dll, 'renderer.json' );
const requiredByDLLConfig = module.parent.filename.includes(
    'webpack.config.renderer.dev.dll'
);
const baseConf = ( { mode, es5 = false, aggressize = false } = {} ) => ( {
    devServer: {
        ...devServer( es5, mode ),

    },
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom',
            '@app': path.resolve( root, appDir ),
            'react-hot-loader': path.resolve( root, 'node_modules', 'react-hot-loader' ),
            '@assets': path.resolve( root, srcDir, 'assets' ),
            'target': path.resolve( root, 'node_modules' ),
            '@shared': path.resolve( root, srcDir, 'shared' ),
            // 'theme': path.resolve( root, 'dashboardTheme' ),
            '@target': path.resolve( root, 'node_modules' ),

        },
    },
    entry: [
        mode === 'prod' ? './src/index.tsx' : './src/index.hmr.tsx',
        `webpack-dev-server/client?http://localhost:${ process.env.PORT }/`,
        'react-hot-loader/patch',
        'webpack/hot/only-dev-server',
    ],
    plugins: [
        requiredByDLLConfig
            ? null
            : new webpack.DllReferencePlugin( {
                context: path.join( __dirname, '..', 'dll' ),
                manifest: require( manifest ),
                sourceType: 'var'
            } ),

        new webpack.HotModuleReplacementPlugin( {
            multiStep: true
        } ),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    target: "electron-renderer",
    mode: mode !== 'prod' ? 'development' : 'production',
    output: {
        libraryTarget: 'commonjs2',
        publicPath: `http://localhost:${ process.env.PORT }/dist/`,
        filename: 'renderer.dev.js'
    }
} )
module.exports = ( env ) => merge( baseConfig( env ), baseConf( env ) )
