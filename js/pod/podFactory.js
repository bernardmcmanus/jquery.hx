hxManager.PodFactory = (function( AnimationPod , PromisePod ) {


    function PodFactory( node , type ) {

        switch (type) {

            case 'animation':
                return new AnimationPod( node );

            case 'promise':
                return new PromisePod();
        }
    }


    return PodFactory;

    
}( hxManager.AnimationPod , hxManager.PromisePod ));