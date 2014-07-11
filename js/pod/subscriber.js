hxManager.Subscriber = (function( TimingMOJO ) {


    var Object_defineProperty = Object.defineProperty;


    function Subscriber( duration , delay , onComplete , timingCallback ) {

        var that = this;

        that.duration = duration;
        that.delay = delay;
        that.onComplete = onComplete || function() {};
        that.timingCallback = timingCallback || function() {};
        that.startTime = null;

        that.paused = false;
        that.buffer = 0;
        that.bufferStart = 0;

        Object_defineProperty( that , 'elapsed' , {
            get: function() {
                return that.startTime ? (that.time - that.startTime - that.buffer) : 0;
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

            if (that.paused) {
                that.buffer += (timestamp - that.bufferStart);
                that.bufferStart = timestamp;
            }

            var progress = (timestamp - that.startTime - that.delay);

            return (progress - that.buffer) / that.duration;
        },

        pause: function() {
            var that = this;
            that.paused = true;
            that.bufferStart = that.time;
        },

        resume: function() {
            this.paused = false;
        },

        destroy: function() {
            TimingMOJO.unsubscribe( this );
        }
    };


    return Subscriber;

    
}( hxManager.TimingMOJO ));




























