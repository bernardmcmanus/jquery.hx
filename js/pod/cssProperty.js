hxManager.CSSProperty = (function() {


    var Object_defineProperty = Object.defineProperty;


    function CSSProperty( name , values , index ) {

        var that = this;
        var property = Properties[name] || Properties.other;

        Object_defineProperty( that , 'name' , {
            get: function() {
                return name;
            }
        });

        Object_defineProperty( that , 'mappedName' , {
            get: function() {
                return name;
            }
        });

        Object_defineProperty( that , 'defaults' , {
            get: function() {
                return [ '' ];
            }
        });

        Object_defineProperty( that , 'keyMap' , {
            get: function() {
                return [ 0 ];
            }
        });

        Object_defineProperty( that , 'string' , {
            get: function() {
                return that[0];
            }
        });

        that._init( values );
    }


    var CSSProperty_prototype = (CSSProperty.prototype = Object.create( Array.prototype ));


    CSSProperty_prototype.update = function( values ) {

        
    };


    CSSProperty_prototype.isDefault = function() {
        return this[0] === '';
    };


    return CSSProperty;

    
}());



























