hxManager.Queue = (function( Object , Array , hxManager ) {


    var UNDEFINED;


    var Helper = hxManager.Helper;


    var Descriptor = Helper.descriptor;
    var EnsureArray = Helper.ensureArray;
    var Length = Helper.length;


    function Queue() {

        var that = this;

        Object.defineProperties( that , {

            current: Descriptor(function() {
                return that[0] || false;
            }),

            last: Descriptor(function() {
                var l = Length( that ) - 1;
                return l >= 0 ? that[l] : false;
            }),

            complete: Descriptor(function() {
                return !Length( that );
            })
        });
    }


    var Queue_prototype = (Queue.prototype = Object.create( Array.prototype ));


    Queue_prototype.pushPod = function( pod ) {

        var that = this;

        that.push( pod );

        if (Length( that ) === 1) {
            that.current.run();
        }
    };


    /*Queue_prototype.nextOfType = function( type ) {

        var that = this;
        var pod = false;

        for (var i = 0; i < Length( that ); i++) {
            if (that[i].type === type) {
                pod = that[i];
                break;
            }
        }

        return pod;
    };*/


    /*Queue_prototype.next = function() {

        var that = this;
    };*/


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
        all = (all !== UNDEFINED ? all : true);

        var that = this;

        while (Length( that ) > (all ? 0 : 1)) {
            that.pop().cancel();
        }
    };


    Queue_prototype.getPodCount = function( type ) {

        type = EnsureArray( type );

        return Length(
            this.filter(function( pod ) {
                return type.indexOf( pod.type ) >= 0;
            })
        );
    };


    return Queue;

    
}( Object , Array , hxManager ));



























