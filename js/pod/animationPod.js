hxManager.AnimationPod = (function( VendorPatch ) {


    var MOJO_Each = MOJO.Each;
    var Object_defineProperty = Object.defineProperty;


    function AnimationPod( node ) {

        var that = this;

        that.type = 'animation';
        that.node = node;
        that.beans = {};

        MOJO.Construct( that );

        Object_defineProperty( that , 'sequence' , {
            get: function() {
                var sequence = {};
                MOJO_Each( that.beans , function( cluster , type ) {
                    if (cluster.length > 0) {
                        sequence[type] = cluster[0];
                    }
                });
                return sequence;
            }
        });

        Object_defineProperty( that , 'resolved' , {
            get: function() {
                return Object.keys( that.beans ).length === 0;
            }
        });
    }


    AnimationPod.prototype = MOJO.Create({

        addBean: function( bean ) {
            var that = this;
            var type = bean.type;
            var cluster = (that.beans[type] = that.beans[type] || []);
            cluster.push( bean );
        },

        run: function() {

            var that = this;
            var node = that.node;

            MOJO_Each( that.sequence , function( bean , key ) {
                
                if (!bean.subscribed) {
                    that._runBean( node , bean );
                }
            });

            node._hx.applyTransition();
            node._hx.paint();
        },

        _runBean: function( node , bean ) {

            var that = this;

            node._hx.updateComponent( bean );
            node._hx.setTransition( bean );

            bean.when( 'beanComplete' , function( e , bean ) {
                that._beanComplete( bean );
            });

            bean.subscribe();

            /*node._hx.applyTransition();
            node._hx.paint( bean.type );*/

            that.happen( 'beanStart' , bean );
        },

        _beanComplete: function( bean ) {

            var that = this;
            var type = bean.type;
            var cluster = that.beans[type];

            that.happen( 'beanComplete' , bean );

            cluster.shift();

            if (cluster.length > 0) {
                that.run();
            }
            else {
                that._clusterComplete( type );
            }
        },

        _clusterComplete: function( type ) {

            var that = this;

            delete that.beans[type];

            that.happen( 'clusterComplete' , type );

            if (that.resolved) {
                that.resolvePod();
            }
        },

        resolvePod: function() {

            var that = this;

            if (!that.resolved) {
                that._forceResolve();
            }
            else {
                that.happen( 'podComplete' , that );
            }
        },

        cancel: function() {

            var that = this;

            that.happen( 'podCanceled' , that );

            MOJO_Each( that.beans , function( cluster , key ) {
                while (cluster.length > 0) {
                    cluster.shift().resolveBean();
                }
            });
        },

        _forceResolve: function() {

            var that = this;
            var beans = that.beans;

            MOJO_Each( beans , function( cluster , type ) {
                
                var lastBean = cluster.pop();
                delete beans[type];

                lastBean.resolveBean();

                that.happen( 'beanComplete' , lastBean );
                that.happen( 'clusterComplete' , lastBean.type );
            });

            that.happen( 'podComplete' , that );
        }
    });


    return AnimationPod;

    
}( hxManager.VendorPatch ));



























