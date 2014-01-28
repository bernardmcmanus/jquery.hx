(function( hx ) {

    var config = {
        vendors: {
            webkit: 'webkit',
            moz: 'firefox',
            o: 'opera',
            ms: 'msie'
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

    $.extend( hx , {vendorPatch: vendorPatch} );
    
}( hxManager ));



























