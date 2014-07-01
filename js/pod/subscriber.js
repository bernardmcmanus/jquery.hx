hxManager.Subscriber = (function( TimingMOJO ) {


    var Object_defineProperty = Object.defineProperty;


    function Subscriber( options , onComplete ) {

        var that = this;

        $.extend( that , options );
        that.onComplete = onComplete || function() {};
        that.startTime = null;

        Object_defineProperty( that , 'total' , {
            get: function() {
                return (options.duration + options.delay);
            }
        });

        that.handle = that._handle.bind( that );

        TimingMOJO.subscribe( that );
    }


    Subscriber.prototype = {

        _handle: function( e , timestamp ) {

            var that = this;
            var progress = that.getProgress( timestamp );
            
            if (progress >= 1) {
                that.onComplete();
                that.destroy();
            }
        },

        getProgress: function( timestamp ) {

            var that = this;

            if (!that.startTime) {
                that.startTime = timestamp;
                return 0;
            }

            return (timestamp - that.startTime) / that.total;
        },

        destroy: function() {
            TimingMOJO.unsubscribe( this );
        }
    };


    return Subscriber;

    
}( hxManager.TimingMOJO ));




























