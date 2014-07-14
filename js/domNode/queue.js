hxManager.Queue = (function() {


    var Object_defineProperty = Object.defineProperty;


    function Queue() {

        var that = this;

        Object_defineProperty( that , 'current' , {
            get: function() {
                return that[0] || false;
            }
        });

        Object_defineProperty( that , 'last' , {
            get: function() {
                var l = that.length - 1;
                return l >= 0 ? that[l] : false;
            }
        });

        Object_defineProperty( that , 'complete' , {
            get: function() {
                return that.length === 0;
            }
        });
    }


    var Queue_prototype = (Queue.prototype = Object.create( Array.prototype ));


    Queue_prototype.pushPod = function( pod ) {

        var that = this;

        that.push( pod );

        if (that.length === 1) {
            that.current.run();
        }
    };


    Queue_prototype.next = function() {

        var that = this;
    };


    Queue_prototype.proceed = function() {

        var that = this;

        that.shift();

        if (!that.complete) {
            that.current.run();
            return true;
        }

        return false;
    };


    Queue_prototype.clear = function( all ) {

        // all controls whether all pods or all but the current pod will be cleared
        all = (typeof all !== 'undefined' ? all : true);

        var that = this;

        while (that.length > (all ? 0 : 1)) {
            that.pop().cancel();
        }
    };


    /*Queue_prototype.getPodCount = function( type ) {

        return this
            .filter(function( pod ) {
                return (!type || pod.type === type);
            })
            .length;
    };*/


    return Queue;

    
}());



























