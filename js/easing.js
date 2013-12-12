(function( hx ) {
    var _easing = function( name ) {
        /**
        * Derived from AliceJS easing definitions
        * http://blackberry.github.io/Alice/
        */
        var type = {
            linear: {
                p1: 0.25,
                p2: 0.25,
                p3: 0.75,
                p4: 0.75
            },
            ease: {
                p1: 0.25,
                p2: 0.1,
                p3: 0.25,
                p4: 1
            },
            'ease-in': {
                p1: 0.42,
                p2: 0,
                p3: 1,
                p4: 1
            },
            'ease-out': {
                p1: 0,
                p2: 0,
                p3: 0.58,
                p4: 1
            },
            'ease-in-out': {
                p1: 0.42,
                p2: 0,
                p3: 0.58,
                p4: 1
            },
            easeInQuad: {
                p1: 0.55,
                p2: 0.085,
                p3: 0.68,
                p4: 0.53
            },
            easeInCubic: {
                p1: 0.55,
                p2: 0.055,
                p3: 0.675,
                p4: 0.19
            },
            easeInQuart: {
                p1: 0.895,
                p2: 0.03,
                p3: 0.685,
                p4: 0.22
            },
            easeInQuint: {
                p1: 0.755,
                p2: 0.05,
                p3: 0.855,
                p4: 0.06
            },
            easeInSine: {
                p1: 0.47,
                p2: 0,
                p3: 0.745,
                p4: 0.715
            },
            easeInExpo: {
                p1: 0.95,
                p2: 0.05,
                p3: 0.795,
                p4: 0.035
            },
            easeInCirc: {
                p1: 0.6,
                p2: 0.04,
                p3: 0.98,
                p4: 0.335
            },
            easeInBack: {
                p1: 0.6,
                p2: -0.28,
                p3: 0.735,
                p4: 0.045
            },
            easeOutQuad: {
                p1: 0.25,
                p2: 0.46,
                p3: 0.45,
                p4: 0.94
            },
            easeOutCubic: {
                p1: 0.215,
                p2: 0.61,
                p3: 0.355,
                p4: 1
            },
            easeOutQuart: {
                p1: 0.165,
                p2: 0.84,
                p3: 0.44,
                p4: 1
            },
            easeOutQuint: {
                p1: 0.23,
                p2: 1,
                p3: 0.32,
                p4: 1
            },
            easeOutSine: {
                p1: 0.39,
                p2: 0.575,
                p3: 0.565,
                p4: 1
            },
            easeOutExpo: {
                p1: 0.19,
                p2: 1,
                p3: 0.22,
                p4: 1
            },
            easeOutCirc: {
                p1: 0.075,
                p2: 0.82,
                p3: 0.165,
                p4: 1
            },
            easeOutBack: {
                p1: 0.175,
                p2: 0.885,
                p3: 0.32,
                p4: 1.275
            },
            easeInOutQuad: {
                p1: 0.455,
                p2: 0.03,
                p3: 0.515,
                p4: 0.955
            },
            easeInOutCubic: {
                p1: 0.645,
                p2: 0.045,
                p3: 0.355,
                p4: 1
            },
            easeInOutQuart: {
                p1: 0.77,
                p2: 0,
                p3: 0.175,
                p4: 1
            },
            easeInOutQuint: {
                p1: 0.86,
                p2: 0,
                p3: 0.07,
                p4: 1
            },
            easeInOutSine: {
                p1: 0.445,
                p2: 0.05,
                p3: 0.55,
                p4: 0.95
            },
            easeInOutExpo: {
                p1: 1,
                p2: 0,
                p3: 0,
                p4: 1
            },
            easeInOutCirc: {
                p1: 0.785,
                p2: 0.135,
                p3: 0.15,
                p4: 0.86
            },
            easeInOutBack: {
                p1: 0.68,
                p2: -0.55,
                p3: 0.265,
                p4: 1.55
            },
            easeOutBackMod1: {
                p1: 0.7,
                p2: -1,
                p3: 0.5,
                p4: 2
            },
            easeMod1: {
                p1: 0.25,
                p2: 0.2,
                p3: 0.25,
                p4: 1
            },
        };
        var b = {};
        if (typeof name === 'object') {
            b = name;
        } else {
            b = type[name] ? type[name] : type.ease;
        }
        return 'cubic-bezier(' + b.p1 + ', ' + b.p2 + ', ' + b.p3 + ', ' + b.p4 + ')';
    };
    $.extend( hx , {_easing: _easing} );
}( hxManager ));

















