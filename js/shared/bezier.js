hxManager.Bezier = hxManager.Inject(
[
    Array,
    Error,
    BezierEasing,
    'VendorPatch',
    'PROTOTYPE',
    'NULL',
    'create',
    'defProps',
    'descriptor',
    'isUndef',
    'length'
],
function(
    Array,
    Error,
    BezierEasing,
    VendorPatch,
    PROTOTYPE,
    NULL,
    create,
    defProps,
    descriptor,
    isUndef,
    length
){


    function Bezier( name , points ) {

        var that = this;

        for (var i = 0; i < length( points ); i++) {
            that.push( points[i] );
        }

        if (!VendorPatch.unclamped()) {
            that.clamp();
        }

        var easeFunction = BezierEasing.apply( NULL , that );

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


    var Bezier_prototype = (Bezier[PROTOTYPE] = create( Array[PROTOTYPE] ));


    Bezier_prototype.clamp = function() {
        var that = this;
        that.forEach(function( point , i ) {
            that[i] = (point < 0 ? 0 : (point > 1 ? 1 : point));
        });
    };


    var Definitions = {
        default: 'ease'
    };


    return Bezier;

});



















