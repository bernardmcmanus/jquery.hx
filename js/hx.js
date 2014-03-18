(function( window , $ , hx , Helper ) {

    
    $.fn.hx = function( hxArgs ) {

        var hxm = new hx( this );

        if (!hxArgs) {
            return hxm;
        }

        hxArgs = Array.isArray( hxArgs ) ? hxArgs : [hxArgs];

        hxArgs.forEach(function( a ) {
            a.order = a.order || Helper.object.getOrder( a );
        });

        return hxm._addXformPod( hxArgs );
    };

 
}( window , jQuery , hxManager , hxManager.helper ));





















