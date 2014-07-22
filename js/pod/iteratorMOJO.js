hxManager.IteratorMOJO = (function( RetrieveBezier , Bean , Subscriber ) {


    var MOJO_Each = MOJO.Each;


    function IteratorMOJO( node , bean ) {

        var that = this;
        var bean_options = bean.options;

        that.bean = bean;
        that.node = node;
        that.type = bean.type;
        that.styles = bean.styles;
        that.properties = bean.order.computed;
        that.subscribed = false;
        //that.subscriber = null;

        that.progress = 0;
        //that.duration = bean_options.duration;
        //that.delay = bean_options.delay;
        //that.easing = bean_options.easing;

        that.easing = RetrieveBezier( bean_options.easing );

        that.subscriber = that._createSubscriber( bean_options.duration , bean_options.delay );

        MOJO.Construct( that );

        Object.defineProperty( that , 'paused' , {
            get: function() {
                var subscriber = that.subscriber;
                return (subscriber ? subscriber.paused : false);
            }
        });
    }


    IteratorMOJO.prototype = MOJO.Create({

        run: function() {
            
            var that = this;
            var node_hx = that.node._hx;

            if (that.subscribed) {
                return false;
            }

            that.subscribed = true;
            that.current = that._getCurrent( that.node );
            that.dest = that._getDest( that.current , that.styles );
            that.diff = that._getDiff( that.node , that.current , that.dest );

            that.subscriber.subscribe();

            return true;
        },

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

        pause: function() {
            var that = this;
            if (that.subscribed) {
                that.subscriber.pause();
            }
        },

        resume: function() {
            var that = this;
            if (that.subscribed) {
                that.subscriber.resume();
            }
        },

        resolveIterator: function() {
            var that = this;
            that.happen( 'complete' );
            that.unsubscribe();
            that.paint( that.dest );
        },

        destroy: function() {
            var that = this;
            that.dispel( 'complete' );
            that.unsubscribe();
        },

        unsubscribe: function() {
            var that = this;
            if (that.subscribed) {
                that.subscriber.destroy();
            }
            that.subscribed = false;
        },

        paint: function( model ) {

            var that = this;
            var node_hx = that.node._hx;
            var bean = that._updateBean( model );

            node_hx.updateComponent( bean );
            node_hx.paint( that.type );
        },

        _createSubscriber: function( duration , delay ) {

            var that = this;

            function onComplete() {
                
                if (!that.subscribed) {
                    return that.unsubscribe();
                }

                that.resolveIterator();
            }

            function timingCallback( progress ) {
                
                if (!that.subscribed) {
                    return that.unsubscribe();
                }
                
                that.progress = progress;

                if (!that.paused) {
                    that.calculate(
                        that.easing.function( progress )
                    );
                }
            }

            return new Subscriber( duration , delay , onComplete , timingCallback );
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

    
}( hxManager.Bezier.retrieve , hxManager.Bean , hxManager.Subscriber ));






















