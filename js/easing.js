/*
**  Derived from AliceJS easing definitions
**  http://blackberry.github.io/Alice/
*/

(function( window , hx , VendorPatch ) {

    var type = {
        linear: [ 0.25 , 0.25 , 0.75 , 0.75 ],
        ease: [ 0.25 , 0.1 , 0.25 , 1 ],
        'ease-in': [ 0.42 , 0 , 1 , 1 ],
        'ease-out': [ 0 , 0 , 0.58 , 1 ],
        'ease-in-out': [ 0.42 , 0 , 0.58 , 1 ],
        easeInQuad: [ 0.55 , 0.085 , 0.68 , 0.53 ],
        easeInCubic: [ 0.55 , 0.055 , 0.675 , 0.19 ],
        easeInQuart: [ 0.895 , 0.03 , 0.685 , 0.22 ],
        easeInQuint: [ 0.755 , 0.05 , 0.855 , 0.06 ],
        easeInSine: [ 0.47 , 0 , 0.745 , 0.715 ],
        easeInExpo: [ 0.95 , 0.05 , 0.795 , 0.035 ],
        easeInCirc: [ 0.6 , 0.04 , 0.98 , 0.335 ],
        easeInBack: [ 0.6 , -0.28 , 0.735 , 0.045 ],
        easeOutQuad: [ 0.25 , 0.46 , 0.45 , 0.94 ],
        easeOutCubic: [ 0.215 , 0.61 , 0.355 , 1 ],
        easeOutQuart: [ 0.165 , 0.84 , 0.44 , 1 ],
        easeOutQuint: [ 0.23 , 1 , 0.32 , 1 ],
        easeOutSine: [ 0.39 , 0.575 , 0.565 , 1 ],
        easeOutExpo: [ 0.19 , 1 , 0.22 , 1 ],
        easeOutCirc: [ 0.075 , 0.82 , 0.165 , 1 ],
        easeOutBack: [ 0.175 , 0.885 , 0.32 , 1.275 ],
        easeInOutQuad: [ 0.455 , 0.03 , 0.515 , 0.955 ],
        easeInOutCubic: [ 0.645 , 0.045 , 0.355 , 1 ],
        easeInOutQuart: [ 0.77 , 0 , 0.175 , 1 ],
        easeInOutQuint: [ 0.86 , 0 , 0.07 , 1 ],
        easeInOutSine: [ 0.445 , 0.05 , 0.55 , 0.95 ],
        easeInOutExpo: [ 1 , 0 , 0 , 1 ],
        easeInOutCirc: [ 0.785 , 0.135 , 0.15 , 0.86 ],
        easeInOutBack: [ 0.68 , -0.55 , 0.265 , 1.55 ],
        easeOutBackMod1: [ 0.7 , -1 , 0.5 , 2 ],
        easeMod1: [ 0.25 , 0.2 , 0.25 , 1 ]
    };

    var fallback = {
        easeInBack: [ 0.6 , 0 , 0.735 , 0.045 ],
        easeOutBack: [ 0.175 , 0.885 , 0.32 , 1 ],
        easeInOutBack: [ 0.68 , 0 , 0.265 , 1 ],
        easeOutBackMod1: [ 0.7 , 0 , 0.5 , 1 ]
    };
    
    var easing = function( def ) {

        if ((/cubic\-bezier\(/).test( def )) {
            return def;
        }

        var b;

        if (typeof def === 'object') {
            b = [ def.p1 , def.p2 , def.p3 , def.p4 ];
        }
        else {
            // check support for beziers with points outside 0 - 1
            if (fallback[def] && !VendorPatch.getBezierSupport()) {
                b = fallback[def];
            }
            else {
                b = type[def] ? type[def] : type.ease;
            }
        }

        return 'cubic-bezier(' + b.join( ',' ) + ')';
    };

    $.extend( hx , {easing: easing} );

}( window , hxManager , hxManager.vendorPatch ));

















