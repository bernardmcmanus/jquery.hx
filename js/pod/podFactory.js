var AnimationPod = require( 'pod/AnimationPod' );
var PrecisionPod = require( 'pod/precisionPod' );
var PromisePod = require( 'pod/promisePod' );

module.exports = function PodFactory( node , type ) {
    switch (type) {
        case AnimationPod.type:
            return new AnimationPod( node );
        case PrecisionPod.type:
            return new PrecisionPod();
        case PromisePod.type:
            return new PromisePod();
    }
};
