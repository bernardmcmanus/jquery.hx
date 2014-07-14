hxManager.PromisePod = (function() {


    function PromisePod() {
        var that = this;
        that.type = 'promise';
        MOJO.Hoist( that );
    }


    PromisePod.prototype = new MOJO({

        run: function() {
            this.happen( 'promiseMade' );
        },

        resolvePromise: function() {
            this.happen( 'promiseResolved' );
        },

        resolvePod: function() {
            var that = this;
            that.happen( 'podComplete' , that );
        },

        cancel: function() {
            var that = this;
            that.happen( 'podCanceled' , that );
        }
    });


    return PromisePod;

    
}());