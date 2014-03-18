(function( window , hx ) {

    var animator = function( options ) {

        options = $.extend({
            timeout: null,
            buffer: 50,
            running: false
        }, options );

        $.extend( this , options );

        this.listeners = this._getListeners();
    };

    animator.prototype = {
        
        start: function() {

            this.running = true;

            $(this.node).on( this.eventType , this.listeners._transitionEnd );

            if (this.fallback !== false) {
                this.timeout = _createFallback.call( this );
            }
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
                this._complete();
            }
        },

        destroy: function() {
            clearTimeout( this.timeout );
            this.running = false;
            $(this.node).off( this.eventType , this.listeners._transitionEnd );
        }
    };


    function _createFallback() {

        var t = this.duration + this.delay + this.buffer;

        var fallback = function() {
            var data = {propertyName: this.property};
            $(this.node).trigger( this.eventType , data );
        }.bind( this );

        return setTimeout( fallback , t );
    }


    $.extend( hx , {animator: animator} );

    
}( window , hxManager ));




























