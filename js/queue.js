(function( hx , Animator , VendorPatch ) {


    var queue = function( node , hooks ) {
        this.node = node;
        this.hooks = hooks;
        this.branches = {};
    };


    queue.prototype = {

        push: function( property , xformString , options ) {

            var branch = (this.branches[property] = this.branches[property] || []);

            options = $.extend({
                node: this.node,
                property: property,
                value: xformString,
                eventType: VendorPatch.getEventType(),
                _complete: this._instanceComplete.bind( this )
            } , options );

            branch.push(
                new Animator( options )
            );

            if (branch.length === 1) {
                this._exec( property );
            }
        },

        getCurrentInstance: function( property ) {
            return this.branches[property][0];
        },

        _exec: function( property ) {

            var sequence = getActiveSequence( this.branches );
            setTransition( this.node , sequence );
            
            var animator = this.getCurrentInstance( property );
            applyXform( this.node , animator );

            animator.start();
        },

        _instanceComplete: function( property ) {

            var branch = this.branches[property];
            var instance = branch.splice( 0 , 1 )[0];

            console.log(instance);

            if (branch.length > 0) {
                this._exec( property );
            }
            else {
                this._branchComplete( property );
            }

            this.hooks.instanceComplete( property );
        },

        _branchComplete: function( property ) {
            
            var sequence = getActiveSequence( this.branches );
            setTransition( this.node , sequence );

            delete this.branches[property];

            this.hooks.branchComplete( property );
        },

        _queueComplete: function() {

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


    function applyXform( node , instance ) {
        var tProp = VendorPatch.getPrefixed( instance.property );
        $(node).css( tProp , instance.value );
    }


    function getActiveSequence( branches ) {
        var sequence = {};
        for (var key in branches) {
            if (branches[key].length > 0) {
                sequence[key] = branches[key][0];
            }
        }
        return sequence;
    }


    function buildTransitionString( sequence ) {
        
        var arr = [];
        
        for (var key in sequence) {
            var component = key + ' ' + sequence[key].duration + 'ms ' + sequence[key].easing + ' ' + sequence[key].delay + 'ms';
            if (arr.indexOf( component ) < 0) {
                arr.push( component );
            }
        }

        return VendorPatch.getPrefixed(
            arr.join( ', ' )
        );
    }


    $.extend( hx , {queue: queue} );

    
}( hxManager , hxManager.animator , hxManager.vendorPatch ));



























