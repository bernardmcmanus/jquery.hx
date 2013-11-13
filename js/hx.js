/* ------------------------------------- */
/*         jQuery.hx v0.1 (beta)         */
/* ------------------------------------- */


(function( $ ) {


    var config = {
        debug: false
    };

    // ---------------------------------- hxManager ----------------------------------
        var hxManager = function( element ) {
            this.element = element;
            this.props = {};
            this.queue = [];
            this.listening = false;
            this.callback = function() {};

            var self = $(this.element);
            self.hxManager = 1;
            $.extend(self, this);
            return self;
        };
        hxManager.prototype = {
            handleEvent: function( e ) {
                this._transend( e );
            },
            set: function( name , obj ) {

                var self = this;
                if (this.queue.indexOf( obj.property ) < 0) this.queue.push( obj.property );
                if (config.debug) console.log(this.queue);

                obj = {
                    property: obj.property,
                    value: obj.value,
                    duration: obj.duration || 400,
                    ease: obj.ease || 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                    delay: obj.delay || 1,
                    done: obj.done || []
                };

                this.props[ name ] = obj;
                if (config.debug) console.log(this.props);

                var tString = this._buildTransitionString();
                if (config.debug) console.log(tString);

                $(this.element).css('-webkit-transition', tString);
                if (!this.listening) {
                    this.element.addEventListener( 'webkitTransitionEnd' , this );
                    this.listening = true;
                }

                if (obj.property === '-webkit-transform') {
                    var styleStr = this._buildTransformString();
                } else {
                    var styleStr = obj.value;
                }
                if (config.debug) console.log(styleStr);

                setTimeout(function() {
                    $(self.element).css( obj.property , styleStr );
                }, this.props[ name ].delay);

            },
            _buildTransitionString: function() {
                var arr = [];
                for (var key in this.props) {
                    var component = this.props[key].property + ' ' + this.props[key].ease + ' ' + this.props[key].duration;
                    if (arr.indexOf( component ) < 0) arr.push( component );
                }
                return arr.join(', ');
            },
            _buildTransformString: function() {
                var arr = [];
                for (var key in this.props) {
                    if (this.props[key].property === '-webkit-transform') arr.push(this.props[key].value);
                }
                return arr.join(' ');
            },
            _isHXTransform: function( str ) {
                var types = [ 'translate3d' , 'scale3d' , 'rotate3d' , 'matrix' , 'matrix3d' ];
                var response = false;
                for (var i = 0; i < types.length; i++) {
                    if (str.match( types[i] !== 'matrix' ? types[i] : types[i] + '\\(' )) {
                        response = types[i];
                        break;
                    }
                }
                return response;
            },
            _parse: function( str ) {
                var type = this._isHXTransform( str );
                if (!str || !type) return {};
                str = str.replace(/px/g, '').replace(/ /g, '').replace(/\)/g, '').split('(')[1].split(',');
                var map = Array.prototype.map;
                str = map.call( str , function(i) {return parseFloat(i, 10)} );
                return {
                    type: type,
                    transform: str
                };
            },
            _transend: function( e ) {

                var name = e.propertyName;
                
                // fire callbacks for individual properties
                for (var key in this.props) {
                    if (name === this.props[key].property && this.props[key].done) {
                        for (var i = 0; i < this.props[key].done.length; i++) {
                            this.props[key].done[i].call( this , e );
                        }
                        delete this.props[key].done;
                    }
                }

                // check the animation queue
                var index = this.queue.indexOf( name );
                this.queue.splice(index, 1);
                if (this.queue.length < 1) {
                    if (this.callback) this.callback.call( this , e );
                    this.element.removeEventListener( 'webkitTransitionEnd' , this );
                    this.listening = false;
                }
            },
            done: function( callback ) {
                this.callback = callback || function() {};
            }
        };
    // -------------------------------------------------------------------------------
 

    $.fn.hx = function( action , options ) {
        var self = this;
        if (!self.hxManager) self = new hxManager( $(this).get(0) );
        if (action) $.fn.hx[action].call(self,options);
        return self;
    };


    $.fn.hx.scale = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 1,
            vector: {},
            done: function() {}
        }, options);

        // -------------------------------------------------------------- //
            // prevent individual callbacks from being added
            // there is a bug that will cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        options.vector = $.extend({x: 1, y: 1, z: 1}, options.vector);

        try {
            this.set( 'scale3d' , {
                property: '-webkit-transform',
                value: 'scale3d(' + options.vector.x + ', ' + options.vector.y + ', ' + options.vector.z + ')',
                duration: options.duration + 'ms',
                ease: options.ease,
                delay: options.delay,
                done: [options.done]
            });
        } catch( err ) {
            $(this).css({
                '-webkit-transition': 'webkit-transform ' + options.duration + 'ms ' + options.easing,
                '-webkit-transform': 'translate3d(' + options.vector.x + 'px, ' + options.vector.y + 'px, ' + options.vector.z + 'px)'
            });
        }

    };


    $.fn.hx.translate = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 1,
            vector: {},
            done: function() {}
        }, options);

        // -------------------------------------------------------------- //
            // prevent individual callbacks from being added
            // there is a bug that will cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        options.vector = $.extend({x: 0, y: 0, z: 0}, options.vector);

        try {
            this.set( 'translate3d' , {
                property: '-webkit-transform',
                value: 'translate3d(' + options.vector.x + 'px, ' + options.vector.y + 'px, ' + options.vector.z + 'px)',
                duration: options.duration + 'ms',
                ease: options.ease,
                delay: options.delay,
                done: [options.done]
            });
        } catch( err ) {
            $(this).css({
                '-webkit-transition': 'webkit-transform ' + options.duration + 'ms ' + options.easing,
                '-webkit-transform': 'translate3d(' + options.vector.x + 'px, ' + options.vector.y + 'px, ' + options.vector.z + 'px)'
            });
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
            // there is a bug that will cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        $(this).css({
            '-webkit-transition': '',
            'opacity': 1,
            'display': 'block'
        });

        var complete = function() {
            $(this.element).css('display', 'none');
            this.set( 'opacity' , {
                property: 'opacity',
                value: 1,
                duration: '0ms'
            });
        };

        try {
            this.set( 'opacity' , {
                property: 'opacity',
                value: 0,
                duration: options.duration + 'ms',
                ease: options.easing,
                delay: options.delay,
                done: [options.done, complete]
            });
        } catch( err ) {
            $(this).css({
                '-webkit-transition': 'opacity ' + options.duration + 'ms ' + options.easing,
                'opacity': 0
            });
        }

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
            // there is a bug that will cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        $(this).css({
            '-webkit-transition': '',
            'opacity': 0,
            'display': 'block'
        });

        try {
            this.set( 'opacity' , {
                property: 'opacity',
                value: 1,
                duration: options.duration + 'ms',
                ease: options.easing,
                delay: options.delay,
                done: [options.done]
            });
        } catch( err ) {
            $(this).css({
                '-webkit-transition': 'opacity ' + options.duration + 'ms ' + options.easing,
                'opacity': 1
            });
        }

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

        this.overlay = new hxManager( overlay );

        
        this.open = function() {
            this.overlay.hx( 'fadeIn' , {
                duration: 300
            })
            .hx( 'translate' , {
                vector: {y: -this.Height},
                duration: 300
            })
            .done( this.options.onOpen );
        };

        
        this.close = function() {
            this.overlay.hx( 'fadeOut' , {
                duration: 300
            })
            .hx( 'translate' , {
                duration: 300
            })
            .done(function() {
                self.options.onClose( e );
                $(self.overlay.element).remove();
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