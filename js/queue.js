(function( window , hx ) {


    var queue = function() {
        return $.extend( [] , this );
    };


    queue.prototype = {

        pushPod: function( pod ) {

            this.push( pod );

            if (this.length === 1) {
                this[0].run();
            }
        },

        next: function() {

            this.splice( 0 , 1 );

            if (!this.isComplete()) {
                this[0].run();
                return true;
            }

            return false;
        },

        isComplete: function() {
            return this.length === 0;
        }
        
    };


    $.extend( hx , {queue: queue} );

    
}( window , hxManager ));



























