hxManager.StyleDefinition = (function( PropertyMap , Helper ) {


    var EnsureArray = Helper.ensureArray;


    function StyleDefinition() {

        var that = this;
        var args = arguments;
        var other = Properties.other;

        that.name = Helper.shift( args );
        that.pName = args[0] || that.name;

        that.defaults = other.defaults;
        that.keyMap = other.keyMap;

        that._stringGetter = function( name , CSSProperty ) {
            return CSSProperty[0];
        };
    }


    StyleDefinition.define = function() {

        var args = arguments;
        var name = Helper.pop( args );
        var prettyName = args[0] || name;
        
        if (Properties[name]) {
            throw new Error( name + ' is already defined' );
        }

        if (name !== prettyName) {
            PropertyMap[prettyName] = name;
        }

        Properties[name] = new StyleDefinition( name , prettyName );
        return Properties[name];
    };


    StyleDefinition.retrieve = function( name ) {
        return Properties[name] || new StyleDefinition( name );
    };


    StyleDefinition.prototype = {

        setDefaults: function( defaults ) {
            var that = this;
            that.defaults = EnsureArray( defaults );
            return that;
        },

        setKeymap: function( keyMap ) {
            var that = this;
            that.keyMap = EnsureArray( keyMap );
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



























