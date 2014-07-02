hxManager.IteratorMOJO = (function( Subscriber ) {


    var Object_defineProperty = Object.defineProperty;


    function IteratorMOJO( hxm , seed ) {

        var that = this;

        MOJO.Hoist( that );

        Object_defineProperty( that , 'hxm' , {
            get: function() {
                return hxm;
            }
        });
    }


    var IteratorMOJO_prototype = (IteratorMOJO.prototype = new MOJO());


    IteratorMOJO_prototype.run = function() {
        console.log(this);
        this.complete = true;
        this.happen( 'complete' );
    };


    return IteratorMOJO;

    
}( hxManager.Subscriber ));




























