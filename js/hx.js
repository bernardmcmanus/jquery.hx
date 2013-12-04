/* ------------------------------------- */
/*         jQuery.hx v0.2 (beta)         */
/* ------------------------------------- */


(function( $ ) {


    var config = {
        debug: false
    };

    // ---------------------------------- hxManager ----------------------------------
        var hxManager = function( element ) {
            this.element = element;
            this.props = {};
            this.transform = [];
            this.queue = [];
            this.listening = false;
            this._callback = function() {};

            this.configKeys = [ 'property' , 'value' , 'duration' , 'easing' , 'delay' , 'done' ];
            this.calculatedKeys = [ 'width' , 'height' ];
            this.nonTransformKeys = [ 'opacity' ];

            var self = $(this.element);
            self.hxManager = 1;
            $.extend(self, this);
            return self;
        };
        hxManager.prototype = {
            _get: function() {
                var style = window.getComputedStyle(this.element).webkitTransform;
                if (style !== 'none') {
                    this.transform.push( style );
                }
            },
            _getTransformType: function( options ) {
                var raw = [];
                var calc = [];
                for (var key in options) {
                    if (this.configKeys.indexOf( key ) < 0) {
                        if (this.calculatedKeys.indexOf( key ) >= 0) {
                            calc.push( key );
                        } else {
                            raw.push( key );
                        }
                    }
                    if (raw.length > 0 && calc.length > 0)
                        throw 'Error: Incompatible transform properties.';
                }
                return calc.length > 0 ? 'calc' : 'raw';
            },
            handleEvent: function( e ) {
                this._transend( e );
            },
            setOrigin: function( x , y ) {
                x = (x && typeof x !== 'undefined') ? x : 50;
                y = (y && typeof y !== 'undefined') ? y : 50;
                $(this.element).css({
                    '-webkit-transform-origin': x + '% ' + y + '%'
                });
                this.transformOrigin = {
                    x: x,
                    y: y
                };
            },
            _calcWidthScale: function( width ) {
                return width / this.element.getBoundingClientRect().width;
            },
            _calcHeightScale: function( height ) {
                return height / this.element.getBoundingClientRect().height;
            },
            _getFixedOrigin: function( scale ) {

                var defined = $.extend({}, window.getComputedStyle( this.element ));
                var computed = this.element.getBoundingClientRect();

                defined.width = parseInt(defined.width, 10);
                defined.height = parseInt(defined.height, 10);

                var sx = ((computed.width - defined.width) * scale[0]) / 2;
                var sy = ((computed.height - defined.height) * scale[1]) / 2;

                var dx = ((computed.width * scale[0] - defined.width) / 2) - sx;
                var dy = ((computed.height * scale[1] - defined.height) / 2) - sy;
                
                return [ dx , dy ];
            },
            apply: function( property , options ) {
                this._get();
                return this.set( property , options );
            },
            set: function( property , options ) {

                var self = this;
                if (this.queue.indexOf( property ) < 0) this.queue.push( property );
                if (config.debug) console.log(this.queue);

                var components = {};
                
                if (this._getTransformType( options ) === 'raw') {
                    components = this._getRawComponents( options );
                } else {
                    components = this._getCalculatedComponents( options );
                }
                
                if (config.debug) console.log(components);

                var styleObject = {
                    value       : this.nonTransformKeys.indexOf( property ) < 0 ? this._buildTransformString( components ) : components[property][0],
                    duration    : options.duration ? options.duration + 'ms' : '400ms',
                    easing      : options.easing || 'cubic-bezier(0.25,0.1,0.25,1)',
                    delay       : options.delay || 1,
                    done        : options.done || []
                };

                this.props[ property ] = styleObject;
                if (config.debug) console.log(this.props);

                var tString = this._buildTransitionString();
                if (config.debug) console.log(tString);

                $(this.element).css('-webkit-transition', tString);
                if (!this.listening) {
                    this.element.addEventListener( 'webkitTransitionEnd' , this );
                    this.listening = true;
                }

                setTimeout(function() {
                    $(self.element).css( property , styleObject.value );
                }, this.props[ property ].delay);

                return this;

            },
            _getRawComponents: function( options ) {
                var defaults = [];
                var components = {};
                for (var key in options) {
                    if (this.configKeys.indexOf( key ) >= 0) continue;
                    var values = Array.isArray(options[key]) ? options[key] : [ options[key] ];
                    switch (key) {
                        case 'translate3d':
                            defaults = [ 0 , 0 , 0 ];
                            break;
                        case 'scale3d':
                            defaults = [ 1 , 1 , 1 ];
                            break;
                        case 'rotate3d':
                            defaults = [ 0 , 0 , 0 , 0 ];
                            break;
                        case 'rotateX':
                        case 'rotateY':
                        case 'rotateZ':
                        case 'opacity':
                            defaults = [ 0 ];
                            break;
                    }
                    values = $.extend( defaults , values );
                    components[key] = values;
                }
                return components;
            },
            _getCalculatedComponents: function( options ) {
                var defaults = [];
                var components = {};
                for (var key in options) {
                    if (this.configKeys.indexOf( key ) >= 0) continue;
                    switch (key) {
                        case 'width':
                            var scaleX = this._calcWidthScale( options[key] );
                            components.translate3d = components.translate3d || [ 0 , 0 , 0 ];
                            components.scale3d = components.scale3d || [ 1 , 1 , 1 ];
                            components.translate3d[0] = components.translate3d[0] + this._getFixedOrigin( [scaleX, 1] )[0];
                            components.scale3d[0] = components.scale3d[0] * scaleX;
                            break;
                        case 'height':
                            var scaleY = this._calcHeightScale( options[key] );
                            components.translate3d = components.translate3d || [ 0 , 0 , 0 ];
                            components.scale3d = components.scale3d || [ 1 , 1 , 1 ];
                            components.translate3d[1] = components.translate3d[1] + this._getFixedOrigin( [1, scaleY] )[1];
                            components.scale3d[1] = components.scale3d[1] * scaleY;
                            break;
                    }
                }
                return components;
            },
            _buildComponentString: function( component , values ) {
                var joinWith = '';
                var appendWith = '';
                switch (component) {
                    case 'translate3d':
                        joinWith = 'px, ';
                        appendWith = 'px';
                        break;
                    case 'scale3d':
                        joinWith = ', ';
                        appendWith = '';
                        break;
                    case 'rotate3d':
                        joinWith = ', ';
                        appendWith = 'deg';
                        break;
                    case 'rotateX':
                    case 'rotateY':
                    case 'rotateZ':
                        joinWith = '';
                        appendWith = 'deg';
                        break;
                }
                return component + '(' + values.join( joinWith ) + appendWith + ')';
            },
            _buildTransformString: function( options ) {
                for (var key in options) {
                    if (this.configKeys.indexOf( key ) < 0) {
                        var compString = this._buildComponentString( key , options[key] );
                        this.transform.push( compString );
                    }
                }
                return this.transform.join(' ');
            },
            _buildTransitionString: function() {
                var arr = [];
                for (var key in this.props) {
                    var component = key + ' ' + this.props[key].easing + ' ' + this.props[key].duration;
                    if (arr.indexOf( component ) < 0) arr.push( component );
                }
                return arr.join(', ');
            },
            /*_isHXTransform: function( str ) {
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
            },*/
            _transend: function( e ) {

                var name = e.propertyName;
                
                // fire callbacks for individual properties
                for (var key in this.props) {
                    if (name === key && typeof this.props[key].done[0] === 'function') {
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
                    if (this._callback) this._callback.call( this , e );
                    this.element.removeEventListener( 'webkitTransitionEnd' , this );
                    this.listening = false;
                }

            },
            done: function( callback ) {
                this._callback = callback || function() {};
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
            // there is a bug that may cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        options.vector = $.extend({x: 1, y: 1, z: 1}, options.vector);

        // If one of the vector componenets is zero, make it really small but not quite zero
        options.vector.x = options.vector.x === 0 ? 0.000001 : options.vector.x;
        options.vector.y = options.vector.y === 0 ? 0.000001 : options.vector.y;
        options.vector.z = options.vector.z === 0 ? 0.000001 : options.vector.z;

        this.apply( '-webkit-transform' , {
            scale3d: [ options.vector.x , options.vector.y , options.vector.z ],
            duration: options.duration,
            easing: options.easing,
            delay: options.delay,
            done: [options.done]
        });

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
            // there is a bug that may cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        options.vector = $.extend({x: 0, y: 0, z: 0}, options.vector);

        this.apply( '-webkit-transform' , {
            translate3d: [ options.vector.x , options.vector.y , options.vector.z ],
            duration: options.duration,
            easing: options.easing,
            delay: options.delay,
            done: [options.done]
        });

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

        this.set( 'opacity' , {
            opacity: 0,
            duration: options.duration,
            easing: options.easing,
            delay: options.delay,
            done: [ complete , options.done ]
        });

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

        this.set( 'opacity' , {
            opacity: 1,
            duration: options.duration,
            easing: options.easing,
            delay: options.delay,
            done: [options.done]
        });

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





















