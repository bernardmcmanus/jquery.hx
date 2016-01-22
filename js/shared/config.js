var helper = require( 'shared/helper' );

module.exports.buffer = ((1000 / 60) * 2);

module.exports.optionKeys = [ 'ref' , 'type' , 'duration' , 'easing' , 'delay' , 'done' , 'order' ];

module.exports.properties = (function(){
    var properties = {};
    helper.defProps( properties , {
        inverse: helper.descriptor(function() {
            var out = {};
            helper.each( this , function( val , key ) {
                out[val] = key;
            });
            return out;
        })
    });
    return properties;
}());

module.exports.defaults = {
    ref: null,
    duration: 400,
    easing: 'ease',
    delay: 0,
    done: function() {}
};
