var MOJO = require( 'mojo' );
var helper = require( 'shared/helper' );
var VendorPatch = require( 'shared/vendorPatch' );

var TIMING = 'timing';

var shouldLoop = false;
var TimingMOJO = new MOJO({
    subscribe: function( callback ) {
        TimingMOJO.when( TIMING , callback );
        if (!shouldLoop) {
            start();
        }
    },
    unsubscribe: function( callback ) {
        TimingMOJO.dispel( TIMING , callback );
    }
});

helper.defProp( TimingMOJO , 'subscribers' , helper.descriptor(
    function() {
        return helper.length( TimingMOJO.handlers[ TIMING ] || [] );
    }
));

module.exports = TimingMOJO;

function start() {
    shouldLoop = true;
    VendorPatch.RAF( step );
}

function step( timestamp ) {
    TimingMOJO.happen( TIMING , timestamp );
    if (!TimingMOJO.subscribers) {
        shouldLoop = false;
    }
    else if (shouldLoop) {
        VendorPatch.RAF( step );
    }
}
