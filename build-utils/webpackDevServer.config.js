const { spawn } = require( "child_process" );
const path = require( 'path' );
module.exports = ( transpile, mode ) => ( {
    historyApiFallback: true,
    port: process.env.PORT,
    publicPath: `http://localhost:${ process.env.PORT }/dist`,
    contentBase: path.join( __dirname, 'dist' ),
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 100
    },
    before: function ( app, server ) {
        if ( mode === 'dev' ) {
            console.log( 'Starting Main Process...' );
            spawn( 'yarn', [ 'start-main-dev' ], {
                shell: true,
                env: process.env,
                stdio: 'inherit'
            } )
                .on( 'close', code => process.exit( code ) )
                .on( 'error', spawnError => console.error( spawnError ) );
        }
    }
} )
