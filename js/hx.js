(function( $ , hxManager , shift ) {

    
    $.fn.hx = function() {

        var args = arguments;
        var hxm = new hxManager( this );

        switch (typeof args[0]) {

            case 'string':

                var method = shift( args );

                if (typeof hxm[method] !== 'function') {
                    throw new TypeError( method + ' is not a function.' );
                }

                return hxm[method].apply( hxm , args );

            case 'object':
                return hxm._addAnimationPod( args[0] );
        }
    };

 
}( jQuery , hxManager , hxManager.Helper.shift ));





















