hxManager.Inject(
[
    Error,
    jQuery,
    hxManager,
    'shift',
    'isFunc',
    'is'
],
function(
    Error,
    $,
    hxManager,
    shift,
    isFunc,
    is
){

    $.fn.hx = function() {

        var args = arguments;
        var hxm = new hxManager( this );
        var out;

        if (is( args[0] , 'string' )) {

            var method = shift( args );

            if (!isFunc( hxm[method] )) {
                throw new Error( method + ' is not a function.' );
            }

            out = hxm[method].apply( hxm , args );
        }
        else if (is( args[0] , 'object' )) {
            out = hxm.animate( args[0] );
        }
        else {
            out = hxm;
        }

        return out;
    };

});



















