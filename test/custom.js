(function() {

    
    /*$('.tgt').on( 'hx.applyXform' , function( e , data ) {
        $('.tgt2, .tgt3').hx( 'transform' , data.xform );
    });*/


    /*$('.tgt').on( 'hx_transitionEnd' , function( e ) {
        console.log(e.originalEvent.detail);
    });*/


    $('#target').on( 'click', test1 );
    //$('#target').on( 'click', test2 );


    function test1() {

        $('.tgt')

        .hx( 'transform' , {
            translate: {x: '+=200'},
            rotate: {x: 1, y: 1, z: 1, a: '+=360'},
            scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
            duration: 800,
            easing: 'easeOutBack',
            done: function() {
                //console.log('transform 1 complete');
            }
        })

        .done(function() {
            console.log('DONE');
        })

        .hx( 'transform' , {
            translate: {x: '+=100'},
            rotate: {x: 1, y: 1, z: 1, a: '-=180'},
            scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
            duration: 900,
            easing: 'easeOutBack',
            done: function() {
                //console.log('transform 2 complete');
            }
        })

        .hx( 'transform' , {
            translate: {x: '-=200'},
            rotate: {x: 1, y: 1, z: 1, a: '+=180'},
            scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
            duration: 1000,
            easing: 'easeOutBack',
            done: function() {
                //console.log('transform 3 complete');
            }
        });
    }


    function test2() {

        $('.tgt').hx( 'transform' , {
            translate: {x: '+=50'},
            rotate: {x: 1, y: 1, z: 1, a: '+=90'},
            duration: 200,
            easing: 'linear'
        });

        $('.tgt').hx( 'transform' , {
            translate: {x: '+=50'},
            rotate: {x: 1, y: 1, z: 1, a: '+=90'},
            duration: 200,
            easing: 'linear'
        });

        $('.tgt').hx( 'transform' , {
            translate: {x: '+=50'},
            rotate: {x: 1, y: 1, z: 1, a: '+=90'},
            duration: 200,
            easing: 'linear'
        });

        $('.tgt').hx( 'transform' , {
            translate: {x: '+=50'},
            rotate: {x: 1, y: 1, z: 1, a: '+=90'},
            duration: 200,
            easing: 'linear'
        });
    }


}());






















