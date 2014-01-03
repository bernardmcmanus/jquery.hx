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
            properties: [ 'transition' , 'transform' ]
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
        getPrefixed: function( str ) {
            for (var i = 0; i < this.properties.length; i++) {
                var re = new RegExp( '(?!-)' + this.properties[i] + '(?!-)' , 'g' );
                var match = null;
                if (match = re.exec( str ))
                    str = str.replace( re , ('-' + this.ua + '-' + match[0]) );
            }
            return str;
        },
        addEventListener: function( target , listener ) {
            var evt = this.events[ this.ua ];
            target.addEventListener( evt , listener );
        },
        removeEventListener: function( target , listener ) {
            var evt = this.events[ this.ua ];
            target.removeEventListener( evt , listener );
        },
        getComputedMatrix: function( element ) {
            
            var style = window.getComputedStyle( element );
            var transform = this.ua + 'Transform';
            
            if (style.display === 'none') {
                
                var temp = $.extend( {} , element.style );
                var offset = -1000;
                var css = null;
                var transition = this.ua + 'Transition';

                css = {
                    position: 'fixed',
                    left: offset + 'px',
                    top: offset + 'px',
                    opacity : 0,
                    display : 'block'
                };
                css[transition] = 'none';
                $(this.element).css( css );

                style = $.extend( {} , window.getComputedStyle(this.element) );

                css = {
                    position: temp.position || '',
                    left: temp.left || '',
                    top: temp.top || '',
                    opacity : '',
                    display : 'none'
                };
                css[transition] = temp[transition] || '';
                $(this.element).css( css );
            }

            return style[transform] || style.transform;
        },
    };

    $.extend( hx , {vendorPatch: vendorPatch} );
    
}( hxManager ));



























