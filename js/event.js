(function( hx ) {

    var event = function( args ) {

        var type = args[0];
        var _args = Array.prototype.slice.call( args , 1 );
        var evt = {};

        if (typeof _constructors[type] === 'function') {
            evt = _constructors[type].apply( this , _args );
        } else {
            evt = _create( type , _args[0] );
        }

        return evt;
    };


    var _constructors = {

        init: function() {
            return _create( 'hx_init' , {} , false , true );
        },

        setTransition: function( property , string ) {
            return _create( 'hx_setTransition' , {
                propertyName: property,
                string: string
            } , false , true );
        },

        applyXform: function( property , string , xform ) {
            return _create( 'hx_applyXform' , {
                propertyName: property,
                string: string,
                xform: xform
            } , false , true );
        },

        transitionEnd: function( property ) {
            return _create( 'hx_transitionEnd' , {
                propertyName: property
            } , false , true );
        },

        fallback: function( property ) {
            return _create( 'hx_fallback' , {
                propertyName: property
            } , false , true );
        },

        cancel: function() {
            return _create( 'hx_cancel' , {} , false , true );
        },

        done: function() {
            return _create( 'hx_done' , {} , false , true );
        }

    };

    function _create( type , detail , bubbles , cancelable ) {

        if (!type)
            return;

        detail = detail || {};
        bubbles = typeof bubbles !== 'undefined' ? bubbles : true;
        cancelable = typeof cancelable !== 'undefined' ? cancelable : true;

        var evt = {};

        try {
            evt = new CustomEvent( type , {
                bubbles: bubbles,
                cancelable: cancelable,
                detail: detail
            });
        } catch( err ) {
            evt = document.createEvent( 'Event' );
            evt.initEvent( type , bubbles , cancelable );
            evt.detail = detail;
        }

        return evt;
    }




    $.extend( hx , {event: event} );
    
}( hxManager ));



























