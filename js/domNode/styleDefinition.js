hxManager.StyleDefinition = (function( PropertyMap , Helper ) {


    var EnsureArray = Helper.ensureArray;
    var Pop = Helper.pop;
    var Shift = Helper.shift;
    var isUndef = Helper.isUndef;


    function StyleDefinition() {

        var that = this;
        var args = arguments;
        var other = Properties.other;

        that.name = Shift( args );
        that.pName = args[0] || that.name;

        that.defaults = other.defaults;
        that.keymap = other.keymap;

        that.stringGetter = function( name , CSSProperty ) {
            return CSSProperty[0];
        };
    }


    StyleDefinition.define = function() {

        var args = arguments;
        var name = Pop( args );
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


    StyleDefinition.isDefined = function( name ) {
        return !isUndef( Properties[name] );
    };


    StyleDefinition.retrieve = function( name ) {
        return Properties[name] || new StyleDefinition( name );
    };


    StyleDefinition.prototype = {

        set: function( key , value ) {
            var that = this;
            if (key === 'defaults' || key === 'keymap') {
                value = EnsureArray( value );
            }
            that[key] = value;
            return that;
        },

        toString: function( CSSProperty ) {
            return this.stringGetter( CSSProperty.name , CSSProperty );
        }
    };


    var Properties = {

        other: {
            defaults: [ '' ],
            keymap: [ 0 ]
        }
    };


    return StyleDefinition;

    
}( hxManager.Config.properties , hxManager.Helper ));



























