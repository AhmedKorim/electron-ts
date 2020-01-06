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
const srcDir = path.join( root, dotenv.approot || '' );
const appDir = path.join( srcDir, 'app' );
const { dependencies: externals } = require( '../src/package' );
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );
module.exports = ( { mode, es5 = false, aggressize = false } = {} ) => {
    return {
        output: {
            libraryTarget: 'commonjs2',
            path: path.join( __dirname, '..', 'build' ),

        },
        resolve: {
            extensions: [ ".ts", ".tsx", ".js", ".jsx" ],
            descriptionFiles: [ 'package.json' ],
            alias: {
                'react-dom': '@hot-loader/react-dom'
            }
        },
        stats: 'errors-only',
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.t?sx?$/,
                    exclude: /node_modules/,
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
                                "react-hot-loader/babel",
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
                            presets: [ [ "@babel/preset-env", ],
                                "@babel/preset-react" ],
                            plugins: [
                                "@babel/plugin-syntax-dynamic-import",
                                "react-hot-loader/babel",
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
        externals: [ ...Object.keys( externals || {} ) ],
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

