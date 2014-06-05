(function( window , hx , Config , When ) {

    var animator = function( options ) {

        options = $.extend({
            timeout: null,
            buffer: Config.buffer,
            running: false
        }, options );

        $.extend( this , options );

        // create the when module
        When( this );

        this.listeners = this._getListeners();
    };

    animator.prototype = {
        
        start: function() {

            this.running = true;

            $(this.node).on( this.eventType , this.listeners._transitionEnd );

            if (this.fallback !== false) {
                this.timeout = _createFallback( this );
            }
        },

        isRunning: function() {
            return this.running === true;
        },

        _getListeners: function() {

            return {
                _transitionEnd: this._transitionEnd.bind( this )
            };
        },

        _transitionEnd: function( e , data ) {

            e.originalEvent = e.originalEvent || {};
            data = data || {};

            var name = e.originalEvent.propertyName || data.propertyName;
            var re = new RegExp( this.property , 'i' );
            
            if (re.test( name )) {
                this.destroy();
                this.happen( 'complete' );
            }
        },

        destroy: function() {
            clearTimeout( this.timeout );
            this.running = false;
            $(this.node).off( this.eventType , this.listeners._transitionEnd );
        }
    };


    function _createFallback( instance ) {

        var t = instance.duration + instance.delay + instance.buffer;

        var fallback = function() {
            var data = {propertyName: instance.property};
            $(instance.node).trigger( instance.eventType , data );
        };

        return setTimeout( fallback , t );
    }


    $.extend( hx , {animator: animator} );

    
}( window , hxManager , hxManager.config.animator , hxManager.when ));




























