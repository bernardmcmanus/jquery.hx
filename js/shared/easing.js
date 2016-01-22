var helper = require( 'shared/helper' );
var Bezier = require( 'shared/bezier' );

module.exports = function Easing( definition ) {
    var out;
    if (helper.is( definition , 'string' )) {
        out = Bezier.retrieve( definition );
    }
    else if (helper.is( definition , 'object' )) {
        out =  new Bezier( null , definition );
    }
    return out;
};
