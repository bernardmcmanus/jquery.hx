hxManager.StyleFactory = (function() {


    var Object_defineProperty = Object.defineProperty;


    function StyleFactory( name ) {
        return Properties[name] || new StyleProperty( name );
    }


    var DefineProperty = (StyleFactory.defineProperty = function( name ) {
        return (Properties[name] = new StyleProperty( name ));
    });


    function StyleProperty( name ) {

        var that = this;
        var other = Properties.other;

        that.name = name;
        that.defaults = other.defaults;
        that.keyMap = other.keyMap;

        that._stringGetter = function( CSSProperty ) {
            return CSSProperty[0];
        };
    }


    StyleProperty.prototype = {

        setDefaults: function( defaults ) {
            var that = this;
            that.defaults = defaults;
            return that;
        },

        setKeymap: function( keyMap ) {
            var that = this;
            that.keyMap = keyMap;
            return that;
        },

        setStringGetter: function( stringGetter ) {
            var that = this;
            that._stringGetter = stringGetter;
            return that;
        },

        toString: function( CSSProperty ) {
            return this._stringGetter( CSSProperty );
        }
    };


    var Properties = {

        other: {
            defaults: [ '' ],
            keyMap: [ 0 ]
        }
    };


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
        .setStringGetter(function( CSSProperty ) {
            return CSSProperty.name + '(' + CSSProperty.join( ',' ) + ')';
        });


    DefineProperty( 'translate3d' )
        .setDefaults([ 0 , 0 , 0 ])
        .setKeymap([ 'x' , 'y' , 'z' ])
        .setStringGetter(function( CSSProperty ) {
            return CSSProperty.name + '(' + CSSProperty.join( 'px,' ) + 'px)';
        });


    DefineProperty( 'scale3d' )
        .setDefaults([ 1 , 1 , 1 ])
        .setKeymap([ 'x' , 'y' , 'z' ])
        .setStringGetter(function( CSSProperty ) {
            return CSSProperty.name + '(' + CSSProperty.join( ',' ) + ')';
        });


    DefineProperty( 'rotate3d' )
        .setDefaults([ 0 , 0 , 0 , 0 ])
        .setKeymap([ 'x' , 'y' , 'z' , 'a' ])
        .setStringGetter(function( CSSProperty ) {
            return CSSProperty.name + '(' + CSSProperty.join( ',' ) + 'deg)';
        });


    DefineProperty( 'rotateX' )
        .setDefaults([ 0 ])
        .setStringGetter(function( CSSProperty ) {
            return CSSProperty.name + '(' + CSSProperty[0] + 'deg)';
        });


    DefineProperty( 'rotateY' )
        .setDefaults([ 0 ])
        .setStringGetter(function( CSSProperty ) {
            return CSSProperty.name + '(' + CSSProperty[0] + 'deg)';
        });


    DefineProperty( 'rotateZ' )
        .setDefaults([ 0 ])
        .setStringGetter(function( CSSProperty ) {
            return CSSProperty.name + '(' + CSSProperty[0] + 'deg)';
        });


    DefineProperty( 'matrix' )
        .setDefaults([ 1 , 0 , 0 , 1 , 0 , 0 ])
        .setKeymap([ 'a1' , 'b1' , 'c1' , 'd1' , 'a4' , 'b4' ])
        .setStringGetter(function( CSSProperty ) {
            return CSSProperty.name + '(' + CSSProperty.join( ',' ) + ')';
        });


    DefineProperty( 'translate' )
        .setDefaults([ 0 , 0 ])
        .setKeymap([ 'x' , 'y' ])
        .setStringGetter(function( CSSProperty ) {
            return CSSProperty.name + '(' + CSSProperty.join( 'px,' ) + 'px)';
        });


    DefineProperty( 'scale' )
        .setDefaults([ 1 , 1 ])
        .setKeymap([ 'x' , 'y' ])
        .setStringGetter(function( CSSProperty ) {
            return CSSProperty.name + '(' + CSSProperty.join( ',' ) + ')';
        });


    DefineProperty( 'opacity' )
        .setDefaults([ 1 ]);


    return StyleFactory;

    
}());



























