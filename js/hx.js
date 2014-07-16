(function( $ , hxManager ) {

    
    $.fn.hx = function( hxArgs ) {

        var shift = hxManager.Helper.shift;
        var hxm = new hxManager( this );
        var out;

        switch (typeof hxArgs) {

            case 'string':

                var method = shift( arguments );

                if (typeof hxm[method] !== 'function') {
                    throw new TypeError( method + ' is not a function.' );
                }

                out = hxm[method].apply( hxm , arguments );

            break;

            case 'object':

                out = hxm._addAnimationPod( hxArgs );

            break;
        }

        return out;
    };

 
}( jQuery , hxManager ));





















