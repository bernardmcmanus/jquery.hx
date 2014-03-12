(function( hx , Helper , VendorPatch , Animator ) {


    var pod = function( node ) {
        this.node = node;
        this.beans = {};
        this.hooks = {};
    };


    pod.prototype = {

        addBean: function( bean ) {
            var cluster = (this.beans[bean.type] = this.beans[bean.type] || []);
            cluster.push( bean );
        },

        setHooks: function( hooks ) {
            this.hooks = hooks;
        },

        run: function() {

            var sequence = getActiveSequence( this.beans );

            setTransition( this.node , sequence );

            for (var key in sequence) {

                var bean = sequence[key];

                if (typeof bean.animator !== 'undefined') {
                    continue;
                }
                
                this._runBean( bean );
            }
        },

        _runBean: function( bean ) {

            bean.value = this.node._hx.updateComponent( bean );

            var options = $.extend({

                node: this.node,
                property: bean.type,
                eventType: VendorPatch.getEventType(),
                _complete: this._beanComplete.bind( this , bean )

            } , bean.options );

            bean.animator = new Animator( options );

            applyXform( this.node , bean );

            bean.animator.start();

            this.hooks.beanStart( bean );
        },

        isComplete: function() {
            return Helper.object.size.call( this.beans ) === 0;
        },

        _beanComplete: function( bean ) {

            var cluster = this.beans[bean.type];

            cluster.splice( 0 , 1 );

            this.hooks.beanComplete( bean );

            if (cluster.length > 0) {
                this.run();
            }
            else {
                this._clusterComplete( bean.type );
            }
        },

        _clusterComplete: function( property ) {
            
            var sequence = getActiveSequence( this.beans );
            setTransition( this.node , sequence );

            delete this.beans[property];

            this.hooks.clusterComplete( property );

            if (this.isComplete()) {
                this._podComplete();
            }
        },

        _podComplete: function() {
            this.hooks.podComplete();
        }
        
    };


    function setTransition( node , sequence ) {

        var tProp = VendorPatch.getPrefixed( 'transition' );
        var tString = buildTransitionString( sequence );

        if (node.style.transition === tString) {
            return;
        }

        $(node).css( tProp , tString );
    }


    function applyXform( node , bean ) {
        var tProp = VendorPatch.getPrefixed( bean.type );
        $(node).css( tProp , bean.value );
    }


    function getActiveSequence( beans ) {
        var sequence = {};
        for (var key in beans) {
            if (beans[key].length > 0) {
                sequence[key] = beans[key][0];
            }
        }
        return sequence;
    }


    function buildTransitionString( sequence ) {
        
        var arr = [];
        
        for (var key in sequence) {
            var options = sequence[key].options;
            var component = key + ' ' + options.duration + 'ms ' + options.easing + ' ' + options.delay + 'ms';
            if (arr.indexOf( component ) < 0) {
                arr.push( component );
            }
        }

        return VendorPatch.getPrefixed(
            arr.join( ', ' )
        );
    }


    $.extend( hx , {pod: pod} );

    
}( hxManager , hxManager.helper , hxManager.vendorPatch , hxManager.animator ));



























