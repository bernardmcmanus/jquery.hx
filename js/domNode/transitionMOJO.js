hxManager.TransitionMOJO = (function( Config , Helper , VendorPatch , Easing ) {


    var Config_defaults = Config.defaults;
    var Helper_each = Helper.each;


    var transitionDefaults = {
        duration: Config_defaults.duration,
        easing: Config_defaults.easing,
        delay: Config_defaults.delay
    };


    function TransitionMOJO() {
        MOJO.Hoist( this );
    }


    var TransitionMOJO_prototype = (TransitionMOJO.prototype = new MOJO());


    TransitionMOJO_prototype.getString = function() {

        var that = this;
        var arr = [];

        Helper_each( that , function( options , type ) {

            var duration = options.duration;
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
            easing: Easing( options.easing ),
            delay: options.delay
        };
    }


    function getTransitionString( type , duration , easing , delay ) {
        return (type + ' ' + duration + 'ms ' + easing + ' ' + delay + 'ms');
    }


    return TransitionMOJO;

    
}( hxManager.Config , hxManager.Helper , hxManager.VendorPatch , hxManager.Easing ));




























