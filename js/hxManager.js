(function() {

    var config = {
        debug: {
            queue: false,
            components: false,
            tString: false,
            transitionEndEvent: true
        }
    };

    window.hxManager = function( element ) {
        
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
            
            var style = window.getComputedStyle(this.element);
            
            if (style.display === 'none') {
                
                var temp = $.extend( {} , this.element.style );
                var offset = -1000;
                
                $(this.element).css({
                    position: 'fixed',
                    left: offset + 'px',
                    top: offset + 'px',
                    '-webkit-transition': 'none',
                    opacity : 0,
                    display : 'block'
                });

                style = $.extend( {} , window.getComputedStyle(this.element) );
                
                $(this.element).css({
                    position: temp.position,
                    left: temp.left,
                    top: temp.top,
                    '-webkit-transition': temp.webkitTransition,
                    opacity : '',
                    display : 'none'
                });
            }

            if (typeof style.webkitTransform !== 'undefined' && style.webkitTransform !== 'none' && style.webkitTransform !== '') {
                this.components['-webkit-transform'] = this.components['-webkit-transform'] || {};
                this.components['-webkit-transform'].computed = this._parse( style.webkitTransform );
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

            // build the component array
            if (this._getTransformType( options ) === 'raw') {
                this.components[property] = $.extend( this.components[property] , this._getRawComponents( options ));
            } else {
                this.components[property] = $.extend( this.components[property] , this._getCalculatedComponents( options ));
            }
            
            // components debugging
            if (config.debug.components) console.log(this.components);


            // add the animation instance to the queue
            this.queue[ property ] = new animator({
                element     : this.element,
                property    : property,
                value       : this.keys.nonXform.indexOf( property ) < 0 ? this._buildTransformString( this.components[property] ) : this.components[property][property][0],
                duration    : options.duration ? options.duration : 400,
                easing      : hxManager._easing( options.easing ),
                delay       : options.delay || 1,
                done        : options.done || [],
            });

            // queue debugging
            if (config.debug.queue) console.log($.extend( {} , this.queue ));

            // build and apply the transition string
            var tString = this._buildTransitionString();
            $(this.element).css('-webkit-transition', tString);

            // transition string debugging
            if (config.debug.tString) console.log(tString);

            // add the event listener if it has not already been added
            if (!this.listening) {
                this.element.addEventListener( 'webkitTransitionEnd' , this );
                this.listening = true;
            }

            // apply the style string
            setTimeout(function() {
                self.queue[ property ].start();
                $(self.element).css( property , self.queue[ property ].value );
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
                        break;
                    case 'matrix':
                        defaults = [ 0 , 0 , 0 , 0 , 0 , 0 ];
                        break;
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
                var component = key + ' ' + this.queue[key].easing + ' ' + this.queue[key].duration + 'ms';
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
            str = map.call( str , function(i) {return parseFloat(i, 10);} );
            return {
                type: type,
                transform: str
            };
        },
        _transend: function( event ) {

            if (config.debug.transitionEndEvent) console.log(event);

            // get the key corresponding to the event property name
            var name = event.propertyName || event.detail.propertyName;

            var re = new RegExp( name , 'i' );
            for (var key in this.queue) {
                if (re.test(key)) {
                    name = key;
                    break;
                }
            }
            
            // fire callbacks for individual properties
            if (typeof this.queue[name] !== 'undefined' && typeof this.queue[name].done[0] === 'function') {
                for (var i = 0; i < this.queue[name].done.length; i++) {
                    this.queue[name].done[i].call( this , event );
                }
            }

            // remove the style object from the queue
            this.queue[name].destroy();
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
    
}());



























