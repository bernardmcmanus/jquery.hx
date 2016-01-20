hxManager.Bezier = hxManager.Inject(
[
    Array,
    Error,
    BezierEasing,
    'VendorPatch',
    'PROTOTYPE',
    'create',
    'defProps',
    'descriptor',
    'isUndef'
],
function(
    Array,
    Error,
    BezierEasing,
    VendorPatch,
    PROTOTYPE,
    create,
    defProps,
    descriptor,
    isUndef
){


    var UNCLAMPED = VendorPatch.unclamped();


    function Bezier( name , points ) {

        var that = this;
        var easeFunction = BezierEasing.apply( null , points );

        points.forEach(function( point ) {
            that.push(
                UNCLAMPED ? point : clamp( point )
            );
        });

        defProps( that , {

            name: {value: name},

            string: descriptor(function() {
                return 'cubic-bezier(' + that.join( ',' ) + ')';
            }),

            function: {value: easeFunction},
        });
    }


    Bezier.define = function( name , points ) {

        if (!isUndef( Definitions[name] )) {
            throw new Error( name + ' is already defined' );
        }
        
        Definitions[name] = new Bezier( name , points );
        return Definitions[name];
    };


    Bezier.retrieve = function( name ) {
        return Definitions[name] || Definitions[ Definitions.default ];
    };


    Bezier[PROTOTYPE] = create( Array[PROTOTYPE] );


    function clamp( point ) {
        return (point < 0 ? 0 : (point > 1 ? 1 : point));
    }


    var Definitions = {
        default: 'ease'
    };


    return Bezier;

});
