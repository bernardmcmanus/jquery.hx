hxManager.Easing = hxManager.Inject(
[
    'Bezier',
    'NULL',
    'is'
],
function(
    Bezier,
    NULL,
    is
){

    function Easing( definition ) {

        var out;

        if (is( definition , 'string' )) {
            out = Bezier.retrieve( definition );
        }
        else if (is( definition , 'object' )) {
            out =  new Bezier( NULL , definition );
        }

        return out;
    }


    return Easing;

});