var helper = require( 'shared/helper' );
var StyleDefinition = require( 'domNode/styleDefinition' );

module.exports = CSSProperty;

function CSSProperty( name , values ) {
    var that = this;
    var definition = StyleDefinition.retrieve( name );
    var isNull;
    helper.defProps( that , {
        name: helper.descriptor(function() {
            return name;
        }),
        pName: helper.descriptor(function() {
            return definition.pName;
        }),
        defaults: helper.descriptor(function() {
            return definition.defaults;
        }),
        isNull: helper.descriptor(
            function() {
                return isNull;
            },
            function( value ) {
                isNull = value;
            }
        ),
        keymap: helper.descriptor(function() {
            return definition.keymap;
        }),
        string: helper.descriptor(function() {
            return definition.toString( that );
        }),
        length: helper.descriptor(function() {
            return helper.length(
                helper.keys( that )
            );
        }),
        values: helper.descriptor(function() {
            if (helper.length( that ) === 1) {
                return that[0];
            }
            else {
                var key, obj = {}, keymap = that.keymap;
                for (var i = 0; i < helper.length( keymap ); i++) {
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

CSSProperty.prototype = $.extend(helper.create( Array.prototype ), {
    constructor: CSSProperty,
    clone: function( cloneDefaults ) {
        var that = this;
        var subject = (cloneDefaults ? that.defaults : that.values);
        return new CSSProperty( that.name , subject );
    },
    update: function( values ) {
        values = (helper.instOf( values , CSSProperty ) && values.isNull ? null : values);
        var that = this;
        var keymap = that.keymap;
        var key, i;
        that.isNull = (values === null);
        values = (( values || values === 0 ) ? values : that.defaults );
        if (!helper.isObj( values )) {
            values = [ values ];
        }
        for (i = 0; i < helper.length( keymap ); i++) {
            if (helper.isArr( values )) {
                key = i;
            }
            else {
                key = keymap[i];
            }
            if (!helper.isUndef( values[key] )) {
                that[i] = mergeUpdates( that[i] , values[key] );
            }
        }
        function mergeUpdates( storedVal , newVal ) {
            /* jshint -W061 */
            var parts = parseExpression( newVal );
            return ( parts.op ? eval( storedVal + parts.op + parts.val ) : parts.val );
        }
    },
    isDefault: function() {
        var that = this;
        return that.isNull && helper.compareArray( that , that.defaults );
    }
});

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
