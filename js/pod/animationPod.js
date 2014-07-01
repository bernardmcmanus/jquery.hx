hxManager.AnimationPod = (function( Helper , VendorPatch ) {


    var Helper_each = Helper.each;
    var Object_defineProperty = Object.defineProperty;


    function AnimationPod( node ) {

        var that = this;

        that.type = 'animation';
        that.node = node;
        that.beans = {};

        MOJO.Hoist( that );

        Object_defineProperty( that , 'sequence' , {
            get: function() {
                var sequence = {};
                Helper_each( that.beans , function( cluster , type ) {
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


    var AnimationPod_prototype = (AnimationPod.prototype = new MOJO());


    AnimationPod_prototype.addBean = function( bean ) {
        var that = this;
        var type = bean.type;
        var cluster = (that.beans[type] = that.beans[type] || []);
        cluster.push( bean );
    };


    AnimationPod_prototype.run = function() {

        var that = this;
        var node = that.node;

        Helper_each( that.sequence , function( bean , key ) {
            
            if (bean.subscribed) {
                return;
            }

            that._runBean( node , bean );
        });

        node._hx.applyTransition();
        node._hx.paint();
    };


    AnimationPod_prototype._runBean = function( node , bean ) {

        var that = this;
        var type = bean.type;

        node._hx.updateComponent( bean );
        node._hx.setTransition( bean );

        bean.when( 'beanComplete' , function( e , bean ) {
            that._beanComplete( bean );
        });

        bean.subscribe();

        that.happen( 'beanStart' , bean );
    };


    AnimationPod_prototype._beanComplete = function( bean ) {

        var that = this;
        var type = bean.type;
        var cluster = that.beans[type];

        // if cluster is undefined, the pod must have been force resolved
        /*if (!cluster) {
            return;
        }*/

        that.happen( 'beanComplete' , bean );

        cluster.shift();

        if (cluster.length > 0) {
            that.run();
        }
        else {
            that._clusterComplete( type );
        }
    };


    AnimationPod_prototype._clusterComplete = function( type ) {

        var that = this;

        delete that.beans[type];

        that.happen( 'clusterComplete' , type );

        if (that.resolved) {
            that.resolvePod();
        }
    };


    AnimationPod_prototype.resolvePod = function() {

        var that = this;

        if (!that.resolved) {
            that._forceResolve();
        }
        else {
            that.happen( 'podComplete' , that );
        }
    };


    AnimationPod_prototype.cancel = function() {

        var that = this;

        that.happen( 'podCanceled' , that );

        Helper_each( that.beans , function( cluster , key ) {
            while (cluster.length > 0) {
                cluster.shift().resolveBean();
            }
        });
    };


    AnimationPod_prototype._forceResolve = function() {

        var that = this;
        var beans = that.beans;

        Helper_each( beans , function( cluster , type ) {
            
            var lastBean = cluster.pop();
            delete beans[type];

            lastBean.resolveBean();

            that.happen( 'beanComplete' , lastBean );
            that.happen( 'clusterComplete' , lastBean.type );
        });

        that.happen( 'podComplete' , that );
    };


    return AnimationPod;

    
}( hxManager.Helper , hxManager.VendorPatch ));



























