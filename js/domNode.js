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

        once: function( event , callback ) {
            this.addEventListener( event , function temp() {
                this.removeEventListener( event , temp );
                callback.apply( this , arguments );
            }.bind( this ));
        },

        cleanup: function() {
            config.removeOnClean.forEach(function( key ) {
                delete this[key];
            }.bind( this ));
        }

    };


    var _hxProto = {

        /*getComputedMatrix: function() {
            
            var matrix = hx.vendorPatch.getComputedMatrix( this );

            if (_isHXTransform( matrix ) !== false) {
                
                matrix = _parse( matrix );
                
                if (matrix.transform.length < 1)
                    return null;

                return matrix;

            } else {
                return null;
            }
        },*/

        setXformData: function( property , raw , options ) {

            this._hx.components[property] = this._hx.components[property] || {};

            // delete computed matrix if this is not a relative transformation
            /*if (options.relative === false && property === 'transform')
                delete this._hx.components[property].computed;*/

            // build the component array
            this._hx.components[property] = $.extend( this._hx.components[property] , raw );
            
            //console.log(this);
        },

        applyXform: function( property , xformString , options ) {

            this._hx.queue[property] = this._hx.queue[property] || [];

            //console.log(xformString);

            var animatorConfig = $.extend({
                node: this,
                property: property,
                value: xformString,
                eventType: hx.vendorPatch.getEventType(),
                complete: function() {}
            } , options );

            // add the new animation instance to the queue
            this._hx.queue[property].push(new hx.animator( animatorConfig ));

            if (this._hx.queue[property].length > 1) {
                console.log('queue length is ' + this._hx.queue[property].length);
                return;
            }

            // build and apply the transition string
            this._hx.setTransition( property , options );

            // start the animation instance
            _applyXform( this , property , xformString );
        },

        setTransition: function( property , options ) {
            
            options = options || {};

            // if easing was passed in the options object, get the corresponding bezier
            if (options.easing)
                options.easing = hx._easing( options.easing );

            var tempQueue = {};
            tempQueue[ property ] = [];

            if (this._hx.queue[ property ][0]) {
                // if the property already exists in the queue, extend it with the new options
                this._hx.queue[ property ][0] = $.extend( this._hx.queue[ property ][0] , options );
            } else {
                // otherwise, populate tempQueue with defaults
                tempQueue[ property ][0] = {
                    easing: typeof options.easing !== 'undefined' ? options.easing : 'ease',
                    duration: options.duration || 0,
                    delay: options.delay || 0
                };
            }

            // extend tempQueue with the instance queue
            $.extend( tempQueue , this._hx.queue );

            // construct the transition string
            var tString = _buildTransitionString( tempQueue );
            tString = hx.vendorPatch.getPrefixed( tString );

            // add vendor prefixes
            var tProp = hx.vendorPatch.getPrefixed( 'transition' );

            // if the element's style is already equal to the new transition string, don't apply it
            if (this.style.transition === tString)
                return;

            $(this).css( tProp , tString );

            // trigger the hx_setTransition event
            this._hx.trigger( 'setTransition' , property , tString );
        },

        trigger: function() {
            var event = new hx.event( arguments );
            this.dispatchEvent( event );
        },

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

    function _buildTransitionString( queue ) {
        
        var arr = [];
        
        for (var key in queue) {
            var component = key + ' ' + queue[key][0].duration + 'ms ' + queue[key][0].easing + ' ' + queue[key][0].delay + 'ms';
            if (arr.indexOf( component ) < 0)
                arr.push( component );
        }

        return arr.join(', ');
    }

    function _applyXform( node , property , value ) {

        // apply the style string and start the fallback timeout
        var transform = {
            property: hx.vendorPatch.getPrefixed( property ),
            value: hx.vendorPatch.getPrefixed( value )
        };
        
        $(node).css( transform.property , transform.value );
        node._hx.queue[ property ][0].start();

        // trigger the hx_applyXform event
        //node._hx.trigger( 'applyXform' , property , transform.value , options );
    }


    // push the contents of the prototype to config.removeOnClean
    (function() {
        for (var key in domNode.prototype) {
            config.removeOnClean.push( key );
        }
    }());


    $.extend( hx , {domNode: domNode} );
    
}( hxManager ));



























