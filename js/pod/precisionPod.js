hxManager.PrecisionPod = (function() {


    var Object_defineProperty = Object.defineProperty;


    function PrecisionPod( node ) {

        var that = this;

        that.type = 'precision';
        that.node = node;
        that.iterators = [];

        MOJO.Hoist( that );

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
        var node = that.node;

        that.iterators.forEach(function( iteratorMOJO ) {
            that.happen( 'iteratorStart' , iteratorMOJO.bean );
            iteratorMOJO.run();
        });
    };


    PrecisionPod_prototype.resolvePod = function() {

        var that = this;

        if (!that.resolved) {
            //that._forceResolve();
        }
        else {
            that.happen( 'podComplete' , that );
        }
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




























