(function() {

    
    /*$('.tgt').on( 'hx.applyXform' , function( e , data ) {
        $('.tgt2, .tgt3').hx( 'transform' , data.xform );
    });*/


    /*$('.tgt').on( 'hx_transitionEnd' , function( e ) {
        console.log(e.originalEvent.detail);
    });*/


    $('#target').on( 'click', test1 );


    function test1() {

        $('.tgt')

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
                opacity: 0.5,
                duration: 2000,
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

        .then({
            type: 'transform',
            translate: {x: '-=200'},
            rotate: {x: 0, y: 0, z: 0, a: 0},
            scale: {x: '-=0.2', y: '-=0.2', z: '-=0.2'},
            duration: 1000,
            easing: 'easeOutBack',
            done: function() {
                console.log('transform 2 complete');
            }
        })

        .then({
            type: 'transform',
            rotateZ: 360,
            duration: 1200,
            easing: 'easeOutBack',
            done: function() {
                console.log('transform 3 complete');
            }
        })

        .then({
            type: 'transform',
            rotateZ: 0,
            duration: 1200,
            easing: 'easeOutBack',
            done: function() {
                console.log('transform 4 complete');
            }
        });
    }


    function test2() {

        $('.tgt').hx([
            {
                type: 'transform',
                translate: {x: '+=200'},
                rotate: {x: 1, y: 1, z: 1, a: '+=360'},
                scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
                duration: 800,
                easing: 'easeOutBack',
                done: function() {
                    console.log('transform 1 complete');
                }
            },
            {
                type: 'transform',
                translate: {x: '-=200'},
                rotate: {x: 1, y: 1, z: 1, a: '-=360'},
                scale: {x: '-=0.2', y: '-=0.2', z: '-=0.2'},
                duration: 1000,
                easing: 'easeOutBack',
                done: function() {
                    console.log('transform 2 complete');
                }
            },
            /*{
                type: 'opacity',
                opacity: 0.5,
                duration: 1000,
                done: function() {
                    console.log('transform 2 complete');
                }
            }*/
        ]);
    }


}());






















