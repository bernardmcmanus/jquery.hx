hxManager.SubscriberMOJO = (function( MOJO , TimingMOJO ) {


    var TIMING = 'timing';


    var Object_defineProperty = Object.defineProperty;


    function SubscriberMOJO() {

        var that = this;

        that.time = null;
        that.startTime = null;

        MOJO.Construct( that );

        Object_defineProperty( that , 'subscribers' , {
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

            if (that.subscribers < 1) {
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

    
}( MOJO , hxManager.TimingMOJO ));




























