hxManager.IteratorMOJO = (function( MOJO , Easing ) {


    var TOLERANCE = ( 1000 / 240 );


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
                    current[i] = dest[i] - value;
                });
            });

            that.paint( that.current );
        },

        paint: function( model ) {

            var that = this;
            var node_hx = that.node._hx;
            var bean = that._updateBean( model );

            node_hx.updateComponent( bean );
            node_hx.paint( that.type );
        },

        resolve: function( model ) {
            var that = this;
            that.paint( model );
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
                    if (!that.running && progress > 0) {
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
            var node_hx = node._hx;
            var current = that.current = that._getCurrent( node );
            that.dest = that._getDest( current , that.styles );
            that.diff = that._getDiff( node , current , that.dest );
            node_hx.deleteTransition( that.type );
            node_hx.applyTransition();
            that.when( 'progress' , that );
            that.happen( 'beanStart' );
        },

        _timing: function( e , elapsed ) {

            var that = this;
            var duration = that.duration;
            var delay = that.delay;
            var progress = calcProgress( elapsed , duration , delay );

            if (isWithinTolerance( progress , 1 , TOLERANCE , duration )) {
                progress = 1;
            }

            that.happen( 'progress' , progress );

            if (progress === 1) {
                that.resolve( that.dest );
            }
            else {
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
                current[property] = node._hx.getComponents( find , false );
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
                    return dest[key][i] - val;
                });
            });

            return diff;
        }
    });


    function calcProgress( elapsed , duration , delay ) {
        elapsed = elapsed - delay;
        elapsed = elapsed < 0 ? 0 : elapsed;
        return duration > 0 ? (elapsed / duration) : 1;
    }


    function isWithinTolerance( subject , target , tolerance , duration ) {
        return (target - subject) <= (tolerance / duration);
    }


    return IteratorMOJO;

    
}( MOJO , hxManager.Easing ));






















