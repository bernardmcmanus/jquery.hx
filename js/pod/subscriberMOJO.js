hxManager.SubscriberMOJO = hxManager.Inject(
[
    MOJO,
    'TimingMOJO',
    'NULL',
    'defProp',
    'descriptor',
    'length'
],
function(
    MOJO,
    TimingMOJO,
    NULL,
    defProp,
    descriptor,
    length
){


    var TIMING = 'timing';
    var SUBSCRIBERS = 'subscribers';


    function SubscriberMOJO() {

        var that = this;

        that.time = NULL;
        that.startTime = NULL;

        MOJO.Construct( that );

        defProp( that , SUBSCRIBERS , descriptor(
            function() {
                return length( that.handlers[ TIMING ] || [] );
            }
        ));

        that[TIMING] = that[TIMING].bind( that );
    }


    SubscriberMOJO.prototype = MOJO.Create({

        timing: function( e , timestamp ) {

            var that = this;
            var diff = timestamp - (that.time || timestamp);

            that.time = timestamp;

            if (!that.startTime) {
                that.startTime = timestamp;
            }

            var elapsed = timestamp - that.startTime;

            that.happen( TIMING , [ elapsed , diff ]);

            if (that[SUBSCRIBERS] < 1) {
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


    return SubscriberMOJO;

});
