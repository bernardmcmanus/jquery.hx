/* ------------------------------------- */
/*        jQuery.hx v0.3.2 (beta)        */
/* ------------------------------------- */

(function( $ ) {

    
    $.fn.hx = function( action , options ) {
        var self = this;
        if (!self.hxManager) self = new hxManager( $(this).get(0) );
        if (action) $.fn.hx[action].call(self,options);
        return self;
    };


    $.fn.hx.transform = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 1,
            done: function() {},
            relative: true
        }, options);

        // -------------------------------------------------------------- //
            // prevent individual callbacks from being added
            // there is a bug that may cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        var xForm = $.extend( {} , options , {
            done: [ options.done ]
        });

        delete xForm.relative;

        if (options.relative) {
            this.apply( '-webkit-transform' , xForm );
        } else {
            this.set( '-webkit-transform' , xForm );
        }
    };


    $.fn.hx.fadeOut = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 1,
            done: function() {}
        }, options);

        // -------------------------------------------------------------- //
            // prevent individual callbacks from being added
            // there is a bug that may cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        $(this).css({
            '-webkit-transition': '',
            'opacity': 1,
            'display': 'block'
        });

        var complete = function() {
            $(this).css({
                '-webkit-transition': '',
                'opacity': 1,
                'display': 'none'
            });
        };

        var xForm = $.extend( {} , options , {
            opacity: 0,
            done: [ complete , options.done ]
        });

        this.set( 'opacity' , xForm );
    };


    $.fn.hx.fadeIn = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 1,
            done: function() {}
        }, options);

        // -------------------------------------------------------------- //
            // prevent individual callbacks from being added
            // there is a bug that may cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        $(this).css({
            '-webkit-transition': '',
            'opacity': 0,
            'display': 'block'
        });

        var xForm = $.extend( {} , options , {
            opacity: 1,
            done: [ options.done ]
        });

        this.set( 'opacity' , xForm );
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
        this.Top        = Math.round(this.dims.height * 0.4);
        this.Left       = Math.round(this.dims.width * 0.1);
        this.Width      = this.dims.width - (this.Left * 2);
        this.Height     = Math.round(this.Width * 0.15);
        this.fontSize   = Math.round(this.Height * 0.3);
        this.radius     = Math.round(this.fontSize * 0.8);

        this.options.css = $.extend({
            'text-align'            : 'center',
            'font-size'             : this.fontSize + 'px',
            'color'                 : 'white',
            'position'              : 'absolute',
            'left'                  : this.Left + 'px',
            'top'                   : this.Top + 'px',
            'width'                 : this.Width + 'px',
            'height'                : this.Height + 'px',
            'line-height'           : this.Height + 'px',
            'background-color'      : 'rgba(0,0,0,0.8)',
            '-webkit-border-radius' : this.radius + 'px',
            'z-index'               : 10000,
            'display'               : 'none'
        }, this.options.css);

        var overlay = document.createElement('div');
        $(overlay)
            .addClass( 'hx_notify' )
            .css( this.options.css )
            .html( this.options.message )
            .appendTo( $(this) );

        
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





















