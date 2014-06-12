hxManager.DomNodeFactory = (function( Queue , NodeComponents ) {

    
    function DomNodeFactory( element ) {

        // if this is already an hx element, return it
        if (typeof element._hx !== 'undefined') {
            return element;
        }

        // otherwise, create a new hx element
        var _hxModule = GetScopedModule( hxModule , element );

        element._hx = $.extend({
            queue: new Queue(),
            components: new NodeComponents()
        } , _hxModule );

        return element;
    }


    var hxModule = {

        updateComponent: function( bean ) {
            var that_hx = this._hx;
            var components = this._hx.components;
            components.updateComponent( bean );
            return components.getStyleString( bean.type );
        },

        getStyleString: function( type ) {
            return this._hx.components.getStyleString( type );
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
        // do something on cluster complete
    }

    function podComplete( e , node , pod ) {
        node._hx.queue.next();
    }

    function xformCanceled( e , node , pod ) {
        pod.dispel( 'beanComplete' );
        pod.dispel( 'clusterComplete' );
        pod.dispel( 'podComplete' );
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

    
}( hxManager.Queue , hxManager.NodeComponents ));



























