(function( window , hx , Config ) {


    function VendorPatch() {

        this.ua = _getUserAgent();
        this.os = _getOS();
        this.isMobile = _isMobile();

        Object.defineProperty( this , 'eventType' , {
            get: function() {
                return Config.events[ this.ua ];
            }
        });
    }


    VendorPatch.prototype = {

        getPrefixed: function( str ) {

            if (this.ua === 'other') {
                return str;
            }

            Config.prefixProps.forEach(function( re ) {

                var match = re.exec( str );
                
                if (match) {
                    str = str.replace( re , ('-' + this.ua + '-' + match[0]) );
                }

            }.bind( this ));

            return str;
        },

        getComputedMatrix: function( element ) {
            var style = getComputedStyle( element );
            var transform = this.ua !== 'other' ? (this.ua + 'Transform') : 'transform';
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


    function _getUserAgent() {
        var uaString = navigator.userAgent;
        for (var key in Config.vendors) {
            if (Config.vendors[key].test( uaString )) {
                return key;
            }
        }
        return 'other';
    }


    function _getOS() {
        var uaString = navigator.userAgent;
        for (var key in Config.os) {
            if (Config.os[key].test( uaString )) {
                return key;
            }
        }
        return 'other';
    }


    function _isMobile() {
        return Config.tests.mobile.test( navigator.userAgent );
    }


    function _isAndroidNative( os ) {
        return (os === 'android' && !Config.tests.andNat.test( navigator.userAgent ));
    }


    $.extend( hx , { VendorPatch : new VendorPatch() });

    
}( window , hxManager , hxManager.Config.VendorPatch ));



























