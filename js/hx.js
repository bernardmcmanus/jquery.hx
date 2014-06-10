(function( $ , hxManager , Helper , Get ) {

    
    $.fn.hx = function( hxArgs ) {

        var hxm = new hxManager( this );

        switch (typeof hxArgs) {

            case 'string':

                var method = Array.prototype.shift.call( arguments );

                if (typeof hxm[method] !== 'function') {
                    throw new TypeError( method + ' is not a function.' );
                }

                hxm[method].apply( hxm , arguments );

            break;

            case 'object':

                if (hxArgs instanceof Array) {
                    // make sure transform seeds are placed first in the bundle
                    hxArgs = Get.orderedBundle( hxArgs );
                }
                else {
                    hxArgs = [ hxArgs ];
                }

                hxm._addXformPod( hxArgs );

            break;
        }

        return hxm;
    };

 
}( jQuery , hxManager , hxManager.Helper , hxManager.Get ));





















