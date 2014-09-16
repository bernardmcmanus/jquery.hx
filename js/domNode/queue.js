hxManager.Queue = hxManager.Inject(
[
    Array,
    'PROTOTYPE',
    'defProps',
    'create',
    'descriptor',
    'ensureArray',
    'length',
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
    length,
    isUndef,
    indexOf
){


    function Queue() {

        var that = this;

        defProps( that , {

            current: descriptor(function() {
                return that[0] || false;
            }),

            last: descriptor(function() {
                var l = length( that ) - 1;
                return l >= 0 ? that[l] : false;
            }),

            complete: descriptor(function() {
                return !length( that );
            })
        });
    }


    var Queue_prototype = (Queue[PROTOTYPE] = create( Array[PROTOTYPE] ));


    Queue_prototype.pushPod = function( pod ) {

        var that = this;

        that.push( pod );

        if (length( that ) === 1) {
            that.current.run();
        }
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


    return Queue;
});



























