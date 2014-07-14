hxManager.StyleDefinition = (function() {


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


    StyleDefinition.define = function( name ) {
        
        if (Properties[name] !== undefined) {
            throw new Error( name + ' is already defined' );
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

    
}());



























