(function( $ ) {

    
    $.fn.hx = function( action , options ) {

        options.order = hxManager.helper.object.getOrder.call( options );
        
        var nodes = [];

        $(this).each(function() {
            nodes.push(new hxManager.domNode( this ));
        });

        var hxm = new hxManager( nodes );

        if (typeof $.fn.hx[action] === 'function')
            $.fn.hx[action].call( hxm , options );

        /*nodes.forEach(function( node ) {
            node.cleanup();
        });*/

        return hxm;
    };


    $.fn.hx.transform = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 0,
            relative: true,
            fallback: true
        }, (options || {}));

        this.set( 'transform' , options );
    };

 
}( jQuery ));





















