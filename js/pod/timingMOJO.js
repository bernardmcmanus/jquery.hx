hxManager.TimingMOJO = hxManager.Inject(
[
    MOJO,
    'VendorPatch',
    'defProp',
    'descriptor',
    'length'
],
function(
    MOJO,
    VendorPatch,
    defProp,
    descriptor,
    length
){


    var TIMING = 'timing';
    var SUBSCRIBERS = 'subscribers';


    var RAF = VendorPatch.RAF;
    var shouldLoop = false;


    function start() {
        shouldLoop = true;
        RAF( step );
    }


    function step( timestamp ) {

        //console.log(timestamp);

        TimingMOJO.happen( TIMING , timestamp );

        if (!TimingMOJO[ SUBSCRIBERS ]) {
            shouldLoop = false;
        }
        else if (shouldLoop) {
            RAF( step );
        }
    }


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


    defProp( TimingMOJO , SUBSCRIBERS , descriptor(
        function() {
            return length( TimingMOJO.handlers[ TIMING ] || [] );
        }
    ));


    return TimingMOJO;

});



















