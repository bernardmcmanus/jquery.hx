hxManager.PromisePod = (function( Promise , $ , MOJO ) {


    var TYPE = 'TYPE';


    function PromisePod() {

        var that = this;
        that.type = PromisePod[TYPE];
        that.attached = true;
        MOJO.Construct( that );

        var promise = new Promise(function( resolve , reject ) {
            that.resolve = resolve;
            that.reject = reject;
        });

        return $.extend( promise , that );
    }


    PromisePod[TYPE] = 'promise';


    PromisePod.prototype = MOJO.Create({

        run: function() {
            this.resolve();
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


}( Promise , jQuery , MOJO ));



















