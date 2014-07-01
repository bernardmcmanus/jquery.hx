hxManager.Bean = (function( Config , Easing , Subscriber ) {


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

        that.subscriber = new Subscriber( that.options , function() {

            console.log('unsubscribe');
            
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

        console.log(that);
    };


    function getCompiledData( seed ) {

        return {
            seed: seed,
            type: seed.type,
            order: _getOrder( seed ),
            options: _getOptions( seed ),
            styles: _getStyles( seed )
        };
    }


    function _getOrder( seed ) {

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
    }


    function _getOptions( seed ) {

        var defaults = Config.defaults;
        var options = $.extend( {} , defaults , seed );

        for (var key in options) {
            if (!defaults.hasOwnProperty( key )) {
                delete options[key];
            }
        }

        options.easing = Easing( options.easing );

        return options;
    }


    function _getStyles( seed ) {

        var optionKeys = Config.keys.options;
        var styles = {};

        for (var key in seed) {
            if (optionKeys.indexOf( key ) < 0) {
                styles[key] = seed[key];
            }
        }

        return styles;
    }


    return Bean;

    
}( hxManager.Config , hxManager.Easing , hxManager.Subscriber ));



























