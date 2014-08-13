hxManager.DomNodeFactory = (function( Object , $ , MOJO , hxManager ) {


    var UNDEFINED;
    var BEAN_START = 'beanStart';
    var BEAN_COMPLETE = 'beanComplete';
    var CLUSTER_COMPLETE = 'clusterComplete';
    var POD_PAUSED = 'podPaused';
    var POD_RESUMED = 'podResumed';
    var POD_COMPLETE = 'podComplete';
    var POD_CANCELED = 'podCanceled';


    var Config = hxManager.Config;
    var Helper = hxManager.Helper;
    var VendorPatch = hxManager.VendorPatch;
    var Queue = hxManager.Queue;
    var CSSProperty = hxManager.CSSProperty;
    var ComponentMOJO = hxManager.ComponentMOJO;
    var TransitionMOJO = hxManager.TransitionMOJO;

    
    var MOJO_Each = MOJO.Each;
    var PropertyMap = Config.properties;
    var EnsureArray = Helper.ensureArray;
    var isUndef = Helper.isUndef;
    var instOf = Helper.instOf;
    var Prefix = VendorPatch.prefix;


    function DomNodeFactory( element ) {

        // if this is already an hx element, return it
        if (element._hx !== UNDEFINED) {
            return element;
        }

        // otherwise, create a new hx element
        var _hxModule = new MOJO(
            getBoundModule( hxModule , element )
        );

        _hxModule.queue = new Queue();
        _hxModule.componentMOJO = new ComponentMOJO();
        _hxModule.transitionMOJO = new TransitionMOJO();

        element._hx = _hxModule;

        return element;
    }


    var hxModule = {

        paint: function( typeArray ) {

            var that = this;
            var that_hx = that._hx;
            var style = {};

            if (typeArray === UNDEFINED) {
                typeArray = Object.keys( that_hx.getOrder() );
            }
            else {
                typeArray = EnsureArray( typeArray );
            }

            typeArray.forEach(function( type ) {
                var property = Prefix( type );
                var string = that_hx.getStyleString( type );
                style[property] = string;
            });

            $(that).css( style );
        },

        handleMOJO: function( e ) {
            
            var that = this;
            var that_hx = that._hx;
            var args = arguments;
            var type, bean, pod;

            //console.log(e.type);

            switch (e.type) {

                case BEAN_START:
                    bean = args[1];
                    $(that).trigger( 'hx.start' , bean.seed );
                break;

                case BEAN_COMPLETE:
                    bean = args[1];
                    $(that).trigger( 'hx.end' , {
                        type: bean.type
                    });
                    bean.options.done();
                break;

                case CLUSTER_COMPLETE:
                    type = args[1];
                    that_hx.deleteTransition( type );
                    that_hx.applyTransition();
                break;

                case POD_PAUSED:
                case POD_RESUMED:

                    var evtString = ('hx.' + (e.type === POD_PAUSED ? 'pause' : 'resume'));
                    pod = args[1];

                    $(that).trigger( evtString , {
                        progress: pod.progress
                    });
                break;

                case POD_COMPLETE:
                    that_hx.proceed();
                break;

                case POD_CANCELED:

                    pod = args[1];

                    if (pod.type === 'promise') {
                        pod.dispel( POD_COMPLETE );
                    }
                    else {

                        pod.dispel( POD_COMPLETE , that_hx );

                        pod.once( POD_COMPLETE , function() {
                            if (!that_hx.getPodCount( 'animation' )) {
                                that_hx.resetTransition();
                                that_hx.applyTransition();
                            }
                        });
                    }
                break;
            }
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
            var property = Prefix( 'transition' );
            var string = that._hx.getTransitionString();
            if (that.style.transition === string) {
                return;
            }
            $(that).css( property , string );
        },

        getComponents: function( find , pretty ) {

            find = PropertyMap[find] || find;
            pretty = (!isUndef( pretty ) ? pretty : true);
            
            var that_hx = this._hx;
            var components = that_hx.componentMOJO.getComponents( find );
            var out = {};

            if (instOf( components , ComponentMOJO )) {
                components.each(function( styleObj , key ) {
                    out[key] = that_hx.getComponents( key , pretty );
                });
            }
            else if (instOf( components , CSSProperty )) {
                out = getProperty( components );
            }
            else if (!isUndef( components )) {

                MOJO_Each( components , function( property , key ) {
                    
                    key = getKey( key );
                    property = getProperty( property );
                    
                    if (key === 'value') {
                        out = property;
                    }
                    else {
                        out[key] = property;
                    }
                });
            }

            function getProperty( property ) {
                return (pretty ? property.values : property.clone());
            }

            function getKey( key ) {
                return (pretty ? (PropertyMap.inverse[ key ] || key) : key);
            }

            return out;
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

        addPod: function( pod ) {

            var that_hx = this._hx;

            [
                BEAN_START,
                BEAN_COMPLETE,
                CLUSTER_COMPLETE,
                POD_PAUSED,
                POD_RESUMED,
                POD_COMPLETE,
                POD_CANCELED
            ]
            .forEach(function( evt ) {
                pod.when( evt , that_hx );
            });

            that_hx.queue.pushPod( pod );
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

        getPodCount: function( type ) {
            return this._hx.queue.getPodCount( type );
        },

        cleanup: function() {
            delete this._hx;
        }
    };


    function getBoundModule( module , context ) {

        var scope = {}, func;

        for (var key in module) {
            func = module[key];
            scope[key] = func.bind( context );
        }

        return scope;
    }


    return DomNodeFactory;

    
}( Object , jQuery , MOJO , hxManager ));



























