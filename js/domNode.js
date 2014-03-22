(function( window , hx , Config , Helper , Get , Queue ) {

    
    var domNode = function( element ) {

        // make sure an element is passed to the constructor
        if (!element) {
            throw 'Error: You must pass an element to the hxManager.domNode constructor.';
        }

        // if this is already an hx element, return it
        if (typeof element._hx !== 'undefined') {
            return element;
        }

        // otherwise, create a new hx element
        return _init.call( this , element );
    };


    var hxModule = {

        checkDisplayState: function() {
            if (!_checkDisplayState.call( this , this )) {
                _prepHidden.call( this , this );
            }
        },

        updateComponent: function( bean ) {

            var type = bean.getData( 'type' );
            var raw = bean.getData( 'raw' );
            var defs = bean.getData( 'defaults' );
            var rules = bean.getData( 'rules' );
            
            var component = (this._hx.components[type] = this._hx.components[type] || {});
            var nodeOrder = (this._hx.order[type] = this._hx.order[type] || []);
            
            var instance = {};
            var instOrder = bean.getData( 'xform' ).mapped.order;

            Helper.object.each( raw , function( val , key , i ) {
                
                instance[key] = (component[key] || defs[key]);
                instance[key] = (instance[key].length === defs[key].length ? instance[key] : defs[key]);
                
                instance[key] = raw[key].map(function( value , i ) {

                    var _eval = eval;
                    var exp = _extractOperator( value );
                    var result = null;

                    if (rules[key][i]) {
                        result = exp.op ? _eval(instance[key][i] + exp.op + exp.val) : exp.val;
                    }
                    else {
                        result = instance[key][i];
                    }

                    return result;
                });
            });

            $.extend( component , instance );
            this._hx.order[type] = Get.extendedOrder( nodeOrder , instOrder );

            return Get.xformString( type , component , defs , this._hx.order[type] );
        },

        addXformPod: function( pod ) {

            pod.when( 'beanStart' , podHooks.beanStart , this );
            pod.when( 'beanComplete' , podHooks.beanComplete , this );
            pod.when( 'clusterComplete' , podHooks.clusterComplete , this );
            pod.when( 'podComplete' , podHooks.podComplete , this );

            this._hx.queue.pushPod( pod );
        },

        addPromisePod: function( pod ) {

            pod.when( 'podComplete' , podHooks.podComplete , this );

            this._hx.queue.pushPod( pod );
        },

        cleanup: function() {

            Config.removeOnClean.forEach(function( key ) {
                delete this[key];
            }.bind( this ));
        }

    };


    var podHooks = {

        beanStart: function( bean ) {

            $(this).trigger( 'hx.xformStart' , {
                type: bean.getData( 'type' ),
                xform: bean.getData( 'xform' ).passed,
                options: bean.getData( 'options' )
            });
        },

        beanComplete: function( bean ) {
            
            $(this).trigger( 'hx.xformComplete' , {
                type: bean.getData( 'type' ),
            });

            bean.animator.done.call( this );
        },

        clusterComplete: function( type ) {
            //console.log(type + ' cluster complete.');
        },

        podComplete: function( pod ) {
            if (!this._hx.queue.next()) {
                //console.log('queue complete.');
            }

        }
    };


    function _init( node ) {

        var _node = $.extend( node , this );
        var _hxModule = Get.scopedModule( hxModule , _node );

        _node._hx = $.extend({
            queue: new Queue(),
            components: {},
            order: {}
        } , _hxModule );

        return _node;
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
        node.style.opacity = 0;
        node.style.display = 'block';
        // trigger a dom reflow
        node.getBoundingClientRect();
    }


    function _extractOperator( exp ) {

        var re = /((\+|\-|\*|\/|\%){1})+\=/;
        var out = {op: null, val: 0};

        var match = re.exec( exp );

        if (match) {
            out.op = match[1];
            exp = exp.replace( re , '' );
        }

        out.val = exp;

        if (out.op) {
            out.val = parseFloat( out.val , 10 );
        }
        
        return out;
    }


    $.extend( hx , {domNode: domNode} );

    
}( window , hxManager , hxManager.config , hxManager.helper , hxManager.get , hxManager.queue ));



























