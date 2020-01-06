const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const webpack = require( 'webpack' );
const UglifyJsWebpackPlugin = require( 'uglifyjs-webpack-plugin' )
const path = require( 'path' );
const builldPlugins = [
    // new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
    // new UglifyJsWebpackPlugin()s
]
const root = path.join( __dirname, '..' );
const dotenv = require( 'dotenv' ).config( { path: path.join( root, '.env' ) } ).parsed;
module.exports.envConf = dotenv;
const srcDir = path.join( root, dotenv.approot || '' );
const appDir = path.join( srcDir, 'app' );
const { dependencies: externals } = require( '../package' );
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );

module.exports = ( { mode, es5 = false, aggressize = false } = {} ) => {
    return {
        output: {
            libraryTarget: 'commonjs2'

        },
        resolve: {
            extensions: [ ".ts", ".tsx", ".js", ".jsx" ],
            descriptionFiles: [ 'package.json' ],
            alias: {
                'react-dom': path.resolve( path.join( root, 'node_modules','@hot-loader/react-dom' ) ),
                '@app': path.resolve( root, appDir ),
                'react-hot-loader': path.resolve( root, 'node_modules', 'react-hot-loader' ),
                '@assets': path.resolve( root, srcDir, 'assets' ),
                'target': path.resolve( root, 'node_modules' ),
                '@shared': path.resolve( root, srcDir, 'shared' ),
                // 'theme': path.resolve( root, 'dashboardTheme' ),
                '@target': path.resolve( root, 'node_modules' ),

            },
        },
        stats: 'errors-only',
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.t?sx?$/,
                    exclude: es5 ? !aggressize ? /node_modules\/(?!(@material-ui|react-spring)\/).*/ : / / : /node_modules|packages/,
                    use: [ {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            babelrc: false,
                            presets: [ [ "@babel/preset-env", ],
                                "@babel/preset-typescript",
                                "@babel/preset-react" ],
                            plugins: [
                                "@babel/plugin-syntax-dynamic-import",
                                ...( mode === 'prod' ? [] : [ "react-hot-loader/babel" ] ),
                                [ "@babel/plugin-proposal-decorators", { legacy: true } ],
                                [
                                    "@babel/plugin-proposal-class-properties",
                                    {
                                        "loose": true
                                    }
                                ],
                                [
                                    "const-enum",
                                    {
                                        "transform": "constObject"
                                    }
                                ]
                            ],

                        }
                    }
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: es5 ? !aggressize ? /node_modules\/(?!(@material-ui|react-spring)\/).*/ : / / : /node_modules|packages/,
                    use: [ {
                        loader: 'babel-loader?cacheDirectory',
                        options: {
                            presets: [ [ "@babel/preset-env", {
                                targets: {
                                    "chrome": "58",
                                    "ie": "11"
                                }
                            } ],
                                "@babel/preset-react" ],
                            plugins: [
                                "@babel/plugin-syntax-dynamic-import",
                                ...( mode === 'prod' ? [] : [ "react-hot-loader/babel" ] ),
                                [
                                    "@babel/plugin-proposal-class-properties",
                                    {
                                        "loose": true
                                    }
                                ],

                            ],

                        }
                    }
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    use:
                        [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[path][name].[ext]',
                                    outputPath: 'images',
                                    context: 'src/assets/images'
                                },
                            },
                        ],
                }, {
                    test: /\.(scss|css)$/,
                    use: [
                        {
                            loader: "style-loader"
                        }, {
                            loader: "css-loader"
                        }, {
                            loader: "sass-loader"
                        }
                    ]
                }
            ]
        },
        parallelism: 1,
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new webpack.DefinePlugin( {
                'process.env': JSON.stringify( {
                    NODE_ENV: mode !== 'prod' ? 'development' : 'production',
                    ...( dotenv.parsed || {} )
                } )
            } ),
            new webpack.NamedModulesPlugin(),
            ...( mode === 'prod' ? builldPlugins : [] )
        ]
    }
}
module.exports.srcDir = srcDir
module.exports.appDir = appDir
