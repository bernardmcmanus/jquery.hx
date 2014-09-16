hxManager.Config = hxManager.Inject(
[
    MOJO,
    'defProps',
    'descriptor'
],
function(
    MOJO,
    defProps,
    descriptor
){


    var properties = {};

    var Config = {

        buffer: ((1000 / 60) * 2),

        optionKeys: [ 'ref' , 'type' , 'duration' , 'easing' , 'delay' , 'done' , 'order' ],

        properties: properties,

        defaults: {
            ref: null,
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
                ios     : (/(ipad|iphone|ipod)/i),
                macos   : (/mac os/i),
                windows : (/windows/i)
            },

            tests: {
                //mobile  : (/mobile/i),
                andNat  : (/(chrome|firefox)/i)
            },

            prefix: [
                (/(\-{0})transform/g),
                (/(\-{0})transition/g),
                {
                    regx: (/(\-{0})filter/g),
                    omit: [ 'ms' ]
                }
            ]
        }
    };


    defProps( properties , {

        inverse: descriptor(function() {
            var out = {};
            MOJO.Each( this , function( val , key ) {
                out[val] = key;
            });
            return out;
        })
    });

    
    return Config;

});



















