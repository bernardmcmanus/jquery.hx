hxManager.TransitionMOJO = (function( Object , Config , VendorPatch , Easing ) {


    var Config_defaults = Config.defaults;
    var MOJO_Each = MOJO.Each;


    var transitionDefaults = {
        duration: Config_defaults.duration,
        easing: Config_defaults.easing,
        delay: Config_defaults.delay
    };


    function TransitionMOJO() {
        MOJO.Construct( this );
    }


    TransitionMOJO.prototype = MOJO.Create({

        getString: function() {

            var that = this;
            var arr = [];

            MOJO_Each( that , function( options , type ) {

                var duration = options.duration;
                var easing = options.easing;
                var delay = options.delay;

                // don't add a component for transitions with duration and delay of 0
                if (duration < 1 && delay < 1) {
                    return '';
                }

                var str = getTransitionString( type , duration , easing , delay );
                arr.push( str );
            });
            
            return VendorPatch.getPrefixed(
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

    
}(
    Object,
    hxManager.Config,
    hxManager.VendorPatch,
    hxManager.Easing
));




























