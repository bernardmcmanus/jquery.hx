hxManager.Queue = hxManager.Inject(
[
    Array,
    'PROTOTYPE',
    'defProps',
    'create',
    'descriptor',
    'ensureArray',
    'isUndef',
    'indexOf'
],
function(
    Array,
    PROTOTYPE,
    defProps,
    create,
    descriptor,
    ensureArray,
    isUndef,
    indexOf
){


    function Queue() {

        var that = this;

        defProps( that , {

            complete: descriptor(function() {
                return !length( that );
            })
        });
    }


    var Queue_prototype = (Queue[PROTOTYPE] = create( Array[PROTOTYPE] ));


    Queue_prototype.run = function() {
        var pod = this[0];
        if (pod) {
            pod.run();
        }
    };


    Queue_prototype.pushPod = function( pod ) {

        var that = this;

        that.push( pod );

        if (length( that ) === 1) {
            that.run();
        }
    };


    Queue_prototype.proceed = function() {

        var that = this;

        that.shift();

        if (!that.complete) {
            that.run();
            return true;
        }

        return false;
    };


    Queue_prototype.clear = function( all ) {

        // all controls whether all pods or all but the current pod will be cleared
        all = (!isUndef( all ) ? all : true);

        var that = this;

        while (length( that ) > (all ? 0 : 1)) {
            that.pop().cancel();
        }
    };


    Queue_prototype.getPodCount = function( type ) {

        type = ensureArray( type );

        return length(
            this.filter(function( pod ) {
                return indexOf( type , pod.type ) >= 0;
            })
        );
    };


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


    return Queue;

});
