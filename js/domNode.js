(function( hx ) {


    var config = {
        removeOnClean: [ '_hx' , 'hx_display' ]
    };

    
    var domNode = function( element ) {

        // make sure an element is passed to the constructor
        if (!element)
            throw 'Error: You must pass an element to the hxManager.domNode constructor.';

        // check the element's hx_display code
        if (!_checkDisplayState.call( this , element ))
            _prepHidden.call( this , element );

        // if this is already an hx element, return it
        if (typeof element._hx !== 'undefined')
            return element;

        // otherwise, create a new hx element
        return _init.call( this , element );
    };

    domNode.prototype = {

        cleanup: function() {
            config.removeOnClean.forEach(function( key ) {
                delete this[key];
            }.bind( this ));
        }

    };


    var _hxProto = {

        trigger: function() {
            var event = new hx.event( arguments );
            this.dispatchEvent( event );
        }

    };


    function _init( element ) {

        var that = $.extend( element , this );

        that._hx = $.extend({
            queue: {},
            components: {}
        } , _getScopedProto.call( that ));

        that._hx.trigger( 'init' );

        return that;
    }

    function _getScopedProto() {

        var _proto = $.extend( {} , _hxProto );

        for (var key in _proto) {
            _proto[key] = _proto[key].bind( this );
        }

        return _proto;
    }

    function _checkDisplayState( element ) {
        
        var hx_display = _getHXDisplay( element );
        var style = element.style.display;
        var response = null;

        if (hx_display === null) {
            
            var computed = window.getComputedStyle( element ).display;

            // determine the hx_display code
            if (computed !== 'none' && style === '') {
                // visible, not styled inline
                hx_display = 0;
            } else if (computed !== 'none' && computed === style) {
                // visible, styled inline
                hx_display = 1;
            } else if (computed === 'none' && style === '') {
                // hidden, not styled inline
                hx_display = 2;
            } else if (computed === 'none' && computed === style) {
                // hidden, styled inline
                hx_display = 3;
            }

            _setHXDisplay( element , hx_display );

        }

        // determine the boolean response
        switch (hx_display) {
            case 0:
            case 3:
                response = (style !== 'none');
                break;
            case 1:
            case 2:
                response = (style !== 'none' && style !== '');
                break;
        }

        return response;

    }

    function _getHXDisplay( element ) {
        var hx_display = typeof element.hx_display !== 'undefined' ? element.hx_display : null;
        if (hx_display !== null)
            hx_display = parseInt( hx_display , 10 );
        return hx_display;
    }

    function _setHXDisplay( element , value ) {
        element.hx_display = value;
    }

    function _prepHidden( element ) {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
    }


    // push the contents of the prototype to config.removeOnClean
    (function() {
        for (var key in domNode.prototype) {
            config.removeOnClean.push( key );
        }
    }());


    $.extend( hx , {domNode: domNode} );
    
}( hxManager ));



























