hxManager.TimingMOJO = (function( VendorPatch ) {


    var Object_defineProperty = Object.defineProperty;


    function TimingMOJO() {

        var that = this;

        that.shouldLoop = false;

        var frameEvent = (that.frameEvent = 'animationFrame');

        MOJO.Hoist( that );

        Object_defineProperty( that , 'subscribers' , {
            get: function() {
                return (that.handlers[frameEvent] || []).length;
            }
        });
    }


    var TimingMOJO_prototype = (TimingMOJO.prototype = new MOJO());


    TimingMOJO_prototype.subscribe = function( subscriber ) {

        var that = this;

        that.when( that.frameEvent , subscriber.handle );

        if (!that.shouldLoop) {
            that._start();
        }
    };


    TimingMOJO_prototype.unsubscribe = function( subscriber ) {

        var that = this;
        that.dispel( that.frameEvent , subscriber.handle );
    };


    TimingMOJO_prototype._start = function() {

        var that = this;

        that.shouldLoop = true;
        that._animationLoop();
    };


    TimingMOJO_prototype._stop = function() {
        this.shouldLoop = false;
    };


    TimingMOJO_prototype._checkSubscribers = function() {

        var that = this;

        if (that.subscribers < 1) {
            that._stop();
        }
    };


    TimingMOJO_prototype._animationLoop = function() {
        var that = this;
        that.step = that._step.bind( that );
        VendorPatch.RAF( that.step );
    };


    TimingMOJO_prototype._step = function( timestamp ) {

        console.log(timestamp);

        var that = this;

        that.happen( that.frameEvent , timestamp );

        that._checkSubscribers();

        if (that.shouldLoop) {
            VendorPatch.RAF( that.step );
        }
    };


    return new TimingMOJO();

    
}( hxManager.VendorPatch ));




























