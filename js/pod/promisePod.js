hxManager.PromisePod = (function( MOJO ) {


    function PromisePod() {
        var that = this;
        that.type = 'promise';
        that.attached = true;
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
        },

        detach: function() {
            
        }
    });


    return PromisePod;

    
}( MOJO ));