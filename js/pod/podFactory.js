hxManager.PodFactory = (function( AnimationPod , PrecisionPod , PromisePod ) {


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

    
}( hxManager.AnimationPod , hxManager.PrecisionPod , hxManager.PromisePod ));