hxManager.PrecisionPod = (function( SubscriberMOJO ) {


    var TIMING = 'timing';
    var TIMING_CALLBACK = 'timingCallback';
    var POD_COMPLETE = 'podComplete';
    var POD_CANCELED = 'podCanceled';
    var SUBSCRIBE = 'subscribe';
    var INIT = 'init';
    var ITERATOR_START = 'iteratorStart';
    var ITERATOR_COMPLETE = 'iteratorComplete';
    var PROGRESS = 'progress';


    var Object_defineProperty = Object.defineProperty;


    function PrecisionPod( node ) {

        var that = this;

        that.type = 'precision';
        that.paused = false;
        that.buffer = 0;
        that[PROGRESS] = [];

        MOJO.Construct( that );

        Object_defineProperty( that , 'subscribers' , {
            get: function() {
                return (that.handlers[ TIMING ] || []).length;
            }
        });

        Object_defineProperty( that , 'complete' , {
            get: function() {
                return that.subscribers === 0;
            }
        });

        that.handle = that._handle.bind( that );

        that._init( that.handle );
    }


    PrecisionPod.prototype = MOJO.Create({

        _init: function( handle ) {

            var that = this;
            var subscriber = new SubscriberMOJO();

            subscriber.when( TIMING , handle );

            that.once([ SUBSCRIBE , POD_COMPLETE , POD_CANCELED ] , [ subscriber , handle ] , handle );
        },

        addBean: function( iteratorMOJO ) {

            var that = this;
            var podHandle = that.handle;
            var iteratorHandle = iteratorMOJO.handle;
            var index = that.subscribers;

            that.when( TIMING , iteratorHandle );
            that.once([ INIT , POD_COMPLETE , POD_CANCELED ] , iteratorHandle );

            iteratorMOJO.when( PROGRESS , index , podHandle );
            iteratorMOJO.once([ ITERATOR_START , ITERATOR_COMPLETE ] , iteratorHandle , podHandle );
        },

        addCallback: function( callback ) {
            var that = this;
            that.when( TIMING_CALLBACK , function( e , elapsed ) {
                callback( elapsed , that.progress );
            });
        },

        run: function() {
            this.happen([ INIT , SUBSCRIBE ]);
        },

        pause: function() {
            var that = this;
            that.paused = true;
            that.happen( 'podPaused' , that );
        },

        resume: function() {
            var that = this;
            that.paused = false;
            that.happen( 'podResumed' , that );
        },

        resolvePod: function() {
            var that = this;
            that.happen( POD_COMPLETE , that );
        },

        cancel: function() {
            var that = this;
            that.happen( POD_CANCELED , that );
        },

        _handle: function( e ) {

            var that = this;
            var args = arguments;
            var subscriber, podHandle, index, progress, iteratorMOJO, iteratorHandle;

            switch (e.type) {

                case TIMING:
                    that._timing.apply( that , args );
                break;

                case SUBSCRIBE:
                    subscriber = args[1];
                    subscriber.subscribe();
                break;

                case POD_COMPLETE:
                case POD_CANCELED:

                    subscriber = args[1];
                    podHandle = args[2];

                    subscriber.dispel( TIMING , podHandle );
                    that.dispel([ SUBSCRIBE , POD_COMPLETE , POD_CANCELED ] , podHandle );
                break;

                case PROGRESS:
                    index = args[1];
                    progress = args[2];
                    that[PROGRESS][index] = progress > 1 ? 1 : progress;
                break;

                case ITERATOR_START:
                    iteratorMOJO = e.target;
                    that.happen( ITERATOR_START, iteratorMOJO.bean );
                break;

                case ITERATOR_COMPLETE:

                    iteratorMOJO = e.target;
                    iteratorHandle = args[1];

                    that.happen( ITERATOR_COMPLETE , iteratorMOJO.bean );
                    that.dispel([ TIMING , INIT , POD_COMPLETE , POD_CANCELED ] , iteratorHandle );

                    //console.log('iterator complete');

                    if (that.complete) {
                        //console.log('pod complete');
                        that.resolvePod();
                    }
                break;
            }
        },

        _timing: function( e , elapsed , diff ) {

            var that = this;

            if (that.paused) {
                that.buffer += diff;
            }
            else {
                that.happen([ TIMING , TIMING_CALLBACK ] , ( elapsed - that.buffer ));
            }
        }
    });


    return PrecisionPod;

    
}( hxManager.SubscriberMOJO ));




























