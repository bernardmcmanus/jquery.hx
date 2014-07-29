hxManager.CSSProperty = (function( Helper , StyleDefinition ) {


    function createDescriptor( getter , setter ) {
        return {
            get: getter,
            set: setter
        };
    }


    function CSSProperty( name , values ) {

        var that = this;
        var definition = StyleDefinition.retrieve( name );
        var isNull;

        Object.defineProperties( that , {

            name: createDescriptor(function() {
                return name;
            }),

            pName: createDescriptor(function() {
                return definition.pName;
            }),

            defaults: createDescriptor(function() {
                return definition.defaults;
            }),

            isNull: createDescriptor(
                function() {
                    return isNull;
                },
                function( value ) {
                    isNull = value;
                }
            ),

            keyMap: createDescriptor(function() {
                return definition.keyMap;
            }),

            string: createDescriptor(function() {
                return definition.toString( that );
            }),

            length: createDescriptor(function() {
                return Object.keys( that ).length;
            }),

            values: createDescriptor(function() {
                if (that.length === 1) {
                    return that[0];
                }
                else {
                    var key, obj = {}, keyMap = that.keyMap;
                    for (var i = 0; i < keyMap.length; i++) {
                        key = keyMap[i];
                        obj[key] = that[i];
                    }
                    return obj;
                }
            })
        });

        that.defaults.forEach(function( val , i ) {
            that[i] = val;
        });

        that.update( values );
    }


    var CSSProperty_prototype = (CSSProperty.prototype = Object.create( Array.prototype ));


    CSSProperty_prototype.clone = function( cloneDefaults ) {
        var that = this;
        var subject = (cloneDefaults ? that.defaults : that.values);
        return new CSSProperty( that.name , subject );
    };


    CSSProperty_prototype.update = function( values ) {

        var that = this;
        var keyMap = that.keyMap;
        var key, i;

        that.isNull = (values === null);

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
        return that.isNull && Helper.compareArray( that , that.defaults );
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


    return CSSProperty;

    
}( hxManager.Helper , hxManager.StyleDefinition ));



























