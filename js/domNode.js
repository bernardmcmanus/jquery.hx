(function( hx , Config , Queue ) {

    
    var domNode = function( element ) {

        // make sure an element is passed to the constructor
        if (!element) {
            throw 'Error: You must pass an element to the hxManager.domNode constructor.';
        }

        // check the element's hx_display code
        if (!_checkDisplayState.call( this , element )) {
            _prepHidden.call( this , element );
        }

        // if this is already an hx element, return it
        if (typeof element._hx !== 'undefined') {
            return element;
        }

        // otherwise, create a new hx element
        return _init.call( this , element );
    };


    var _hxProto = {

        updateComponent: function( property , raw , defaults ) {
            
            var component = (this._hx.components[property] = this._hx.components[property] || {});
            
            for (var key in raw) {
                component[key] = component[key] || defaults[key];
                component[key] = raw[key].map(function( a , b ) {
                    var exp = _extractOperator( a );
                    return exp.op ? eval(component[key][b] + exp.op + exp.val) : exp.val;
                });
            }
        },

        applyXform: function( property , xformString , options ) {

            this._hx.queue.add( property , xformString , options );
            
        },

        once: function( event , callback ) {
            $(this).on( event , function temp() {
                $(this).off( event , temp );
                callback.apply( this , arguments );
            }.bind( this ));
        },

        cleanup: function() {
            Config.removeOnClean.forEach(function( key ) {
                delete this[key];
            }.bind( this ));
        },

        /*trigger: function() {
            var event = new hx.event( arguments );
            this.dispatchEvent( event );
        }*/

    };


    var transition = {

        start: function( xform , property , options ) {
            //this._hx.trigger( 'applyXform' , property , xform.value , options );
        },

        complete: function( e , property ) {

            //this._hx.trigger( 'transitionEnd' , property );
            this._hx.queue[ property ].splice( 0 , 1 );

            var next = this._hx.queue[ property ][0];

            if (typeof next !== 'undefined' && !next.running) {
                next.start();
            }
        }

    };


    function getScopedModule( context , module , scopeArgs ) {

        var _module = $.extend( {} , module );

        for (var key in _module) {

            _module[key] = (function( func , _scopeArgs ) {

                _scopeArgs = _scopeArgs || [];

                return function() {

                    var args = Array.prototype.slice.call( arguments , 0 );

                    _scopeArgs.forEach(function( a ) {
                        args.push( a );
                    });

                    func.apply( this , args );

                }.bind( context );

            }( _module[key] , scopeArgs[key] ));
            
        }

        return _module;
    }


    function _init( node ) {

        var _node = $.extend( node , this );

        _node._hx = $.extend({
            queue: new Queue( _node ),
            components: {}
        } , _getScopedProto.call( _node ));

        return _node;
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
            }
            else if (computed !== 'none' && computed === style) {
                // visible, styled inline
                hx_display = 1;
            }
            else if (computed === 'none' && style === '') {
                // hidden, not styled inline
                hx_display = 2;
            }
            else if (computed === 'none' && computed === style) {
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
        if (hx_display !== null) {
            hx_display = parseInt( hx_display , 10 );
        }
        return hx_display;
    }

    
    function _setHXDisplay( element , value ) {
        element.hx_display = value;
    }

    
    function _prepHidden( element ) {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
    }


    function _extractOperator( exp ) {

        var re = /((\+|\-|\*|\/|\%){1})+\=/;
        var out = {op: null, val: 0};

        var match = re.exec( exp );

        if (match) {
            out.op = match[1];
            exp = exp.replace( re , '' );
        }

        out.val = parseFloat( exp , 10 );
        return out;
    }


    $.extend( hx , {domNode: domNode} );

    
}( hxManager , hxManager.config , hxManager.queue ));



























