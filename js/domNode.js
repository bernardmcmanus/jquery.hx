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


    var hxModule = {

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

        applyXform: function( property , passed , xformString , options ) {

            $(this).trigger( 'hx.applyXform' , {
                property: property,
                xform: passed,
                options: options
            });

            this._hx.queue.push( property , xformString , options );
        },

        cleanup: function() {

            Config.removeOnClean.forEach(function( key ) {

                delete this[key];

            }.bind( this ));
        }

    };


    var queueHooks = {

        instanceComplete: function( property ) {
            console.log(property + ' instance complete.');
        },

        branchComplete: function( property ) {
            console.log(property + ' branch complete.');
        },

        queueComplete: function() {
            console.log('queue complete.');
        }
    };


    function _init( node ) {

        var _node = $.extend( node , this );
        var _queueHooks = getScopedModule( _node , queueHooks );
        var _hxModule = getScopedModule( _node , hxModule );

        _node._hx = $.extend({
            queue: new Queue( _node , _queueHooks ),
            components: {}
        } , _hxModule );

        return _node;
    }

    
    function getScopedModule( context , module ) {

        var _module = {};

        for (var key in module) {
            _module[key] = module[key].bind( context );
        }

        return _module;
    }

    
    function _checkDisplayState( node ) {
        
        var hx_display = _getHXDisplay( node );
        var style = node.style.display;
        var response = null;

        if (hx_display === null) {
            
            var computed = getComputedStyle( node ).display;

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

            _setHXDisplay( node , hx_display );

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

    
    function _getHXDisplay( node ) {
        var hx_display = typeof node.hx_display !== 'undefined' ? node.hx_display : null;
        if (hx_display !== null) {
            hx_display = parseInt( hx_display , 10 );
        }
        return hx_display;
    }

    
    function _setHXDisplay( node , value ) {
        node.hx_display = value;
    }

    
    function _prepHidden( node ) {
        node.style.visibility = 'hidden';
        node.style.display = 'block';
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



























