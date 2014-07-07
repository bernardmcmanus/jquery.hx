hxManager.Bean = (function( Config , Subscriber ) {


    var Object_defineProperty = Object.defineProperty;


    function Bean( seed ) {

        if (!seed.type) {
            throw new TypeError( 'Bean type is required.' );
        }

        var that = this;

        that.subscriber = null;

        MOJO.Hoist( that );

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


    var Bean_prototype = (Bean.prototype = new MOJO());


    Bean_prototype.subscribe = function() {

        var that = this;
        var options = that.options;
        var duration = options.duration;
        var delay = options.delay;

        that.subscriber = new Subscriber( duration , delay , function() {            
            that.resolveBean();
            that.happen( 'beanComplete' , that );
        });
    };


    Bean_prototype.resolveBean = function() {

        var that = this;

        if (that.subscribed && !that.complete) {
            that.subscriber.destroy();
            delete that.subscriber;
        }
    };


    Bean_prototype.getOptions = function( seed ) {

        var defaults = Config.defaults;
        var options = $.extend( {} , defaults , seed );

        for (var key in options) {
            if (!defaults.hasOwnProperty( key )) {
                delete options[key];
            }
        }

        return options;
    };


    Bean_prototype.getOrder = function( seed ) {

        var passed = (seed.order || []).map( mapCallback );
        
        var computed = Object.keys( seed )
            .filter(function( key , i ) {
                return Config.keys.options.indexOf( key ) < 0;
            })
            .map( mapCallback );

        function mapCallback( key ) {
            return Config.properties[key] || key;
        }

        return {
            passed: passed,
            computed: computed
        };
    };


    Bean_prototype.getStyles = function( seed ) {

        var optionKeys = Config.keys.options;
        var keyMap = Config.properties;
        var styles = {};
        var key, mappedKey;

        for (key in seed) {
            mappedKey = keyMap[key] || key;
            if (optionKeys.indexOf( mappedKey ) < 0) {
                styles[mappedKey] = seed[key];
            }
        }

        return styles;
    };


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



























