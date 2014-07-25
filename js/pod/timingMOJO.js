hxManager.TimingMOJO = (function( VendorPatch ) {


    var TIMING_EVENT = 'timing';


    var Object_defineProperty = Object.defineProperty;


    function TimingMOJO() {

        var that = this;

        that.shouldLoop = false;

        //var frameEvent = (that.frameEvent = 'animationFrame');

        MOJO.Construct( that );

        Object_defineProperty( that , 'subscribers' , {
            get: function() {
                return (that.handlers[ TIMING_EVENT ] || []).length;
            }
        });

        that.step = that._step.bind( that );
    }


    TimingMOJO.prototype = MOJO.Create({

        subscribe: function( callback ) {

            var that = this;

            that.when( TIMING_EVENT , callback );

            if (!that.shouldLoop) {
                that._start();
            }
        },

        unsubscribe: function( callback ) {

            var that = this;
            that.dispel( TIMING_EVENT , callback );
        },

        _start: function() {

            var that = this;

            that.shouldLoop = true;
            VendorPatch.RAF( that.step );
        },

        /*_stop: function() {
            this.shouldLoop = false;
        },*/

        /*_checkSubscribers: function() {

            var that = this;

            if (that.subscribers < 1) {
                that._stop();
            }
        },*/

        _step: function( timestamp ) {

            var that = this;

            that.happen( TIMING_EVENT , timestamp );

            //that._checkSubscribers();
            if (that.subscribers < 1) {
                that.shouldLoop = false;
            }
            else if (that.shouldLoop) {
                VendorPatch.RAF( that.step );
            }
        }
    });


    return new TimingMOJO();

    
}( hxManager.VendorPatch ));




























