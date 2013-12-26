(function() {

    var config = {
        debug: {
            oncreate: false,
            queue: false,
            components: false,
            tString: false,
            transitionEndEvent: false
        }
    };

    window.hxManager = function( element ) {

        if (config.debug.oncreate) hxManager.log('new hxManager');
        
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
                    'transition': 'none',
                    opacity : 0,
                    display : 'block'
                });

                style = $.extend( {} , window.getComputedStyle(this.element) );
                
                $(this.element).css({
                    position: temp.position || '',
                    left: temp.left || '',
                    top: temp.top || '',
                    '-webkit-transition': temp.webkitTransition || '',
                    'transition': temp.transition || '',
                    opacity : '',
                    display : 'none'
                });
            }

            if (this._isHXTransform( style.webkitTransform ) !== false) {
                this.components['-webkit-transform'] = this.components['-webkit-transform'] || {};
                this.components['-webkit-transform'].computed = this._parse( style.webkitTransform );
            }
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
        apply: function( property , options ) {
            this._getComputedStyle();
            return this.set( property , options , true );
        },
        set: function( property , options , setComputed ) {

            this.components[property] = this.components[property] || {};

            // prevent computed matrix transform from being applied if it exists and the set method is called directly
            setComputed = typeof setComputed !== 'undefined' ? setComputed : false;
            if (!setComputed && typeof this.components[property].computed !== 'undefined')
                delete this.components[property].computed;

            // build the component array
            this.components[property] = $.extend( this.components[property] , this._getRawComponents( options ));
            
            // components debugging
            if (config.debug.components) hxManager.log(this.components);


            // add the animation instance to the queue
            this.queue[ property ] = new animator({
                element     : this.element,
                property    : property,
                value       : this.keys.nonXform.indexOf( property ) < 0 ? this._buildTransformString( this.components[property] ) : this.components[property][property][0],
                duration    : options.duration || 0,
                easing      : hxManager._easing( options.easing ),
                delay       : options.delay || 0,
                done        : options.done || [],
            });

            // queue debugging
            if (config.debug.queue) hxManager.log($.extend( {} , this.queue ));

            // build and apply the transition string
            var tString = this._buildTransitionString();
            $(this.element).css('-webkit-transition', tString);

            // transition string debugging
            if (config.debug.tString) hxManager.log(tString);

            // add the event listener if it has not already been added
            if (!this.listening) {
                this.element.addEventListener( 'webkitTransitionEnd' , this );
                this.listening = true;
            }

            if (this.queue[ property ]) {
                // apply the style string and start the fallback timeout
                $(this.element).css( property , this.queue[ property ].value );
                this.queue[ property ].start();
            } else {
                // remove the event listener if the hxManager instance it belonged to was destroyed before it could be fired
                this.element.addEventListener( 'webkitTransitionEnd' , this );
            }

            return this;

        },
        _mapVectorToArray: function( vector , name ) {

            if (hxManager.objSize( vector ) < 1 && !Array.isArray( vector ))
                return [ vector ];

            if (Array.isArray( vector ))
                return vector;
            
            var v = vector;
            var arr = [];
            var i = 0;

            var map = {
                x: 0,
                y: 1,
                z: 2,
                a: 3
            };
            
            for (var key in v) {
                i = map[key];
                arr[i] = v[key];
            }

            return arr;
        },
        _getRawComponents: function( options ) {
            var defaults = [];
            var components = {};
            for (var key in options) {
                if (this.keys.config.indexOf( key ) >= 0) continue;
                var values = this._mapVectorToArray( options[key] );
                switch (key) {
                    case 'matrix3d':
                        defaults = [ 1 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 1 ];
                        break;
                    case 'matrix':
                        defaults = [ 1 , 0 , 0 , 1 , 0 , 0 ];
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
                    case 'opacity':
                        defaults = [ 0 ];
                        break;
                }
                values = $.extend( defaults , values );
                components[key] = values;
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
                var component = key + ' ' + this.queue[key].duration + 'ms ' + this.queue[key].easing + ' ' + this.queue[key].delay + 'ms';
                if (arr.indexOf( component ) < 0) arr.push( component );
            }
            return arr.join(', ');
        },
        _isHXTransform: function( str ) {
            if (!str) return false;
            var types = [ 'matrix' , 'matrix3d' ];
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

            if (config.debug.transitionEndEvent) hxManager.log(event);

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
            try{ this.queue[name].destroy(); }catch(err){}
            delete this.queue[name];

            // check the remaining queue elements
            if (hxManager.objSize( this.queue ) < 1) {
                if (typeof this._callback === 'function')
                    this._callback.call( this , event );
                this.element.removeEventListener( 'webkitTransitionEnd' , this );
                this.listening = false;
                this.hxManager = 0;
            }

        },
        done: function( callback ) {
            this._callback = callback || function() {};
        },
        destroy: function() {
            // remove event listeners and clear timeouts
        }
    };

    hxManager.pseudoHide = function( element ) {
        $(element)
            .addClass('hx_pseudoHide')
            .css('pointer-events', 'none');
    };

    hxManager.pseudoShow = function( element ) {
        if (!$(element).hasClass('hx_pseudoHide'))
            return;
        $(element)
            .removeClass('hx_pseudoHide')
            .css('pointer-events', 'auto');
    };

    hxManager.objSize = function( obj ) {
        if (typeof obj !== 'object') return 0;
        var size = 0, key;
        for (key in obj) {
            if (key in obj) size++;
        }
        return size;
    };

    hxManager.log = function( msg , type ) {
        type = type || 'log';
        try {
            console[type](msg);
        } catch (err) {}
    };
    
}());



























