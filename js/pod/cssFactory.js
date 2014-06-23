hxManager.CSSFactory = (function( TransformKeys , Transform , CSSProperty ) {


    function CSSFactory( name , values , index ) {

        // replace any #d at the end of the property name before checking it
        var test = name.replace( /\dd/i , '' );
        
        if (TransformKeys.indexOf( test ) >= 0) {
            return new Transform( name , values , index );
        }
        else {
            return new CSSProperty( name , values , index );
        }
    }


    return CSSFactory;

    
}( hxManager.Config.keys.transform , hxManager.Transform , hxManager.CSSProperty ));



























