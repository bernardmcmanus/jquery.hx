hxManager.IteratorMOJO = (function( RetrieveBezier , Bean ) {


    var MOJO_Each = MOJO.Each;


    function IteratorMOJO( node , bean ) {

        var that = this;
        var bean_options = bean.options;

        that.bean = bean;
        that.node = node;
        that.type = bean.type;
        that.styles = bean.styles;
        that.properties = bean.order.computed;

        that.duration = bean_options.duration;
        that.delay = bean_options.delay;
        that.easing = RetrieveBezier( bean_options.easing );

        MOJO.Construct( that );

        that.handle = that._handle.bind( that );
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

        complete: function( model ) {
            var that = this;
            that.happen( 'iteratorComplete' );
            that.paint( model );
        },

        _handle: function( e ) {
            
            var that = this;
            var args = arguments;

            switch (e.type) {

                case 'init':
                    that._init();
                break;

                case 'timing':
                    that._timing.apply( that , args );
                break;

                case 'podComplete':
                    that.complete( that.dest );
                break;

                case 'podCanceled':
                    that.complete( that.current );
                break;
            }
        },

        _init: function( e ) {
            var that = this;
            that.current = that._getCurrent( that.node );
            that.dest = that._getDest( that.current , that.styles );
            that.diff = that._getDiff( that.node , that.current , that.dest );
        },

        _timing: function( e , elapsed ) {

            var that = this;
            var progress = that._calcProgress( elapsed );

            that.happen( 'progress' , [ progress ]);
            
            if (progress < 1) {
                //console.log(progress);
                that.calculate(
                    that.easing.function( progress )
                );
            }
            else {
                that.complete( that.dest );
            }
        },

        _calcProgress: function( elapsed ) {
            
            var that = this;

            /*if (!elapsed || elapsed <= that.delay) {
                return 0;
            }*/

            elapsed = elapsed - that.delay;
            elapsed = elapsed < 0 ? 0 : elapsed;

            return (elapsed / that.duration);
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
                current[property] = node._hx.getComponents( type , property , false );
            });

            return current;
        },

        _getDest: function( current , styles ) {

            var that = this;
            var newProperties = {};

            MOJO_Each( current , function( CSSProperty , key ) {

                CSSProperty = CSSProperty.clone();
                CSSProperty.update( styles[key] );
                newProperties[key] = CSSProperty;
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


    return IteratorMOJO;

    
}( hxManager.Bezier.retrieve , hxManager.Bean ));






















