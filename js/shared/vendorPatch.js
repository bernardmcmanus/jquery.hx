hxManager.VendorPatch = (function(
    window,
    navigator,
    Date,
    RegExp,
    Config,
    Helper
) {


    var OTHER = 'other';


    var navigator_userAgent = navigator.userAgent;
    var Vendors = Config.vendors;
    var OS = Config.os;
    var Tests = Config.tests;
    var InstOf = Helper.instOf;
    var Test = Helper.test;


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

            Config.prefix.forEach(function( pfx ) {

                var re, omit = [];

                if (InstOf( pfx , RegExp )) {
                    re = pfx;
                }
                else {
                    re = pfx.regx;
                    omit = pfx.omit || omit;
                }

                if (omit.indexOf( vendor ) < 0) {
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
            if (Test( search[key] , navigator_userAgent )) {
                return key;
            }
        }
        return OTHER;
    }


    function isAndroidNative( os ) {
        return (os === 'android' && !Test( Tests.andNat , navigator_userAgent ));
    }


    return new VendorPatch();

    
}(
    window,
    navigator,
    Date,
    RegExp,
    hxManager.Config.VendorPatch,
    hxManager.Helper
));



























