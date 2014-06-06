(function( window , hx , Config , Helper , When , Easing , Animator , KeyMap ) {


    var ODP = Object.defineProperty;


    function Bean( seed ) {

        if (!seed.type) {
            throw new TypeError( 'Bean type is required.' );
        }

        ODP( this , 'hasAnimator' , {
            get: function() {
                return (typeof this.animator !== 'undefined');
            }
        });

        ODP( this , 'complete' , {
            get: function() {
                return (this.hasAnimator ? !this.animator.running : false);
            }
        });

        ODP( this , 'easing' , {
            get: function() {
                return Easing( this.options.easing );
            }
        });

        $.extend( this , getCompiledData( seed ));
    }


    Bean.prototype = Object.create( When );


    Bean.prototype.setStyleString = function( str ) {
        this.styleString = str;
    };


    Bean.prototype.createAnimator = function( options ) {

        if (!this.hasAnimator) {
            
            $.extend( options , this.options.export() );
            this.animator = new Animator( options );

            this.animator.when( 'complete' , onComplete , this );
        }
    };


    Bean.prototype.startAnimator = function() {
        if (this.hasAnimator && !this.animator.running) {
            this.animator.start();
        }
    };


    Bean.prototype.resolveBean = function() {
        if (this.hasAnimator && !this.complete) {
            this.animator.destroy();
        }
    };


    function onComplete() {
        this.happen( 'complete' , [ this ] );
    }


    function getCompiledData( seed ) {

        var type = seed.type;

        var order = _getOrder( seed );

        var options = _getOptions( seed );

        var defaults = _getDefaults( type , order );

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

        var order = new KeyMap({
            passed: (seed.order || []),
            computed: Helper.object.getOrder( seed )
        });

        return order
            .cast()
            .each(function( keyMap , key ) {
                keyMap
                    .subtract( Config.keys.options )
                    .unique()
                    .mapTo( Config.maps.component );
            });
    }


    function _getOptions( seed ) {

        var options = $.extend( {} , Config.defaults.options , seed );

        return new KeyMap( options )
            .scrub(
                Object.keys( Config.defaults.options )
            );
    }


    function _getRaw( seed , defaults ) {

        var raw = new KeyMap( seed );

        return raw
            .subtract( Config.keys.options )
            .mapTo( Config.maps.component )
            .each(function( val , key ) {
                if (val === null) {
                    val = defaults[key].export();
                }
                raw[key] = (typeof val === 'object' ? val : [ val ]);
            })
            .cast();
    }


    function _getDefaults( type , order ) {

        var defaults = new KeyMap(
            Config.defaults[type] || Config.defaults.nonTransform
        );

        return defaults
            .scrub( order.computed.export() )
            .each(function( val , key ) {
                defaults[key] = (typeof val === 'object' ? val : [ val ]);
            })
            .cast();
    }


    function _getCompiled( type , raw , defaults ) {

        var compiled = raw.clone();

        return compiled
            .cast()
            .each(function( keyMap , key ) {
                var map = Config.maps[ type ] || Config.maps.nonTransform;
                keyMap
                    .mapTo( map[key] || map.other )
                    .merge(
                        defaults[key].export()
                    );
            });
    }


    function _getRules( type , compiled , raw ) {

        var compareTo = raw.clone()
            .cast()
            .each(function( keyMap , key ) {
                var map = Config.maps[ type ] || Config.maps.nonTransform;
                keyMap.mapTo( map[key] || map.other );
            });

        return compiled.clone()
            .cast()
            .compare( compareTo );
    }


    $.extend( hx , { Bean : Bean });

    
}( window , hxManager , hxManager.Config , hxManager.Helper , hxManager.When , hxManager.Easing , hxManager.Animator , hxManager.KeyMap ));



























