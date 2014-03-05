(function( hx , Config , Helper , VendorPatch , Easing ) {


    var get = {};


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

        xform.order = xform.order || [];

        var map = Config.maps.component;
        
        for (var key in xform) {
            
            if (!map[key]) {
                continue;
            }

            xform[map[key]] = xform[key];
            
            var i = xform.order.indexOf( key );

            if (i >= 0) {
                xform.order[i] = map[key];
            }

            delete xform[key];
        }

        return xform;
    };


    get.xformOptions = function( options ) {

        var _options = {};
        
        for (var key in options) {

            if (key === 'easing') {
                _options[key] = Easing( options[key] );
            }
            else if (Config.keys.config.indexOf( key ) >= 0)  {
                _options[key] = options[key];
            }
        }

        //return $.extend( {} , _options );
        return _options;
    };


    get.xformDefaults = function( raw ) {
        var defs = {};
        for (var key in raw) {
            defs[key] = get.componentDefaults( key );
        }
        return defs;
    };


    get.rawComponents = function( options ) {

        function _mapVectorToArray( vector ) {
            
            if (typeof vector !== 'object' && Helper.object.size.call( vector ) < 1) {
                return [ vector ];
            }

            if (Array.isArray( vector )) {
                return vector;
            }

            var map = Config.maps.vector;
            
            var v = vector;
            var arr = [];
            var i = 0;
            
            for (var key in v) {
                i = map[key];
                arr[i] = v[key];
            }

            return arr;
        }

        function exec() {

            var components = {};

            for (var key in options) {
                
                if (Config.keys.config.indexOf( key ) >= 0) {
                    continue;
                }

                var values = _mapVectorToArray( options[key] );
                var defaults = get.componentDefaults( key );
                components[key] = _checkComponentDefaults( key , values , defaults , options.relative );
            }

            return components;
        }

        return $.extend( {} , exec() );
    };


    get.xformString = function( property , component , order ) {

        function _buildComponentString( component , values ) {

            if (values.length < 1)
                return '';

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
                    var compString = _buildComponentString( key , component[key] );
                    if (compString !== '')
                        xform.push( compString );
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
            case 'opacity':
                defaults = [ 0 ];
                break;
        }

        return defaults;
    };


    function _checkComponentDefaults( component , values , defaults ) {
        
        var defs = $.extend( [] , defaults );
        var newVals = $.extend( defs , values );
                
        if (Helper.array.compare.call( defaults , newVals ) && Config.keys.xform.indexOf( component ) >= 0) {
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

        for (var key in types) {
            if (types[key].test( str )) {
                response = key;
                break;
            }
        }

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

    
}( hxManager , hxManager.config , hxManager.helper , hxManager.vendorPatch , hxManager.easing ));



























