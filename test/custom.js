(function() {

    
    $('.tgt').on( 'hx.xformStart' , function( e , data ) {
        console.log(data);
        //var xform = $.extend( {type: data.type} , data.xform , data.options );
        //$('.tgt2, .tgt3').hx( xform );
    });


    /*$('.tgt').on( 'hx.xformComplete' , function( e , data ) {
        console.log(data);
    });*/


    $('#target').on( 'click', test4 );


    function test0() {

        $('.tgt')

        .hx([
            {
                type: 'transform',
                translate: {x: '+=200'},
                rotate: {x: 1, y: 1, z: 1, a: '+=360'},
                scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
                duration: 800,
                easing: 'easeOutBack'
            },
            {
                type: 'opacity',
                value: 0.3,
                duration: 800
            },
            {
            type: 'background-color',
                value: '#fff',
                duration: 800
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


    function test2() {

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

        .done( test2 );
    }


    // example - defer
    function test3( incrementor , order ) {

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
            test3( incrementor , order );
        });
    }


    // example - race
    function test3_5( delay ) {

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
            $(this)
            .hx( 'resolve' , true );
        })

        .done(function() {
            console.log('awesome');
        });

        if (delay > 0) {
            test3_5( 0 );
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
            translate: {x: '+=200'}
        })

        .defer()

        .hx({
            type: 'transform',
            translate: {z: '+=400'},
        });

        setTimeout(function() {
            $('.tgt').hx( 'resolve' );
        }, 1000);
    }




    var click = 0;

    function test7() {

        var xform = {};

        if (click < 1) {
            xform = {
                type: 'transform',
                translate: {x: '+=50', y: '+=50'},
                scale: {x: '+=0.5', y: '+=0.5'},
                duration: 1200,
                easing: 'easeOutBack'
            };
        }
        else if (click === 1) {
            xform = {
                type: 'transform',
                translate: {},
                scale: {x: '+=0.5', y: '+=0.5'},
                //translate: {x: 50, y: 50},
                //order: [ 'translate' , 'scale' ],
                //order: [ 'scale' , 'translate' ],
                duration: 1200,
                easing: 'easeOutBack'
            };
        }
        else if (click > 1) {
            xform = {
                type: 'transform',
                scale: {},
                translate: {x: '+=50', y: '+=50'},
                //translate: {x: 50, y: 50},
                //order: [ 'translate' , 'scale' ],
                //order: [ 'scale' , 'translate' ],
                duration: 1200,
                easing: 'easeOutBack'
            };
        }
        else {
            return;
        }

        click++;

        $('.tgt')

        .hx([
            xform/*,
            {
                type: 'opacity',
                value: 0.5,
                duration: 1200
            },
            {
                type: 'background-color',
                value: '#fff',
                duration: 1200
            }*/
        ])

        .done(function() {
            console.log('done!');
        });
    }


}());






















