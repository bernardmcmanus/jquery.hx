var MOJO = require( 'mojo' );
var helper = require( 'shared/helper' );
var TimingMOJO = require( 'pod/timingMOJO' );

var TIMING = 'timing';

module.exports = SubscriberMOJO;

function SubscriberMOJO() {
    var that = this;
    that.time = null;
    that.startTime = null;
    MOJO.Construct( that );
    helper.defProp( that , 'subscribers' , helper.descriptor(
        function() {
            return helper.length( that.handlers[ TIMING ] || [] );
        }
    ));
    that[TIMING] = that[TIMING].bind( that );
}

SubscriberMOJO.prototype = MOJO.Create({
    constructor: SubscriberMOJO,
    timing: function( e , timestamp ) {
        var that = this;
        var diff = timestamp - (that.time || timestamp);
        that.time = timestamp;
        if (!that.startTime) {
            that.startTime = timestamp;
        }
        var elapsed = timestamp - that.startTime;
        that.happen( TIMING , [ elapsed , diff ]);
        if (that.subscribers < 1) {
            that.destroy();
        }
    },
    subscribe: function() {
        TimingMOJO.subscribe( this[TIMING] );
    },
    destroy: function() {
        TimingMOJO.unsubscribe( this[TIMING] );
    }
});
