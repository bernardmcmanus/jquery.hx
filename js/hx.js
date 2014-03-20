(function( window , $ , hx , Helper ) {

    
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

                hxArgs = Array.isArray( hxArgs ) ? hxArgs : [hxArgs];

                hxArgs.forEach(function( a ) {
                    a.order = a.order || Helper.object.getOrder( a );
                });

                hxm._addXformPod( hxArgs );

            break;
        }

        return hxm;
    };

 
}( window , jQuery , hxManager , hxManager.helper ));





















