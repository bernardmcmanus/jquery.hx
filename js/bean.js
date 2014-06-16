hxManager.Bean = (function( Config , Helper , Easing , Animator ) {


    var Object_defineProperty = Object.defineProperty;
    var Config_getMappedProperties = Config.getMappedProperties;


    function Bean( seed ) {

        if (!seed.type) {
            throw new TypeError( 'Bean type is required.' );
        }

        var that = this;

        MOJO.Hoist( that );

        Object_defineProperty( that , 'hasAnimator' , {
            get: function() {
                return (typeof that.animator !== 'undefined');
            }
        });

        Object_defineProperty( that , 'complete' , {
            get: function() {
                return (that.hasAnimator ? !that.animator.running : false);
            }
        });

        $.extend( that , getCompiledData( seed ));
    }


    var Bean_prototype = (Bean.prototype = new MOJO());


    /*Bean_prototype.setStyleString = function( str ) {
        this.styleString = str;
    };*/


    Bean_prototype.createAnimator = function( options ) {

        var that = this;

        if (!that.hasAnimator) {
            
            $.extend( options , that.options );
            that.animator = new Animator( options );

            that.animator.when( 'animatorComplete' , function( e ) {
                that.happen( 'beanComplete' , that );
            });
        }
    };


    Bean_prototype.startAnimator = function() {
        if (this.hasAnimator && !this.animator.running) {
            this.animator.start();
        }
    };


    Bean_prototype.resolveBean = function() {
        if (this.hasAnimator && !this.complete) {
            this.animator.destroy();
        }
    };


    function getCompiledData( seed ) {

        var type = seed.type;

        var order = _getOrder( seed );

        var options = _getOptions( seed );

        var defaults = Config.getDefaults( type , order.computed );

        var raw = _getRaw( seed , defaults );

        var compiled = _getCompiled( type , raw , defaults );

        var rules = _getRules( type , compiled , raw );

        return {
            type: type,
            original: seed,
            order: order,
            options: options,
            raw: raw,
            defaults: defaults,
            compiled: compiled,
            rules: rules
        };
    }


    function _getOrder( seed ) {

        var passed = (seed.order || []);
        var computed = Object.keys( seed ).filter(function( key , i ) {
            return Config.keys.options.indexOf( key ) < 0;
        });

        return {
            passed: Config_getMappedProperties( passed ),
            computed: Config_getMappedProperties( computed )
        };
    }


    function _getOptions( seed ) {

        var defaults = Config.defaults.options;
        var options = $.extend( {} , defaults , seed );

        for (var key in options) {
            if (!defaults.hasOwnProperty( key )) {
                delete options[key];
            }
        }

        options.easing = Easing( options.easing );

        return options;
    }



    function _getRaw( seed , defaults ) {

        var type = seed.type;
        var raw = $.extend( {} , seed );
        var Config_maps = Config.maps;

        for (var key in raw) {

            var val = raw[key];

            if (Config.keys.options.indexOf( key ) >= 0) {
                delete raw[key];
                continue;
            }

            var oldKey = key;
            key = Config_getMappedProperties( key );
            raw[key] = val;
            delete raw[oldKey];

            if (val === null) {
                // map defaults array to component keys
                val = mapDefaults( defaults[key] );
            }

            raw[key] = (typeof val === 'object' ? val : [ val ]);
        }

        function mapDefaults( defaults ) {
            var maps = Config_maps[type] || Config_maps.nonTransform;
            var map = maps[key] || maps.other;
            var keys = Object.keys( map );
            var out = {};
            for (var i = 0; i < defaults.length; i++) {
                out[keys[i]] = defaults[i];
            }
            return out;
        }

        return raw;
    }


    function _getCompiled( type , raw , defaults ) {

        var compiled = $.extend( {} , raw );
        var maps = Config.maps[ type ] || Config.maps.nonTransform;

        for (var key in compiled) {
            var map = maps[key] || maps.other;
            var property = compiled[key];
            var defs = defaults[key];
            compiled[key] = mapProperty( property , map , defs );
        }

        function mapProperty( property , map , defaults ) {

            var out = [], value, keys = Object.keys( map );

            for (var i = 0; i < defaults.length; i++) {
                value = property[keys[i]];
                out[i] = typeof value !== 'undefined' ? value : defaults[i];
            }

            return out;
        }

        return compiled;
    }


    function _getRules( type , compiled , raw ) {

        var maps = Config.maps[ type ] || Config.maps.nonTransform;
        var rules = getDiff( compiled , raw );

        function getDiff( subject , compareTo , map , level ) {

            level = level || 0;

            var diff = subject instanceof Array ? [] : {};

            for (var key in subject) {

                if (!level) {
                    map = Object.keys( maps[key] || maps.other );
                }

                var keyCompare = map[key];
                var valueSubject = subject[key];

                if (typeof valueSubject === 'object') {                    
                    var valueCompare = compareTo[keyCompare] || compareTo[key];
                    diff[key] = getDiff( valueSubject , valueCompare , map , ( level + 1 ));
                }
                else {
                    diff[key] = compareTo.hasOwnProperty( map[key] );
                }
            }

            return diff;
        }

        return rules;
    }


    return Bean;

    
}( hxManager.Config , hxManager.Helper , hxManager.Easing , hxManager.Animator ));



























