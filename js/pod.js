(function( window , hx , Helper , When , VendorPatch ) {


    var pod = function( node ) {

        this.node = node;
        this.beans = {};
        this.done = [];

        var whenModule = new When();
        this.when = whenModule.when.bind( whenModule );
        this.happen = whenModule.happen.bind( whenModule );
    };


    pod.prototype = {

        addBean: function( bean ) {
            var type = bean.getData( 'type' );
            var cluster = (this.beans[type] = this.beans[type] || []);
            cluster.push( bean );
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

            cluster.splice( 0 , 1 );

            this.happen( 'beanComplete' , [ bean ] );

            if (cluster.length > 0) {
                this.run();
            }
            else {
                this._clusterComplete( type );
            }
        },

        _clusterComplete: function( property ) {
            
            var sequence = getActiveSequence( this.beans );
            setTransition( this.node , sequence );

            delete this.beans[property];

            this.happen( 'clusterComplete' , [ property ] );

            if (this.isComplete()) {
                this._podComplete();
            }
        },

        _podComplete: function() {
            this.happen( 'podComplete' , [ this ] );
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
        var tProp = VendorPatch.getPrefixed( bean.getData( 'type' ));
        $(node).css( tProp , bean.getData( 'value' ));
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

    
}( window , hxManager , hxManager.helper , hxManager.when , hxManager.vendorPatch ));



























