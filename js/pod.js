(function( window , hx , Config , Helper , When , VendorPatch ) {


    var EACH = Helper.object.each;
    var ODP = Object.defineProperty;


    // =========================== pod constructor ========================== //


    function Pod( node , type ) {

        if (!isValidType( type )) {
            throw new TypeError( 'Invalid pod type' );
        }

        var _pod = null;

        switch (type) {

            case 'xform':
                _pod = new xformPod( node );
                break;

            case 'promise':
                _pod = new promisePod();
                break;
        }

        return _pod;
    }


    function isValidType( type ) {
        return (typeof type === 'string' && Config.types.indexOf( type ) >= 0);
    }


    // ============================== xformPod ============================== //


    function xformPod( node ) {

        this.node = node;
        this.beans = {};
        
        ODP( this , 'type' , {
            get: function() {
                return 'xform';
            }
        });

        ODP( this , 'resolved' , {
            get: function() {
                return Helper.object.size( this.beans ) === 0;
            }
        });
    }


    var xformPod_prototype = (xformPod.prototype = Object.create( When ));


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

        bean.setStyleString(
            this.node._hx.updateComponent( bean )
        );

        var options = {
            node: this.node,
            property: bean.type,
            eventType: VendorPatch.eventType,
        };

        bean.createAnimator( options );
        bean.when( 'complete' , this._beanComplete , this );

        // check the hx_display code and correct style.display if needed
        this.node._hx.checkDisplayState();

        applyXform( this.node , bean );
        bean.startAnimator();

        this.happen( 'beanStart' , [ bean ] );
    };


    xformPod_prototype._beanComplete = function( bean ) {

        var type = bean.type;
        var cluster = this.beans[type];

        this.happen( 'beanComplete' , [ bean ] );

        // if cluster is undefined, the pod must have been force-completed
        if (!cluster) {
            return;
        }

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

        this.happen( 'clusterComplete' , [ type ] );

        if (this.resolved) {
            this.resolvePod();
        }
    };


    xformPod_prototype.resolvePod = function() {

        if (!this.resolved) {
            forceResolve( this , this.beans );
        }
        else {
            this.happen( 'podComplete' , [ this ] );
        }
    };


    xformPod_prototype.cancel = function() {

        this.happen( 'podCanceled' , [ this ] );

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

            instance.happen( 'beanComplete' , [ lastBean ] );
            instance.happen( 'clusterComplete' , [ lastBean.type ] );

        });

        instance.happen( 'podComplete' , [ instance ] );

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
        ODP( this , 'type' , {
            get: function() {
                return 'promise';
            }
        });
    }


    var promisePod_prototype = (promisePod.prototype = Object.create( When ));


    promisePod_prototype.run = function() {
        this.happen( 'promiseMade' );
    };


    promisePod_prototype.resolvePromise = function() {
        this.happen( 'promiseResolved' );
    };


    promisePod_prototype.resolvePod = function() {
        this.happen( 'podComplete' , [ this ] );
    };


    promisePod_prototype.cancel = function() {
        this.happen( 'podCanceled' , [ this ] );
    };


    // ====================================================================== //


    $.extend( hx , { Pod : Pod });

    
}( window , hxManager , hxManager.Config.Pod , hxManager.Helper , hxManager.When , hxManager.VendorPatch ));



























