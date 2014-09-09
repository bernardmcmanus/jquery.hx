hxManager.PrecisionPod = (function( Object , MOJO , hxManager ) {


    var NULL = null;
    var TIMING = 'timing';
    var TIMING_CALLBACK = 'timingCallback';
    var POD_PAUSED = 'podPaused';
    var POD_RESUMED = 'podResumed';
    var POD_COMPLETE = 'podComplete';
    var POD_CANCELED = 'podCanceled';
    var POD_FORCED = 'forceResolve';
    var SUBSCRIBE = 'subscribe';
    var INIT = 'init';
    var BEAN_START = 'beanStart';
    var BEAN_COMPLETE = 'beanComplete';
    var BEAN_CANCELED = 'beanCanceled';
    var PROGRESS = 'progress';


    var Helper = hxManager.Helper;
    var SubscriberMOJO = hxManager.SubscriberMOJO;


    var Descriptor = Helper.descriptor;
    var Length = Helper.length;


    function PrecisionPod() {

        var that = this;

        that.type = 'precision';
        that.forced = false;
        that.paused = false;
        that.buffer = 0;
        that.attached = true;
        that[PROGRESS] = [];

        MOJO.Construct( that );

        Object.defineProperties( that , {

            subscribers: Descriptor(function() {
                return Length( that.handlers[ TIMING ] || [] );
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

            that.once([ SUBSCRIBE , POD_COMPLETE , POD_FORCED , POD_CANCELED ] , subscriber , that );
        },

        addBean: function( iteratorMOJO ) {

            var that = this;
            var index = that.subscribers;

            that.when( TIMING , iteratorMOJO );
            that.once([ INIT , POD_CANCELED ] , iteratorMOJO );

            iteratorMOJO.when( PROGRESS , index , that );
            iteratorMOJO.once([ BEAN_START , BEAN_COMPLETE , BEAN_CANCELED ] , that );
        },

        addCallback: function( callback ) {
            
            var that = this;

            that.when( TIMING_CALLBACK , function( e , elapsed , diff , attached ) {
                if (attached) {
                    callback( elapsed , that.progress );
                }
            });
        },

        run: function() {
            this.happen([ INIT , SUBSCRIBE ]);
        },

        detach: function() {
            this.attached = false;
        },

        pause: function() {
            var that = this;
            that.paused = true;
            that.happen( POD_PAUSED , that );
        },

        resume: function() {
            var that = this;
            that.paused = false;
            that.happen( POD_RESUMED , that );
        },

        resolvePod: function() {
            var that = this;
            if (that.complete) {
                that.happen( POD_COMPLETE , that );
            }
            else {
                that.happen( POD_FORCED );
            }
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
                    subscriber = args[1];
                    subscriber.dispel();
                    that.dispel();
                break;

                case POD_CANCELED:
                    that.dispel( BEAN_COMPLETE );
                    that.happen( POD_FORCED );
                break;

                case POD_FORCED:

                    that.forced = true;
                    subscriber = args[1];

                    if (that.paused || !that.attached) {
                        that.happen( POD_COMPLETE , that );
                    }
                    else {
                        that.dispel( NULL , that );
                        that.happen( POD_COMPLETE , that );
                        that.once( POD_COMPLETE , subscriber , that );
                    }
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

                case BEAN_CANCELED:
                    iteratorMOJO = e.target;
                    iteratorMOJO.dispel();
                    that.dispel( NULL , iteratorMOJO );
                break;

                case BEAN_COMPLETE:

                    iteratorMOJO = e.target;

                    that.dispel( NULL , iteratorMOJO );

                    if (!that.forced) {
                        that.happen( BEAN_COMPLETE , iteratorMOJO.bean );
                    }

                    if (that.complete) {
                        that.resolvePod();
                    }
                break;
            }
        },

        _timing: function( e , elapsed , diff ) {

            var that = this;
            var attached = that.attached;

            if (that.paused) {
                that.buffer += diff;
            }
            else {
                that.happen([ TIMING , TIMING_CALLBACK ] , [( elapsed - that.buffer ) , diff , attached ]);
            }
        }
    });


    return PrecisionPod;

    
}( Object , MOJO , hxManager ));




























