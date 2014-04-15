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

            this.shift();

            if (!this.isComplete()) {
                this[0].run();
                return true;
            }

            return false;
        },

        clear: function( all ) {

            // all controls whether all pods or all but the current pod will be cleared
            all = (typeof all !== 'undefined' ? all : true);

            while (this.length > (all ? 0 : 1)) {
                this.pop().cancel();
            }
        },

        getCurrent: function() {
            if (this.length > 0) {
                return this[0];
            }
            else {
                return false;
            }
        },

        getPodCount: function( type ) {

            var count = 0;

            this.forEach(function( pod ) {
                if (!type || pod.getType() === type) {
                    count++;
                }
            });

            return count;
        },

        isComplete: function() {
            return this.length === 0;
        }
        
    };


    $.extend( hx , {queue: queue} );

    
}( window , hxManager ));



























