(function( $ ) {

    $.fn.once = function( event , handler ) {
        var that = this;
        $(that).on( event , function once() {
            $(that).off( event , once );
            handler.apply( that , arguments );
        });
        return that;
    };
    
}( jQuery ));