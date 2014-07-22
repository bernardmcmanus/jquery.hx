hxManager.PromisePod = (function() {


    function PromisePod() {
        var that = this;
        that.type = 'promise';
        MOJO.Construct( that );
    }


    PromisePod.prototype = MOJO.Create({

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