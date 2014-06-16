hxManager.TransitionMOJO = (function( Config , Helper , VendorPatch ) {


    var Config_defaults_options = Config.defaults.options;
    var Helper_each = Helper.each;



    var transitionDefaults = {
        duration: Config_defaults_options.duration,
        easing: Config_defaults_options.easing,
        delay: Config_defaults_options.delay
    };


    function TransitionMOJO() {
        MOJO.Hoist( this );
    }


    var TransitionMOJO_prototype = (TransitionMOJO.prototype = new MOJO());


    TransitionMOJO_prototype.getString = function() {

        var that = this;
        var arr = [];

        Helper_each( that , function( options , type ) {

            // android native browser won't respond to zero duration when cancelling a transition
            var duration = VendorPatch.getDuration( options.duration );
            var easing = options.easing;
            var delay = options.delay;

            // don't add a component for transitions with duration and delay of 0
            if (duration < 1 && delay < 1) {
                return;
            }

            var str = getTransitionString( type , duration , easing , delay );
            arr.push( str );
        });
        
        return VendorPatch.getPrefixed(
            arr.join( ', ' )
        );
    };


    TransitionMOJO_prototype.setTransition = function( bean ) {
        this.set( bean.type , getTransitionObject( bean ));
    };


    TransitionMOJO_prototype.deleteTransition = function( type ) {
        this.remove( type );
    };


    function getTransitionObject( bean ) {
        var options = bean.options;
        return {
            duration: options.duration,
            easing: options.easing,
            delay: options.delay
        };
    }


    function getTransitionString( type , duration , easing , delay ) {
        return (type + ' ' + duration + 'ms ' + easing + ' ' + delay + 'ms');
    }


    return TransitionMOJO;

    
}( hxManager.Config , hxManager.Helper , hxManager.VendorPatch ));




























