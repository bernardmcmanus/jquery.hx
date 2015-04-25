/*jshint -W061 */
hxManager.CSSProperty = hxManager.Inject(
[   
    Array,
    parseFloat,
    eval,
    'StyleDefinition',
    'PROTOTYPE',
    'NULL',
    'compareArray',
    'defProps',
    'descriptor',
    'keys',
    'create',
    'length',
    'instOf',
    'isArr',
    'isObj',
    'isUndef'
],
function(
    Array,
    parseFloat,
    _eval,
    StyleDefinition,
    PROTOTYPE,
    NULL,
    compareArray,
    defProps,
    descriptor,
    keys,
    create,
    length,
    instOf,
    isArr,
    isObj,
    isUndef
){


    function CSSProperty( name , values ) {

        var that = this;
        var definition = StyleDefinition.retrieve( name );
        var isNull;

        defProps( that , {

            name: descriptor(function() {
                return name;
            }),

            pName: descriptor(function() {
                return definition.pName;
            }),

            defaults: descriptor(function() {
                return definition.defaults;
            }),

            isNull: descriptor(
                function() {
                    return isNull;
                },
                function( value ) {
                    isNull = value;
                }
            ),

            keymap: descriptor(function() {
                return definition.keymap;
            }),

            string: descriptor(function() {
                return definition.toString( that );
            }),

            length: descriptor(function() {
                return length(
                    keys( that )
                );
            }),

            values: descriptor(function() {
                if (length( that ) === 1) {
                    return that[0];
                }
                else {
                    var key, obj = {}, keymap = that.keymap;
                    for (var i = 0; i < length( keymap ); i++) {
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


    var CSSProperty_prototype = (CSSProperty[PROTOTYPE] = create( Array[PROTOTYPE] ));


    CSSProperty_prototype.clone = function( cloneDefaults ) {
        var that = this;
        var subject = (cloneDefaults ? that.defaults : that.values);
        return new CSSProperty( that.name , subject );
    };


    CSSProperty_prototype.update = function( values ) {

        values = (instOf( values , CSSProperty ) && values.isNull ? NULL : values);

        var that = this;
        var keymap = that.keymap;
        var key, i;

        that.isNull = (values === NULL);

        values = (( values || values === 0 ) ? values : that.defaults );

        if (!isObj( values )) {
            values = [ values ];
        }

        for (i = 0; i < length( keymap ); i++) {

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
            var parts = parseExpression( newVal );
            return ( parts.op ? _eval( storedVal + parts.op + parts.val ) : parts.val );
        }
    };


    CSSProperty_prototype.isDefault = function() {
        var that = this;
        return that.isNull && compareArray( that , that.defaults );
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

});



















