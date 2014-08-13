hxManager.Easing = (function( hxManager ) {


    var Bezier = hxManager.Bezier;

    
    function Easing( definition ) {

        switch (typeof definition) {

            case 'string':
                return Bezier.retrieve( definition );

            case 'object':
                return new Bezier( null , definition );
        }
    }


    return Easing;


}( hxManager ));