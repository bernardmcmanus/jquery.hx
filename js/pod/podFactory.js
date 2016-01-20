hxManager.PodFactory = hxManager.Inject(
[
    'AnimationPod',
    'PrecisionPod',
    'PromisePod'
],
function(
    AnimationPod,
    PrecisionPod,
    PromisePod
){


    var TYPE = 'TYPE';


    function PodFactory( node , type ) {

        switch (type) {

            case AnimationPod[TYPE]:
                return new AnimationPod( node );

            case PrecisionPod[TYPE]:
                return new PrecisionPod();

            case PromisePod[TYPE]:
                return new PromisePod();
        }
    }


    return PodFactory;

});
