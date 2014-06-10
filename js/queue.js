hxManager.Queue = (function() {


    var Object_defineProperty = Object.defineProperty;


    function Queue() {

        Object_defineProperty( this , 'current' , {
            get: function() {
                return this[0] || false;
            }
        });

        Object_defineProperty( this , 'complete' , {
            get: function() {
                return this.length === 0;
            }
        });
    }


    var Queue_prototype = (Queue.prototype = Object.create( Array.prototype ));


    Queue_prototype.pushPod = function( pod ) {

        this.push( pod );

        if (this.length === 1) {
            this.current.run();
        }
    };


    Queue_prototype.next = function() {

        this.shift();

        if (!this.complete) {
            this.current.run();
            return true;
        }

        return false;
    };


    Queue_prototype.clear = function( all ) {

        // all controls whether all pods or all but the current pod will be cleared
        all = (typeof all !== 'undefined' ? all : true);

        while (this.length > (all ? 0 : 1)) {
            this.pop().cancel();
        }
    };


    Queue_prototype.getPodCount = function( type ) {

        var count = 0;

        this.forEach(function( pod ) {
            if (!type || pod.type === type) {
                count++;
            }
        });

        return count;
    };


    return Queue;

    
}());



























