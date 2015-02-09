(function() {


    $('#target').on( 'touchstart click' , function( e ) {

        $(this).html( 'reset' );

        if (!QUnit.config.started) {
            QUnit.start();
        }
        else {
            window.location.reload( true );
        }
    });

    $('*').on( 'touchstart mousedown' , function( e ) {
        $('.indicate').removeClass( 'indicate' );
        if ($(this).hasClass( 'clickable' )) {
            e.preventDefault();
            if (this === e.target) {
                e.stopPropagation();
                $(this).addClass( 'indicate' );
            }
        }
    });

    $('*').on( 'touchend mouseup' , function( e ) {
        $('.indicate').removeClass( 'indicate' );
        if ($(this).hasClass( 'clickable' )) {
            e.preventDefault();
        }
    });


    (function() {

        return;

        $.hx.defineProperty( 'blur' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + 'px)';
            });

        $.hx.defineProperty( 'brightness' )
            .set( 'defaults' , 100 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

        $.hx.defineProperty( 'contrast' )
            .set( 'defaults' , 100 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

        $.hx.defineProperty( 'dropshadow' , 'drop-shadow' )
            .set( 'defaults' , [ 0 , 0 , 0 , 'transparent' ])
            .set( 'keymap' , [ 'x' , 'y' , 'blur' , 'color' ])
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( 'px ' ) + ')';
            });

        $.hx.defineProperty( 'grayscale' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

        $.hx.defineProperty( 'hueRotate' , 'hue-rotate' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + 'deg)';
            });

        $.hx.defineProperty( 'invert' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

        $.hx.defineProperty( 'opacity' )
            .set( 'defaults' , 100 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

        $.hx.defineProperty( 'saturate' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

        $.hx.defineProperty( 'sepia' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

    }());

}());






















