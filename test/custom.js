(function() {


    Require.setManifestPath( 'http://bmcmanus.cs.sandbox.millennialmedia.com/jquery.hx/cdn/manifest.json' );
    Require.load( 'Solace' );


    /*$('#target').on( 'touchstart click' , function( e ) {
        //updateTest();
        //resetTest();
        callbackTest();
    });*/

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


    /*function callbackTest() {

        var SELECTOR = '.tgt';
        var method = 'animate';
        var duration = 400;
        var easing = 'linear';

        $(SELECTOR)
        .hx()
        .animate([
        //.iterate([
            {
                type: 'transform',
                translate: {x: 100},
                duration: duration,
                easing: easing
            },
            function( elapsed , progress ) {
                console.log(progress[0]);
            }
        ]);
    }*/


    /*function resetTest() {

        var SELECTOR = '.tgt';
        var method = 'animate';
        var duration = 200;
        var easing = 'linear';

        var beans = [
            {
                type: 'transform',
                translate: {x: 20, y: 20, z: 20},
                rotate: {x: 1, y: 1, z: 1, a: 60},
                scale: {x: 1.2, y: 1.2, z: 1.2},
                rotateX: 20,
                rotateY: 20,
                rotateZ: 20,
                translate2d: {x: 20, y: 20},
                scale2d: {x: 1.2, y: 1.2}
            },
            {
                type: 'opacity',
                value: 0.5
            },
            {
                type: 'filter',
                blur: 2,
                dropShadow: {x: 10, y: 10, color: 'blue'}
            },
            {
                type: 'clip',
                value: {
                    top: 0,
                    right: 25,
                    bottom: 25,
                    left: 0
                }
            }
        ];

        beans.forEach(function( bean ) {

            var type = bean.type;
            var hxm = $(SELECTOR).hx();
            
            hxm.update( bean );

            hxm
            .reset()
            .paint();

            console.log($(SELECTOR).attr( 'style' ));

            $(SELECTOR).attr( 'style' , '' );
        });
    }*/


    /*function updateTest() {

        var SELECTOR = '.tgt';
        var method = 'animate';
        var duration = 200;
        var easing = 'linear';

        var beans = [
            {
                type: 'transform',
                translate: {x: 20, y: 20, z: 20},
                rotate: {x: 1, y: 1, z: 1, a: 60},
                scale: {x: 1.2, y: 1.2, z: 1.2},
                rotateX: 20,
                rotateY: 20,
                rotateZ: 20,
                translate2d: {x: 20, y: 20},
                scale2d: {x: 1.2, y: 1.2}
            },
            {
                type: 'opacity',
                value: 0.5
            },
            {
                type: 'filter',
                blur: 2,
                dropShadow: {x: 10, y: 10, color: 'blue'}
            },
            {
                type: 'clip',
                value: {
                    top: 0,
                    right: 25,
                    bottom: 25,
                    left: 0
                }
            }
        ];

        beans.forEach(function( bean ) {

            var type = bean.type;

            $(SELECTOR)
            .hx()
            .update( bean )
            .paint( type );

            console.log($(SELECTOR).attr( 'style' ));

            $(SELECTOR).attr( 'style' , '' );
        });
    }*/

    
    (function( selector ) {

        return;

        $(selector).on( 'hx.start' , function( e , data ) {
            console.log(e.namespace,data);
        });


        $(selector).on( 'hx.end' , function( e , data ) {
            console.log(e.namespace,data);
        });


        $(selector).on( 'hx.pause' , function( e , data ) {
            console.log(e.namespace,$.extend(true,{},data));
        });


        $(selector).on( 'hx.resume' , function( e , data ) {
            console.log(e.namespace,$.extend(true,{},data));
        });


        $(window).on( 'hx.error' , function( e , data ) {
            console.log(e.namespace,data);
        });


        $(window).on( 'hx.ready' , function( e , data ) {
            console.log(e.namespace,data);
        });

    }( '.tgt-container > div' ));


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






















