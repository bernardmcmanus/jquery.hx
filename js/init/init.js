(function( window , document , $ , MOJO , hxManager ) {


    var NULL = null;


    var Helper = hxManager.Helper;
    var VendorPatch = hxManager.VendorPatch;
    var StyleDefinition = hxManager.StyleDefinition;
    var Bezier = hxManager.Bezier;
    var TimingMOJO = hxManager.TimingMOJO;


    var DefineProperty = StyleDefinition.define;
    var DefineBezier = Bezier.define;
    var EnsureArray = Helper.ensureArray;


    // Do some important stuff when hx is loaded


    $.hx = {
        defineProperty: DefineProperty,
        defineBezier: DefineBezier,
        subscribe: function( callback ) {

            var startTime = NULL;

            TimingMOJO.subscribe( timingCallback );

            function timingCallback( e , timestamp ) {
                startTime = (startTime === NULL ? timestamp : startTime);
                callback(( timestamp - startTime ));
            }

            return function() {
                TimingMOJO.unsubscribe( timingCallback );
            };
        },
        error: function( error ) {
            $(document).trigger( 'hx.error' , error );
            try { console.error( error.stack ); }
            catch( err ) {}
        }
    };


    // define a bunch of properties
    [
        [
            [ 'matrix' , 'matrix3d' ],
            [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
            [ 'a1', 'b1', 'c1', 'd1', 'a2', 'b2', 'c2', 'd2', 'a3', 'b3', 'c3', 'd3', 'a4', 'b4', 'c4', 'd4' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( ',' ) + ')';
            }
        ],
        [
            [ 'translate' , 'translate3d' ],
            [ 0 , 0 , 0 ],
            [ 'x' , 'y' , 'z' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( 'px,' ) + 'px)';
            }
        ],
        [
            [ 'scale' , 'scale3d' ],
            [ 1 , 1 , 1 ],
            [ 'x' , 'y' , 'z' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( ',' ) + ')';
            }
        ],
        [
            [ 'rotate' , 'rotate3d' ],
            [ 0 , 0 , 0 , 0 ],
            [ 'x' , 'y' , 'z' , 'a' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( ',' ) + 'deg)';
            }
        ],
        [
            [ 'rotateX' ],
            0,
            NULL,
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + 'deg)';
            }
        ],
        [
            [ 'rotateY' ],
            0,
            NULL,
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + 'deg)';
            }
        ],
        [
            [ 'rotateZ' ],
            0,
            NULL,
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + 'deg)';
            }
        ],
        [
            [ 'matrix2d' , 'matrix' ],
            [ 1 , 0 , 0 , 1 , 0 , 0 ],
            [ 'a1' , 'b1' , 'c1' , 'd1' , 'a4' , 'b4' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( ',' ) + ')';
            }
        ],
        [
            [ 'translate2d' , 'translate' ],
            [ 0 , 0 ],
            [ 'x' , 'y' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( 'px,' ) + 'px)';
            }
        ],
        [
            [ 'scale2d' , 'scale' ],
            [ 1 , 1 ],
            [ 'x' , 'y' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( ',' ) + ')';
            }
        ],
        [
            [ 'opacity' ],
            1,
            NULL,
            NULL
        ]
    ]
    .forEach(function( definition ) {

        var property = DefineProperty.apply( NULL , definition[0] );

        [ 'defaults' , 'keymap' , 'stringGetter' ]
        .forEach(function( key , i ) {

            var args = definition[i+1];
            
            if (args !== NULL) {
                property.set( key , args );
            }
        });
    });


    /*
    **  Derived from AliceJS easing definitions
    **  http://blackberry.github.io/Alice/
    */
    var beziers = {
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
        easeMod1: [ 0.25 , 0.2 , 0.25 , 1 ],
        gravityUp: [ 0.05 , 0.6 , 0.3 , 1 ],
        gravityDown: [ 0.65 , 0.01 , 0.78 , 0.5 ]
    };


    MOJO.Each( beziers , function( points , name ) {
        DefineBezier( name , points );
    });


    function hxReady() {
        $(window).off( 'load' , hxReady );
        $(document).trigger( 'hx.ready' );
    }

    if (document.readyState !== 'complete') {
        $(window).on( 'load' , hxReady );
    }
    else {
        hxReady();
    }


}( window , document , jQuery , MOJO , hxManager ));



























