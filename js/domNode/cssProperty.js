hxManager.CSSProperty = (function( Helper ) {


    var Object_defineProperty = Object.defineProperty;
    var Helper_compareArray = Helper.compareArray;


    function CSSProperty( mappedName , values ) {

        var that = this;
        var property = Properties[mappedName] || Properties.other;

        /*Object_defineProperty( that , 'mappedName' , {
            get: function() {
                return mappedName;
            }
        });*/

        Object_defineProperty( that , 'defaults' , {
            get: function() {
                return property.defaults;
            }
        });

        Object_defineProperty( that , 'keyMap' , {
            get: function() {
                return property.keyMap;
            }
        });

        Object_defineProperty( that , 'string' , {
            get: function() {
                return that[0];
            }
        });

        Object_defineProperty( that , 'length' , {
            get: function() {
                return Object.keys( that ).length;
            }
        });

        Object_defineProperty( that , 'values' , {
            get: function() {
                return that[0];
            }
        });

        Object_defineProperty( that , 'clone' , {
            get: function() {
                return new CSSProperty( mappedName , that.values );
            }
        });

        that.defaults.forEach(function( val , i ) {
            that[i] = val;
        });

        that.update( values );
    }


    var CSSProperty_prototype = (CSSProperty.prototype = Object.create( Array.prototype ));


    CSSProperty_prototype.update = function( values ) {

        var that = this;
        var keyMap = that.keyMap;
        var key, i;

        values = (( values || values === 0 ) ? values : that.defaults );

        if (typeof values !== 'object') {
            values = [ values ];
        }

        for (i = 0; i < keyMap.length; i++) {

            if (values instanceof Array) {
                key = i;
            }
            else {
                key = keyMap[i];
            }

            if (values[key] !== undefined) {
                that[i] = mergeUpdates( that[i] , values[key] );
            }
        }

        function mergeUpdates( storedVal , newVal ) {
            var _eval = eval;
            var parts = parseExpression( newVal );
            return ( parts.op ? _eval( storedVal + parts.op + parts.val ) : parts.val );
        }
    };


    CSSProperty_prototype.isDefault = function() {
        var that = this;
        return Helper_compareArray( that , that.defaults );
    };


    function parseExpression( exp ) {

        var re = /(\+|\-|\*|\/|\%)\=/;
        var out = {op: null, val: 0};
        var match = re.exec( exp );

        if (match) {
            out.op = match[1];
            exp = exp.replace( re , '' );
        }

        out.val = exp;

        if (out.op) {
            out.val = parseFloat( out.val , 10 );
        }
        
        return out;
    }


    var Properties = {

        opacity: {
            defaults: [ 1 ],
            keyMap: [ 0 ]
        },

        other: {
            defaults: [ '' ],
            keyMap: [ 0 ]
        }
    };


    return CSSProperty;

    
}( hxManager.Helper ));



























