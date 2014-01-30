(function( hx ) {

    var helper = {
        array: {}
    };

    helper.array.compare = function ( array ) {
        
        if (!array)
            return false;

        if (this.length != array.length)
            return false;

        for (var i = 0, l=this.length; i < l; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].compare( array[i] ))
                    return false;
            }
            else if (this[i] != array[i]) {
                return false;
            }
        }
        return true;
    };

    helper.array.last = function() {
        if (arguments.length > 0)
            this[this.length - 1] = arguments[0];
        return this[this.length - 1];
    };

    $.extend( hx , {helper: helper} );

}( hxManager ));