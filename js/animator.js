hxManager.Animator = (function( Config ) {


    var Object_defineProperty = Object.defineProperty;


    function Animator( options ) {

        var that = this;

        $.extend( that , Config , options );

        that.transitionEnd = that._transitionEnd.bind( that );
        var handlers = {};

        Object_defineProperty( that , 'handlers' , {
            get: function() {
                return handlers;
            }
        });

        Object_defineProperty( that , 'running' , {
            get: function() {
                return that.timeout !== null;
            }
        });
    }


    var Animator_prototype = (Animator.prototype = new MOJO());


    Animator_prototype.set( 'start' , function() {

        var that = this;

        $(that.node).on( that.eventType , that.transitionEnd );

        that.timeout = (function() {
            if (that.fallback === false) {
                return 1;
            }
            else {
                var t = that.duration + that.delay + that.buffer;
                return setTimeout( fallback , t );
            }
        }());

        function fallback() {
            var data = {propertyName: that.property};
            $(that.node).trigger( that.eventType , data );
        }
    });


    Animator_prototype.set( '_transitionEnd' , function( e , data ) {

        var that = this;

        e.originalEvent = e.originalEvent || {};
        data = data || {};

        var name = e.originalEvent.propertyName || data.propertyName;
        var re = new RegExp( that.property , 'i' );
        
        if (re.test( name )) {
            that.destroy();
            that.happen( 'animatorComplete' );
        }
    });


    Animator_prototype.set( 'destroy' , function() {
        
        var that = this;

        clearTimeout( that.timeout );
        that.timeout = null;
        $(that.node).off( that.eventType , that.transitionEnd );
    });


    return Animator;

    
}( hxManager.Config.Animator ));




























