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
        return _init( this , element );
    };


    var hxModule = {

        checkDisplayState: function() {
            if (!_checkDisplayState( this )) {
                _prepHidden( this );
            }
        },

        updateComponent: function( bean ) {

            var type = bean.getData( 'type' );
            var raw = bean.getData( 'raw' );
            var defs = bean.getData( 'defaults' );
            var rules = bean.getData( 'rules' );
            
            var component = (this._hx.components[type] = this._hx.components[type] || {});
            var nodeOrder = (this._hx.order[type] = this._hx.order[type] || []);
            
            var xformInst = {};
            var instOrder = bean.getData( 'xform' ).mapped.order;

            Helper.object.each( raw , function( val , key , i ) {
                
                xformInst[key] = (component[key] || defs[key]);
                xformInst[key] = (xformInst[key].length === defs[key].length ? xformInst[key] : defs[key]);
                
                xformInst[key] = raw[key].map(function( value , i ) {

                    var _eval = eval;
                    var exp = _extractOperator( value );
                    var result = null;

                    if (rules[key][i]) {
                        result = exp.op ? _eval(xformInst[key][i] + exp.op + exp.val) : exp.val;
                    }
                    else {
                        result = xformInst[key][i];
                    }

                    return result;
                });
            });

            $.extend( component , xformInst );
            this._hx.order[type] = Get.extendedOrder( nodeOrder , instOrder );

            return Get.xformString( type , component , defs , this._hx.order[type] );
        },

        addXformPod: function( pod ) {

            pod.when( 'beanStart' , beanStart , this );
            pod.when( 'beanComplete' , beanComplete , this );
            pod.when( 'clusterComplete' , clusterComplete , this );
            pod.when( 'podComplete' , podComplete , this );
            pod.when( 'podCanceled' , xformCanceled , this );

            this._hx.queue.pushPod( pod );
        },

        addPromisePod: function( pod ) {

            pod.when( 'podComplete' , podComplete , this );
            pod.when( 'podCanceled' , promiseCanceled , this );

            this._hx.queue.pushPod( pod );
        },

        clearQueue: function( all ) {
            this._hx.queue.clear( all );
        },

        getCurrentPod: function() {
            return this._hx.queue.getCurrent();
        },

        getPodCount: function( type ) {
            return this._hx.queue.getPodCount( type );
        },

        cleanup: function() {

            Config.removeOnClean.forEach(function( key ) {
                delete this[key];
            }.bind( this ));
        }
    };


    function beanStart( bean ) {
        $(this).trigger( 'hx.xformStart' , {
            type: bean.getData( 'type' ),
            xform: bean.getData( 'xform' ).passed,
            options: bean.getData( 'options' )
        });
    }


    function beanComplete( bean ) {
        $(this).trigger( 'hx.xformComplete' , {
            type: bean.getData( 'type' ),
        });
        bean.getData( 'done' ).call( this );
    }

    function clusterComplete( type ) {
        // do something on cluster complete
    }

    function podComplete( pod ) {
        this._hx.queue.next();
    }

    function xformCanceled( pod ) {
        pod.dispel( 'beanComplete' );
        pod.dispel( 'clusterComplete' );
        pod.dispel( 'podComplete' );
    }

    function promiseCanceled( pod ) {
        pod.dispel( 'podComplete' );
    }


    function _init( instance , element ) {

        var _node = $.extend( element , instance );
        var _hxModule = Get.scopedModule( hxModule , _node );

        _node._hx = $.extend({
            queue: new Queue(),
            components: {},
            order: {}
        } , _hxModule );

        return _node;
    }

    
    function _checkDisplayState( instance ) {
        
        var hx_display = _getHXDisplay( instance );
        var style = instance.style.display;
        var response = null;

        if (hx_display === null) {
            
            var computed = getComputedStyle( instance ).display;

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

            _setHXDisplay( instance , hx_display );

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

    
    function _getHXDisplay( instance ) {
        var hx_display = typeof instance.hx_display !== 'undefined' ? instance.hx_display : null;
        if (hx_display !== null) {
            hx_display = parseInt( hx_display , 10 );
        }
        return hx_display;
    }

    
    function _setHXDisplay( instance , value ) {
        instance.hx_display = value;
    }

    
    function _prepHidden( instance ) {
        instance.style.opacity = 0;
        instance.style.display = 'block';
        // trigger a dom reflow
        instance.getBoundingClientRect();
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



























