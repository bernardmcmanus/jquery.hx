hxManager.AnimationPod = (function( Object , MOJO , hxManager ) {


    var NULL = null;
    var TIMING = 'timing';
    var TIMING_CALLBACK = 'timingCallback';
    var POD_COMPLETE = 'podComplete';
    var POD_CANCELED = 'podCanceled';
    var POD_FORCED = 'forceResolve';
    var SUBSCRIBE = 'subscribe';
    var BEAN_START = 'beanStart';
    var BEAN_PAINT = 'beanPaint';
    var BEAN_COMPLETE = 'beanComplete';
    var CLUSTER_COMPLETE = 'clusterComplete';
    var PROGRESS = 'progress';


    var Helper = hxManager.Helper;
    var SubscriberMOJO = hxManager.SubscriberMOJO;


    var Length = Helper.length;
    var Descriptor = Helper.descriptor;
    var MOJO_Each = MOJO.Each;


    function AnimationPod( node ) {

        var that = this;

        that.type = 'animation';
        that.node = node;
        that.beans = {};

        that.forced = false;
        that.paused = false;
        that.buffer = 0;
        that[PROGRESS] = [];

        MOJO.Construct( that );

        Object.defineProperties( that , {

            sequence: Descriptor(function() {
                var sequence = {};
                MOJO_Each( that.beans , function( cluster , type ) {
                    if (Length( cluster ) > 0) {
                        sequence[type] = cluster[0];
                    }
                });
                return sequence;
            }),

            subscribers: Descriptor(function() {
                return Length( that.handlers[ TIMING ] || [] );
            }),

            complete: Descriptor(function() {
                return that.subscribers === 0;
            })
        });

        that._init();
    }


    AnimationPod.prototype = MOJO.Create({

        _init: function() {

            var that = this;
            var subscriber = new SubscriberMOJO();

            subscriber.when( TIMING , that );

            that.once([ SUBSCRIBE , POD_COMPLETE , POD_FORCED , POD_CANCELED ] , subscriber , that );
        },

        addBean: function( bean ) {

            var that = this;
            var type = bean.type;
            that._getBeans( type ).push( bean );

            var index = that.subscribers;

            that.when( TIMING , bean );

            bean.when( PROGRESS , index , that );
            bean.once([ BEAN_START , BEAN_COMPLETE ] , that );
        },

        addCallback: function( callback ) {
            
            var that = this;

            function timingCallback( e , elapsed ) {
                callback( elapsed , that.progress , detach );
            }

            function detach( all ) {
                var handler = (all ? NULL : timingCallback);
                that.dispel( TIMING_CALLBACK , handler );
            }

            that.when( TIMING_CALLBACK , timingCallback );
        },

        run: function() {
            var that = this;
            that.happen( SUBSCRIBE );
            that._runSequence();
        },

        _runSequence: function() {

            var that = this;
            var node_hx = that.node._hx;

            MOJO_Each( that.sequence , function( bean , type ) {
                if (bean.run( node_hx )) {
                    bean.once( BEAN_PAINT , function( e ) {
                        node_hx.applyTransition();
                        node_hx.paint( bean.type );
                    });
                }
            });
        },

        _next: function( type ) {
            var that = this;
            var cluster = that._getBeans( type );
            cluster.shift();
            return Length( cluster ) > 0;
        },

        _getBeans: function( type ) {

            var that = this;
            var beans = that.beans;
            var out;

            if (type) {
                out = (beans[type] = beans[type] || []);
            }
            else {
                out = beans;
            }
            
            return out;
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

        _resolveBeans: function( type ) {
            var that = this;
            that._getBeans( type ).forEach(function( bean ) {
                that.dispel( NULL , bean );
            });
        },

        cancel: function() {
            var that = this;
            that.happen( POD_CANCELED , that );
        },

        handleMOJO: function( e ) {

            var that = this;
            var args = arguments;
            var subscriber, index, progress, bean, type;

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
                    that.dispel([ CLUSTER_COMPLETE , BEAN_COMPLETE ]);
                    that.happen( POD_FORCED );
                break;

                case POD_FORCED:

                    that.forced = true;
                    subscriber = args[1];

                    that.dispel( NULL , that );
                    that.happen( POD_COMPLETE , that );
                    that.once( POD_COMPLETE , subscriber , that );
                break;

                case PROGRESS:
                    index = args[1];
                    progress = args[2];
                    that[PROGRESS][index] = progress > 1 ? 1 : progress;
                break;

                case BEAN_START:
                    bean = e.target;
                    that.happen( BEAN_START, bean );
                break;

                case BEAN_COMPLETE:

                    bean = e.target;
                    type = bean.type;

                    that.dispel( NULL , bean );

                    if (!that.forced && that._next( type )) {
                        that._runSequence();
                    }
                    else {
                        that.happen( CLUSTER_COMPLETE , type );
                    }

                    // trigger beanComplete after clusterComplete so transition
                    // is reset before bean done function is executed

                    if (!that.forced) {
                        that.happen( BEAN_COMPLETE , bean );
                    }
                    else {
                        that._resolveBeans( type );
                    }

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
                that.happen([ TIMING , TIMING_CALLBACK ] , [( elapsed - that.buffer ) , diff ]);
            }
        }
    });


    return AnimationPod;

    
}( Object , MOJO , hxManager ));



























