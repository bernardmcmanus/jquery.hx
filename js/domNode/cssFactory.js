hxManager.CSSFactory = (function( StyleDefinition , CSSProperty ) {


    var DefineProperty = StyleDefinition.define;


    function CSSFactory( name , values ) {
        return new CSSProperty( name , values );
    }


    DefineProperty( 'matrix3d' )
        .setDefaults([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        .setKeymap([
            'a1', 'b1', 'c1', 'd1',
            'a2', 'b2', 'c2', 'd2',
            'a3', 'b3', 'c3', 'd3',
            'a4', 'b4', 'c4', 'd4'
        ])
        .setStringGetter(function( name , CSSProperty ) {
            return name + '(' + CSSProperty.join( ',' ) + ')';
        });


    DefineProperty( 'translate3d' )
        .setDefaults([ 0 , 0 , 0 ])
        .setKeymap([ 'x' , 'y' , 'z' ])
        .setStringGetter(function( name , CSSProperty ) {
            return name + '(' + CSSProperty.join( 'px,' ) + 'px)';
        });


    DefineProperty( 'scale3d' )
        .setDefaults([ 1 , 1 , 1 ])
        .setKeymap([ 'x' , 'y' , 'z' ])
        .setStringGetter(function( name , CSSProperty ) {
            return name + '(' + CSSProperty.join( ',' ) + ')';
        });


    DefineProperty( 'rotate3d' )
        .setDefaults([ 0 , 0 , 0 , 0 ])
        .setKeymap([ 'x' , 'y' , 'z' , 'a' ])
        .setStringGetter(function( name , CSSProperty ) {
            return name + '(' + CSSProperty.join( ',' ) + 'deg)';
        });


    DefineProperty( 'rotateX' )
        .setDefaults([ 0 ])
        .setStringGetter(function( name , CSSProperty ) {
            return name + '(' + CSSProperty[0] + 'deg)';
        });


    DefineProperty( 'rotateY' )
        .setDefaults([ 0 ])
        .setStringGetter(function( name , CSSProperty ) {
            return name + '(' + CSSProperty[0] + 'deg)';
        });


    DefineProperty( 'rotateZ' )
        .setDefaults([ 0 ])
        .setStringGetter(function( name , CSSProperty ) {
            return name + '(' + CSSProperty[0] + 'deg)';
        });


    DefineProperty( 'matrix' )
        .setDefaults([ 1 , 0 , 0 , 1 , 0 , 0 ])
        .setKeymap([ 'a1' , 'b1' , 'c1' , 'd1' , 'a4' , 'b4' ])
        .setStringGetter(function( name , CSSProperty ) {
            return name + '(' + CSSProperty.join( ',' ) + ')';
        });


    DefineProperty( 'translate' )
        .setDefaults([ 0 , 0 ])
        .setKeymap([ 'x' , 'y' ])
        .setStringGetter(function( name , CSSProperty ) {
            return name + '(' + CSSProperty.join( 'px,' ) + 'px)';
        });


    DefineProperty( 'scale' )
        .setDefaults([ 1 , 1 ])
        .setKeymap([ 'x' , 'y' ])
        .setStringGetter(function( name , CSSProperty ) {
            return name + '(' + CSSProperty.join( ',' ) + ')';
        });


    DefineProperty( 'opacity' )
        .setDefaults([ 1 ]);


    return CSSFactory;

    
}( hxManager.StyleDefinition , hxManager.CSSProperty ));



























