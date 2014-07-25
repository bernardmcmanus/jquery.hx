hxManager.PrecisionPod = (function( SubscriberMOJO ) {


    var TIMING_EVENT = 'timing';
    var SHARED_EVENTS = [ 'podComplete' , 'podCanceled' ];
    var POD_EVENTS = [ 'subscribe' ].concat( SHARED_EVENTS );
    var ITERATOR_EVENTS = [ 'init' ].concat( SHARED_EVENTS );


    var Object_defineProperty = Object.defineProperty;


    function PrecisionPod( node ) {

        var that = this;

        that.type = 'precision';
        that.progress = [];
        that.paused = false;
        that.buffer = 0;

        MOJO.Construct( that );

        Object_defineProperty( that , 'subscribers' , {
            get: function() {
                return (that.handlers[ TIMING_EVENT ] || []).length;
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

            subscriber.when( TIMING_EVENT , handle );

            that.once( POD_EVENTS.join( ' ' ) , [ subscriber , handle ] , handle );
        },

        addBean: function( iteratorMOJO ) {

            var that = this;
            var podHandle = that.handle;
            var iteratorHandle = iteratorMOJO.handle;
            var index = that.subscribers;

            that.when( TIMING_EVENT , iteratorHandle );
            that.once( ITERATOR_EVENTS.join( ' ' ) , iteratorHandle );

            iteratorMOJO.when( 'progress' , [ index ] , podHandle );
            iteratorMOJO.once( 'iteratorComplete' , iteratorHandle , podHandle );
        },

        run: function() {
            this.happen( ITERATOR_EVENTS[0] + ' ' + POD_EVENTS[0] );
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
            that.happen( SHARED_EVENTS[0] , that );
        },

        cancel: function() {
            var that = this;
            that.happen( SHARED_EVENTS[1] , that );
        },

        _handle: function( e ) {

            var that = this;
            var args = arguments;

            switch (e.type) {

                case TIMING_EVENT:
                    that._timing.apply( that , args );
                break;

                case POD_EVENTS[0]: // subscribe
                    // args[1] === subscriber
                    args[1].subscribe();
                break;

                case POD_EVENTS[1]: // podComplete
                case POD_EVENTS[2]: // podCanceled
                    // args[1] === subscriber
                    // args[2] === that.handle
                    args[1].dispel( TIMING_EVENT , args[2] );
                    // !!! this is preventing podComplete from being run
                    // !! in DomNodeFactory - there may be a bug in MOJO
                    //that.dispel( POD_EVENTS.join( ' ' ) , args[2] );
                    //console.log(that.handlers);
                break;

                case 'progress':
                    // args[1] === index
                    // args[2] === progress
                    that.progress[args[1]] = args[2] > 1 ? 1 : args[2];
                break;

                case 'iteratorComplete':
                    // args[1] === iterator.handle
                    //console.log('iterator complete');
                    //console.log(that.handlers);
                    that.dispel( 'timing ' + ITERATOR_EVENTS.join( ' ' ) , args[1] );

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
                that.happen( TIMING_EVENT , [( elapsed - that.buffer )]);
            }
        }
    });


    return PrecisionPod;

    
}( hxManager.SubscriberMOJO ));




























