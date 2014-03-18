(function() {

    
    /*$('.tgt').on( 'hx.xformStart' , function( e , data ) {
        console.log(data);
        $('.tgt2, .tgt3').hx( 'transform' , data.xform );
    });*/


    /*$('.tgt').on( 'hx.xformComplete' , function( e , data ) {
        console.log(data);
    });*/


    $('#target').on( 'click', test1 );


    function test1() {

        $('.tgt, .tgt2, .tgt3')
        .hx()
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
            type: 'transform',
            translate: {x: '+=200'},
            rotate: {x: 1, y: 1, z: 1, a: '+=360'},
            scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
            duration: 800,
            easing: 'easeOutBack'
        })

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

            .then( resolve );
        })

        .then(function( resolve , reject ) {
            console.log('cool!');
            resolve();
        })

        .hx({
            type: 'opacity',
            opacity: 0.4,
            duration: 800
        })

        .hx({
            type: 'opacity',
            opacity: 1,
            duration: 1000
        });
    }


}());






















