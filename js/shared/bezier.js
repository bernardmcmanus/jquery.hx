hxManager.Bezier = (function( Object , Array , Error , BezierEasing , hxManager ) {


    var UNDEFINED;
    var NULL = null;


    var Helper = hxManager.Helper;
    var VendorPatch = hxManager.VendorPatch;


    var Descriptor = Helper.descriptor;


    function Bezier( name , points ) {

        var that = this;

        for (var i = 0; i < points.length; i++) {
            that.push( points[i] );
        }

        if (!VendorPatch.unclamped()) {
            that.clamp();
        }

        var easeFunction = BezierEasing.apply( NULL , that );

        Object.defineProperties( that , {

            name: {value: name},

            string: Descriptor(function() {
                return 'cubic-bezier(' + that.join( ',' ) + ')';
            }),

            function: {value: easeFunction},
        });
    }


    Bezier.define = function( name , points ) {

        if (Definitions[name] !== UNDEFINED) {
            throw new Error( name + ' is already defined' );
        }
        
        Definitions[name] = new Bezier( name , points );
        return Definitions[name];
    };


    Bezier.retrieve = function( name ) {
        return Definitions[name] || Definitions[ Definitions.default ];
    };


    var Bezier_prototype = (Bezier.prototype = Object.create( Array.prototype ));


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

    
}( Object , Array , Error , BezierEasing , hxManager ));



























