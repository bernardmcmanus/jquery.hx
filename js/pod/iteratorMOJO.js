hxManager.IteratorMOJO = (function( MOJO , hxManager , isNaN ) {


    var TOLERANCE = ( 1000 / 240 );


    var Easing = hxManager.Easing;


    var MOJO_Each = MOJO.Each;


    function IteratorMOJO( node , bean ) {

        var that = this;
        var bean_options = bean.options;

        that.bean = bean;
        that.node = node;
        that.type = bean.type;
        that.running = false;
        that.styles = bean.styles;
        that.properties = bean.order.computed;

        that.duration = bean_options.duration;
        that.delay = bean_options.delay;
        that.easing = Easing( bean_options.easing );

        MOJO.Construct( that );
    }


    IteratorMOJO.prototype = MOJO.Create({

        calculate: function( percent ) {

            var that = this;

            MOJO_Each( that.diff , function( diff , key ) {

                var current = that.current[key];
                var dest = that.dest[key];

                diff.forEach(function( val , i ) {

                    var value = val * (1 - percent);
                    
                    if (isNumber( val )) {
                        current[i] = dest[i] - value;
                    }
                    else {
                        current[i] = (val === current.defaults[i] ? dest[i] : val);
                    }
                });
            });

            that.paint( that.current );
        },

        paint: function( model ) {

            var that = this;
            var $hx = that.node.$hx;
            var bean = that._updateBean( model );

            $hx.updateComponent( bean );
            $hx.paint( that.type );
        },

        resolve: function( model , attached ) {
            var that = this;
            if (attached) {
                that.paint( model );
            }
            that.happen( 'beanComplete' , that );
        },

        handleMOJO: function( e ) {
            
            var that = this;
            var args = arguments;
            var progress;

            switch (e.type) {

                case 'init':
                    that._init();
                break;

                case 'timing':
                    that._timing.apply( that , args );
                break;

                case 'progress':
                    progress = args[1];
                    if (!that.running && progress >= 0) {
                        that.running = true;
                        that.dispel( 'progress' , that );
                    }
                break;

                case 'podCanceled':
                    if (!that.running) {
                        that.happen( 'beanCanceled' );
                    }
                break;
            }
        },

        _init: function() {
            var that = this;
            var node = that.node;
            var $hx = node.$hx;
            var current = that.current = that._getCurrent( node );
            that.dest = that._getDest( current , that.styles );
            that.diff = that._getDiff( node , current , that.dest );
            $hx.deleteTransition( that.type );
            $hx.applyTransition();
            that.when( 'progress' , that );
            that.happen( 'beanStart' );
        },

        _timing: function( e , elapsed , diff , attached ) {

            var that = this;
            var duration = that.duration;
            var delay = that.delay;
            var progress = calcProgress( elapsed , duration , delay );

            if (isWithinTolerance( progress , 1 , TOLERANCE , duration , delay )) {
                progress = 1;
            }

            that.happen( 'progress' , progress );

            if (progress === 1) {
                that.resolve( that.dest , attached );
            }
            else if (attached) {
                that.calculate(
                    that.easing.function( progress )
                );
            }
        },

        _updateBean: function( model ) {

            var that = this;
            var bean = that.bean;

            MOJO_Each( model , function( property , key ) {
                bean.styles[key] = property;
            });

            return bean;
        },

        _getCurrent: function( node ) {

            var that = this;

            var current = {};
            var type = that.type;
            var properties = that.properties;

            properties.forEach(function( property ) {
                var find = (property === 'value' ? type : property);
                current[property] = node.$hx.getComponents( find , false );
            });

            return current;
        },

        _getDest: function( current , styles ) {

            var that = this;
            var newProperties = {};

            MOJO_Each( current , function( CSSProperty , key ) {

                var clone = CSSProperty.clone();
                clone.update( styles[key] );
                newProperties[key] = clone;
            });

            return newProperties;
        },

        _getDiff: function( node , current , dest ) {

            var diff = {};

            MOJO_Each( current , function( property , key ) {
                
                diff[key] = property.map(function( val , i ) {
                    return isNumber( val ) ? dest[key][i] - val : val;
                });
            });

            return diff;
        }
    });


    function isNumber( subject ) {
        return !isNaN( subject * 1 );
    }


    function calcProgress( elapsed , duration , delay ) {
        elapsed = elapsed - delay;
        elapsed = elapsed < 0 ? 0 : elapsed;
        return (elapsed / (duration || 1));
    }


    function isWithinTolerance( subject , target , tolerance , duration , delay ) {
        return (target - subject) <= (tolerance / (duration + delay));
    }


    return IteratorMOJO;

    
}( MOJO , hxManager , isNaN ));






















