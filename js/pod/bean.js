hxManager.Bean = (function( Config , SubscriberMOJO ) {


    var TIMING = 'timing';


    var MOJO_Each = MOJO.Each;
    var Object_defineProperty = Object.defineProperty;
    var OptionKeys = Config.optionKeys;
    var PropertyMap = Config.properties;


    function Bean( seed , node , index ) {

        if (!seed.type) {
            throw new TypeError( 'Bean type is required.' );
        }

        var that = this;

        that.subscriber = null;

        MOJO.Construct( that );

        Object_defineProperty( that , 'subscribed' , {
            get: function() {
                return (that.subscriber !== null);
            }
        });

        Object_defineProperty( that , 'complete' , {
            get: function() {
                return (that.subscriber === undefined);
            }
        });

        $.extend( that , getCompiledData( seed , node , index ));
    }


    var Bean_prototype = Bean.prototype = MOJO.Create({

        subscribe: function() {

            var that = this;
            var options = that.options;
            var duration = options.duration;
            var delay = options.delay;

            var subscriber = that.subscriber = new SubscriberMOJO();

            subscriber.when( TIMING , function timing( e , elapsed , diff ) {
                if (elapsed >= (duration + delay)) {
                    that.resolveBean();
                    that.happen( 'beanComplete' , that );
                }
            });

            subscriber.subscribe();
        },

        resolveBean: function() {

            var that = this;

            if (that.subscribed && !that.complete) {
                that.subscriber.destroy();
                delete that.subscriber;
            }
        },

        getOrder: function( seed ) {

            var passed = (seed.order || []).map( mapCallback );
            
            var computed = Object.keys( seed )
                .filter(function( key , i ) {
                    return OptionKeys.indexOf( key ) < 0;
                })
                .map( mapCallback );

            function mapCallback( key ) {
                return PropertyMap[key] || key;
            }

            return {
                passed: passed,
                computed: computed
            };
        },

        getOptions: function( seed , node , index ) {

            var defaults = Config.defaults;
            var options = $.extend( {} , defaults , seed );

            MOJO_Each( options , function( val , key ) {
                if (!defaults.hasOwnProperty( key )) {
                    delete options[key];
                }
                else if (key === 'done') {
                    // make sure we don't execute the done function just yet
                    options[key] = val.bind( null , node , index );
                }
                else {
                    options[key] = getBeanProperty( val , node , index );
                }
            });

            return options;
        },

        getStyles: function( seed , node , index ) {

            var styles = {};

            MOJO_Each( seed , function( val , key ) {
                var mappedKey = PropertyMap[key] || key;
                if (OptionKeys.indexOf( mappedKey ) < 0) {
                    styles[mappedKey] = getBeanProperty( val , node , index );
                }
            });

            return styles;
        }
    });


    function getBeanProperty( property , node , index ) {
        return (typeof property === 'function' ? property( node , index ) : property);
    }


    function getCompiledData( seed , node , index ) {

        var getOrder = Bean_prototype.getOrder;
        var getOptions = Bean_prototype.getOptions;
        var getStyles = Bean_prototype.getStyles;

        return {
            seed: seed,
            type: seed.type,
            order: getOrder( seed ),
            options: getOptions( seed , node , index ),
            styles: getStyles( seed , node , index )
        };
    }


    return Bean;

    
}( hxManager.Config , hxManager.SubscriberMOJO ));



























