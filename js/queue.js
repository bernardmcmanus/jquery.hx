(function( hx , Animator , VendorPatch ) {


    var queue = function( node ) {
        this.node = node;
        this.branches = {};
    };


    queue.prototype = {

        add: function( property , xformString , options ) {

            var branch = (this.branches[property] = this.branches[property] || []);

            options = $.extend({
                node: this.node,
                property: property,
                value: xformString,
                eventType: VendorPatch.getEventType(),
                done: this._instanceComplete.bind( this )
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

        _instanceComplete: function( e , property ) {

            var branch = this.branches[property];
            branch.splice( 0 , 1 );

            if (branch.length > 0) {
                this._exec( property );
            }
            else {
                this._branchComplete( property );
            }
        },

        _branchComplete: function( property ) {
            console.log('branch complete');
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

        console.log( tProp , tString );
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



























