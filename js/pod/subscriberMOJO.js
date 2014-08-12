hxManager.SubscriberMOJO = (function( Object , MOJO , TimingMOJO ) {


    var NULL = null;
    var TIMING = 'timing';
    var SUBSCRIBERS = 'subscribers';


    function SubscriberMOJO() {

        var that = this;

        that.time = NULL;
        that.startTime = NULL;

        MOJO.Construct( that );

        Object.defineProperty( that , SUBSCRIBERS , {
            get: function() {
                return (that.handlers[ TIMING ] || []).length;
            }
        });

        that.timing = that._timing.bind( that );
    }


    SubscriberMOJO.prototype = MOJO.Create({

        _timing: function( e , timestamp ) {

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
            TimingMOJO.subscribe( this.timing );
        },

        destroy: function() {
            TimingMOJO.unsubscribe( this.timing );
        }
    });


    return SubscriberMOJO;

    
}( Object , MOJO , hxManager.TimingMOJO ));




























