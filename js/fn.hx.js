var hxManager = require( 'hxManager' );
var helper = require( 'shared/helper' );

module.exports = function() {
    var args = arguments;
    var hxm = new hxManager( this );
    var out;
    if (helper.is( args[0] , 'string' )) {
        var method = helper.shift( args );
        if (!helper.isFunc( hxm[method] )) {
            throw new Error( method + ' is not a function.' );
        }
        out = hxm[method].apply( hxm , args );
    }
    else if (helper.is( args[0] , 'object' )) {
        out = hxm.animate( args[0] );
    }
    else {
        out = hxm;
    }
    return out;
};
