hxManager.CSSProperty = (function( Helper , StyleDefinition ) {


    var Descriptor = Helper.descriptor;


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
                return Object.keys( that ).length;
            }),

            values: Descriptor(function() {
                if (that.length === 1) {
                    return that[0];
                }
                else {
                    var key, obj = {}, keymap = that.keymap;
                    for (var i = 0; i < keymap.length; i++) {
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


    var CSSProperty_prototype = (CSSProperty.prototype = Object.create( Array.prototype ));


    CSSProperty_prototype.clone = function( cloneDefaults ) {
        var that = this;
        var subject = (cloneDefaults ? that.defaults : that.values);
        return new CSSProperty( that.name , subject );
    };


    CSSProperty_prototype.update = function( values ) {

        var that = this;
        var keymap = that.keymap;
        var key, i;

        that.isNull = (values === null);

        values = (( values || values === 0 ) ? values : that.defaults );

        if (typeof values !== 'object') {
            values = [ values ];
        }

        for (i = 0; i < keymap.length; i++) {

            if (values instanceof Array) {
                key = i;
            }
            else {
                key = keymap[i];
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



























