hxManager.TimingMOJO = (function( VendorPatch ) {


    var Object_defineProperty = Object.defineProperty;


    function TimingMOJO() {

        var that = this;

        that.shouldLoop = false;

        var frameEvent = (that.frameEvent = 'animationFrame');

        that.step = that._step.bind( that );

        MOJO.Construct( that );

        Object_defineProperty( that , 'subscribers' , {
            get: function() {
                return (that.handlers[frameEvent] || []).length;
            }
        });
    }


    TimingMOJO.prototype = MOJO.Create({

        subscribe: function( subscriber ) {

            var that = this;

            that.when( that.frameEvent , subscriber.handle );

            if (!that.shouldLoop) {
                that._start();
            }
        },

        unsubscribe: function( subscriber ) {

            var that = this;
            that.dispel( that.frameEvent , subscriber.handle );
        },

        _start: function() {

            var that = this;

            that.shouldLoop = true;
            VendorPatch.RAF( that.step );
        },

        _stop: function() {
            this.shouldLoop = false;
        },

        _checkSubscribers: function() {

            var that = this;

            if (that.subscribers < 1) {
                that._stop();
            }
        },

        _step: function( timestamp ) {

            var that = this;

            that.happen( that.frameEvent , timestamp );

            that._checkSubscribers();

            if (that.shouldLoop) {
                VendorPatch.RAF( that.step );
            }
        }
    });


    return new TimingMOJO();

    
}( hxManager.VendorPatch ));




























