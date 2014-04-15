(function( window , hx , Config , Helper , VendorPatch , Easing ) {


    var get = {};


    get.scopedModule = function( module , context ) {

        var _module = {};

        Helper.object.each( module , function( func , key ) {
            _module[key] = func.bind( context );
        });

        return _module;
    };


    // TODO - implement get.computedMatrix to account for transforms applied in CSS
    /*get.computedMatrix = function( node ) {

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

        function exec() {

            var matrix = VendorPatch.getComputedMatrix( node );

            if (_isMatrix( matrix ) !== false) {
                
                matrix = _parse( matrix );
                
                if (matrix.transform.length < 1) {
                    return null;
                }

                return matrix;

            }
            else {
                return null;
            }

        }

        return exec();
    };*/


    get.orderedBundle = function( bundle ) {

        var xformSeeds = [];
        var otherSeeds = [];

        bundle.forEach(function( seed ) {

            if (seed.type === 'transform') {
                xformSeeds.push( seed );
            }
            else {
                otherSeeds.push( seed );
            }
        });

        return xformSeeds.concat( otherSeeds );
    };


    get.xformKeys = function( seed ) {

        var map = Config.maps.component;
        var order = [];

        seed.order.forEach(function( key ) {
            if (Config.keys.config.indexOf( key ) < 0) {
                order.push( key );
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

        order.forEach(function( key , i ) {

            var val = seed[key];

            // order can be passed in a seed, so all components won't necessarily be defined at this point
            if (typeof val === 'undefined') {
                return;
            }

            out.passed[key] = val;

            if (typeof map[key] === 'undefined' && Config.keys.config.indexOf( key ) < 0) {
                out.mapped[key] = val;
            }
            else {
                out.mapped[map[key]] = val;
            }

            var index = out.mapped.order.indexOf( key );

            if (index >= 0 && typeof map[key] !== 'undefined') {
                out.mapped.order[index] = map[key];
            }
            else {
                out.mapped.order[index] = key;
            }

        });

        // do some special stuff for non-tranform seeds
        if (seed.type !== 'transform') {

            // if mapped.value is null, set it to an empty string
            out.mapped.value = (out.mapped.value !== null ? out.mapped.value : '');

            // change mapped.value to seed.type
            var p = out.mapped.order.indexOf( 'value' );
            out.mapped.order.splice( p , 1 , seed.type );
            out.mapped[seed.type] = out.mapped.value;
            delete out.mapped.value;
        }

        return out;
    };


    get.seedOrder = function( seed ) {
        var order;
        if (typeof seed.order !== 'undefined' && seed.order !== null) {
            order = get.mappedOrder( seed );
        }
        else {
            order = Helper.object.getOrder( seed );
        }
        return order;
    };


    get.mappedOrder = function( seed ) {

        var ord = [];
        var map = Config.maps.component;

        seed.order.forEach(function( val ) {
            if (typeof map[val] !== 'undefined' && typeof seed[val] === 'undefined') {
                val = map[val];
            }
            if (ord.indexOf( val ) < 0) {
                ord.push( val );
            }
        });

        return ord;
    };


    get.xformOptions = function( options ) {

        var _options = {};
        var defaults = Config.hx;

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


    get.rawComponents = function( mapped ) {

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

            Helper.object.each( mapped , function( val , key ) {

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


    get.updateRules = function( mapped , raw ) {

        var Rules = {};
        var map = Config.maps.array;

        Helper.object.each( raw , function( val , key ) {

            var rule = [];

            val.forEach(function( part , i ) {

                var mapKey = map[i];

                if (typeof mapped[key][mapKey] !== 'undefined') {
                    rule.push( true );
                }
                else if (typeof mapped[key] === 'string' || typeof mapped[key] === 'number') {
                    rule.push( true );
                }
                else {
                    rule.push( false );
                }
            });

            Rules[key] = rule;

        });

        return Rules;
    };


    get.extendedOrder = function( nodeOrder , instOrder ) {

        var order = [];

        nodeOrder.forEach(function( val ) {
            if (instOrder.indexOf( val ) < 0) {
                order.push( val );
            }
        });

        instOrder.forEach(function( val ) {
            if (order.indexOf( val ) < 0) {
                order.push( val );
            }
        });

        return order;
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

                    // make sure defaults are defined before comparing
                    defaults[key] = defaults[key] || get.componentDefaults( key );

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


    get.componentDefaults = function( type ) {

        var defaults = [];

        switch (type) {
            case 'matrix3d':
                defaults = Config.xformDefaults.matrix3d;
                break;
            case 'matrix':
                defaults = Config.xformDefaults.matrix;
                break;
            case 'translate3d':
                defaults = Config.xformDefaults.translate3d;
                break;
            case 'scale3d':
                defaults = Config.xformDefaults.scale3d;
                break;
            case 'rotate3d':
                defaults = Config.xformDefaults.rotate3d;
                break;
            case 'translate':
                defaults = Config.xformDefaults.translate;
                break;
            case 'scale':
                defaults = Config.xformDefaults.scale;
                break;
            case 'rotateX':
            case 'rotateY':
            case 'rotateZ':
                defaults = Config.xformDefaults.singleAxisRotate;
                break;
            default:
                defaults = [ '' ];
                break;
        }

        return defaults;
    };


    function _checkComponentDefaults( type , values , defaults ) {
        
        var defs = $.extend( [] , defaults );
        var newVals = $.extend( defs , values );
                
        if (Helper.array.compare( defaults , newVals ) && Config.keys.xform.indexOf( type ) >= 0) {
            newVals = [];
        }
        
        return newVals;
    }

    
    $.extend( hx , {get: get} );

    
}( window , hxManager , hxManager.config , hxManager.helper , hxManager.vendorPatch , hxManager.easing ));



























