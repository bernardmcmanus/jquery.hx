hxManager.Transform = (function( CSSProperty ) {


    var Object_defineProperty = Object.defineProperty;


    function Transform( mappedName , values ) {

        var that = this;
        var property = Properties[mappedName];

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
                return mappedName + '(' + that.join( property.join ) + property.append + ')';
            }
        });

        Object_defineProperty( that , 'length' , {
            get: function() {
                return Object.keys( that ).length;
            }
        });

        Object_defineProperty( that , 'values' , {
            get: function() {
                var key, obj = {}, keyMap = that.keyMap;
                for (var i = 0; i < keyMap.length; i++) {
                    key = keyMap[i];
                    obj[key] = that[i];
                }
                return obj;
            }
        });

        Object_defineProperty( that , 'clone' , {
            get: function() {
                return new Transform( mappedName , that.values );
            }
        });

        that.defaults.forEach(function( val , i ) {
            that[i] = val;
        });

        that.update( values );
    }


    Transform.prototype = Object.create( CSSProperty.prototype );


    var Properties = {

        matrix3d: {
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
            defaults: [ 0 , 0 , 0 ],
            keyMap: [ 'x' , 'y' , 'z' ],
            join: 'px,',
            append: 'px'
        },

        scale3d: {
            defaults: [ 1 , 1 , 1 ],
            keyMap: [ 'x' , 'y' , 'z' ],
            join: ',',
            append: ''
        },

        rotate3d: {
            defaults: [ 0 , 0 , 0 , 0 ],
            keyMap: [ 'x' , 'y' , 'z' , 'a' ],
            join: ',',
            append: 'deg'
        },

        rotateX: {
            defaults: [ 0 ],
            keyMap: [ 0 ],
            join: ',',
            append: 'deg'
        },

        rotateY: {
            defaults: [ 0 ],
            keyMap: [ 0 ],
            join: ',',
            append: 'deg'
        },

        rotateZ: {
            defaults: [ 0 ],
            keyMap: [ 0 ],
            join: ',',
            append: 'deg'
        },

        matrix: {
            defaults: [ 1 , 0 , 0 , 1 , 0 , 0 ],
            keyMap: [ 'a1' , 'b1' , 'c1' , 'd1' , 'a4' , 'b4' ],
            join: ',',
            append: ''
        },

        translate: {
            defaults: [ 0 , 0 ],
            keyMap: [ 'x' , 'y' ],
            join: 'px,',
            append: 'px'
        },

        scale: {
            defaults: [ 1 , 1 ],
            keyMap: [ 'x' , 'y' ],
            join: ',',
            append: ''
        }
    };


    return Transform;

    
}( hxManager.CSSProperty ));



























