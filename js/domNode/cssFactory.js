hxManager.CSSFactory = (function( TransformKeys , CSSProperty , Transform ) {


    function CSSFactory( mappedName , values ) {

        if (TransformKeys.indexOf( mappedName ) >= 0) {
            return new Transform( mappedName , values );
        }
        else {
            return new CSSProperty( mappedName , values );
        }
    }


    return CSSFactory;

    
}( hxManager.Config.keys.transform , hxManager.CSSProperty , hxManager.Transform ));



























