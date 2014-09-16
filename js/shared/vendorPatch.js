hxManager.VendorPatch = hxManager.Inject(
[
    window,
    navigator,
    Date,
    RegExp,
    setTimeout,
    clearTimeout,
    'Config',
    'instOf',
    'test',
    'indexOf'
],
function(
    window,
    navigator,
    Date,
    RegExp,
    setTimeout,
    clearTimeout,
    Config,
    instOf,
    test,
    indexOf
){


    var OTHER = 'other';
    var UserAgent = navigator.userAgent;
    var VPConfig = Config.VendorPatch;
    var Vendors = VPConfig.vendors;
    var OS = VPConfig.os;
    var Tests = VPConfig.tests;


    function VendorPatch() {

        var that = this;
        var vendor = UA_RegExp( Vendors );
        var os = UA_RegExp( OS );

        that.RAF = getRequestAnimationFrame();
        that.prefix = that.prefix.bind( that , vendor );
        that.unclamped = that.unclamped.bind( that , os );
    }


    VendorPatch.prototype = {

        prefix: function( vendor , str ) {

            if (vendor === OTHER) {
                return str;
            }

            VPConfig.prefix.forEach(function( pfx ) {

                var re, omit = [];

                if (instOf( pfx , RegExp )) {
                    re = pfx;
                }
                else {
                    re = pfx.regx;
                    omit = pfx.omit || omit;
                }

                if (indexOf( omit , vendor ) < 0) {
                    var match = re.exec( str );
                    if (match) {
                        str = str.replace( re , ('-' + vendor + '-' + match[0]) );
                    }
                }
            });

            return str;
        },

        unclamped: function( os ) {
            return isAndroidNative( os ) === false;
        }
    };


    function getRequestAnimationFrame() {
        
        var name = 'equestAnimationFrame';
        var initTime = Date.now();

        function timestamp() {
            return Date.now() - initTime;
        }
        
        return (
            window['r' + name] ||
            window['webkitR' + name] ||
            window['mozR' + name] ||
            window['oR' + name] ||
            window['msR' + name] ||
            function( callback ) {
                var timeout = setTimeout(function() {
                    callback( timestamp() );
                    clearTimeout( timeout );
                }, ( 1000 / 60 ));
            }
        ).bind( null );
    }


    function UA_RegExp( search ) {
        for (var key in search) {
            if (test( search[key] , UserAgent )) {
                return key;
            }
        }
        return OTHER;
    }


    function isAndroidNative( os ) {
        return (os === 'android' && !test( Tests.andNat , UserAgent ));
    }


    return new VendorPatch();

});




















