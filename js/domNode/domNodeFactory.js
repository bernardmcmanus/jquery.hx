hxManager.DomNodeFactory = (function( Config , VendorPatch , Queue , ComponentMOJO , TransitionMOJO ) {

    
    var MOJO_Each = MOJO.Each;


    function DomNodeFactory( element ) {

        // if this is already an hx element, return it
        if (typeof element._hx !== 'undefined') {
            return element;
        }

        // otherwise, create a new hx element
        var _hxModule = new MOJO(
            getScopedModule( hxModule , element )
        );

        _hxModule.queue = new Queue();
        _hxModule.componentMOJO = new ComponentMOJO();
        _hxModule.transitionMOJO = new TransitionMOJO();

        element._hx = _hxModule;

        return element;
    }


    var hxModule = {

        paint: function( type ) {

            var that_hx = this._hx;
            var style = {}, property, string;

            if (type === undefined) {
                type = Object.keys( that_hx.componentMOJO.getOrder() );
            }
            else {
                type = (type instanceof Array ? type : [ type ]);
            }

            for (var i = 0; i < type.length; i++) {
                property = VendorPatch.getPrefixed( type[i] );
                string = that_hx.getStyleString( type[i] );
                style[property] = string;
            }

            $(this).css( style );
        },

        setTransition: function( bean ) {
            this._hx.transitionMOJO.setTransition( bean );
        },

        deleteTransition: function( type ) {
            this._hx.transitionMOJO.deleteTransition( type );
        },

        resetTransition: function() {

            var transitionMOJO = this._hx.transitionMOJO;

            MOJO_Each( transitionMOJO , function( val , type ) {
                transitionMOJO.deleteTransition( type );
            });
        },

        applyTransition: function() {
            var that = this;
            var property = VendorPatch.getPrefixed( 'transition' );
            var string = that._hx.getTransitionString();
            if (that.style.transition === string) {
                return;
            }
            $(that).css( property , string );
        },

        getComponents: function( type , property , pretty ) {

            // TODO - clean up this method
            
            property = Config.properties[property] || property;
            pretty = (pretty !== undefined ? pretty : true);
            
            var that_hx = this._hx;
            var components = that_hx.componentMOJO.getComponents( type , property );
            var keys = Object.keys( components );
            var out = {};

            if (pretty) {

                var keyMap = Config.properties;
                var keyMapInv = keyMap.inverse;
                var i, key, keyInv;

                if (property) {

                    out = components.values || {};

                    if (out.hasOwnProperty( 0 )) {
                        out = out[0];
                    }
                }
                else if (type) {

                    for (i = 0; i < keys.length; i++) {
                        
                        key = keys[i];
                        keyInv = keyMapInv[key] || key;
                        out[keyInv] = components[key].values;

                        if (out[keyInv].hasOwnProperty( 0 )) {
                            out[keyInv] = out[keyInv][0];
                        }
                        else if (keyInv === 'value') {
                            out = out.value;
                        }
                    }
                }
                else {
                    MOJO_Each( components , function( val , key ) {
                        out[key] = that_hx.getComponents( key );
                    });
                }

                return out;
            }
            else {

                if (property) {

                    out = components.clone || {};
                }
                else if (type) {

                    MOJO_Each( components , function( val , key ) {
                        out[key] = that_hx.getComponents( type , key , false );
                    });
                }
                else {
                    out = $.extend( true , {} , components );
                }

                return out;
            }
        },

        getOrder: function( type ) {
            return this._hx.componentMOJO.getOrder( type );
        },

        updateComponent: function( bean ) {
            this._hx.componentMOJO.updateComponent( bean );
        },

        resetComponents: function( type ) {

            var componentMOJO = this._hx.componentMOJO;

            if (type) {
                console.log( componentMOJO );
                //componentMOJO.setOrder( type );
                delete componentMOJO[type];
            }
            else {
                MOJO_Each( componentMOJO , function( val , key ) {
                    //componentMOJO.setOrder( key );
                    delete componentMOJO[key];
                });
            }
        },

        getStyleString: function( type ) {
            return this._hx.componentMOJO.getString( type );
        },

        getTransitionString: function() {
            return this._hx.transitionMOJO.getString();
        },

        addPrecisionPod: function( pod ) {

            var that = this;

            pod.when( 'iteratorStart' , beanStart , that );
            pod.when( 'iteratorComplete' , beanComplete , that );
            pod.when( 'podComplete' , podComplete , that );
            pod.when( 'podCanceled' , animationCanceled , that );

            that._hx.queue.pushPod( pod );
        },

        addAnimationPod: function( pod ) {

            var that = this;

            pod.when( 'beanStart' , beanStart , that );
            pod.when( 'beanComplete' , beanComplete , that );
            pod.when( 'clusterComplete' , clusterComplete , that );
            pod.when( 'podComplete' , podComplete , that );
            pod.when( 'podCanceled' , animationCanceled , that );

            that._hx.queue.pushPod( pod );
        },

        addPromisePod: function( pod ) {

            var that = this;

            pod.when( 'podComplete' , podComplete , that );
            pod.when( 'podCanceled' , promiseCanceled , that );

            that._hx.queue.pushPod( pod );
        },

        next: function() {
            return this._hx.queue.next();
        },

        clearQueue: function( all ) {
            this._hx.queue.clear( all );
        },

        getCurrentPod: function() {
            return this._hx.queue.current;
        },

        getLastPod: function() {
            return this._hx.queue.last;
        },

        getPodCount: function( type ) {
            return this._hx.queue.getPodCount( type );
        },

        cleanup: function() {
            delete this._hx;
        }
    };


    function beanStart( e , node , bean ) {
        $(node).trigger( 'hx.start' , bean.seed );
    }


    function beanComplete( e , node , bean ) {
        $(node).trigger( 'hx.end' , {
            type: bean.type
        });
        bean.options.done.call( node );
    }

    function clusterComplete( e , node , type ) {
        node._hx.deleteTransition( type );
        node._hx.applyTransition( type );
    }

    function podComplete( e , node , pod ) {
        //node._hx.happen( 'podComplete' , node , pod );
        node._hx.next();
    }

    function animationCanceled( e , node , pod ) {
        pod.dispel( 'beanComplete' );
        pod.dispel( 'clusterComplete' );
        pod.dispel( 'podComplete' );
        //node._hx.happen( 'animationCanceled' , node , pod );
        node._hx.resetTransition();
    }

    function promiseCanceled( e , node , pod ) {
        pod.dispel( 'podComplete' );
        //node._hx.happen( 'promiseCanceled' , node , pod );
    }


    function getScopedModule( module , context ) {

        var scope = {}, func;

        for (var key in module) {
            func = module[key];
            scope[key] = func.bind( context );
        }

        return scope;
    }


    return DomNodeFactory;

    
}( hxManager.Config , hxManager.VendorPatch , hxManager.Queue , hxManager.ComponentMOJO , hxManager.TransitionMOJO ));



























