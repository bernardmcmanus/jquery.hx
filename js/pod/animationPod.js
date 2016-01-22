var MOJO = require( 'mojo' );
var helper = require( 'shared/helper' );
var SubscriberMOJO = require( 'pod/subscriberMOJO' );

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

module.exports = AnimationPod;

function AnimationPod( node ) {
    var that = this;
    that.type = AnimationPod.type;
    that.node = node;
    that.beans = {};
    that.forced = false;
    that.paused = false;
    that.buffer = 0;
    that.attached = true;
    that[PROGRESS] = [];
    MOJO.Construct( that );
    helper.defProps( that , {
        sequence: helper.descriptor(function() {
            var sequence = {};
            helper.each( that.beans , function( cluster , type ) {
                if (helper.length( cluster ) > 0) {
                    sequence[type] = cluster[0];
                }
            });
            return sequence;
        }),
        subscribers: helper.descriptor(function() {
            return helper.length( that.handlers[ TIMING ] || [] );
        }),
        complete: helper.descriptor(function() {
            return that.subscribers === 0;
        })
    });
    that._init();
}

AnimationPod.type = 'animation';

AnimationPod.prototype = MOJO.Create({
    constructor: AnimationPod,
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
        that.when( TIMING_CALLBACK , function( e , elapsed , diff , attached ) {
            if (attached) {
                callback( elapsed , that.progress );
            }
        });
    },
    run: function() {
        var that = this;
        that.happen( SUBSCRIBE );
        that._runSequence();
    },
    detach: function() {
        this.attached = false;
    },
    _runSequence: function() {
        var that = this;
        var $hx = that.node.$hx;
        helper.each( that.sequence , function( bean , type ) {
            if (bean.run( $hx )) {
                bean.once( BEAN_PAINT , function( e ) {
                    $hx.applyTransition();
                    $hx.paint( bean.type );
                });
            }
        });
    },
    _next: function( type ) {
        var that = this;
        var cluster = that._getBeans( type );
        cluster.shift();
        return helper.length( cluster ) > 0;
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
            that.dispel( null , bean );
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
                if (!that.attached) {
                    that.happen( POD_COMPLETE , that );
                }
                else {
                    that.dispel( null , that );
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
                bean = e.target;
                that.happen( BEAN_START, bean );
            break;
            case BEAN_COMPLETE:
                bean = e.target;
                type = bean.type;
                that.dispel( null , bean );
                if (!that.forced && that._next( type )) {
                    that._runSequence();
                }
                else if (!that.forced) {
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
        var attached = that.attached;
        if (that.paused) {
            that.buffer += diff;
        }
        else {
            that.happen([ TIMING , TIMING_CALLBACK ] , [( elapsed - that.buffer ) , diff , attached ]);
        }
    }
});
