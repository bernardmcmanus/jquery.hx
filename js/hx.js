(function( window , $ , hx , Helper , Get ) {

    
    $.fn.hx = function( hxArgs ) {

        var hxm = new hx( this );

        switch (typeof hxArgs) {

            case 'string':

                var method = Array.prototype.splice.call( arguments , 0 , 1 );

                try {
                    hxm[method].apply( hxm , arguments );
                }
                catch( err ) {}

            break;

            case 'object':

                if (Array.isArray( hxArgs )) {
                    // make sure transform seeds are placed first in the bundle
                    hxArgs = Get.orderedBundle( hxArgs );
                }
                else {
                    hxArgs = [hxArgs];
                }

                hxArgs.forEach(function( a ) {
                    a.order = Get.seedOrder( a );
                });

                hxm._addXformPod( hxArgs );

            break;
        }

        return hxm;
    };

 
}( window , jQuery , hxManager , hxManager.helper , hxManager.get ));





















