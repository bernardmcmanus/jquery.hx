(function( hx ) {

    var helper = {
        array: {},
        hxInst: {},
        object: {}
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
        var L = this.length > 0 ? this.length - 1 : 0;
        if (arguments.length > 0)
            this[L] = arguments[0];
        return this[L];
    };


    helper.hxInst.prepForFade = function( action ) {

        this.setTransition( 'opacity' , {
            duration: 0,
            delay: 0
        });

        this.element.style.opacity = (action === 'in' ? 0 : 1);
        this.element.style.visibility = 'visible';

        // getBoundingClientRect forces a DOM reflow
        this.element.getBoundingClientRect();
    }


    helper.object.size = function() {
        if (typeof this !== 'object')
            return 0;
        var size = 0;
        for (var key in this) {
            size++;
        }
        return size;
    }

    
    $.extend( hx , {helper: helper} );

}( hxManager ));























