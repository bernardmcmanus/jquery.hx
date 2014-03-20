(function( window , hx , Config , Helper , VendorPatch , Easing ) {


    var get = {};


    get.scopedModule = function( module , context ) {

        var _module = {};

        Helper.object.each( module , function( func , key ) {
            _module[key] = func.bind( context );
        });

        return _module;
    };


    get.computedMatrix = function( node ) {

        var matrix = VendorPatch.getComputedMatrix( node );

        if (_isMatrix( matrix ) !== false) {
            
            matrix = _parse( matrix );
            
            if (matrix.transform.length < 1)
                return null;

            return matrix;

        } else {
            return null;
        }
        
    };


    get.xformKeys = function( xform ) {

        var map = Config.maps.component;
        var order = $.extend( [] , ( xform.order || [] ));

        order.forEach(function( key ) {
            if (Config.keys.config.indexOf( key ) >= 0) {
                var p = order.indexOf( key );
                order.splice( p , 1 );
            }
        });

        var out = {
            passed: {
                order: $.extend( [] , order )
            },
            mapped: {
                order: $.extend( [] , order )
            }
        };

        Helper.object.each( xform , function( val , key ) {

            if (!map[key]) {
                return;
            }

            out.passed[key] = val;
            out.mapped[map[key]] = val;

            var index = out.mapped.order.indexOf( key );

            if (index >= 0) {
                out.mapped.order[index] = map[key];
            }

        });

        return out;
    };


    get.xformOptions = function( options ) {

        var _options = {};
        var defaults = Config.$hx;

        Helper.object.each( options , function( val , key ) {

            if (key === 'easing') {
                _options[key] = Easing( val );
            }
            else if (key === 'order' || key === 'type') {
                return;
            }
            else if (Config.keys.config.indexOf( key ) >= 0) {
                _options[key] = val;
            }

        });

        return $.extend( {} , defaults , _options );
    };


    get.xformDefaults = function( raw ) {
        var defs = {};
        Helper.object.each( raw , function( val , key ) {
            defs[key] = get.componentDefaults( key );
        });
        return defs;
    };


    get.rawComponents = function( options ) {

        function _mapVectorToArray( vector ) {
            
            if (typeof vector !== 'object' && Helper.object.size( vector ) < 1) {
                return [ vector ];
            }

            if (Array.isArray( vector )) {
                return vector;
            }

            var map = Config.maps.vector;
            
            var v = vector;
            var arr = [];
            var i = 0;

            Helper.object.each( v , function( val , key ) {
                i = map[key];
                arr[i] = val;
            });

            return arr;
        }

        function exec() {

            var components = {};

            Helper.object.each( options , function( val , key ) {

                if (Config.keys.config.indexOf( key ) >= 0) {
                    return;
                }

                var values = _mapVectorToArray( val );
                var defaults = get.componentDefaults( key );
                components[key] = _checkComponentDefaults( key , values , defaults );

            });

            return components;
        }

        return exec();
    };


    get.xformString = function( property , component , defaults , order ) {

        function _buildComponentString( component , values ) {

            if (values.length < 1) {
                return '';
            }

            var joinWith = '';
            var appendWith = '';
            switch (component) {
                case 'computed':
                    component = values.type;
                    values = values.transform;
                    joinWith = ', ';
                    appendWith = '';
                    break;
                case 'translate':
                case 'translate3d':
                    joinWith = 'px, ';
                    appendWith = 'px';
                    break;
                case 'matrix3d':
                case 'matrix':
                case 'scale':
                case 'scale3d':
                    joinWith = ', ';
                    appendWith = '';
                    break;
                case 'rotate3d':
                    joinWith = ', ';
                    appendWith = 'deg';
                    break;
                case 'rotateX':
                case 'rotateY':
                case 'rotateZ':
                    joinWith = '';
                    appendWith = 'deg';
                    break;
            }
            return component + '(' + values.join( joinWith ) + appendWith + ')';
        }

        function exec() {

            if (property !== 'transform') {
                return component[property][0];
            }
            
            var xform = [];

            order.forEach(function( key ) {

                if (Config.keys.config.indexOf( key ) < 0) {

                    var _component = _checkComponentDefaults( key , component[key] , defaults[key] );

                    var compString = _buildComponentString( key , _component );

                    if (compString !== '') {
                        xform.push( compString );
                    }
                }
            });

            return xform.join(' ');
        }

        return exec();
    };


    get.componentDefaults = function( component ) {

        var defaults = [];

        switch (component) {
            case 'matrix3d':
                defaults = [ 1 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 1 ];
                break;
            case 'matrix':
                defaults = [ 1 , 0 , 0 , 1 , 0 , 0 ];
                break;
            case 'translate3d':
                defaults = [ 0 , 0 , 0 ];
                break;
            case 'scale3d':
                defaults = [ 1 , 1 , 1 ];
                break;
            case 'rotate3d':
                defaults = [ 0 , 0 , 0 , 0 ];
                break;
            case 'translate':
                defaults = [ 0 , 0 ];
                break;
            case 'scale':
                defaults = [ 1 , 1 ];
                break;
            case 'rotateX':
            case 'rotateY':
            case 'rotateZ':
                defaults = [ 0 ];
                break;
            case 'opacity':
                defaults = [ 1 ];
                break;
        }

        return defaults;
    };


    function _checkComponentDefaults( component , values , defaults ) {
        
        var defs = $.extend( [] , defaults );
        var newVals = $.extend( defs , values );
                
        if (Helper.array.compare( defaults , newVals ) && Config.keys.xform.indexOf( component ) >= 0) {
            newVals = [];
        }
        
        return newVals;
    }


    function _isMatrix( str ) {
        
        if (!str) {
            return false;
        }

        var types = {
            matrix3d: (/matrix3d\(/i),
            matrix: (/matrix\(/i)
        };

        var response = false;

        Helper.object.each( types , function( val , key ) {
            if (response !== false) {
                return;
            }
            if (val.test( str )) {
                response = key;
            }
        });

        return response;
    }

    function _parse( str ) {
        
        var type = _isMatrix( str );
        
        if (!type) {
            return {};
        }
        
        var defaults = get.componentDefaults( type );
        var arr = str.replace( /(px|\s|\))/gi , '' ).split( '(' )[1].split( ',' );

        arr.map(function( i ) {
            return parseFloat( i , 10 );
        });

        arr = _checkComponentDefaults( type , arr , defaults );

        return {
            type: type,
            transform: arr
        };
    }

    
    $.extend( hx , {get: get} );

    
}( window , hxManager , hxManager.config , hxManager.helper , hxManager.vendorPatch , hxManager.easing ));



























