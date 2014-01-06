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
            
            var element = manager.element;
            var style = window.getComputedStyle( element );
            var transform = this.ua + 'Transform';
            
            // this block should no longer be necessary
            // since elements are being prepped at init
            
            /*if (style.display === 'none') {
                
                var temp = $.extend( {} , element.style );
                var transition = this.ua + 'Transition';
                var flow = new hxManager.workflow();

                function task1() {
                    manager.setTransition( 'opacity' , {
                        duration: 0,
                        delay: 0
                    });
                    flow.progress();
                }

                function task2() {
                    $(element).css({
                        position: 'fixed',
                        opacity : 0,
                        display : 'block'
                    });
                    flow.progress();
                }

                function task3() {
                    style = $.extend( {} , window.getComputedStyle( element ));
                    flow.progress();
                }

                function task4() {
                    $(element).css({
                        position: temp.position || '',
                        opacity : '',
                        display : 'none'
                    });
                    flow.progress();
                }

                flow.add( task1 , this );
                flow.add( task2 , this );
                flow.add( task3 , this );
                flow.add( task4 , this );

                flow.run();
            }*/

            return style[transform] || style.transform;
        }
    };

    $.extend( hx , {vendorPatch: vendorPatch} );
    
}( hxManager ));



























