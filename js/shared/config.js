hxManager.Config = (function( Object , MOJO , hxManager ) {


    var Helper = hxManager.Helper;


    var Descriptor = Helper.descriptor;


    var Config = {

        optionKeys: [ 'type' , 'duration' , 'easing' , 'delay' , 'done' , 'order' ],

        properties: {},

        defaults: {
            duration: 400,
            easing: 'ease',
            delay: 0,
            done: function() {}
        },

        VendorPatch: {

            vendors: {
                webkit  : (/webkit/i),
                moz     : (/firefox/i),
                o       : (/opera/i),
                ms      : (/msie/i)
            },

            os: {
                android : (/android/i),
                ios     : (/(ios|iphone)/i),
                macos   : (/mac os/i),
                windows : (/windows/i)
            },

            tests: {
                //mobile  : (/mobile/i),
                andNat  : (/(chrome|firefox)/i)
            },

            prefix: [
                (/(\-{0})transition/g),
                (/(\-{0})transform/g),
                {
                    regx: (/(\-{0})filter/g),
                    omit: [ 'ms' ]
                }
            ]
        }
    };


    Object.defineProperties( Config.properties , {

        inverse: Descriptor(function() {
            var out = {};
            MOJO.Each( this , function( val , key ) {
                out[val] = key;
            });
            return out;
        })
    });

    
    return Config;

    
}( Object , MOJO , hxManager ));



























