hxManager.PodFactory = (function( hxManager ) {


    var AnimationPod = hxManager.AnimationPod;
    var PrecisionPod = hxManager.PrecisionPod;
    var PromisePod = hxManager.PromisePod;


    function PodFactory( node , type ) {

        switch (type) {

            case 'animation':
                return new AnimationPod( node );

            case 'precision':
                return new PrecisionPod();

            case 'promise':
                return new PromisePod();
        }
    }


    return PodFactory;

    
}( hxManager ));