hxManager.Animator = (function( Config , When ) {


    function Animator( options ) {

        var that = this;

        $.extend( that , Config , options );
        //this.listeners = this._getListeners();

        that.transitionEnd = that._transitionEnd.bind( that );

        Object.defineProperty( that , 'running' , {
            get: function() {
                return that.timeout !== null;
            }
        });
    }


    var Animator_prototype = (Animator.prototype = Object.create( When ));


    Animator_prototype.start = function() {

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
    };


    /*Animator_prototype._getListeners = function() {

        return {
            _transitionEnd: this._transitionEnd.bind( this )
        };
    };*/


    Animator_prototype._transitionEnd = function( e , data ) {

        var that = this;

        e.originalEvent = e.originalEvent || {};
        data = data || {};

        var name = e.originalEvent.propertyName || data.propertyName;
        var re = new RegExp( that.property , 'i' );
        
        if (re.test( name )) {
            that.destroy();
            that.happen( 'complete' );
        }
    };


    Animator_prototype.destroy = function() {
        
        var that = this;

        clearTimeout( that.timeout );
        that.timeout = null;
        $(that.node).off( that.eventType , that.transitionEnd );
    };


    /*function _createFallback( instance ) {

        var t = instance.duration + instance.delay + instance.buffer;

        var fallback = function() {
            var data = {propertyName: instance.property};
            $(instance.node).trigger( instance.eventType , data );
        };

        return setTimeout( fallback , t );
    }*/


    return Animator;

    
}( hxManager.Config.Animator , hxManager.When ));




























