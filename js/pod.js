(function( window , hx , Config , Helper , When , VendorPatch ) {


    // =========================== pod constructor ========================== //


    var pod = function( node , type ) {

        if (!isValidType( type )) {
            throw new TypeError( 'you must pass a valid type to the hxManager.pod constructor.' );
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
    };


    function isValidType( type ) {
        return (type && typeof type === 'string' && type !== '' && Config.types.indexOf( type ) >= 0);
    }


    // ============================== xformPod ============================== //


    var xformPod = function( node ) {

        this.node = node;
        this.beans = {};
        this.type = 'xform';

        // create the when module
        When( this );
    };


    xformPod.prototype = {

        addBean: function( bean ) {
            var type = bean.getData( 'type' );
            var cluster = (this.beans[type] = this.beans[type] || []);
            cluster.push( bean );
        },

        getType: function() {
            return this.type;
        },

        run: function() {

            var sequence = getActiveSequence( this.beans );

            setTransition( this.node , sequence );

            Helper.object.each( sequence , function( bean , key ) {
                
                if (bean.hasAnimator()) {
                    return;
                }

                this._runBean( bean );

            } , this );
        },

        _runBean: function( bean ) {

            bean.setValue(
                this.node._hx.updateComponent( bean )
            );

            var options = {
                node: this.node,
                property: bean.getData( 'type' ),
                eventType: VendorPatch.getEventType(),
            };

            bean.createAnimator( options );
            bean.when( 'complete' , this._beanComplete , this );

            // check the hx_display code and correct style.display if needed
            this.node._hx.checkDisplayState();

            applyXform( this.node , bean );
            bean.startAnimator();

            this.happen( 'beanStart' , [ bean ] );
        },

        isComplete: function() {
            return Helper.object.size( this.beans ) === 0;
        },

        _beanComplete: function( bean ) {

            var type = bean.getData( 'type' );
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
        },

        _clusterComplete: function( type ) {

            var sequence = getActiveSequence( this.beans );
            setTransition( this.node , sequence , true );

            delete this.beans[type];

            this.happen( 'clusterComplete' , [ type ] );

            if (this.isComplete()) {
                this.complete();
            }
        },

        complete: function() {

            if (!this.isComplete()) {
                forceComplete.call( this , this.beans );
            }
            else {
                this.happen( 'podComplete' , [ this ] );
            }
        },

        cancel: function() {

            this.happen( 'podCanceled' , [ this ] );

            Helper.object.each( this.beans , function( cluster , key ) {
                while (cluster.length > 0) {
                    cluster.shift().complete();
                }
            });
        }
        
    };


    function forceComplete( beans ) {

        Helper.object.each( beans , function( cluster , key ) {
            
            var lastBean = cluster.pop();
            delete beans[key];

            lastBean.complete();

            this.happen( 'beanComplete' , [ lastBean ] );
            this.happen( 'clusterComplete' , [ lastBean.getData( 'type' ) ] );

        } , this );

        this.happen( 'podComplete' , [ this ] );

        // if this is the last xform pod in the queue, reset the transition
        if (!this.node._hx.getPodCount( 'xform' )) {
            setTransition( this.node , {} , true );
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
        var tProp = VendorPatch.getPrefixed( bean.getData( 'type' ));
        $(node).css( tProp , bean.getData( 'value' ));
    }


    function getActiveSequence( beans ) {

        var sequence = {};
        
        Helper.object.each( beans , function( cluster , key ) {
            if (cluster.length > 0) {
                sequence[key] = cluster[0];
            }
        });

        return sequence;
    }


    function buildTransitionString( sequence , last ) {
        
        var arr = [];

        Helper.object.each( sequence , function( part , key ) {

            var options = part.options;

            // android native browser won't respond to zero duration when cancelling a transition
            if (!last) {
                options.duration = VendorPatch.getDuration( options.duration );
            }

            // don't add a component for transitions with duration and delay of 0
            if (options.duration < 1 && options.delay < 1) {
                return;
            }

            var component = key + ' ' + options.duration + 'ms ' + options.easing + ' ' + options.delay + 'ms';
            if (arr.indexOf( component ) < 0) {
                arr.push( component );
            }
        });
        
        return VendorPatch.getPrefixed(
            arr.join( ', ' )
        );
    }


    // ============================= promisePod ============================= //


    var promisePod = function() {

        this.type = 'promise';

        // create the when module
        When( this );
    };


    promisePod.prototype = {

        run: function() {
            this.happen( 'promiseMade' );
        },

        resolve: function() {
            this.happen( 'promiseResolved' );
        },

        complete: function() {
            this.happen( 'podComplete' , [ this ] );
        },

        cancel: function() {
            this.happen( 'podCanceled' , [ this ] );
        },

        getType: function() {
            return this.type;
        }
    };


    // ====================================================================== //


    $.extend( hx , {pod: pod} );

    
}( window , hxManager , hxManager.config.pod , hxManager.helper , hxManager.when , hxManager.vendorPatch ));



























