hxManager.PrecisionPod = (function() {


    var Object_defineProperty = Object.defineProperty;


    function PrecisionPod( node ) {

        var that = this;

        that.type = 'precision';
        that.node = node;
        that.iterators = [];

        MOJO.Hoist( that );

        Object_defineProperty( that , 'progress' , {
            get: function() {
                
                var iterators = that.iterators;
                var len = iterators.length;
                var progress = 1;

                if (len === 1) {
                    progress = iterators[0].progress;
                }
                else if (len > 1) {
                    progress = iterators.reduce(function( p , c ) {
                        return (typeof p === 'number' ? p : p.progress) + c.progress;
                    });
                }

                return (progress / (len || 1));
            }
        });

        Object_defineProperty( that , 'resolved' , {
            get: function() {
                return that.iterators.length === 0;
            }
        });
    }


    var PrecisionPod_prototype = (PrecisionPod.prototype = new MOJO());


    PrecisionPod_prototype.addIterator = function( iteratorMOJO ) {

        var that = this;

        iteratorMOJO.when( 'complete' , function( e ) {
            that._iteratorComplete( iteratorMOJO );
        });

        that.iterators.push( iteratorMOJO );
    };


    PrecisionPod_prototype.run = function() {

        var that = this;

        that.iterators.forEach(function( iteratorMOJO ) {
            if (iteratorMOJO.run()) {
                that.happen( 'iteratorStart' , iteratorMOJO.bean );
            }
        });
    };


    PrecisionPod_prototype.pause = function() {

        var that = this;

        that.happen( 'podPaused' , that );

        that.iterators.forEach(function( iteratorMOJO ) {
            iteratorMOJO.pause();
        });
    };


    PrecisionPod_prototype.resume = function() {

        var that = this;

        that.happen( 'podResumed' , that );

        that.iterators.forEach(function( iteratorMOJO ) {
            iteratorMOJO.resume();
        });
    };


    PrecisionPod_prototype.resolvePod = function() {

        var that = this;

        if (!that.resolved) {

            that.iterators.forEach(function( iteratorMOJO ) {
                iteratorMOJO.destroy();
                that.happen( 'iteratorComplete' , iteratorMOJO.bean );
                iteratorMOJO.resolveIterator();
            });

            that.iterators = [];
        }

        that.happen( 'podComplete' , that );
    };


    PrecisionPod_prototype.cancel = function() {

        var that = this;

        that.happen( 'podCanceled' , that );

        that.iterators.forEach(function( iteratorMOJO ) {
            iteratorMOJO.destroy();
        });
    };


    PrecisionPod_prototype._iteratorComplete = function( iteratorMOJO ) {

        var that = this;
        var i = that.iterators.indexOf( iteratorMOJO );

        that.happen( 'iteratorComplete' , iteratorMOJO.bean );
        that.iterators.splice( i , 1 );
        
        if (that.resolved) {
            that.resolvePod();
        }
    };


    return PrecisionPod;

    
}());




























