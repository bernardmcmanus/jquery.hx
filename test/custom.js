(function() {

    
    /*$('.tgt').on( 'hx.xformStart' , function( e , data ) {
        console.log(data);
        //var xform = $.extend( {type: data.type} , data.xform , data.options );
        //$('.tgt2, .tgt3').hx( xform );
    });*/


    /*$('.tgt').on( 'hx.xformComplete' , function( e , data ) {
        console.log(data);
    });*/


    $('#target').on( 'click', test0 );


    // test - null values
    function test0() {

        $('.tgt')

        .hx([
            {
                type: 'transform',
                translate: {x: '+=135'},
                scale: {x: 2.12},
                rotate: {x: 1, y: 1, z: 1, a: '+=360'},
                duration: 600
            },
            {
                type: 'transform',
                translate: null,
                scale: null,
                rotate: null,
                duration: 600,
                delay: 1000
            },
            {
                type: 'opacity',
                value: 0.5,
                duration: 600
            },
            {
                type: 'opacity',
                value: null,
                duration: 600,
                delay: 1000
            },
            {
                type: 'background-color',
                value: '#fff',
                duration: 600
            },
            {
                type: 'background-color',
                value: null,
                duration: 600,
                delay: 1000
            }
        ])

        .done(function() {
            console.log('done');
        });
    }


    function test1() {

        $('.tgt, .tgt2, .tgt3')

        .hx([
            {
                type: 'transform',
                translate: {x: '+=200'},
                rotate: {x: 1, y: 1, z: 1, a: 360},
                scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
                duration: 800,
                easing: 'easeOutBack',
                done: function() {
                    console.log('transform 1 complete');
                }
            },
            {
                type: 'opacity',
                value: 0.3,
                duration: 1000,
                done: function() {
                    console.log('opacity 1 complete');
                }
            },
            {
                type: 'opacity',
                value: 1,
                duration: 400,
                done: function() {
                    console.log('opacity 2 complete');
                }
            }
        ])

        .then(function( resolve , reject ) {
            console.log('cool!');
            resolve();
        })

        .hx({
            type: 'transform',
            translate: {x: '-=200'},
            rotate: null,
            scale: {x: '-=0.2', y: '-=0.2', z: '-=0.2'},
            duration: 1000,
            delay: 1000,
            easing: 'easeOutBack',
            done: function() {
                console.log('transform 2 complete');
            }
        })

        .hx([
            {
                type: 'transform',
                rotateZ: 360,
                duration: 1200,
                easing: 'easeOutBack',
                done: function() {
                    console.log('transform 3 complete');
                }
            },
            {
                type: 'background-color',
                value: '#fff',
                duration: 1200
            }
        ])

        .hx([
            {
                type: 'transform',
                rotateZ: 0,
                duration: 1200,
                easing: 'easeOutBack',
                done: function() {
                    console.log('transform 4 complete');
                }
            },
            {
                type: 'background-color',
                value: '',
                duration: 1200
            }
        ])

        .done(function() {
            console.log('awesome!');
        });
    }


    function test2_0() {

        $('.tgt, .tgt2')

        .hx({
            type: 'opacity',
            value: 0,
            duration: 800
        })

        .hx([
            {
                type: 'transform',
                translate: {x: '+=200'},
                rotate: {x: 1, y: 1, z: 1, a: '+=360'},
                scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
                duration: 800,
                delay: 200,
                easing: 'easeOutBack'
            },
            {
                type: 'opacity',
                value: 1,
                duration: 600
            }
        ])

        .hx({
            type: 'transform',
            translate: {x: '-=200'},
            rotate: {x: 1, y: 1, z: 1, a: '-=360'},
            scale: {x: '-=0.2', y: '-=0.2', z: '-=0.2'},
            duration: 1000,
            easing: 'easeOutBack'
        })

        .then(function( resolve , reject ) {

            $('.tgt3')

            .hx([
                {
                    type: 'transform',
                    rotateZ: '+=360',
                    duration: 1200,
                    easing: 'easeOutBack'
                },
                {
                    type: 'transform',
                    rotateZ: 0,
                    duration: 1200,
                    easing: 'easeOutBack'
                }
            ])

            .done( resolve );
        })

        .done( test2_0 );
    }


    // test - then reject
    function test2_1() {

        $('.tgt, .tgt2')

        .hx({
            type: 'opacity',
            value: 0,
            duration: 800
        })

        .hx([
            {
                type: 'transform',
                translate: {x: '+=200'},
                rotate: {x: 1, y: 1, z: 1, a: '+=360'},
                scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
                duration: 800,
                delay: 200,
                easing: 'easeOutBack'
            },
            {
                type: 'opacity',
                value: 1,
                duration: 600
            }
        ])

        .then(function( resolve , reject ) {
            reject();
        })

        .done(function() {
            console.log('Uh-oh! This shouldn\'t execute!');
        });
    }


    // example - defer
    function test3_0( incrementor , order ) {

        incrementor = typeof incrementor === 'string' ? incrementor : '+=360';
        order = Array.isArray( order ) ? order : [ '.tgt' , '.tgt2' , '.tgt3' ];

        var tgt1 = $(order[0]).hx();
        var tgt2 = $(order[1]).hx();
        var tgt3 = $(order[2]).hx();

        tgt1.hx({
            type: 'transform',
            rotateZ: incrementor,
            duration: 1200,
            easing: 'easeOutBack'
        });

        tgt2.hx( 'defer' ).hx({
            type: 'transform',
            rotateZ: incrementor,
            duration: 1200,
            easing: 'easeOutBack'
        });

        tgt3.hx( 'defer' ).hx({
            type: 'transform',
            rotateZ: incrementor,
            duration: 1200,
            easing: 'easeOutBack'
        });

        tgt1.done(function() {
            tgt2.hx( 'resolve' );
        });

        tgt2.done(function() {
            tgt3.hx( 'resolve' );
        });

        tgt3.done(function() {
            incrementor = (incrementor === '+=360' ? '-=360' : '+=360');
            order.reverse();
            test3_0( incrementor , order );
        });
    }


    // example - cancel
    function test3_1( incrementor , order ) {

        incrementor = typeof incrementor === 'string' ? incrementor : '+=360';
        order = Array.isArray( order ) ? order : [ '.tgt' , '.tgt2' , '.tgt3' ];

        var selector = order.join( ', ' );

        if (this === $('#target').get( 0 )) {

            if ($('#target').hasClass( 'cancel' )) {
                
                $('#target').removeClass( 'cancel' );

                $(selector)

                .hx( 'cancel' )

                .done(function() {
                    console.log('woop woop!');
                });

                return;
            }
            else {
                $('#target').addClass( 'cancel' );
            }
        }

        var tgt1 = $(order[0]).hx();
        var tgt2 = $(order[1]).hx();
        var tgt3 = $(order[2]).hx();

        tgt1.hx({
            type: 'transform',
            rotateZ: incrementor,
            duration: 1200,
            easing: 'easeOutBack'
        });

        tgt2.hx( 'defer' ).hx({
            type: 'transform',
            rotateZ: incrementor,
            duration: 1200,
            easing: 'easeOutBack'
        });

        tgt3.hx( 'defer' ).hx({
            type: 'transform',
            rotateZ: incrementor,
            duration: 1200,
            easing: 'easeOutBack'
        });

        tgt1.done(function() {
            tgt2.hx( 'resolve' );
        });

        tgt2.done(function() {
            tgt3.hx( 'resolve' );
        });

        tgt3.done(function() {
            incrementor = (incrementor === '+=360' ? '-=360' : '+=360');
            order.reverse();
            test3_1( incrementor , order );
        });
    }


    // example - clear
    function test3_2( incrementor , order ) {

        incrementor = typeof incrementor === 'string' ? incrementor : '+=360';
        order = Array.isArray( order ) ? order : [ '.tgt' , '.tgt2' , '.tgt3' ];

        var selector = order.join( ', ' );

        if (this === $('#target').get( 0 )) {

            if ($('#target').hasClass( 'cancel' )) {
                
                $('#target').removeClass( 'cancel' );

                $(selector)

                .hx( 'clear' )

                .done(function() {
                    console.log('woop woop!');
                });

                return;
            }
            else {
                $('#target').addClass( 'cancel' );
            }
        }

        var tgt1 = $(order[0]).hx();
        var tgt2 = $(order[1]).hx();
        var tgt3 = $(order[2]).hx();

        tgt1.hx({
            type: 'transform',
            rotateZ: incrementor,
            duration: 1200,
            easing: 'easeOutBack'
        });

        tgt2.hx( 'defer' ).hx({
            type: 'transform',
            rotateZ: incrementor,
            duration: 1200,
            easing: 'easeOutBack'
        });

        tgt3.hx( 'defer' ).hx({
            type: 'transform',
            rotateZ: incrementor,
            duration: 1200,
            easing: 'easeOutBack'
        });

        tgt1.done(function() {
            tgt2.hx( 'resolve' );
        });

        tgt2.done(function() {
            tgt3.hx( 'resolve' );
        });

        tgt3.done(function() {
            incrementor = (incrementor === '+=360' ? '-=360' : '+=360');
            order.reverse();
            test3_2( incrementor , order );
        });
    }


    // example - race
    function test3_3( delay ) {

        delay = (typeof delay === 'number' ? delay : 500);

        var selector = '.tgt, .tgt2, .tgt3';

        $('.tgt').hx({
            type: 'transform',
            rotateZ: '+=360',
            duration: 1200,
            delay: (Math.floor(Math.random() * delay)),
            easing: 'easeOutBack'
        });

        $('.tgt2').hx({
            type: 'transform',
            rotateZ: '+=360',
            duration: 1200,
            delay: (Math.floor(Math.random() * delay)),
            easing: 'easeOutBack'
        });

        $('.tgt3').hx({
            type: 'transform',
            rotateZ: '+=360',
            duration: 1200,
            delay: (Math.floor(Math.random() * delay)),
            easing: 'easeOutBack'
        });

        $(selector)

        .hx( 'race' , function( resolve , reject ) {
            console.log('cool');
            resolve();
            $(this).hx( 'resolve' , true );
        })

        .done(function() {
            console.log('awesome');
        });

        if (delay > 0) {
            test3_3( 0 );
        }
    }


    // example - promises
    function test4() {

        $('.tgt, .tgt2, .tgt3').off( 'click' ).on( 'click' , function() {
            $(this).hx( 'resolve' );
        });

        $('.tgt, .tgt2, .tgt3')

        .hx({
            type: 'transform',
            rotateZ: '+=360',
            duration: 1200,
            easing: 'easeOutBack'
        })
        
        .then(function( resolve , reject ) {
            console.log('awesome!');
            resolve();
        })

        .defer()

        .hx({
            type: 'transform',
            rotateZ: null,
            duration: 1200,
            easing: 'easeOutBack'
        })

        .done(function() {
            console.log('done!');
        });

    }


    // test - hx_display & timed defer
    function test5() {

        $('.tgt, .tgt2, .tgt3')

        .css( 'display' , 'none' )

        .hx( 'defer' , 1000 )

        .hx({
            type: 'opacity',
            value: 1
        })

        .done(function() {
            console.log('done!');
        });
    }


    // test - translateZ
    function test6() {

        $('.tgt-container').css({
            '-webkit-transform-style': 'preserve-3d',
            'transform-style': 'preserve-3d',
            '-webkit-perspective': '1000px',
            '-moz-perspective': '1000px',
            'perspective': '1000px'
        });

        $('.tgt2, .tgt3').css( 'display' , 'none' );

        $('.tgt')

        .hx({
            type: 'transform',
            translate: {x: 200}
        })

        .defer()

        .hx({
            type: 'transform',
            translate: {z: '+=200'},
        });

        setTimeout(function() {
            $('.tgt').hx( 'resolve' );
        }, 1000);
    }


    // test - order
    function test7() {

        var xform = {};
        var selector = '.tgt';

        if ($('div[class*=\'click\']').length < 1) {

            xform = {
                type: 'transform',
                translate: {x: '+=50', y: '+=50'},
                scale: {x: '+=0.5', y: '+=0.5'},
                duration: 1200,
                easing: 'easeOutBack'
            };

            $(selector).addClass( 'click1' );
        }
        else if ($(selector).hasClass( 'click1' )) {

            xform = {
                type: 'transform',
                scale: {x: '+=0.5', y: '+=0.5'},
                order: [ 'scale' , 'translate' ],
                duration: 1200,
                easing: 'easeOutBack'
            };

            $(selector).removeClass( 'click1' ).addClass( 'click2' );
        }
        else if ($(selector).hasClass( 'click2' )) {

            xform = {
                type: 'transform',
                scale: null,
                translate: {x: '+=50', y: '+=50'},
                rotateZ: '+=90',
                duration: 1200,
                easing: 'easeOutBack'
            };
        }

        $(selector).hx( xform ).done(function() {
            console.log('done!');
        });
    }


}());






















