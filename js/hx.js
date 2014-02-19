(function( $ ) {

    
    $.fn.hx = function( action , options ) {
        
        var nodes = [];

        $(this).each(function() {
            nodes.push(new hxManager.domNode( this ));
        });

        var hxm = new hxManager( nodes );

        if (typeof $.fn.hx[action] === 'function')
            $.fn.hx[action].call( hxm , options );

        return hxm;
    };


    $.fn.hx.transform = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 0,
            relative: true
        }, (options || {}));

        var xform = mapComponentKeys( options );

        if (options.relative) {
            this.apply( 'transform' , xform );
        } else {
            this.set( 'transform' , xform );
        }
    };


    function mapComponentKeys( obj ) {
        var map = {
            translate: 'translate3d',
            scale: 'scale3d',
            rotate: 'rotate3d'
        };
        for (var key in obj) {
            if (!map[key])
                continue;
            obj[map[key]] = obj[key];
            delete obj[key];
        }
        return obj;
    }

 
}( jQuery ));





















