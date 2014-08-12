hxManager.TransitionMOJO = (function( MOJO , VendorPatch , Easing ) {


    function TransitionMOJO() {
        MOJO.Construct( this );
    }


    TransitionMOJO.prototype = MOJO.Create({

        getString: function() {

            var that = this;
            var arr = [];

            that.each(function( options , type ) {

                var duration = options.duration;
                var easing = options.easing;
                var delay = options.delay;
                var str = getTransitionString( type , duration , easing , delay );

                arr.push( str );
            });
            
            return VendorPatch.prefix(
                arr.join( ', ' )
            );
        },

        setTransition: function( bean ) {
            this.set( bean.type , getTransitionObject( bean ));
        },

        deleteTransition: function( type ) {
            this.remove( type );
        }
    });


    function getTransitionObject( bean ) {
        var options = bean.options;
        return {
            duration: options.duration,
            easing: Easing( options.easing ).string,
            delay: options.delay
        };
    }


    function getTransitionString( type , duration , easing , delay ) {
        return (type + ' ' + duration + 'ms ' + easing + ' ' + delay + 'ms');
    }


    return TransitionMOJO;

    
}( MOJO , hxManager.VendorPatch , hxManager.Easing ));




























