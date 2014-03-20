(function() {

    
    /*$('.tgt').on( 'hx.xformStart' , function( e , data ) {
        console.log(data);
        $('.tgt2, .tgt3').hx( 'transform' , data.xform );
    });*/


    /*$('.tgt').on( 'hx.xformComplete' , function( e , data ) {
        console.log(data);
    });*/


    /*$('#target').on( 'click', function() {
        test3( '+=360' , [ '.tgt' , '.tgt2' , '.tgt3' ] );
    });*/


    $('#target').on( 'click', test5 );


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
                opacity: 0.3,
                duration: 1000,
                done: function() {
                    console.log('opacity 1 complete');
                }
            },
            {
                type: 'opacity',
                opacity: 1,
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
            rotate: {x: 0, y: 0, z: 0, a: 0},
            scale: {x: '-=0.2', y: '-=0.2', z: '-=0.2'},
            duration: 1000,
            delay: 1000,
            easing: 'easeOutBack',
            done: function() {
                console.log('transform 2 complete');
            }
        })

        .hx({
            type: 'transform',
            rotateZ: 360,
            duration: 1200,
            easing: 'easeOutBack',
            done: function() {
                console.log('transform 3 complete');
            }
        })

        .hx({
            type: 'transform',
            rotateZ: 0,
            duration: 1200,
            easing: 'easeOutBack',
            done: function() {
                console.log('transform 4 complete');
            }
        })

        .done(function() {
            console.log('awesome!');
        });
    }


    function test2() {

        $('.tgt, .tgt2')

        .hx({
            type: 'opacity',
            opacity: 0,
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
                opacity: 1,
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

    function test3( incrementor , order ) {

        var tgt1 = $(order[0]).hx();
        var tgt2 = $(order[1]).hx();
        var tgt3 = $(order[2]).hx();

        tgt1.hx({
            type: 'transform',
            rotateZ: incrementor,
            duration: 1200,
            easing: 'easeOutBack'
        });

        tgt1.done(function() {
            tgt2.hx( 'resolve' );
        });

        tgt2.hx( 'defer' ).hx({
            type: 'transform',
            rotateZ: incrementor,
            duration: 1200,
            easing: 'easeOutBack'
        });

        tgt2.done(function() {
            tgt3.hx( 'resolve' );
        });

        tgt3.hx( 'defer' ).hx({
            type: 'transform',
            rotateZ: incrementor,
            duration: 1200,
            easing: 'easeOutBack'
        });

        tgt3.done(function() {
            incrementor = (incrementor === '+=360' ? '-=360' : '+=360');
            order.reverse();
            test3( incrementor , order );
        });
    }


    function test4() {

        setTimeout(function() {
            $('.tgt, .tgt2, .tgt3').hx( 'resolve' );
        }, 1000);


        $('.tgt, .tgt2, .tgt3').hx( 'defer' )

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

        .hx({
            type: 'transform',
            rotateZ: 0,
            duration: 1200,
            delay: 1000,
            easing: 'easeOutBack'
        })

        .done(function() {
            console.log('done!');
        });
    }


    function test5() {

        setTimeout(function() {
            $('.tgt, .tgt2, .tgt3').hx( 'resolve' );
        }, 1000);

        $('.tgt, .tgt2, .tgt3')

        .css( 'display' , 'none' )

        .hx( 'defer' )

        .hx({
            type: 'opacity',
            opacity: 1
        })

        .done(function() {
            console.log('done!');
        });
    }


}());






















