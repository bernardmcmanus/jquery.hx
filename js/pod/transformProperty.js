hxManager.Transform = (function( Helper ) {


    var Object_defineProperty = Object.defineProperty;
    var Helper_compareArray = Helper.compareArray;


    function Transform( name , values , index ) {

        var that = this;
        var property = Properties[name];

        Object_defineProperty( that , 'name' , {
            get: function() {
                return name;
            }
        });

        Object_defineProperty( that , 'index' , {
            get: function() {
                return index;
            },
            set: function( value ) {
                index = value;
            }
        });

        Object_defineProperty( that , 'mappedName' , {
            get: function() {
                return property.mappedName;
            }
        });

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
                return name + '(' + that.join( property.join ) + property.append + ')';
            }
        });

        Object_defineProperty( that , 'length' , {
            get: function() {
                return Object.keys( that ).length;
            }
        });

        /*Object_defineProperty( that , 'object' , {
            get: function() {
                var key, obj = {}, keyMap = that.keyMap;
                for (var i = 0; i < keyMap.length; i++) {
                    key = keyMap[i];
                    obj[key] = that[i];
                }
                return obj;
            }
        });*/

        that.defaults.forEach(function( val , i ) {
            that[i] = val;
        });

        that.update( values );
    }


    var Transform_prototype = (Transform.prototype = Object.create( Array.prototype ));


    Transform_prototype.update = function( values ) {

        var that = this;
        var keyMap = that.keyMap;
        var key, i;

        values = (( values && values !== 0 ) ? values : that.defaults );

        if (typeof values !== 'object') {
            values = [ values ];
        }

        for (i = 0; i < keyMap.length; i++) {

            key = keyMap[i];

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


    Transform_prototype.isDefault = function() {
        var that = this;
        return Helper_compareArray( that , that.defaults );
    };


    function parseExpression( exp ) {

        var re = /((\+|\-|\*|\/|\%){1})+\=/;
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

        matrix3d: {
            mappedName: 'matrix',
            defaults: [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ],
            keyMap: [
                'a1', 'b1', 'c1', 'd1',
                'a2', 'b2', 'c2', 'd2',
                'a3', 'b3', 'c3', 'd3',
                'a4', 'b4', 'c4', 'd4'
            ],
            join: ',',
            append: ''
        },

        translate3d: {
            mappedName: 'translate',
            defaults: [ 0 , 0 , 0 ],
            keyMap: [ 'x' , 'y' , 'z' ],
            join: 'px,',
            append: 'px'
        },

        scale3d: {
            mappedName: 'scale',
            defaults: [ 1 , 1 , 1 ],
            keyMap: [ 'x' , 'y' , 'z' ],
            join: ',',
            append: ''
        },

        rotate3d: {
            mappedName: 'rotate',
            defaults: [ 0 , 0 , 0 , 0 ],
            keyMap: [ 'x' , 'y' , 'z' , 'a' ],
            join: ',',
            append: 'deg'
        },

        rotateX: {
            mappedName: 'rotateX',
            defaults: [ 0 ],
            keyMap: [ 0 ],
            join: ',',
            append: 'deg'
        },

        rotateY: {
            mappedName: 'rotateY',
            defaults: [ 0 ],
            keyMap: [ 0 ],
            join: ',',
            append: 'deg'
        },

        rotateZ: {
            mappedName: 'rotateZ',
            defaults: [ 0 ],
            keyMap: [ 0 ],
            join: ',',
            append: 'deg'
        },

        matrix: {
            mappedName: 'matrix2d',
            defaults: [ 1 , 0 , 0 , 1 , 0 , 0 ],
            keyMap: [ 'a1' , 'b1' , 'c1' , 'd1' , 'a4' , 'b4' ],
            join: ',',
            append: ''
        },

        translate: {
            mappedName: 'translate2d',
            defaults: [ 0 , 0 ],
            keyMap: [ 'x' , 'y' ],
            join: 'px,',
            append: 'px'
        },

        scale: {
            mappedName: 'scale2d',
            defaults: [ 1 , 1 ],
            keyMap: [ 'x' , 'y' ],
            join: ',',
            append: ''
        }
    };


    return Transform;

    
}( hxManager.Helper ));



























