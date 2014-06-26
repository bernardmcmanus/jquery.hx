hxManager.CSSFactory = (function( TransformKeys , Transform , CSSProperty ) {


    function CSSFactory( mappedName , name , values , index ) {
        
        if (TransformKeys.indexOf( mappedName ) >= 0) {
            return new Transform( mappedName , name , values , index );
        }
        else {
            return new CSSProperty( mappedName , name , values , index );
        }
    }


    return CSSFactory;

    
}( hxManager.Config.keys.transform , hxManager.Transform , hxManager.CSSProperty ));



























