(function( $ , hx , Defaults , Helper ) {

    
    $.fn.hx = function( actions ) {

        var hxm = new hx( this );

        actions = Array.isArray( actions ) ? actions : [actions];

        actions.forEach(function( a ) {
            a.order = a.order || Helper.object.getOrder.call( a );
        });

        return hxm._set( actions );
    };

 
}( jQuery , hxManager , hxManager.config.$hx , hxManager.helper ));





















