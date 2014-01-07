(function( $ ) {

    
    $.fn.hx = function( action , options ) {
        
        var self = this;
        
        if (!self.hxManager)
            self = new hxManager( $(this).get(0) );
        
        if (action)
            $.fn.hx[action].call( self , options );

        return self;
    };


    var mapComponentKeys = function( obj ) {
        var map = {
            translate: 'translate3d',
            scale: 'scale3d',
            rotate: 'rotate3d'
        };
        for (var key in obj) {
            if (!map[key]) continue;
            obj[map[key]] = obj[key];
            delete obj[key];
        }
        return obj;
    };


    $.fn.hx.transform = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 0,
            done: function() {},
            relative: true
        }, options);

        // -------------------------------------------------------------- //
            // prevent individual callbacks from being added
            // there is a bug that may cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        var xForm = mapComponentKeys($.extend( {} , options , {
            done: [ options.done ]
        }));

        delete xForm.relative;

        if (options.relative) {
            this.apply( 'transform' , xForm );
        } else {
            this.set( 'transform' , xForm );
        }
    };


    $.fn.hx.fadeOut = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 0,
            done: function() {},
            pseudoHide: true
        }, options);

        // -------------------------------------------------------------- //
            // prevent individual callbacks from being added
            // there is a bug that may cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        function trueHide() {

            var flow = new hxManager.workflow();

            function task1() {
                this.setTransition( 'opacity' , {
                    duration: 0,
                    delay: 0
                });
                flow.progress();
            }

            function task2() {
                this.element.style.display = 'none';
                this.element.style.opacity = 1;
                this._setHXDisplay( this.element , 'none' );
                flow.progress();
            }

            flow.add( task1 , this );
            flow.add( task2 , this );

            flow.run();
        }

        function complete() {
            
            if (options.pseudoHide) {
                
                hxManager.pseudoHide( this.element );
                
            } else {

                trueHide.call( this );
            }
        }

        var xForm = $.extend( {} , options , {
            opacity: 0,
            done: [ complete , options.done ]
        });

        delete xForm.pseudoHide;

        this.set( 'opacity' , xForm );
    };


    $.fn.hx.fadeIn = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 0,
            done: function() {}
        }, options);

        // -------------------------------------------------------------- //
            // prevent individual callbacks from being added
            // there is a bug that may cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        function complete() {
            hxManager.pseudoShow( this.element );
        }

        var xForm = $.extend( {} , options , {
            opacity: 1,
            done: [ complete , options.done ]
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





















