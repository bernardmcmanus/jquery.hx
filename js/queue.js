(function( window , hx ) {


    function Queue() {

        Object.defineProperty( this , 'current' , {
            get: function() {
                return this[0] || false;
            }
        });

        Object.defineProperty( this , 'complete' , {
            get: function() {
                return this.length === 0;
            }
        });
    }


    Queue.prototype = Object.create( Array.prototype );


    Queue.prototype.pushPod = function( pod ) {

        this.push( pod );

        if (this.length === 1) {
            this.current.run();
        }
    };


    Queue.prototype.next = function() {

        this.shift();

        if (!this.complete) {
            this.current.run();
            return true;
        }

        return false;
    };


    Queue.prototype.clear = function( all ) {

        // all controls whether all pods or all but the current pod will be cleared
        all = (typeof all !== 'undefined' ? all : true);

        while (this.length > (all ? 0 : 1)) {
            this.pop().cancel();
        }
    };


    Queue.prototype.getPodCount = function( type ) {

        var count = 0;

        this.forEach(function( pod ) {
            if (!type || pod.getType() === type) {
                count++;
            }
        });

        return count;
    };


    $.extend( hx , { Queue : Queue });

    
}( window , hxManager ));



























