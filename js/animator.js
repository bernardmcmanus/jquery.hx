(function( window , hx , Config , When ) {

    function Animator( options ) {

        $.extend( this , Config , options );
        this.listeners = this._getListeners();

        Object.defineProperty( this , 'running' , {
            get: function() {
                return this.timeout !== null;
            }
        });
    }


    Animator.prototype = Object.create( When );


    Animator.prototype.start = function() {

        //this.running = true;

        $(this.node).on( this.eventType , this.listeners._transitionEnd );

        /*if (this.fallback !== false) {
            this.timeout = _createFallback( this );
        }*/
        this.timeout = (this.fallback !== false ? _createFallback( this ) : 1);
    };


    Animator.prototype._getListeners = function() {

        return {
            _transitionEnd: this._transitionEnd.bind( this )
        };
    };


    Animator.prototype._transitionEnd = function( e , data ) {

        e.originalEvent = e.originalEvent || {};
        data = data || {};

        var name = e.originalEvent.propertyName || data.propertyName;
        var re = new RegExp( this.property , 'i' );
        
        if (re.test( name )) {
            this.destroy();
            this.happen( 'complete' );
        }
    };


    Animator.prototype.destroy = function() {
        clearTimeout( this.timeout );
        this.timeout = null;
        $(this.node).off( this.eventType , this.listeners._transitionEnd );
    };


    /*Animator.prototype = {
        
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
    };*/


    function _createFallback( instance ) {

        var t = instance.duration + instance.delay + instance.buffer;

        var fallback = function() {
            var data = {propertyName: instance.property};
            $(instance.node).trigger( instance.eventType , data );
        };

        return setTimeout( fallback , t );
    }


    $.extend( hx , { Animator : Animator });

    
}( window , hxManager , hxManager.Config.Animator , hxManager.When ));




























