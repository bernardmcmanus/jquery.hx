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
    var USER_AGENT = navigator.userAgent;

    var VENDORS = {
        webkit  : (/webkit/i),
        moz     : (/firefox/i),
        o       : (/opera/i),
        ms      : (/msie/i)
    };

    var OS = {
        android : (/android/i),
        ios     : (/(ipad|iphone|ipod)/i),
        macos   : (/mac os/i),
        windows : (/windows/i)
    };

    var PREFIX = [
        (/(?!\-)transform/g),
        (/(?!\-)transition/g),
        {
            regx: (/(?!\-)filter/g),
            omit: [ 'ms' ]
        }
    ];


    var vendor = UA_RegExp( VENDORS );
    var os = UA_RegExp( OS );


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
            if (test( search[key] , USER_AGENT )) {
                return key;
            }
        }
        return OTHER;
    }


    function isAndroidNative( os ) {
        return (os === 'android' && !test( /(chrome|firefox)/i , USER_AGENT ));
    }


    return {

        RAF: getRequestAnimationFrame(),

        unclamped: function() {
            return isAndroidNative( os ) === false;
        },

        prefix: function( str ) {

            if (vendor === OTHER) {
                return str;
            }

            PREFIX.forEach(function( pfx ) {

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
        }
    };

});




















