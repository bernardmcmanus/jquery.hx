hxManager.Subscriber = (function( TimingMOJO ) {


    var Object_defineProperty = Object.defineProperty;


    function Subscriber( duration , delay , onComplete , timingCallback ) {

        var that = this;

        that.duration = duration;
        that.delay = delay;
        that.onComplete = onComplete || function() {};
        that.timingCallback = timingCallback || function() {};
        that.startTime = null;

        /*Object_defineProperty( that , 'total' , {
            get: function() {
                return (that.duration + that.delay);
            }
        });*/

        Object_defineProperty( that , 'elapsed' , {
            get: function() {
                return that.startTime ? (that.time - that.startTime) : 0;
            }
        });

        that.handle = that._handle.bind( that );

        TimingMOJO.subscribe( that );
    }


    Subscriber.prototype = {

        _handle: function( e , timestamp ) {

            var that = this;
            var progress = that.getProgress( timestamp );

            that.timingCallback( progress , timestamp );
            
            if (progress >= 1) {
                that.onComplete();
                that.destroy();
            }
        },

        getProgress: function( timestamp ) {

            var that = this;

            that.time = timestamp;

            if (!that.startTime) {
                that.startTime = timestamp;
                return 0;
            }

            if (that.delay > that.elapsed) {
                return 0;
            }

            return (timestamp - that.startTime - that.delay) / that.duration;
        },

        destroy: function() {
            TimingMOJO.unsubscribe( this );
        }
    };


    return Subscriber;

    
}( hxManager.TimingMOJO ));




























