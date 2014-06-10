hxManager.Config = (function() {


    var Config = {
        
        keys: {
            options: [ 'type' , 'duration' , 'easing' , 'delay' , 'done' , 'fallback' , 'listen' , 'order' ],
            transform: [ 'translate3d' , 'scale3d' , 'translate' , 'scale' , 'rotate3d' , 'rotateX' , 'rotateY' , 'rotateZ' , 'matrix' , 'matrix3d' ]
        },

        maps: {

            component: {
                translate: 'translate3d',
                scale: 'scale3d',
                rotate: 'rotate3d',
                translate2d: 'translate',
                scale2d: 'scale',
                matrix: 'matrix3d',
                matrix2d: 'matrix'
            },

            styleString: {

                translate: {
                    join: 'px,',
                    append: 'px'
                },

                scale: {
                    join: ',',
                    append: ''
                },

                rotate: {
                    join: ',',
                    append: 'deg'
                },

                matrix: {
                    join: ',',
                    append: ''
                },

                other: {
                    join: '',
                    append: ''
                }
            },

            transform: {

                matrix3d: {
                    a1: 0,
                    b1: 1,
                    c1: 2,
                    d1: 3,
                    a2: 4,
                    b2: 5,
                    c2: 6,
                    d2: 7,
                    a3: 8,
                    b3: 9,
                    c3: 10,
                    d3: 11,
                    a4: 12,
                    b4: 13,
                    c4: 14,
                    d4: 15
                },

                matrix: {
                    a: 0,
                    b: 1,
                    c: 2,
                    d: 3,
                    tx: 4,
                    ty: 5
                },

                rotateX: {
                    '0': 0
                },

                rotateY: {
                    '0': 0
                },

                rotateZ: {
                    '0': 0
                },

                other: {
                    x: 0,
                    y: 1,
                    z: 2,
                    a: 3
                }
            },

            nonTransform: {

                other: {
                    '0': 0
                }
            }
        },

        defaults: {

            transform: {
                matrix3d: [ 1 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 1 ],
                translate3d: [ 0 , 0 , 0 ],
                scale3d: [ 1 , 1 , 1 ],
                rotate3d: [ 0 , 0 , 0 , 0 ],
                rotateX: [ 0 ],
                rotateY: [ 0 ],
                rotateZ: [ 0 ],
                matrix: [ 1 , 0 , 0 , 1 , 0 , 0 ],
                translate: [ 0 , 0 ],
                scale: [ 1 , 1 ]
            },

            nonTransform: {
                value: ''
            },

            options: {
                duration: 400,
                easing: 'ease',
                delay: 0,
                fallback: true,
                listen: true,
                done: function() {}
            }
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

            prefixProps: [
                (/(^\-{0})+transition/g),
                (/(^\-{0})+transform/g)
            ]
        },

        Animator: {
            timeout: null,
            buffer: 50
        },

        Pod: {
            types: [ 'xform' , 'promise' ]
        },

        DomNode: {
            removeOnClean: [ '_hx' , 'hx_display' ]
        }
    };

    
    return Config;

    
}());



























