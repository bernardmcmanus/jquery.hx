(function( hx ) {

    var vendorPatch = function( options ) {
        
        options = $.extend({
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
        }, (options || {}));

        $.extend( this , options );

        this._init();
    };

    vendorPatch.prototype = {
        _init: function() {
            this._getUserAgent();
        },
        _getUserAgent: function() {
            var uaString = navigator.userAgent;
            for (var key in this.vendors) {
                var re = new RegExp( this.vendors[key] , 'i' );
                if (re.test( uaString )) {
                    this.ua = key;
                    break;
                }
            }
        },
        getEventName: function() {
            return this.events[ this.ua ];
        },
        getPrefixed: function( str ) {
            for (var i = 0; i < this.prefixProps.length; i++) {
                var re = new RegExp( '(?!-)' + this.prefixProps[i] + '(?!-)' , 'g' );
                var match = re.exec( str );
                if (match)
                    str = str.replace( re , ('-' + this.ua + '-' + match[0]) );
            }
            return str;
        },
        addEventListener: function( target , listener ) {
            var evt = this.getEventName();
            target.addEventListener( evt , listener );
        },
        removeEventListener: function( target , listener ) {
            var evt = this.getEventName();
            target.removeEventListener( evt , listener );
        },
        getComputedMatrix: function( manager ) {
            var style = window.getComputedStyle( manager.element );
            var transform = this.ua + 'Transform';
            return style[transform] || style.transform;
        }
    };

    $.extend( hx , {vendorPatch: vendorPatch} );
    
}( hxManager ));



























