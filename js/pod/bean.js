hxManager.Bean = (function( Config , Helper , Easing , Animator ) {


    var Object_defineProperty = Object.defineProperty;


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

        var that = this;

        if (that.hasAnimator && !that.animator.running) {
            that.animator.start();
        }
    };


    Bean_prototype.resolveBean = function() {

        var that = this;

        if (that.hasAnimator && !that.complete) {
            that.animator.destroy();
        }
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

    
}( hxManager.Config , hxManager.Helper , hxManager.Easing , hxManager.Animator ));



























