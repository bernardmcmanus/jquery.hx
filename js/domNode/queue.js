var helper = require( 'shared/helper' );

module.exports = Queue;

function Queue() {
    var that = this;
    Array.call( that );
    helper.defProps( that , {
        complete: helper.descriptor(function() {
            return !length( that );
        })
    });
}

Queue.prototype = $.extend(helper.create( Array.prototype ), {
    constructor: Queue,
    run: function() {
        var pod = this[0];
        if (pod) {
            pod.run();
        }
    },
    pushPod: function( pod ) {
        var that = this;
        that.push( pod );
        if (length( that ) === 1) {
            that.run();
        }
    },
    proceed: function() {
        var that = this;
        that.shift();
        if (!that.complete) {
            that.run();
            return true;
        }
        return false;
    },
    clear: function( all ) {
        // all controls whether all pods or all but the current pod will be cleared
        all = (!helper.isUndef( all ) ? all : true);
        var that = this;
        while (length( that ) > (all ? 0 : 1)) {
            that.pop().cancel();
        }
    },
    getPodCount: function( type ) {
        type = helper.ensureArray( type );
        return length(
            this.filter(function( pod ) {
                return helper.indexOf( type , pod.type ) >= 0;
            })
        );
    }
});

/*
**  iOS encounters a strange issue using Helper.length
**  (but not this length function), mainly in Queue.prototype.clear,
**  where pods are removed from the queue and cancelled,
**  but length( queue ) continues to return the same value.
**  It's inconsistent and difficult to reproduce, so fixing
**  for now by adding this length function in the same context.
*/

function length( subject ) {
    return subject.length;
}
