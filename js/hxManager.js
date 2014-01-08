(function() {

    var config = {
        debug: {
            oncreate: false,
            queue: false,
            components: false,
            tString: false,
            transitionEndEvent: false,
            fallback: false,
            onComplete: false,
            onCancel: false
        }
    };

    window.hxManager = function( element ) {

        if (!element)
            throw "Error: You must pass an element to the hxManager constructor.";

        if (config.debug.oncreate)
            hxManager.log( 'new hxManager instance' );
        
        $.extend( this , {
            element: element,
            queue: {},
            components: {},
            _callback: function() {}
        });

        this.keys = {
            config: [ 'property' , 'value' , 'duration' , 'easing' , 'delay' , 'done' ],
            calculated: [ 'width' , 'height' ],
            nonXform: [ 'opacity' ]
        };

        return this._init();
    };

    hxManager.prototype = {
        _init: function() {

            this.vendorPatch = new hxManager.vendorPatch();

            var evt = this.vendorPatch.createEvent( 'hxManagerInit' );
            this.element.dispatchEvent( evt );

            if (!this._checkDisplayState( this.element ))
                this._prepHiddenElement();
            
            var self = $(this.element);
            self.hxManager = 1;
            $.extend(self, this);
            return self;
        },
        _checkDisplayState: function( element ) {
            
            var hx_display = this._getHXDisplay( element );
            var style = element.style.display;
            
            if (hx_display === null || hx_display === undefined) {
                
                var computed = window.getComputedStyle( element ).display;
                element.style.display = computed;
                hx_display = computed;
                this._setHXDisplay( this.element , hx_display );

            } else if (hx_display !== style) {
                
                hx_display = style;
                this._setHXDisplay( this.element , hx_display );

            }

            return hx_display !== 'none';
        },
        _getHXDisplay: function( element ) {
            return element.getAttribute( 'hx_display' );
        },
        _setHXDisplay: function( element , value ) {
            element.setAttribute( 'hx_display' , value );
        },
        _prepHiddenElement: function() {

            var flow = new hxManager.workflow();

            function task1() {
                this.setTransition( 'opacity' , {
                    duration: 0,
                    delay: 0
                });
                flow.progress();
            }

            function task2() {
                this.element.style.opacity = 0;
                this.element.style.display = 'block';
                flow.progress();
            }

            function task3() {
                // getBoundingClientRect forces a DOM reflow
                this.element.getBoundingClientRect();
                this._setHXDisplay( this.element , 'block' );
                flow.progress();
            }

            flow.add( task1 , this );
            flow.add( task2 , this );
            flow.add( task3 , this );

            flow.run();
        },
        _getComputedStyle: function( property ) {

            if (this.keys.nonXform.indexOf( property ) >= 0)
                return;
            
            var matrix = this.vendorPatch.getComputedMatrix( this );

            if (this._isHXTransform( matrix ) !== false) {
                this.components.transform = this.components.transform || {};
                this.components.transform.computed = this._parse( matrix );
            }
        },
        apply: function( property , options ) {
            this._getComputedStyle( property );
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
            if (config.debug.components)
                hxManager.log( this.components );


            // add the animation instance to the queue
            this.queue[ property ] = new hxManager.animator({
                manager     : this,
                element     : this.element,
                vendorPatch : this.vendorPatch,
                property    : property,
                value       : this.keys.nonXform.indexOf( property ) < 0 ? this._buildTransformString( this.components[property] ) : this.components[property][property][0],
                duration    : options.duration || 0,
                easing      : hxManager._easing( options.easing ),
                delay       : options.delay || 0,
                done        : options.done || [],
                debug       : config.debug
            });

            // queue debugging
            if (config.debug.queue)
                hxManager.log($.extend( {} , this.queue ));

            // build and apply the transition string
            this.setTransition( property );

            if (this.queue[ property ]) {
                // apply the style string and start the fallback timeout
                var transform = {
                    property: this.vendorPatch.getPrefixed( property ),
                    value: this.vendorPatch.getPrefixed( this.queue[ property ].value )
                };
                $(this.element).css( transform.property , transform.value );
                this.queue[ property ].start();
            }

            return this;

        },
        setTransition: function( property , options ) {
            
            if (!property) return;
            options = options || {};

            this.queue[ property ] = this.queue[ property ] || {
                easing: 'ease',
                duration: 0,
                delay: 0
            };

            this.queue[ property ] = $.extend( this.queue[ property ] , options );

            if (typeof options.easing !== 'undefined')
                this.queue[ property ].easing = hxManager._easing( options.easing );

            var tString = this._buildTransitionString();
            tString = this.vendorPatch.getPrefixed( tString );

            var tProp = this.vendorPatch.getPrefixed( 'transition' );

            $(this.element).css( tProp , tString );

            // transition string debugging
            if (config.debug.tString)
                hxManager.log( tProp + ': ' + tString );
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
                var re = new RegExp( types[i] + '\\(' , 'gi' );
                if (re.test( str )) {
                    response = types[i];
                    break;
                }
            }
            return response;
        },
        _parse: function( str ) {            
            var type = this._isHXTransform( str );
            if (!str || !type) return {};
            str = str.replace(/(px|\s|\))/gi, '').split('(')[1].split(',');
            var map = Array.prototype.map;
            str = map.call( str , function(i) {return parseFloat(i, 10);} );
            return {
                type: type,
                transform: str
            };
        },
        _transitionEnd: function( event , name ) {

            if (config.debug.transitionEndEvent)
                hxManager.log( name + ' complete' );

            // fire callbacks for individual properties
            if (typeof this.queue[name] !== 'undefined' && typeof this.queue[name].done[0] === 'function') {
                for (var i = 0; i < this.queue[name].done.length; i++) {
                    this.queue[name].done[i].call( this , event );
                }
            }

            // remove the animator object from the queue
            delete this.queue[name];

            // check the remaining queue elements
            if (hxManager.objSize( this.queue ) < 1) {
                if (config.debug.onComplete)
                    hxManager.log('done');
                if (typeof this._callback === 'function')
                    this._callback.call( this , event );
                this.hxManager = 0;
            }
        },
        done: function( callback ) {
            this._callback = callback || function() {};
        },
        cancel: function() {
            for (var key in this.queue) {
                this.queue[key].destroy();
            }
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
            if (window.logger) {
                window.logger.log( msg );
            } else {
                console[type](msg);
            }
        } catch (err) {}
    };

    hxManager.setDebugFlag = function( flag ) {
        this.cdn.load( 'logger' );
        if (typeof config.debug[flag] !== 'undefined')
            config.debug[flag] = true;
    };
    
}());



























