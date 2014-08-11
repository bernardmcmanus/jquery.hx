hxManager.PrecisionPod = (function( Object , MOJO , Helper , SubscriberMOJO ) {


    var TIMING = 'timing';
    var TIMING_CALLBACK = 'timingCallback';
    var POD_COMPLETE = 'podComplete';
    var POD_CANCELED = 'podCanceled';
    var SUBSCRIBE = 'subscribe';
    var INIT = 'init';
    var BEAN_START = 'beanStart';
    var BEAN_COMPLETE = 'beanComplete';
    var PROGRESS = 'progress';


    var Descriptor = Helper.descriptor;


    function PrecisionPod() {

        var that = this;

        that.type = 'precision';
        that.paused = false;
        that.buffer = 0;
        that[PROGRESS] = [];

        MOJO.Construct( that );

        Object.defineProperties( that , {

            subscribers: Descriptor(function() {
                return (that.handlers[ TIMING ] || []).length;
            }),
            
            complete: Descriptor(function() {
                return that.subscribers === 0;
            })
        });

        that._init();
    }


    PrecisionPod.prototype = MOJO.Create({

        _init: function() {

            var that = this;
            var subscriber = new SubscriberMOJO();

            subscriber.when( TIMING , that );

            that.once([ SUBSCRIBE , POD_COMPLETE , POD_CANCELED ] , subscriber , that );
        },

        addBean: function( iteratorMOJO ) {

            var that = this;
            var index = that.subscribers;

            that.when( TIMING , iteratorMOJO );
            that.once([ INIT , POD_COMPLETE , POD_CANCELED ] , iteratorMOJO );

            iteratorMOJO.when( PROGRESS , index , that );
            iteratorMOJO.once([ BEAN_START , BEAN_COMPLETE ] , that );
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

        handleMOJO: function( e ) {

            var that = this;
            var args = arguments;
            var subscriber, index, progress, iteratorMOJO;

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

                    subscriber.dispel( TIMING , that );
                    that.dispel([ SUBSCRIBE , POD_COMPLETE , POD_CANCELED ] , that );
                break;

                case PROGRESS:
                    index = args[1];
                    progress = args[2];
                    that[PROGRESS][index] = progress > 1 ? 1 : progress;
                break;

                case BEAN_START:
                    iteratorMOJO = e.target;
                    that.happen( BEAN_START, iteratorMOJO.bean );
                break;

                case BEAN_COMPLETE:

                    iteratorMOJO = e.target;

                    that.happen( BEAN_COMPLETE , iteratorMOJO.bean );
                    that.dispel([ TIMING , INIT , POD_COMPLETE , POD_CANCELED ] , iteratorMOJO );

                    if (that.complete) {
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

    
}( Object , MOJO , hxManager.Helper , hxManager.SubscriberMOJO ));




























