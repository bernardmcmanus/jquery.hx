(function( window , $ , hx , Helper , Get ) {

    
    $.fn.hx = function( hxArgs ) {

        var hxm = new hx( this );

        switch (typeof hxArgs) {

            case 'string':

                var method = Array.prototype.shift.call( arguments );

                try {
                    hxm[method].apply( hxm , arguments );
                }
                catch( err ) {
                    throw new TypeError( method + ' is not a function.' );
                }

            break;

            case 'object':

                if (Array.isArray( hxArgs )) {
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

 
}( window , jQuery , hxManager , hxManager.Helper , hxManager.Get ));





















