(function( hx ) {

    var config = {
        vendors: {
            webkit  : (/webkit/i),
            moz     : (/firefox/i),
            o       : (/opera/i),
            ms      : (/msie/i)
        },
        os: {
            android : (/android/i),
            ios     : (/(ios|iphone)/i),
            macos   : (/mac os/i),
            windows : (/windows/i)
        },
        events: {
            webkit  : 'webkitTransitionEnd',
            moz     : 'transitionend',
            o       : 'oTransitionEnd',
            ms      : 'transitionend',
            other   : 'transitionend'
        },
        prefixProps: [
            (/(?!-)transition(?!-)/g),
            (/(?!-)transform(?!-)/g)
        ]
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

            if (this.ua === 'other')
                return str;

            for (var i = 0; i < config.prefixProps.length; i++) {
                var re = config.prefixProps[i];
                var match = re.exec( str );
                if (match)
                    str = str.replace( re , ('-' + this.ua + '-' + match[0]) );
            }
            return str;
        },
        createEvent: function( type , detail , bubbles , cancelable ) {

            if (!type)
                return;

            detail = detail || {};
            bubbles = typeof bubbles !== 'undefined' ? bubbles : true;
            cancelable = typeof cancelable !== 'undefined' ? cancelable : true;

            var evt = {};

            try {
                evt = new CustomEvent( type , {
                    bubbles: bubbles,
                    cancelable: cancelable,
                    detail: detail
                });
            } catch( err ) {
                evt = document.createEvent( 'Event' );
                evt.initEvent( type , bubbles , cancelable );
                evt.detail = detail;
            }

            return evt;
        },
        getComputedMatrix: function( element ) {
            var style = window.getComputedStyle( element );
            var transform = this.ua !== 'other' ? (this.ua + 'Transform') : 'transform';
            return style[transform] || style.transform;
        },
        getBezierSupport: function() {
            if (_isAndroidNative( this.os ))
                return false;
            return true;
        }
    };

    function _getUserAgent() {
        var uaString = navigator.userAgent;
        for (var key in config.vendors) {
            if (config.vendors[key].test( uaString ))
                return key;
        }
        return 'other';
    }

    function _getOS() {
        var uaString = navigator.userAgent;
        for (var key in config.os) {
            if (config.os[key].test( uaString ))
                return key;
        }
        return 'other';
    }

    function _isMobile() {
        return (/mobile/i).test( navigator.userAgent );
    }

    function _isAndroidNative( os ) {
        return (os === 'android' && !(/(chrome|firefox)/i).test( navigator.userAgent ));
    }

    $.extend( hx , {vendorPatch: new vendorPatch()} );
    
}( hxManager ));



























