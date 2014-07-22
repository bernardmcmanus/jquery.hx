hxManager.StyleDefinition = (function( PropertyMap , Helper ) {


    function StyleDefinition( name ) {

        var that = this;
        var other = Properties.other;

        that.name = name;
        that.defaults = other.defaults;
        that.keyMap = other.keyMap;

        that._stringGetter = function( name , CSSProperty ) {
            return CSSProperty[0];
        };
    }


    StyleDefinition.define = function() {

        var args = arguments;
        var name = Helper.pop( args );
        var mappedName = args[0] || name;
        
        if (Properties[name]) {
            throw new Error( name + ' is already defined' );
        }

        if (name !== mappedName) {
            PropertyMap[mappedName] = name;
        }

        Properties[name] = new StyleDefinition( name );
        return Properties[name];
    };


    StyleDefinition.retrieve = function( name ) {
        return Properties[name] || new StyleDefinition( name );
    };


    StyleDefinition.prototype = {

        setDefaults: function( defaults ) {
            var that = this;
            that.defaults = (defaults instanceof Array ? defaults : [ defaults ]);
            return that;
        },

        setKeymap: function( keyMap ) {
            var that = this;
            that.keyMap = (keyMap instanceof Array ? keyMap : [ keyMap ]);
            return that;
        },

        setStringGetter: function( stringGetter ) {
            var that = this;
            that._stringGetter = stringGetter;
            return that;
        },

        toString: function( CSSProperty ) {
            return this._stringGetter( CSSProperty.name , CSSProperty );
        }
    };


    var Properties = {

        other: {
            defaults: [ '' ],
            keyMap: [ 0 ]
        }
    };


    return StyleDefinition;

    
}( hxManager.Config.properties , hxManager.Helper ));



























