hxManager.PodFactory = (function( Helper , VendorPatch ) {


    var EACH = Helper.object.each;
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
        var handlers = {};

        that.node = node;
        that.beans = {};

        Object_defineProperty( that , 'handlers' , {
            get: function() {
                return handlers;
            }
        });
        
        Object_defineProperty( that , 'type' , {
            get: function() {
                return 'xform';
            }
        });

        Object_defineProperty( that , 'resolved' , {
            get: function() {
                return Helper.object.size( that.beans ) === 0;
            }
        });
    }


    var xformPod_prototype = (xformPod.prototype = new MOJO());


    xformPod_prototype.addBean = function( bean ) {
        var type = bean.type;
        var cluster = (this.beans[type] = this.beans[type] || []);
        cluster.push( bean );
    };


    xformPod_prototype.run = function() {

        var sequence = getActiveSequence( this.beans );

        setTransition( this.node , sequence );

        EACH( sequence , function( bean , key ) {
            
            if (bean.hasAnimator) {
                return;
            }

            this._runBean( bean );

        } , this );
    };


    xformPod_prototype._runBean = function( bean ) {

        var that = this;

        bean.setStyleString(
            that.node._hx.updateComponent( bean )
        );

        if (bean.options.listen) {

            var options = {
                node: that.node,
                property: bean.type,
                eventType: VendorPatch.eventType,
            };

            bean.createAnimator( options );
            bean.when( 'beanComplete' , function( e , bean ) {
                that._beanComplete( bean );
            });

            applyXform( that.node , bean );
            bean.startAnimator();

            that.happen( 'beanStart' , bean );
        }
        else {
            // handle zero-duration
            applyXform( that.node , bean );
            that.happen( 'beanStart' , bean );
            that._beanComplete( bean );
        }
    };


    xformPod_prototype._beanComplete = function( bean ) {

        var type = bean.type;
        var cluster = this.beans[type];

        this.happen( 'beanComplete' , bean );

        // if cluster is undefined, the pod must have been force-completed
        /*if (!cluster) {
            return;
        }*/

        cluster.shift();

        if (cluster.length > 0) {
            this.run();
        }
        else {
            this._clusterComplete( type );
        }
    };


    xformPod_prototype._clusterComplete = function( type ) {

        var sequence = getActiveSequence( this.beans );
        setTransition( this.node , sequence , true );

        delete this.beans[type];

        this.happen( 'clusterComplete' , type );

        if (this.resolved) {
            this.resolvePod();
        }
    };


    xformPod_prototype.resolvePod = function() {

        if (!this.resolved) {
            forceResolve( this , this.beans );
        }
        else {
            this.happen( 'podComplete' , this );
        }
    };


    xformPod_prototype.cancel = function() {

        this.happen( 'podCanceled' , this );

        EACH( this.beans , function( cluster , key ) {
            while (cluster.length > 0) {
                cluster.shift().resolveBean();
            }
        });
    };


    function forceResolve( instance , beans ) {

        EACH( beans , function( cluster , key ) {
            
            var lastBean = cluster.pop();
            delete beans[key];

            lastBean.resolveBean();

            instance.happen( 'beanComplete' , lastBean );
            instance.happen( 'clusterComplete' , lastBean.type );

        });

        instance.happen( 'podComplete' , instance );

        // if this is the last xform pod in the queue, reset the transition
        if (!instance.node._hx.getPodCount( 'xform' )) {
            setTransition( instance.node , {} , true );
        }
    }


    function setTransition( node , sequence , last ) {

        last = typeof last !== 'undefined' ? last : false;

        var tProp = VendorPatch.getPrefixed( 'transition' );
        var tString = buildTransitionString( sequence , last );

        if (node.style.transition === tString) {
            return;
        }

        $(node).css( tProp , tString );
    }


    function applyXform( node , bean ) {
        var tProp = VendorPatch.getPrefixed( bean.type );
        $(node).css( tProp , bean.styleString );
    }


    function getActiveSequence( beans ) {

        var sequence = {};
        
        EACH( beans , function( cluster , key ) {
            if (cluster.length > 0) {
                sequence[key] = cluster[0];
            }
        });

        return sequence;
    }


    function buildTransitionString( sequence , last ) {
        
        var arr = [];

        EACH( sequence , function( bean , type ) {

            var options = bean.options;
            var easing = bean.easing;

            // android native browser won't respond to zero duration when cancelling a transition
            if (!last) {
                options.duration = VendorPatch.getDuration( options.duration );
            }

            // don't add a component for transitions with duration and delay of 0
            if (options.duration < 1 && options.delay < 1) {
                return;
            }

            var component = type + ' ' + options.duration + 'ms ' + easing + ' ' + options.delay + 'ms';
            if (arr.indexOf( component ) < 0) {
                arr.push( component );
            }
        });
        
        return VendorPatch.getPrefixed(
            arr.join( ', ' )
        );
    }


    // ============================= promisePod ============================= //


    function promisePod() {

        var that = this;
        var handlers = {};

        Object_defineProperty( that , 'handlers' , {
            get: function() {
                return handlers;
            }
        });

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



























