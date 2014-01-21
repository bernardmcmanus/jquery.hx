(function() {

    var config = {
        debug: {
            oncreate: false,
            tString: false,
            transitionEndEvent: false,
            fallback: false,
            onComplete: false,
            onCancel: false
        },
        keys: {
            config: [ 'property' , 'value' , 'duration' , 'easing' , 'delay' , 'relative' , 'done' , 'fallback' ],
            calculated: [ 'width' , 'height' ],
            nonXform: [ 'opacity' ]
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

        return this._init();
    };

    hxManager.prototype = {
        _init: function() {

            this.vendorPatch = new hxManager.vendorPatch();

            var evt = this.vendorPatch.createEvent( 'hxManagerInit' );
            this.element.dispatchEvent( evt );

            if (!_checkDisplayState( this.element ))
                this._prepHiddenElement();
            
            var self = $(this.element);
            self.hxManager = 1;
            $.extend(self, this);
            return self;
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
                flow.progress();
            }

            flow.add( task1 , this );
            flow.add( task2 , this );
            flow.add( task3 , this );

            flow.run();
        },
        _getComputedStyle: function( property ) {

            if (config.keys.nonXform.indexOf( property ) >= 0)
                return;
            
            var matrix = this.vendorPatch.getComputedMatrix( this );

            if (_isHXTransform( matrix ) !== false) {
                matrix = _parse( matrix );
                if (matrix.transform.length < 1)
                    return;
                this.components.transform = this.components.transform || {};
                this.components.transform.computed = matrix;
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
            this.components[property] = $.extend( this.components[property] , _getRawComponents( options ));

            // add the animation instance to the queue
            this.queue[ property ] = new hxManager.animator({
                manager     : this,
                element     : this.element,
                vendorPatch : this.vendorPatch,
                property    : property,
                value       : config.keys.nonXform.indexOf( property ) < 0 ? _buildTransformString( this.components[property] ) : this.components[property][property][0],
                duration    : options.duration || 0,
                easing      : hxManager._easing( options.easing ),
                delay       : options.delay || 0,
                fallback    : options.fallback,
                done        : options.done || [],
                debug       : config.debug
            });

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

            var tString = _buildTransitionString( this.queue );
            tString = this.vendorPatch.getPrefixed( tString );

            var tProp = this.vendorPatch.getPrefixed( 'transition' );

            // if the element's style is already equal to the new transition string, don't apply it
            if (this.element.style.transition === tString)
                return;

            $(this.element).css( tProp , tString );

            // transition string debugging
            if (config.debug.tString)
                hxManager.log( tProp + ': ' + tString );
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





    // ------------------------- global methods ------------------------- //
        
        Array.prototype.compare = function ( array ) {
            
            // if the other array is a falsy value, return
            if (!array)
                return false;

            // compare lengths - can save a lot of time
            if (this.length != array.length)
                return false;

            for (var i = 0, l=this.length; i < l; i++) {
                // Check if we have nested arrays
                if (this[i] instanceof Array && array[i] instanceof Array) {
                    // recurse into the nested arrays
                    if (!this[i].compare(array[i]))
                        return false;
                }
                else if (this[i] != array[i]) {
                    // Warning - two different object instances will never be equal: {x:20} != {x:20}
                    return false;
                }
            }
            return true;
        };

    // ------------------------------------------------------------------ //





    // ------------------------- public methods ------------------------- //

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
            if (typeof obj !== 'object')
                return 0;
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

    // ------------------------------------------------------------------ //
    




    // ------------------------- private methods ------------------------- //

        function _checkDisplayState( element ) {
            
            var hx_display = _getHXDisplay( element );
            var style = element.style.display;
            var response = null;

            if (hx_display === null || hx_display === undefined) {
                
                var computed = window.getComputedStyle( element ).display;

                // determine the hx_display code
                if (computed !== 'none' && style === '') {
                    // visible, not styled inline
                    hx_display = 0;
                } else if (computed !== 'none' && computed === style) {
                    // visible, styled inline
                    hx_display = 1;
                } else if (computed === 'none' && style === '') {
                    // hidden, not styled inline
                    hx_display = 2;
                } else if (computed === 'none' && computed === style) {
                    // hidden, styled inline
                    hx_display = 3;
                }

                _setHXDisplay( element , hx_display );

            }

            // determine the boolean response
            switch (hx_display) {
                case 0:
                case 3:
                    response = (style !== 'none');
                    break;
                case 1:
                case 2:
                    response = (style !== 'none' && style !== '');
                    break;
            }

            return response;

        }

        function _getHXDisplay( element ) {
            var hx_display = element.getAttribute( 'hx_display' );
            if (hx_display !== null)
                hx_display = parseInt( hx_display , 10 );
            return hx_display;
        }

        function _setHXDisplay( element , value ) {
            element.setAttribute( 'hx_display' , value );
        }

        function _mapVectorToArray( vector ) {

            if (hxManager.objSize( vector ) < 1 && typeof vector !== 'object')
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
        }

        function _getRawComponents( options ) {
            var components = {};
            for (var key in options) {
                if (config.keys.config.indexOf( key ) >= 0)
                    continue;
                var values = _mapVectorToArray( options[key] );
                var defaults = _getComponentDefaults( key );
                components[key] = _checkComponentDefaults( key , values , defaults , options.relative );
            }
            return components;
        }

        function _getComponentDefaults( component ) {
            var defaults = [];
            switch (component) {
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
                case 'rotateX':
                case 'rotateY':
                case 'rotateZ':
                case 'opacity':
                    defaults = [ 0 ];
                    break;
            }
            return defaults;
        }

        function _checkComponentDefaults( component , values , defaults , relative ) {
            var defs = $.extend( [] , defaults );
            var newVals = $.extend( defs , values );
            if (relative === false)
                return newVals;
            if (defaults.compare( newVals ) && config.keys.nonXform.indexOf( component ) < 0)
                newVals = [];
            return newVals;
        }

        function _buildComponentString( component , values ) {

            if (values.length < 1)
                return '';

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
            }
            return component + '(' + values.join( joinWith ) + appendWith + ')';
        }

        function _buildTransformString( options ) {
            var xform = [];
            for (var key in options) {
                if (config.keys.config.indexOf( key ) < 0) {
                    var compString = _buildComponentString( key , options[key] );
                    if (compString !== '')
                        xform.push( compString );
                }
            }
            return xform.join(' ');
        }

        function _buildTransitionString( queue ) {
            var arr = [];
            for (var key in queue) {
                var component = key + ' ' + queue[key].duration + 'ms ' + queue[key].easing + ' ' + queue[key].delay + 'ms';
                if (arr.indexOf( component ) < 0)
                    arr.push( component );
            }
            return arr.join(', ');
        }

        function _isHXTransform( str ) {
            if (!str)
                return false;
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
        }

        function _parse( str ) {
            var type = _isHXTransform( str );
            if (!str || !type) return {};
            var arr = str.replace(/(px|\s|\))/gi, '').split('(')[1].split(',');
            arr.map(function(i) {return parseFloat( i , 10 );});

            // compare the computed values with default values
            var defaults = _getComponentDefaults( type );
            arr = _checkComponentDefaults( type , arr , defaults );

            return {
                type: type,
                transform: arr
            };
        }

    // ------------------------------------------------------------------- //
    
}());



























