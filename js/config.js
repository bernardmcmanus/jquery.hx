(function( hx ) {


    var config = {
        
        keys: {
            config: [ 'property' , 'value' , 'duration' , 'easing' , 'delay' , 'relative' , 'pseudoHide' , 'done' , 'fallback' , 'order' ],
            xform: [ 'translate3d' , 'scale3d' , 'rotate3d' , 'rotateX' , 'rotateY' , 'rotateZ' , 'matrix' , 'matrix3d' ]
        },

        maps: {

            component: {
                translate: 'translate3d',
                scale: 'scale3d',
                rotate: 'rotate3d'
            },

            vector: {
                x: 0,
                y: 1,
                z: 2,
                a: 3
            }
        },

        domNode: {
            removeOnClean: [ '_hx' , 'hx_display' ]
        },

        vendorPatch: {

            vendors: {
                webkit  : (/webkit/i),
                moz     : (/firefox/i),
                o       : (/opera/i),
                ms      : (/msie/i)
            },

            os: {
                android : (/android/i),
                ios     : (/(ios|iphone)/i),
                macos   : (/mac os/i),
                windows : (/windows/i)
            },

            tests: {
                mobile  : (/mobile/i),
                andNat  : (/(chrome|firefox)/i)
            },

            events: {
                webkit  : 'webkitTransitionEnd',
                moz     : 'transitionend',
                o       : 'oTransitionEnd',
                ms      : 'transitionend',
                other   : 'transitionend'
            },

            prefixProps: [
                (/(^\-{0})+transition/g),
                (/(^\-{0})+transform/g)
            ]
        },

        $hx: {

            transform: {
                duration: 400,
                easing: 'ease',
                delay: 0,
                relative: true,
                fallback: true,
                done: function() {}
            }
        }

    };

    
    $.extend( hx , {config: config} );

    
}( hxManager ));



























