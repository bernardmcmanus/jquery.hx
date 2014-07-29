hxManager.DomNodeFactory = (function( Config , VendorPatch , Queue , ComponentMOJO , TransitionMOJO ) {


    var UNDEFINED;
    var POD_COMPLETE = 'podComplete';
    var POD_CANCELED = 'podCanceled';

    
    var MOJO_Each = MOJO.Each;
    var PropertyMap = Config.properties;


    function DomNodeFactory( element ) {

        // if this is already an hx element, return it
        if (element._hx !== UNDEFINED) {
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

            if (type === UNDEFINED) {
                type = Object.keys( that_hx.getOrder() );
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
            
            property = PropertyMap[property] || property;
            pretty = (pretty !== UNDEFINED ? pretty : true);
            
            var that_hx = this._hx;
            var components = that_hx.componentMOJO.getComponents( type , property );
            var pairArray = [];
            var out = {};

            function getKeyValuePair( name , CSSProperty , pretty ) {

                var key = ( pretty ? CSSProperty.pName : ( name === 'value' ? name : CSSProperty.name ));
                var val = ( pretty ? CSSProperty.values : CSSProperty.clone() );
                                
                return {
                    key: key,
                    val: val
                };
            }

            function getOut( out , type , property , pretty ) {
                return (pretty && out[type] !== UNDEFINED) ? out[type] : ((!pretty && property) ? out[property] : out);
            }

            if (property) {

                pairArray.push(
                    getKeyValuePair( property , components , pretty )
                );
            }
            else if (type) {

                MOJO_Each( components , function( CSSProperty , key ) {
                    pairArray.push(
                        getKeyValuePair( key , CSSProperty , pretty )
                    );
                });
            }
            else {

                MOJO_Each( components , function( val , key ) {
                    out[key] = that_hx.getComponents( key , null , pretty );
                });
            }

            pairArray.forEach(function( pair ) {
                out[pair.key] = pair.val;
            });

            return getOut( out , type , property , pretty );
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
                componentMOJO.remove( type );
            }
            else {
                componentMOJO.each(function( val , key ) {
                    componentMOJO.remove( key );
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

            pod.when( 'iteratorStart' , that , beanStart );
            pod.when( 'iteratorComplete' , that , beanComplete );
            pod.when( 'podPaused' , that , podPaused );
            pod.when( 'podResumed' , that , podResumed );
            pod.when( POD_COMPLETE , that , podComplete );
            pod.when( POD_CANCELED , that , animationCanceled );

            that._hx.queue.pushPod( pod );
        },

        addAnimationPod: function( pod ) {

            var that = this;

            pod.when( 'beanStart' , that , beanStart );
            pod.when( 'beanComplete' , that , beanComplete );
            pod.when( 'clusterComplete' , that , clusterComplete );
            pod.when( POD_COMPLETE , that , podComplete );
            pod.when( POD_CANCELED , that , animationCanceled );

            that._hx.queue.pushPod( pod );
        },

        addPromisePod: function( pod ) {

            var that = this;

            pod.when( POD_COMPLETE , that , podComplete );
            pod.when( POD_CANCELED , that , promiseCanceled );

            that._hx.queue.pushPod( pod );
        },

        proceed: function() {
            return this._hx.queue.proceed();
        },

        clearQueue: function( all ) {
            this._hx.queue.clear( all );
        },

        getCurrentPod: function() {
            return this._hx.queue.current;
        },

        /*nextOfType: function( type ) {
            return this._hx.queue.nextOfType( type );
        },*/

        /*getLastPod: function() {
            return this._hx.queue.last;
        },*/

        /*getPodCount: function( type ) {
            return this._hx.queue.getPodCount( type );
        },*/

        clean: function() {
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
        bean.options.done();
    }

    function clusterComplete( e , node , type ) {
        node._hx.deleteTransition( type );
        node._hx.applyTransition();
    }

    function podPaused( e , node , pod ) {
        $(node).trigger( 'hx.pause' , {
            progress: pod.progress
        });
    }

    function podResumed( e , node , pod ) {
        $(node).trigger( 'hx.resume' , {
            progress: pod.progress
        });
    }

    function podComplete( e , node , pod ) {
        node._hx.proceed();
    }

    function animationCanceled( e , node , pod ) {
        pod.dispel( 'beanComplete' );
        pod.dispel( 'clusterComplete' );
        pod.dispel( POD_COMPLETE );
        node._hx.resetTransition();
    }

    function promiseCanceled( e , node , pod ) {
        pod.dispel( POD_COMPLETE );
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



























