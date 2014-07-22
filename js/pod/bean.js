hxManager.Bean = (function( Config , Subscriber ) {


    var Object_defineProperty = Object.defineProperty;
    var OptionKeys = Config.optionKeys;
    var PropertyMap = Config.properties;


    function Bean( seed ) {

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

        $.extend( that , getCompiledData( seed ));
    }


    var Bean_prototype = Bean.prototype = MOJO.Create({

        subscribe: function() {

            var that = this;
            var options = that.options;
            var duration = options.duration;
            var delay = options.delay;

            that.subscriber = new Subscriber( duration , delay , function() {
                that.resolveBean();
                that.happen( 'beanComplete' , that );
            })
            .subscribe();
        },

        resolveBean: function() {

            var that = this;

            if (that.subscribed && !that.complete) {
                that.subscriber.destroy();
                delete that.subscriber;
            }
        },

        getOptions: function( seed ) {

            var defaults = Config.defaults;
            var options = $.extend( {} , defaults , seed );

            for (var key in options) {
                if (!defaults.hasOwnProperty( key )) {
                    delete options[key];
                }
            }

            return options;
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

        getStyles: function( seed ) {

            var styles = {};
            var key, mappedKey;

            for (key in seed) {
                mappedKey = PropertyMap[key] || key;
                if (OptionKeys.indexOf( mappedKey ) < 0) {
                    styles[mappedKey] = seed[key];
                }
            }

            return styles;
        }        
    });


    function getCompiledData( seed ) {

        var getOrder = Bean_prototype.getOrder;
        var getOptions = Bean_prototype.getOptions;
        var getStyles = Bean_prototype.getStyles;

        return {
            seed: seed,
            type: seed.type,
            order: getOrder( seed ),
            options: getOptions( seed ),
            styles: getStyles( seed )
        };
    }


    return Bean;

    
}( hxManager.Config , hxManager.Subscriber ));



























