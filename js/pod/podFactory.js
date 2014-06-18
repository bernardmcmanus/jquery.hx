hxManager.PodFactory = (function( Helper , VendorPatch ) {


    var Helper_each = Helper.each;
    var Object_defineProperty = Object.defineProperty;


    function PodFactory( node , type ) {

        switch (type) {

            case 'xform':
                return new xformPod( node );

            case 'promise':
                return new promisePod();
        }
    }


    // ============================== xformPod ============================== //


    function xformPod( node ) {

        var that = this;

        that.node = node;
        that.beans = {};

        MOJO.Hoist( that );
        
        Object_defineProperty( that , 'type' , {
            get: function() {
                return 'xform';
            }
        });

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


    var xformPod_prototype = (xformPod.prototype = new MOJO());


    xformPod_prototype.addBean = function( bean ) {
        var that = this;
        var type = bean.type;
        var cluster = (that.beans[type] = that.beans[type] || []);
        cluster.push( bean );
    };


    xformPod_prototype.run = function() {

        var that = this;
        var node = that.node;

        Helper_each( that.sequence , function( bean , key ) {
            
            if (bean.hasAnimator) {
                return;
            }

            that._runBean( node , bean );
        });

        node._hx.applyTransition();
        node._hx.paint();
    };


    xformPod_prototype._runBean = function( node , bean ) {

        var that = this;
        var type = bean.type;

        node._hx.updateComponent( bean );
        node._hx.setTransition( bean );

        bean.createAnimator({
            node: node,
            type: type,
            eventType: VendorPatch.eventType,
        });

        bean.when( 'beanComplete' , function( e , bean ) {
            that._beanComplete( bean );
        });

        bean.startAnimator();

        that.happen( 'beanStart' , bean );
    };


    xformPod_prototype._beanComplete = function( bean ) {

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
    };


    xformPod_prototype._clusterComplete = function( type ) {

        var that = this;

        delete that.beans[type];

        that.happen( 'clusterComplete' , type );

        if (that.resolved) {
            that.resolvePod();
        }
    };


    xformPod_prototype.resolvePod = function() {

        var that = this;

        if (!that.resolved) {
            that._forceResolve();
        }
        else {
            that.happen( 'podComplete' , that );
        }
    };


    xformPod_prototype.cancel = function() {

        var that = this;

        that.happen( 'podCanceled' , that );

        Helper_each( that.beans , function( cluster , key ) {
            while (cluster.length > 0) {
                cluster.shift().resolveBean();
            }
        });
    };


    xformPod_prototype._forceResolve = function() {

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


    // ============================= promisePod ============================= //


    function promisePod() {

        var that = this;

        MOJO.Hoist( that );

        Object_defineProperty( that , 'type' , {
            get: function() {
                return 'promise';
            }
        });
    }


    var promisePod_prototype = (promisePod.prototype = new MOJO());


    promisePod_prototype.run = function() {
        this.happen( 'promiseMade' );
    };


    promisePod_prototype.resolvePromise = function() {
        this.happen( 'promiseResolved' );
    };


    promisePod_prototype.resolvePod = function() {
        var that = this;
        that.happen( 'podComplete' , that );
    };


    promisePod_prototype.cancel = function() {
        var that = this;
        that.happen( 'podCanceled' , that );
    };


    // ====================================================================== //


    return PodFactory;

    
}( hxManager.Helper , hxManager.VendorPatch ));



























