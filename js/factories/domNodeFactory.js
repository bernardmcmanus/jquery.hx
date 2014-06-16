hxManager.DomNodeFactory = (function( Config , VendorPatch , Queue , ComponentMOJO , TransitionMOJO ) {

    
    function DomNodeFactory( element ) {

        // if this is already an hx element, return it
        if (typeof element._hx !== 'undefined') {
            return element;
        }

        // otherwise, create a new hx element
        var _hxModule = GetScopedModule( hxModule , element );

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
                type = $.extend( [] , Object.keys( that_hx.componentMOJO.order ));
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
            var type = true;
            while (type) {
                type = transitionMOJO.nextKey( type );
                transitionMOJO.deleteTransition( type );
            }
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

        getComponents: function( type , property ) {
            if (property) {
                property = Config.getMappedProperties( property );
            }
            return this._hx.componentMOJO.getComponents( type , property );
        },

        getOrder: function( type ) {
            return this._hx.componentMOJO.getOrder( type );
        },

        updateComponent: function( bean ) {
            this._hx.componentMOJO.updateComponent( bean );
        },

        resetComponents: function( type ) {

            var components = this._hx.componentMOJO;

            if (type) {
                components.setOrder( type , [] );
                delete components[type];
            }
            else {
                var key = true;
                while (key) {
                    key = components.nextKey( key );
                    if (key === 'order') {
                        continue;
                    }
                    delete components[key];
                    components.setOrder( key , [] );
                }
            }
        },

        getStyleString: function( type ) {
            return this._hx.componentMOJO.getString( type );
        },

        getTransitionString: function() {
            return this._hx.transitionMOJO.getString();
        },

        addXformPod: function( pod ) {

            var that = this;

            pod.when( 'beanStart' , beanStart , that );
            pod.when( 'beanComplete' , beanComplete , that );
            pod.when( 'clusterComplete' , clusterComplete , that );
            pod.when( 'podComplete' , podComplete , that );
            pod.when( 'podCanceled' , xformCanceled , that );

            that._hx.queue.pushPod( pod );
        },

        addPromisePod: function( pod ) {

            var that = this;

            pod.when( 'podComplete' , podComplete , that );
            pod.when( 'podCanceled' , promiseCanceled , that );

            that._hx.queue.pushPod( pod );
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
            delete this._hx;
        }
    };


    function beanStart( e , node , bean ) {
        $(node).trigger( 'hx.xformStart' , {
            type: bean.type,
            xform: bean.original,
            options: bean.options
        });
    }


    function beanComplete( e , node , bean ) {
        $(node).trigger( 'hx.xformComplete' , {
            type: bean.type,
        });
        bean.options.done.call( node );
    }

    function clusterComplete( e , node , type ) {
        node._hx.deleteTransition( type );
        node._hx.applyTransition( type );
    }

    function podComplete( e , node , pod ) {
        node._hx.queue.next();
    }

    function xformCanceled( e , node , pod ) {
        pod.dispel( 'beanComplete' );
        pod.dispel( 'clusterComplete' );
        pod.dispel( 'podComplete' );
        node._hx.resetTransition();
    }

    function promiseCanceled( e , node , pod ) {
        pod.dispel( 'podComplete' );
    }


    function GetScopedModule( module , context ) {

        var scope = {}, func;

        for (var key in module) {
            func = module[key];
            scope[key] = func.bind( context );
        }

        return scope;
    }


    return DomNodeFactory;

    
}( hxManager.Config , hxManager.VendorPatch , hxManager.Queue , hxManager.ComponentMOJO , hxManager.TransitionMOJO ));



























