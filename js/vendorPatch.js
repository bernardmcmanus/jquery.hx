(function( hx ) {

    var config = {
        vendors: {
            webkit: 'webkit',
            moz: 'firefox',
            o: 'opera',
            ms: 'msie'
        },
        os: {
            android: 'android',
            ios: 'ios',
            macos: 'mac os',
            windows: 'windows'
        },
        events: {
            webkit: 'webkitTransitionEnd',
            moz: 'transitionend',
            o: 'oTransitionEnd',
            ms: 'transitionend'
        },
        prefixProps: [ 'transition' , 'transform' ]
    };

    var vendorPatch = function() {
        this.ua = _getUserAgent();
        this.os = _getOS();
        this.isMobile = _isMobile();
    };

    vendorPatch.prototype = {
        getEventType: function() {
            return config.events[ this.ua ];
        },
        getPrefixed: function( str ) {
            for (var i = 0; i < config.prefixProps.length; i++) {
                var re = new RegExp( '(?!-)' + config.prefixProps[i] + '(?!-)' , 'g' );
                var match = re.exec( str );
                if (match)
                    str = str.replace( re , ('-' + this.ua + '-' + match[0]) );
            }
            return str;
        },
        createEvent: function( type , detail ) {

            if (!type)
                return;

            detail = detail || {};

            var evt = {};

            try {
                evt = new CustomEvent( type , {
                    bubbles: true,
                    cancelable: true,
                    detail: detail
                });
            } catch( err ) {
                evt = document.createEvent( 'Event' );
                evt.initEvent( type , true , true );
                evt.detail = detail;
            }

            return evt;
        },
        getComputedMatrix: function( element ) {
            var style = window.getComputedStyle( element );
            var transform = this.ua + 'Transform';
            return style[transform] || style.transform;
        },
        getBezierSupport: function() {
            if (this.os === 'android' && _isAndroidNative()) {
                return false;
            }
            else {
                return true;
            }
        }
    };

    function _getUserAgent() {
        var uaString = navigator.userAgent;
        for (var key in config.vendors) {
            var re = new RegExp( config.vendors[key] , 'i' );
            if (re.test( uaString ))
                return key;
        }
    }

    function _getOS() {
        var uaString = navigator.userAgent;
        for (var key in config.os) {
            var re = new RegExp( config.os[key] , 'i' );
            if (re.test( uaString ))
                return key;
        }
    }

    function _isMobile() {
        return (/mobile/i).test( navigator.userAgent );
    }

    function _isAndroidNative() {
        var uaString = navigator.userAgent;
        return (!(/chrome/i).test( uaString ) && !(/firefox/i).test( uaString ));
    }

    $.extend( hx , {vendorPatch: vendorPatch} );
    
}( hxManager ));



























