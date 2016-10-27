var BezierEasing = require( 'bezier-easing' );
var VendorPatch = require( 'shared/vendorPatch' );
var helper = require( 'shared/helper' );

var UNCLAMPED = VendorPatch.unclamped();

module.exports = Bezier;

function Bezier( name , points ) {
    var that = this;
    var bezier = new BezierEasing( points );
    Array.call( that );
    points.forEach(function( point ) {
        that.push( UNCLAMPED ? point : clamp( point ));
    });
    helper.defProps( that , {
        name: {value: name},
        string: helper.descriptor(function() {
            return 'cubic-bezier(' + that.join( ',' ) + ')';
        }),
        function: { value: bezier.get },
    });
}

Bezier.define = function( name , points ) {
    if (!helper.isUndef( Definitions[name] )) {
        throw new Error( name + ' is already defined' );
    }
    Definitions[name] = new Bezier( name , points );
    return Definitions[name];
};

Bezier.retrieve = function( name ) {
    return Definitions[name] || Definitions[ Definitions.default ];
};

Bezier.prototype = helper.create( Array.prototype );

Bezier.prototype.constructor = Bezier;

function clamp( point ) {
    return (point < 0 ? 0 : (point > 1 ? 1 : point));
}

var Definitions = {
    default: 'ease'
};
