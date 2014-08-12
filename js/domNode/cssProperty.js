hxManager.CSSProperty = (function( Object , Array , Helper , StyleDefinition ) {


    var NULL = null;
    var PROTOTYPE = 'prototype';


    var Descriptor = Helper.descriptor;
    var Length = Helper.length;
    var isArr = Helper.isArr;
    var isUndef = Helper.isUndef;


    function CSSProperty( name , values ) {

        var that = this;
        var definition = StyleDefinition.retrieve( name );
        var isNull;

        Object.defineProperties( that , {

            name: Descriptor(function() {
                return name;
            }),

            pName: Descriptor(function() {
                return definition.pName;
            }),

            defaults: Descriptor(function() {
                return definition.defaults;
            }),

            isNull: Descriptor(
                function() {
                    return isNull;
                },
                function( value ) {
                    isNull = value;
                }
            ),

            keymap: Descriptor(function() {
                return definition.keymap;
            }),

            string: Descriptor(function() {
                return definition.toString( that );
            }),

            length: Descriptor(function() {
                return Length(
                    Object.keys( that )
                );
            }),

            values: Descriptor(function() {
                if (Length( that ) === 1) {
                    return that[0];
                }
                else {
                    var key, obj = {}, keymap = that.keymap;
                    for (var i = 0; i < Length( keymap ); i++) {
                        key = keymap[i];
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


    var CSSProperty_prototype = (CSSProperty[PROTOTYPE] = Object.create( Array[PROTOTYPE] ));


    CSSProperty_prototype.clone = function( cloneDefaults ) {
        var that = this;
        var subject = (cloneDefaults ? that.defaults : that.values);
        return new CSSProperty( that.name , subject );
    };


    CSSProperty_prototype.update = function( values ) {

        var that = this;
        var keymap = that.keymap;
        var key, i;

        that.isNull = (values === NULL);

        values = (( values || values === 0 ) ? values : that.defaults );

        if (typeof values !== 'object') {
            values = [ values ];
        }

        for (i = 0; i < Length( keymap ); i++) {

            if (isArr( values )) {
                key = i;
            }
            else {
                key = keymap[i];
            }

            if (!isUndef( values[key] )) {
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
        var out = {op: NULL, val: 0};
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

    
}( Object , Array , hxManager.Helper , hxManager.StyleDefinition ));



























