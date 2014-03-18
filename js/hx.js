(function( window , $ , hx , Helper ) {

    
    $.fn.hx = function( actions ) {

        var hxm = new hx( this );

        actions = Array.isArray( actions ) ? actions : [actions];

        actions.forEach(function( a ) {
            a.order = a.order || Helper.object.getOrder( a );
        });

        return hxm._addPod( actions );
    };

 
}( window , jQuery , hxManager , hxManager.helper ));





















