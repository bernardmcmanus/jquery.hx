(function( window , hx , Helper , VendorPatch , Animator ) {


    var pod = function( node ) {
        this.node = node;
        this.beans = {};
        this.hooks = {};
        this.done = [];
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

            Helper.object.each( sequence , function( bean , key ) {
                
                if (typeof bean.animator !== 'undefined') {
                    return;
                }

                this._runBean( bean );

            } , this );
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
            return Helper.object.size( this.beans ) === 0;
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
            this.hooks.podComplete( this );
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
        
        Helper.object.each( beans , function( bean , key ) {
            if (bean.length > 0) {
                sequence[key] = bean[0];
            }
        });

        return sequence;
    }


    function buildTransitionString( sequence ) {
        
        var arr = [];

        Helper.object.each( sequence , function( part , key ) {
            var options = part.options;
            var component = key + ' ' + options.duration + 'ms ' + options.easing + ' ' + options.delay + 'ms';
            if (arr.indexOf( component ) < 0) {
                arr.push( component );
            }
        });
        
        return VendorPatch.getPrefixed(
            arr.join( ', ' )
        );
    }


    $.extend( hx , {pod: pod} );

    
}( window , hxManager , hxManager.helper , hxManager.vendorPatch , hxManager.animator ));



























