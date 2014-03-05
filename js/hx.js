(function( $ , hx , Defaults , Helper ) {

    
    $.fn.hx = function( action , options ) {

        options = options || {};
        options.order = Helper.object.getOrder.call( options );

        var hxm = new hx( this );

        if (typeof $.fn.hx[action] === 'function') {
            return $.fn.hx[action]( hxm , options );
        }
        else {
            return hxm;
        }
    };


    $.fn.hx.transform = function( hxm , options ) {
        options = $.extend( Defaults.transform , options );
        return hxm._set( 'transform' , options );
    };

 
}( jQuery , hxManager , hxManager.config.$hx , hxManager.helper ));





















