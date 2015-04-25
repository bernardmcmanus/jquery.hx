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



















