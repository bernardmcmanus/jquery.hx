hxManager.DomNode = (function( Config , Helper , Get , KeyMap , Queue ) {

    
    function DomNode( element ) {

        // if this is already an hx element, return it
        if (typeof element._hx !== 'undefined') {
            return element;
        }

        // otherwise, create a new hx element
        return _init( this , element );
    }


    var hxModule = {

        checkDisplayState: function() {
            if (!_checkDisplayState( this )) {
                _prepHidden( this );
            }
        },

        getStyleString: function( type ) {

            var that = this;
            var stringMap = Config.maps.styleString;
            var order = that._hx.getOrder( type );

            var arr = order.map(function( name ) {
                var property = that._hx.getComponents( type , name );
                var map = getPropertyMap( name );
                if (map) {
                    return name + '(' + property.join( map.join ) + map.append + ')';
                }
                return property[0];
            });

            function getPropertyMap( name ) {
                var re;
                for (var key in stringMap) {
                    re = new RegExp( key , 'i' );
                    if (re.test( name )) {
                        return stringMap[key];
                    }
                }
                return false;
            }

            return arr.join( ' ' );
        },

        getComponents: function( type , property ) {
            var component = this._hx.components;
            if (type) {
                component[type] = (this._hx.components[type] = this._hx.components[type] || {});
                if (property) {
                    component[type][property] = component[type][property] || [];
                    return component[type][property];
                }
                return component[type];
            }
            return component;
        },

        _setComponent: function( type , newComponent ) {
            
            var that = this;
            var updated = {};

            var defaults = new KeyMap(
                Config.defaults[type] || Config.defaults.nonTransform
            )
            .scrub(
                Object.keys( newComponent )
            );

            new KeyMap( newComponent )
                .each(function( val , property ) {
                    if (Helper.array.compare( val , defaults[property] )) {
                        that._hx._deleteComponent( type , property );
                    }
                    else {
                        updated[property] = val;
                    }
                });

            updated = $.extend( that._hx.getComponents( type ) , updated );
            that._hx.components[type] = updated;
        },

        _deleteComponent: function( type , property ) {
            delete this._hx.components[type][property];
        },

        updateComponent: function( bean ) {

            var that = this;

            var type = bean.type;
            var compiled = bean.compiled;
            var defaults = bean.defaults;
            var rules = bean.rules;
            var newComponents = {};

            compiled.each(function( compiledProperty , name ) {

                var ruleProperty = rules[name];
                var defaultProperty = defaults[name].export();
                var storedProperty = $.extend( defaultProperty , that._hx.getComponents( type , name ));
                
                newComponents[name] = storedProperty.map(function( storedVal , i ) {

                    // if ruleProperty[i] is true, update the stored value
                    if (ruleProperty[i]) {
                        return mergeUpdates( storedVal , compiledProperty[i] );
                    }

                    // otherwise, leave it as is
                    return storedVal;
                });
            });

            function mergeUpdates( storedVal , newVal ) {
                var _eval = eval;
                var parts = _parseExpression( newVal );
                return (parts.op ? _eval(storedVal + parts.op + parts.val) : parts.val);
            }

            that._hx._setComponent( type , newComponents );
            this._hx._updateOrder( bean );

            return that._hx.getStyleString( type );
        },

        getOrder: function( type ) {
            var order = this._hx.order;
            if (type) {
                order[type] = (this._hx.order[type] = this._hx.order[type] || []);
                return order[type];
            }
            return order;
        },

        _setOrder: function( type , newOrder ) {
            this._hx.order[type] = newOrder;
        },

        _updateOrder: function( bean ) {
            var that = this;
            var type = bean.type;
            var storedOrder = that._hx.getOrder( type );
            var passedOrder = bean.order.passed.export();
            var computedOrder = bean.order.computed.export();
            var newOrder = (passedOrder.concat( storedOrder )).concat( computedOrder );
            that._hx._setOrder( type ,
                new KeyMap( newOrder )
                    .unique()
                    .scrub(
                        Object.keys( that._hx.getComponents( type ))
                    )
                    .export()
            );
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
            return this._hx.queue.current;
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
            type: bean.type,
            xform: bean.original,
            options: bean.options
        });
    }


    function beanComplete( bean ) {
        $(this).trigger( 'hx.xformComplete' , {
            type: bean.type,
        });
        bean.options.done.call( this );
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


    function _parseExpression( exp ) {

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


    return DomNode;

    
}( hxManager.Config , hxManager.Helper , hxManager.Get , hxManager.KeyMap , hxManager.Queue ));



























