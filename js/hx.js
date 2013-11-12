(function( $ ) {


    var config = {
        debug: false
    };

    // ---------------------------------- hxManager ----------------------------------
        var hxManager = function( element ) {
            this.element = element;
            this.map = {
                '-webkit-transform': null,
                opacity: null
            };
            this.props = {};
            this._get();

            var self = $(this.element);
            self.hxManager = 1;
            $.extend(self, this);
            return self;
        };
        hxManager.prototype = {
            _get: function() {
                var style = window.getComputedStyle( this.element );
                for (var key in this.map) {
                    if (style[key] !== '' && style[key] !== 'none') {
                        this.props[key] = {
                            value: style[key],
                            duration: (parseFloat((style.webkitTransitionDuration || 0), 10) * 1000) + 'ms',
                            ease: style.webkitTransitionTimingFunction
                        };
                    }
                }
            },
            handleEvent: function( e ) {
                this._transend( e );
            },
            set: function( name , obj ) {

                var self = this;

                obj = {
                    value: obj.value,
                    duration: obj.duration,
                    ease: obj.ease || 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                    delay: obj.delay || 1,
                    done: obj.done || {done: function() {}}
                };

                this.props[name] = obj;

                var tString = this._buildTransitionString();
                //console.log(tString);

                $(this.element).css('-webkit-transition', tString);
                $(this.element).get(0).removeEventListener( 'webkitTransitionEnd' , this );
                $(this.element).get(0).addEventListener( 'webkitTransitionEnd' , this );

                setTimeout(function() {
                    $(self.element).css( name , self.props[name].value );
                }, this.props[name].delay);

            },
            _buildTransitionString: function() {
                tArray = [];
                for (var key in this.props) {
                    tArray.push(key + ' ' + this.props[key].ease + ' ' + this.props[key].duration);
                }
                return tArray.join(', ');
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
                if (this.props[name]) {
                    for (var key in this.props[name].done) {
                        this.props[name].done[key].call( this , e );
                        delete this.props[name].done[key];
                    }
                }
            }
        };
    // -------------------------------------------------------------------------------
 

    $.fn.hx = function( action , options ) {
        var self = this;
        if (!self.hxManager) self = new hxManager( $(this).get(0) );
        $.fn.hx[action].call(self,options);
        return self;
    };


    $.fn.hx.transform = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            delay: 1,
            size: {},
            position: {},
            translate: {},
            rotate: {},
            scale: {},
            done: function() {}
        }, options);

        options.size = $.extend({
            x: parseInt(window.getComputedStyle($(this).get(0)).width, 10),
            y: parseInt(window.getComputedStyle($(this).get(0)).height, 10)
        }, options.size);
        options.position = $.extend({
            x: parseInt(window.getComputedStyle($(this).get(0)).left, 10),
            y: parseInt(window.getComputedStyle($(this).get(0)).top, 10)
        }, options.position);
        options.translate = $.extend({x: 0, y: 0, z: 0}, options.translate);
        options.rotate = $.extend({x: 0, y: 0, z: 0}, options.rotate);
        options.scale = $.extend({x: 1, y: 1, z: 1}, options.scale);

        if (options.delay < 1) options.delay = 1;
        var translation = getTranslateVector( $(this).get(0).style.webkitTransform );

        var complete = function( event ) {
            $(this).css({
                '-pointer-events': 'auto'
            });
            $(this).off( 'webkitTransitionEnd' );
        };

        var rotation = {};
        rotation.x = getRotationMatrix( 'x' , options.rotate.x );
        rotation.y = getRotationMatrix( 'y' , options.rotate.y );
        rotation.z = getRotationMatrix( 'z' , options.rotate.z );

        // ------------------------------- sylvester -------------------------------
            rotation.nested = {};
            rotation.nested.x = getConvertedMatrix( rotation.x , 'nested' );
            rotation.nested.y = getConvertedMatrix( rotation.y , 'nested' );
            rotation.nested.z = getConvertedMatrix( rotation.z , 'nested' );

            rotation.sylvester = {};
            rotation.sylvester.x = $M( rotation.nested.x );
            rotation.sylvester.y = $M( rotation.nested.y );
            rotation.sylvester.z = $M( rotation.nested.z );

            var rotationFinal = {};
            rotationFinal.sylvester = rotation.sylvester.x.multiply( rotation.sylvester.y ).multiply( rotation.sylvester.z );
            rotationFinal.inline = getConvertedMatrix( rotationFinal.sylvester.elements , 'inline' );
        // -------------------------------------------------------------------------

        var transformMatrix = getTransformMatrix( rotationFinal.inline , options.translate , options.scale );
        if (config.debug) console.log(transformMatrix);

        if (options.invert) {
            var inverseTransform = $.extend( [] , transformMatrix );
            inverseTransform = getInverseTransform( inverseTransform );
            if (config.debug) console.log(inverseTransform);
        }

        var self = this;
        setTimeout(function() {
            $(self).css({
                'webkit-transition-timing-function': options.easing,
                '-webkit-transition-duration': options.duration + 'ms'
            });
            if (options.invert) {
                $(self).find(options.invert).css({
                    'webkit-transition-timing-function': options.easing,
                    '-webkit-transition-duration': options.duration + 'ms'
                });
            }
            $(self).on( 'webkitTransitionEnd' , complete );
            $(self).on( 'webkitTransitionEnd' , options.done );

            setTimeout(function() {
                $(self).css({
                    '-pointer-events': 'none',
                    '-webkit-transform': 'matrix3d(' + transformMatrix + ')',
                    'left': options.position.x + 'px',
                    'top': options.position.y + 'px',
                    'width': options.size.x + 'px',
                    'height': options.size.y + 'px'
                });
                if (options.invert) {
                    $(self).find(options.invert).css({
                        '-pointer-events': 'none',
                        '-webkit-transform': 'matrix3d(' + inverseTransform + ')'
                    });
                }
            }, options.delay);
        }, 1);
    };


    var getInverseTransform = function( matrix ) {
        var a = getConvertedMatrix(matrix, 'nested');
        var b = $M(a);
        var c = b.inverse();
        var d = getConvertedMatrix(c.elements, 'inline');
        return d;
    };


    var getConvertedMatrix = function( matrix , form ) {
        var result = [];
        if (form === 'nested') {
            result = [
                [ 0 , 0 , 0 , 0 ],
                [ 0 , 0 , 0 , 0 ],
                [ 0 , 0 , 0 , 0 ],
                [ 0 , 0 , 0 , 0 ]
            ];
            for (var i = 0; i < 16; i++) {
                var j = Math.floor(i/4);
                var k = i - (Math.floor(i/4) * 4);
                result[j][k] = matrix[i];
            }
        } else if (form === 'inline') {
            for (var i = 0; i < 16; i++) {
                var j = Math.floor(i/4);
                var k = i - (Math.floor(i/4) * 4);
                result[i] = matrix[j][k];
            }
        }
        return result;
    };


    var getRotationMatrix = function( axis , angle , get3d ) {

        get3d = (get3d === undefined || get3d === null) ? true : get3d;

        var fixAt = 14;
        var matrix3d = [];
        var x = axis === 'x' ? 1 : 0;
        var y = axis === 'y' ? 1 : 0;
        var z = axis === 'z' ? 1 : 0;
        var a = angle * (Math.PI / 180);

        matrix3d[0]  = parseFloat((  1 + (1 - Math.cos(a)) * (Math.pow(x,2) - 1)  ).toFixed(fixAt));
        matrix3d[1]  = parseFloat((  z * Math.sin(a) + x * y * (1 - Math.cos(a))   ).toFixed(fixAt));
        matrix3d[2]  = parseFloat((  -y * Math.sin(a) + x * z * (1 - Math.cos(a))  ).toFixed(fixAt));
        matrix3d[3]  = 0;

        matrix3d[4]  = parseFloat((  -z * Math.sin(a) + x * y * (1 - Math.cos(a))  ).toFixed(fixAt));
        matrix3d[5]  = parseFloat((  1 + (1 - Math.cos(a)) * (Math.pow(y,2) - 1)  ).toFixed(fixAt));
        matrix3d[6]  = parseFloat((  x * Math.sin(a) + y * z * (1 - Math.cos(a))  ).toFixed(fixAt));
        matrix3d[7]  = 0;

        matrix3d[8]  = parseFloat((  y * Math.sin(a) + x * z + (1 - Math.cos(a))  ).toFixed(fixAt));
        matrix3d[9]  = parseFloat((  -x * Math.sin(a) + y * z * (1 - Math.cos(a))  ).toFixed(fixAt));
        matrix3d[10] = parseFloat((  1 + (1 - Math.cos(a)) * (Math.pow(z,2) - 1)  ).toFixed(fixAt));
        matrix3d[11] = 0;

        matrix3d[12] = 0;
        matrix3d[13] = 0;
        matrix3d[14] = 0;
        matrix3d[15] = 1;

        if (get3d) {
            return matrix3d;
        } else {
            return [ matrix3d[0] , matrix3d[1] , matrix3d[4] , matrix3d[5] , matrix3d[12] , matrix3d[13] ];
        }
    };


    var getTransformMatrix = function( matrix3d , translation , scale ) {

        var tX = translation.x || 0;
        var tY = translation.y || 0;
        var tZ = translation.z || 0;

        var sX = scale.x || 1;
        var sY = scale.y || 1;
        var sZ = scale.z || 1;

        matrix3d[12] = tX;
        matrix3d[13] = tY;
        matrix3d[14] = tZ;

        matrix3d[0] = matrix3d[0] * sX;
        matrix3d[5] = matrix3d[5] * sY;
        matrix3d[10] = matrix3d[10] * sZ;

        return matrix3d;
    };


    /*var getTransformMatrix = function( style ) {

        var matrix2d = [
            0 , 0 , 0 ,
            0 , 0 , 0 ,
        ];

        var matrix3d = [
            0 , 0 , 0 , 0 ,
            0 , 0 , 1 , 0 ,
            0 , -1 , 0 , 0 ,
            0 , 0 , 0 , 0
        ];

        //console.log(style);
        if (style.replace('matrix', '') !== style) {
            style = style.replace(/px/g, '').replace(/ /g, '').replace(/\)/g, '').split('(')[1].split(',');
            var map = Array.prototype.map;
            style = map.call( style , function(i) {return parseFloat(i, 10)} );
        }
        
        if (!Array.isArray(style)) return matrix3d;

        for (var i = 0; i < matrix3d.length; i++) {
            if (style[i]) matrix3d[i] = style[i];
        }

        return matrix3d;
    };*/


    var getTranslateVector = function( transform ) {
        if (transform) {
            transform = transform.replace(/px/g, '').replace(/ /g, '').replace(/\)/g, '').split('(')[1].split(',');
            var map = Array.prototype.map;
            transform = map.call( transform , function(i) {return parseInt(i, 10)} );
        }
        return {
            x: transform[0] || 0,
            y: transform[1] || 0,
            z: transform[2] || 0
        };
    };


    $.fn.hx.translate = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 1,
            vector: {},
            done: function() {}
        }, options);

        options.vector = $.extend({x: 0, y: 0, z: 0}, options.vector);

        try {
            this.set( '-webkit-transform' , {
                value: 'translate3d(' + options.vector.x + 'px, ' + options.vector.y + 'px, ' + options.vector.z + 'px)',
                duration: options.duration + 'ms',
                ease: options.ease,
                delay: options.delay,
                done: {
                    done: options.done
                }
            });
        } catch( err ) {
            $(this).css({
                '-webkit-transition': 'translate3d ' + options.duration + 'ms ' + options.easing,
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

        $(this).css({
            '-webkit-transition': '',
            'opacity': 1,
            'display': 'block'
        });

        var complete = function() {
            $(this.element).css({
                '-webkit-transition': '',
                'opacity': 1,
                'display': 'none'
            });
        };

        try {
            this.set( 'opacity' , {
                value: 0,
                duration: options.duration + 'ms',
                ease: options.easing,
                delay: options.delay,
                done: {
                    done: options.done,
                    complete: complete
                }
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

        $(this).css({
            '-webkit-transition': '',
            'opacity': 0,
            'display': 'block'
        });

        try {
            this.set( 'opacity' , {
                value: 1,
                duration: options.duration + 'ms',
                ease: options.easing,
                delay: options.delay,
                done: {
                    done: options.done
                }
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
                duration: 300,
                done: this.options.onOpen
            })
            .hx( 'translate' , {
                vector: {y: -this.Height},
                duration: 300
            });
            /*.hx( 'transform' , {
                translate: {y: -20},
                duration: 300
            });*/
        };

        
        this.close = function() {
            this.overlay.hx( 'fadeOut' , {
                duration: 300,
                done: function(e) {
                    self.options.onClose(e);
                    $(self.overlay.element).remove();
                }
            })
            .hx( 'translate' , {
                duration: 300
            });
            /*.hx( 'transform' , {
                translate: {y: 20},
                duration: 300
            });*/
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





















