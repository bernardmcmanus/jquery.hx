(function( $ ) {

    
    $.fn.hx.draggable = function( options ) {


        options = $.extend({
            lockAxis: {
                x: 0,
                y: 0
            }
        }, (options || {}));


        var draggable = {
            options: options,
            touch: null
        };


        var _touchStart = function( e ) {
            
            e = e.originalEvent;
            e.preventDefault();
            
            _setTouches.call( this );
            _startListen.call( this );
            
            var d = this.draggable;
            var client = _getEventPosition( e );
            
            d.touch.x[0] = d.touch.x[2] = client.x;
            d.touch.y[0] = d.touch.y[2] = client.y;
            d.touch.t[0] = e.timeStamp;
            
        }.bind( this );


        var _touchMove = function( e ) {

            e = e.originalEvent;
            e.preventDefault();

            var d = this.draggable;
            var client = _getEventPosition( e );

            if (!d.touch)
                return;

            d.touch.x[1] = d.touch.x[2];
            d.touch.y[1] = d.touch.y[2];
            d.touch.t[1] = e.timeStamp;

            d.touch.x[2] = client.x;
            d.touch.y[2] = client.y;

            var dx = d.options.lockAxis.x ? 0 : (d.touch.x[2] - d.touch.x[1]);
            var dy = d.options.lockAxis.y ? 0 : (d.touch.y[2] - d.touch.y[1]);

            this.apply( 'transform' , {
                translate3d: {x: dx, y: dy},
                duration: 0,
                fallback: false
            });

        }.bind( this );


        var _touchEnd = function( e ) {

            e = e.originalEvent;
            e.preventDefault();

            _stopListen.call( this );

            var d = this.draggable;
            
            if (!d.touch)
                return;

            d.touch.t[2] = e.timeStamp;

        }.bind( this );


        function _setTouches() {
            this.draggable.touch = {
                x: [],
                y: [],
                t: []
            };
        }


        function _startListen() {
            $(this.element).on( 'touchmove' , _touchMove );
            $(this.element).on( 'touchend' , _touchEnd );
            $(window).on( 'mousemove' , _touchMove );
            $(window).on( 'mouseup' , _touchEnd );
        }


        function _stopListen() {
            $(this.element).off( 'touchmove' , _touchMove );
            $(this.element).off( 'touchend' , _touchEnd );
            $(window).off( 'mousemove' , _touchMove );
            $(window).off( 'mouseup' , _touchEnd );
        }


        function _getEventPosition( e ) {

            var client = {};

            switch (e.type) {
                case 'touchstart':
                case 'touchmove':
                    client.x = e.touches[0].clientX;
                    client.y = e.touches[0].clientY;
                    break;

                case 'mousedown':
                case 'mousemove':
                    client.x = e.clientX;
                    client.y = e.clientY;
                    break;
            }

            return client;
        }


        // add the init event listeners
        $(this.element).on( 'touchstart mousedown' , _touchStart );

        // extend the hxManager object with the draggable extenstion info
        $.extend( this , {draggable: draggable} );

    };


    $.fn.hx.notify = function( options ) {

        // prevent duplicate notifications
        if ($(this).find('.hx_notify').length > 0) return;

        var self = this;

        this.options = $.extend({
            message: '',
            timeout: 1500,
            css: {},
            onOpen: function() {},
            onClose: function() {}
        }, (options || {}));

        this.dims       = $(this).get(0).getBoundingClientRect();
        this.Left       = this.dims.left + Math.round(this.dims.width * 0.1);
        this.Width      = this.dims.width - ((this.Left - this.dims.left) * 2);
        this.Height     = Math.round(this.Width * 0.15);
        this.fontSize   = Math.round(this.Height * 0.3);
        this.radius     = Math.round(this.fontSize * 0.8);
        this.padding    = Math.round(this.Height * 0.3);

        this.Width -= this.padding * 2;

        this.options.css = $.extend({
            'text-align'            : 'center',
            'font-size'             : this.fontSize + 'px',
            'color'                 : 'white',
            'position'              : 'fixed',
            'left'                  : this.Left + 'px',
            'top'                   : 0,
            'width'                 : this.Width + 'px',
            'line-height'           : 1.5,
            'padding'               : this.padding + 'px',
            'background-color'      : 'rgba(0,0,0,0.8)',
            '-webkit-border-radius' : this.radius + 'px',
            'z-index'               : 10000,
            'opacity'               : 0
        }, this.options.css);

        var overlay = document.createElement('div');
        $(overlay)
            .addClass( 'hx_notify' )
            .css( this.options.css )
            .html( this.options.message )
            .appendTo( $(this) );

        // set the top position
        var h = overlay.getBoundingClientRect().height;
        var t = Math.round(($(window).height() - h) / 2);
        this.Top = this.options.css.top || t >= h ? t : h;
        $(overlay).css( 'top' , this.Top + 'px' );
        
        
        this.overlay = $(overlay);
        
        
        this.open = function() {
            this.overlay
            .hx( 'fadeIn' , {
                duration: 300
            })
            .hx( 'transform' , {
                translate3d: [ 0 , -this.Height ]
            })
            .done( this.options.onOpen );
        };

        
        this.close = function() {
            this.overlay
            .hx( 'transform' , {
                translate3d: 0,
                relative: false
            })
            .hx( 'fadeOut' , {
                duration: 300
            })
            .done(function( e ) {
                self.options.onClose( e );
                $(this.element).remove();
            });
        };


        // open the notification
        this.open();


        // set the timeout to close the notification
        if (this.options.timeout > 0) {
            setTimeout(function() {
                self.close();
            }, this.options.timeout);
        }

    };

 
}( jQuery ));





















