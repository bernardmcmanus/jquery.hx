hxManager.Get = (function( Config , Helper , VendorPatch ) {


    var EACH = Helper.object.each;


    /*function scopedModule( module , context ) {

        var _module = {};

        EACH( module , function( func , key ) {
            _module[key] = func.bind( context );
        });

        return _module;
    }*/


    /*function orderedBundle( bundle ) {

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
    }*/


    // TODO - implement Get.computedMatrix to account for transforms applied in CSS
    /*Get.computedMatrix = function( node ) {

        function _isMatrix( str ) {
            
            if (!str) {
                return false;
            }

            var types = {
                matrix3d: (/matrix3d\(/i),
                matrix: (/matrix\(/i)
            };

            var response = false;

            EACH( types , function( val , key ) {
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
            
            var defaults = Get.componentDefaults( type );
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


    /*Get.orderedBundle = function( bundle ) {

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
    };*/


    var Get = {};


    //Get[scopedModule.name] = scopedModule;
    //Get[orderedBundle.name] = orderedBundle;

    
    return Get;

    
}( hxManager.Config , hxManager.Helper , hxManager.VendorPatch ));



























