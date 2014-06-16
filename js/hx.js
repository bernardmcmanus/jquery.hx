(function( $ , hxManager ) {

    
    $.fn.hx = function( hxArgs ) {

        var hxm = new hxManager( this );
        var out;

        switch (typeof hxArgs) {

            case 'string':

                var args = $.extend( [] , arguments );
                var method = args.shift();

                if (typeof hxm[method] !== 'function') {
                    throw new TypeError( method + ' is not a function.' );
                }

                out = hxm[method].apply( hxm , args );

            break;

            case 'object':

                hxArgs = (hxArgs instanceof Array ? hxArgs : [ hxArgs ]);
                out = hxm._addXformPod( hxArgs );

            break;
        }

        return out;
    };

 
}( jQuery , hxManager ));





















