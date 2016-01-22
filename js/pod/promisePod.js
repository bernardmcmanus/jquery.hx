var MOJO = require( 'mojo' );
var Promise = require( 'wee-promise' );
var helper = require( 'shared/helper' );

module.exports = PromisePod;

function PromisePod() {
    var that = this;
    that.type = PromisePod.type;
    that.attached = true;
    Promise.call( that );
    MOJO.Construct( that );
}

PromisePod.type = 'promise';

PromisePod.prototype = MOJO.Create($.extend( {} , helper.create( Promise.prototype ), {
    constructor: PromisePod,
    run: function() {
        this.resolve();
    },
    resolvePod: function() {
        var that = this;
        that.happen( 'podComplete' , that );
    },
    cancel: function() {
        var that = this;
        that.happen( 'podCanceled' , that );
    },
    detach: function() {
        
    }
}));
