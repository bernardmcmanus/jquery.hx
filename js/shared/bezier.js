hxManager.Bezier = (function( BezierEasing , Helper , VendorPatch ) {


    var Object_defineProperty = Object.defineProperty;
    var UnclampedSupport = VendorPatch.getBezierSupport();


    function Bezier( name , points ) {

        var that = this;

        for (var i = 0; i < points.length; i++) {
            that.push( points[i] );
        }

        if (!UnclampedSupport) {
            that.clamp();
        }

        Object_defineProperty( that , 'name' , {
            get: function() {
                return name;
            }
        });

        Object_defineProperty( that , 'string' , {
            get: function() {
                return 'cubic-bezier(' + that.join( ',' ) + ')';
            }
        });

        var easeFunction = BezierEasing.apply( null , that );

        Object_defineProperty( that , 'function' , {
            get: function() {
                return easeFunction;
            }
        });
    }


    Bezier.define = function( name , points ) {

        if (Definitions[name] !== undefined) {
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

    
}( BezierEasing , hxManager.Helper , hxManager.VendorPatch ));



























