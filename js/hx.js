/* ------------------------------------- */
/*        jQuery.hx v0.3.1 (beta)        */
/* ------------------------------------- */


(function( $ ) {


    var config = {
        debug: false
    };

    // ---------------------------------- hxManager ----------------------------------
        var hxManager = function( element ) {
            
            this.element = element;
            this.queue = {};
            this.components = {};
            this.listening = false;
            this._callback = function() {};

            this.keys = {
                config: [ 'property' , 'value' , 'duration' , 'easing' , 'delay' , 'done' ],
                calculated: [ 'width' , 'height' ],
                nonXform: [ 'opacity' ]
            };

            var self = $(this.element);
            self.hxManager = 1;
            $.extend(self, this);
            return self;
        };
        hxManager.prototype = {
            _getComputedStyle: function() {
                var style = window.getComputedStyle(this.element).webkitTransform;
                if (style !== 'none') {
                    this.components['-webkit-transform'] = this.components['-webkit-transform'] || {};
                    this.components['-webkit-transform'].computed = this._parse( style );
                }
            },
            _getTransformType: function( options ) {
                var raw = [];
                var calc = [];
                for (var key in options) {
                    if (this.keys.config.indexOf( key ) < 0) {
                        if (this.keys.calculated.indexOf( key ) >= 0) {
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
                this._getComputedStyle();
                return this.set( property , options , true );
            },
            set: function( property , options , setComputed ) {

                var self = this;

                this.components[property] = this.components[property] || {};

                // prevent computed matrix transform from being applied if it exists and the set method is called directly
                setComputed = typeof setComputed !== 'undefined' ? setComputed : false;
                if (!setComputed && typeof this.components[property].computed !== 'undefined')
                    delete this.components[property].computed;

                
                if (this._getTransformType( options ) === 'raw') {
                    this.components[property] = $.extend( this.components[property] , this._getRawComponents( options ));
                } else {
                    this.components[property] = $.extend( this.components[property] , this._getCalculatedComponents( options ));
                }
                
                if (config.debug) console.log(this.components);

                var styleObject = {
                    value       : this.keys.nonXform.indexOf( property ) < 0 ? this._buildTransformString( this.components[property] ) : this.components[property][property][0],
                    duration    : options.duration ? options.duration + 'ms' : '400ms',
                    easing      : this._easing( options.easing ),
                    delay       : options.delay || 1,
                    done        : options.done || []
                };

                this.queue[ property ] = styleObject;
                if (config.debug) console.log(this.queue);

                var tString = this._buildTransitionString();
                if (config.debug) console.log(tString);

                $(this.element).css('-webkit-transition', tString);
                if (!this.listening) {
                    this.element.addEventListener( 'webkitTransitionEnd' , this );
                    this.listening = true;
                }

                setTimeout(function() {
                    $(self.element).css( property , styleObject.value );
                }, this.queue[ property ].delay);

                return this;

            },
            _getRawComponents: function( options ) {
                var defaults = [];
                var components = {};
                for (var key in options) {
                    if (this.keys.config.indexOf( key ) >= 0) continue;
                    var values = Array.isArray(options[key]) ? options[key] : [ options[key] ];
                    switch (key) {
                        case 'matrix3d':
                            defaults = [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ];
                        case 'matrix':
                            defaults = [ 0 , 0 , 0 , 0 , 0 , 0 ];
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
                        case 'scaleX':
                        case 'scaleY':
                        case 'scaleZ':
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
                    if (this.keys.config.indexOf( key ) >= 0) continue;
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
                    case 'computed':
                        component = values.type;
                        values = values.transform;
                        joinWith = ', ';
                        appendWith = '';
                        break;
                    case 'translate3d':
                        joinWith = 'px, ';
                        appendWith = 'px';
                        break;
                    case 'matrix3d':
                    case 'matrix':
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
                    case 'scaleX':
                    case 'scaleY':
                    case 'scaleZ':
                        joinWith = '';
                        appendWith = '';
                        break;
                }
                return component + '(' + values.join( joinWith ) + appendWith + ')';
            },
            _buildTransformString: function( options ) {
                var xform = [];
                for (var key in options) {
                    if (this.keys.config.indexOf( key ) < 0) {
                        var compString = this._buildComponentString( key , options[key] );
                        xform.push( compString );
                    }
                }
                return xform.join(' ');
            },
            _buildTransitionString: function() {
                var arr = [];
                for (var key in this.queue) {
                    var component = key + ' ' + this.queue[key].easing + ' ' + this.queue[key].duration;
                    if (arr.indexOf( component ) < 0) arr.push( component );
                }
                return arr.join(', ');
            },
            _isHXTransform: function( str ) {
                var types = [ 'translate3d' , 'scale3d' , 'rotate3d' , 'matrix' , 'matrix3d' ];
                var response = false;
                for (var i = 0; i < types.length; i++) {
                    if (str.match( types[i] === 'matrix' ? types[i] + '\\(' : types[i] )) {
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
            _transend: function( event ) {

                var name = event.propertyName;
                
                // fire callbacks for individual properties
                if (typeof this.queue[name] !== 'undefined' && typeof this.queue[name].done[0] === 'function') {
                    for (var i = 0; i < this.queue[name].done.length; i++) {
                        this.queue[name].done[i].call( this , event );
                    }
                }

                // remove the style object from the queue
                delete this.queue[name];

                // check the remaining queue elements
                if (hxManager.objSize( this.queue ) < 1) {
                    if (typeof this._callback === 'function')
                        this._callback.call( this , event );
                    this.element.removeEventListener( 'webkitTransitionEnd' , this );
                    this.listening = false;
                }

            },
            done: function( callback ) {
                this._callback = callback || function() {};
            },
            _easing: function( name ) {
                /* AliceJS */
                var type = {
                    linear: {
                        p1: .25,
                        p2: .25,
                        p3: .75,
                        p4: .75
                    },
                    ease: {
                        p1: .25,
                        p2: .1,
                        p3: .25,
                        p4: 1
                    },
                    'ease-in': {
                        p1: .42,
                        p2: 0,
                        p3: 1,
                        p4: 1
                    },
                    'ease-out': {
                        p1: 0,
                        p2: 0,
                        p3: .58,
                        p4: 1
                    },
                    'ease-in-out': {
                        p1: .42,
                        p2: 0,
                        p3: .58,
                        p4: 1
                    },
                    easeInQuad: {
                        p1: .55,
                        p2: .085,
                        p3: .68,
                        p4: .53
                    },
                    easeInCubic: {
                        p1: .55,
                        p2: .055,
                        p3: .675,
                        p4: .19
                    },
                    easeInQuart: {
                        p1: .895,
                        p2: .03,
                        p3: .685,
                        p4: .22
                    },
                    easeInQuint: {
                        p1: .755,
                        p2: .05,
                        p3: .855,
                        p4: .06
                    },
                    easeInSine: {
                        p1: .47,
                        p2: 0,
                        p3: .745,
                        p4: .715
                    },
                    easeInExpo: {
                        p1: .95,
                        p2: .05,
                        p3: .795,
                        p4: .035
                    },
                    easeInCirc: {
                        p1: .6,
                        p2: .04,
                        p3: .98,
                        p4: .335
                    },
                    easeInBack: {
                        p1: .6,
                        p2: -0.28,
                        p3: .735,
                        p4: .045
                    },
                    easeOutQuad: {
                        p1: .25,
                        p2: .46,
                        p3: .45,
                        p4: .94
                    },
                    easeOutCubic: {
                        p1: .215,
                        p2: .61,
                        p3: .355,
                        p4: 1
                    },
                    easeOutQuart: {
                        p1: .165,
                        p2: .84,
                        p3: .44,
                        p4: 1
                    },
                    easeOutQuint: {
                        p1: .23,
                        p2: 1,
                        p3: .32,
                        p4: 1
                    },
                    easeOutSine: {
                        p1: .39,
                        p2: .575,
                        p3: .565,
                        p4: 1
                    },
                    easeOutExpo: {
                        p1: .19,
                        p2: 1,
                        p3: .22,
                        p4: 1
                    },
                    easeOutCirc: {
                        p1: .075,
                        p2: .82,
                        p3: .165,
                        p4: 1
                    },
                    easeOutBack: {
                        p1: .175,
                        p2: .885,
                        p3: .32,
                        p4: 1.275
                    },
                    easeInOutQuad: {
                        p1: .455,
                        p2: .03,
                        p3: .515,
                        p4: .955
                    },
                    easeInOutCubic: {
                        p1: .645,
                        p2: .045,
                        p3: .355,
                        p4: 1
                    },
                    easeInOutQuart: {
                        p1: .77,
                        p2: 0,
                        p3: .175,
                        p4: 1
                    },
                    easeInOutQuint: {
                        p1: .86,
                        p2: 0,
                        p3: .07,
                        p4: 1
                    },
                    easeInOutSine: {
                        p1: .445,
                        p2: .05,
                        p3: .55,
                        p4: .95
                    },
                    easeInOutExpo: {
                        p1: 1,
                        p2: 0,
                        p3: 0,
                        p4: 1
                    },
                    easeInOutCirc: {
                        p1: .785,
                        p2: .135,
                        p3: .15,
                        p4: .86
                    },
                    easeInOutBack: {
                        p1: .68,
                        p2: -0.55,
                        p3: .265,
                        p4: 1.55
                    },
                    custom: {
                        p1: 0,
                        p2: .35,
                        p3: .5,
                        p4: 1.3
                    },
                    random: {
                        p1: Math.random().toPrecision(3),
                        p2: Math.random().toPrecision(3),
                        p3: Math.random().toPrecision(3),
                        p4: Math.random().toPrecision(3)
                    },
                    easeOutBackMod1: {
                        p1: .7,
                        p2: -1,
                        p3: .5,
                        p4: 2
                    },
                    easeMod1: {
                        p1: .25,
                        p2: .2,
                        p3: .25,
                        p4: 1
                    },
                };
                var b = type[name] ? type[name] : type.ease;
                return 'cubic-bezier(' + b.p1 + ', ' + b.p2 + ', ' + b.p3 + ', ' + b.p4 + ')';
            }
        };
        hxManager.objSize = function( obj ) {
            if (typeof obj !== 'object') return 0;
            var size = 0, key;
            for (key in obj) {
                if (key in obj) size++;
            }
            return size;
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
                vector: {y: this.Height},
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