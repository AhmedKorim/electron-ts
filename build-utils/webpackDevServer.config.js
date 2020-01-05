module.exports = ( transpile ) => ( {
    historyApiFallback: true,
    port: transpile ? 3003 : 3002,
    host: transpile ? '0.0.0.0' : 'localhost',
    before: function ( app, server ) {
    }
} )
