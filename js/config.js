(function( window , hx ) {


    var config = {
        
        keys: {
            config: [ 'type' , 'duration' , 'easing' , 'delay' , 'done' , 'fallback' , 'order' ],
            xform: [ 'translate3d' , 'scale3d' , 'translate' , 'scale' , 'rotate3d' , 'rotateX' , 'rotateY' , 'rotateZ' , 'matrix' , 'matrix3d' ]
        },

        maps: {

            component: {
                translate: 'translate3d',
                scale: 'scale3d',
                rotate: 'rotate3d',
                translate2d: 'translate',
                scale2d: 'scale'
            },

            vector: {
                x: 0,
                y: 1,
                z: 2,
                a: 3
            },

            array: [ 'x' , 'y' , 'z' , 'a' ]
        },

        xformDefaults: {
            matrix3d: [ 1 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 1 ],
            matrix: [ 1 , 0 , 0 , 1 , 0 , 0 ],
            translate3d: [ 0 , 0 , 0 ],
            scale3d: [ 1 , 1 , 1 ],
            rotate3d: [ 0 , 0 , 0 , 0 ],
            translate: [ 0 , 0 ],
            scale: [ 1 , 1 ],
            singleAxisRotate: [ 0 ]
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

        animator: {
            buffer: 50
        },

        pod: {
            types: [ 'xform' , 'promise' ]
        },

        domNode: {
            removeOnClean: [ '_hx' , 'hx_display' ]
        },

        $hx: {
            duration: 400,
            easing: 'ease',
            delay: 0,
            fallback: true,
            done: function() {}
        }

    };

    
    $.extend( hx , {config: config} );

    
}( window , hxManager ));



























