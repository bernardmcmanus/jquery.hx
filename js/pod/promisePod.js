hxManager.PromisePod = (function() {


    function PromisePod() {
        var that = this;
        that.type = 'promise';
        MOJO.Hoist( that );
    }


    var PromisePod_prototype = (PromisePod.prototype = new MOJO());


    PromisePod_prototype.run = function() {
        this.happen( 'promiseMade' );
    };


    PromisePod_prototype.resolvePromise = function() {
        this.happen( 'promiseResolved' );
    };


    PromisePod_prototype.resolvePod = function() {
        var that = this;
        that.happen( 'podComplete' , that );
    };


    PromisePod_prototype.cancel = function() {
        var that = this;
        that.happen( 'podCanceled' , that );
    };


    return PromisePod;

    
}());