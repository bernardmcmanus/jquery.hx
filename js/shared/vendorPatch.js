hxManager.VendorPatch = (function( Config ) {


    var navigator_userAgent = navigator.userAgent;


    function VendorPatch() {

        var that = this;

        that.vendor = _getUserAgent();
        that.os = _getOS();
        that.isMobile = _isMobile();
        that.RAF = _getRequestAnimationFrame();
    }


    VendorPatch.prototype = {

        getPrefixed: function( str ) {

            var vendor = this.vendor;

            if (vendor === 'other') {
                return str;
            }

            Config.prefix.forEach(function( pfx ) {

                var re, exclude = [];

                if (pfx instanceof RegExp) {
                    re = pfx;
                }
                else {
                    re = pfx.regexp;
                    exclude = pfx.exclude || exclude;
                }

                if (exclude.indexOf( vendor ) < 0) {

                    var match = re.exec( str );
                    
                    if (match) {
                        str = str.replace( re , ('-' + vendor + '-' + match[0]) );
                    }
                }
            });

            return str;
        },

        getBezierSupport: function() {
            if (_isAndroidNative( this.os )) {
                return false;
            }
            return true;
        }
    };


    function _getRequestAnimationFrame() {
        
        var W = window;
        var name = 'equestAnimationFrame';
        var initTime = Date.now();

        function timestamp() {
            return Date.now() - initTime;
        }
        
        return (
            W['r' + name] ||
            W['webkitR' + name] ||
            W['mozR' + name] ||
            W['oR' + name] ||
            W['msR' + name] ||
            function( callback ) {
                setTimeout(function() {
                    callback( timestamp() );
                }, ( 1000 / 60 ));
            }
        ).bind( null );
    }


    function _getUserAgent() {
        var uaString = navigator_userAgent;
        for (var key in Config.vendors) {
            if (Config.vendors[key].test( uaString )) {
                return key;
            }
        }
        return 'other';
    }


    function _getOS() {
        var uaString = navigator_userAgent;
        for (var key in Config.os) {
            if (Config.os[key].test( uaString )) {
                return key;
            }
        }
        return 'other';
    }


    function _isMobile() {
        return Config.tests.mobile.test( navigator_userAgent );
    }


    function _isAndroidNative( os ) {
        return (os === 'android' && !Config.tests.andNat.test( navigator_userAgent ));
    }


    return new VendorPatch();

    
}( hxManager.Config.VendorPatch ));



























