(function() {


    $('.tgt').on( 'hx_init' , function( e ) {
        //console.log(e.originalEvent.detail);
    });


    $('.tgt').on( 'hx_setTransition' , function( e ) {
        //console.log(e.originalEvent.detail);
    });


    $('.tgt').on( 'hx_applyXform' , function( e ) {
        //console.log(e.originalEvent.detail);
    });


    $('.tgt').on( 'hx_transitionEnd' , function( e ) {
        //console.log(e.originalEvent.detail);
    });


    $('#target').on( 'click', test1 );


    function test1() {

        $('.tgt').hx( 'transform' , {
            translate: {x: '+=200'},
            rotate: {x: 1, y: 1, z: 1, a: '+=360'},
            scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
            duration: 800,
            easing: 'easeOutBack'
        });

        $('.tgt').hx( 'transform' , {
            translate: {x: '+=100'},
            rotate: {x: 1, y: 1, z: 1, a: '-=180'},
            scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
            duration: 900,
            easing: 'easeOutBack'
        });

        $('.tgt').hx( 'transform' , {
            translate: {x: '-=200'},
            rotate: {x: 1, y: 1, z: 1, a: '+=180'},
            scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
            duration: 1000,
            easing: 'easeOutBack'
        });
    }


}());






















