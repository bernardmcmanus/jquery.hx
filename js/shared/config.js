hxManager.Config = (function() {


    var Config = {
        
        keys: {
            options: [ 'type' , 'duration' , 'easing' , 'delay' , 'done' , 'fallback' , 'order' ],
            transform: [ 'translate3d' , 'scale3d' , 'translate' , 'scale' , 'rotate3d' , 'rotateX' , 'rotateY' , 'rotateZ' , 'matrix' , 'matrix3d' ]
        },

        properties: {
            translate: 'translate3d',
            scale: 'scale3d',
            rotate: 'rotate3d',
            translate2d: 'translate',
            scale2d: 'scale',
            matrix: 'matrix3d',
            matrix2d: 'matrix'
        },

        defaults: {
            duration: 400,
            easing: 'ease',
            delay: 0,
            fallback: true,
            done: function() {}
        },

        VendorPatch: {

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

            prefix: [
                (/(\-{0})transition/g),
                (/(\-{0})transform/g)
            ]
        },

        Animator: {
            timeout: null,
            buffer: 50
        }
    };

    
    return Config;

    
}());



























