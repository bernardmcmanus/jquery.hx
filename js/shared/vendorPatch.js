hxManager.VendorPatch = (function( Config ) {


    var navigator_userAgent = navigator.userAgent;


    function VendorPatch() {

        var that = this;

        that.vendor = _getUserAgent();
        that.os = _getOS();
        that.isMobile = _isMobile();
        that.RAF = _getRequestAnimationFrame();

        Object.defineProperty( that , 'eventType' , {
            get: function() {
                return Config.events[ that.vendor ];
            }
        });
    }


    VendorPatch.prototype = {

        getPrefixed: function( str ) {

            var vendor = this.vendor;

            if (vendor === 'other') {
                return str;
            }

            Config.prefix.forEach(function( re ) {

                var match = re.exec( str );
                
                if (match) {
                    str = str.replace( re , ('-' + vendor + '-' + match[0]) );
                }
            });

            return str;
        },

        getComputedMatrix: function( element ) {
            var vendor = this.vendor;
            var style = getComputedStyle( element );
            var transform = vendor !== 'other' ? (vendor + 'Transform') : 'transform';
            return style[transform] || style.transform;
        },

        getBezierSupport: function() {
            if (_isAndroidNative( this.os )) {
                return false;
            }
            return true;
        },

        getDuration: function( duration ) {
            if (duration === 0 && _isAndroidNative( this.os )) {
                return 1;
            }
            return duration;
        }
        
    };


    function _getRequestAnimationFrame() {
        var W = window;
        var name = 'equestAnimationFrame';
        return (
            W['r' + name] ||
            W['webkitR' + name] ||
            W['mozR' + name] ||
            W['oR' + name] ||
            W['msR' + name] ||
            function( callback ) {
                setTimeout( callback , ( 1000 / 60 ));
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



























