(function( hx , Config , Get , Queue ) {

    
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

        updateComponent: function( bean ) {
            
            var component = (this._hx.components[bean.type] = this._hx.components[bean.type] || {});
            
            for (var key in bean.raw) {
                
                component[key] = (component[key] || bean.defaults[key]);

                component[key] = (component[key].length === bean.defaults[key].length ? component[key] : bean.defaults[key]);
                
                component[key] = bean.raw[key].map(function( a , b ) {
                    var exp = _extractOperator( a );
                    return exp.op ? eval(component[key][b] + exp.op + exp.val) : exp.val;
                });
            }

            return Get.xformString( bean.type , component , bean.defaults , bean.xform.mapped.order );
        },

        addPod: function( pod ) {

            var _podHooks = Get.scopedModule( podHooks , this );
            pod.setHooks( _podHooks );

            this._hx.queue.pushPod( pod );
        },

        setHooks: function( hooks ) {
            this._hx.hooks = hooks;
        },

        cleanup: function() {

            Config.removeOnClean.forEach(function( key ) {

                delete this[key];

            }.bind( this ));
        }

    };


    var podHooks = {

        beanStart: function( bean ) {

            $(this).trigger( 'hx.applyXform' , {
                property: bean.type,
                xform: bean.xform.passed,
                options: bean.options
            });
        },

        beanComplete: function( bean ) {
            bean.animator.done.call( this );
        },

        clusterComplete: function( property ) {
            //console.log(property + ' cluster complete.');
        },

        podComplete: function() {

            if (!this._hx.queue.next()) {
                console.log('queue complete.');
            }

        }
    };


    function _init( node ) {

        var _node = $.extend( node , this );
        var _hxModule = Get.scopedModule( hxModule , _node );

        _node._hx = $.extend({
            queue: new Queue(),
            components: {},
            hooks: {}
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

    
}( hxManager , hxManager.config , hxManager.get , hxManager.queue ));



























