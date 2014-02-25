(function() {


    var config = {
        keys: {
            config: [ 'property' , 'value' , 'duration' , 'easing' , 'delay' , 'relative' , 'pseudoHide' , 'done' , 'fallback' , 'order' ],
            xform: [ 'translate3d' , 'scale3d' , 'rotate3d' , 'rotateX' , 'rotateY' , 'rotateZ' , 'matrix' , 'matrix3d' ],
            nonXform: [ 'opacity' ]
        },
        componentMap: {
            translate: 'translate3d',
            scale: 'scale3d',
            rotate: 'rotate3d'
        }
    };


    window.hxManager = function( nodeList ) {

        this._callback = function() {};
        return $.extend( nodeList , this );
    };


    hxManager.prototype = {
        
        getComputedMatrix: function( property ) {

            if (config.keys.nonXform.indexOf( property ) >= 0)
                return null;
            
            /*var matrix = hxManager.vendorPatch.getComputedMatrix( this.element );

            if (_isHXTransform( matrix ) !== false) {
                
                matrix = _parse( matrix );
                
                if (matrix.transform.length < 1)
                    return null;

                return matrix;

            } else {
                return null;
            }*/
        },

        /*apply: function( property , options ) {
            
            var matrix = this.getComputedMatrix( property );

            if (matrix) {
                this.components.transform = this.components.transform || {};
                this.components.transform.computed = matrix;
            }

            return this.set( property , options , true );
        },*/

        set: function( property , options ) {

            options = mapComponentKeys( options );

            this.forEach(function( node ) {
                
                var raw = $.extend( {} , _getRawComponents( options ));
                var opt = $.extend( {} , _getXformOptions( options ));
                node._hx.setXformData( property , raw , opt );

                var xformString = _buildTransformString( property , node._hx.components[property] , options.order );
                node._hx.applyXform( property , xformString , opt );

            }.bind( this ));

            return this;

            /*this.components[property] = this.components[property] || {};

            // prevent computed matrix transform from being applied if it exists and the set method is called directly
            if (setComputed === false && typeof this.components[property].computed !== 'undefined')
                delete this.components[property].computed;

            // build the component array
            this.components[property] = $.extend( this.components[property] , _getRawComponents( options ));

            // extend the options object with key defaults
            options = $.extend({
                duration: 0,
                delay: 0,
                relative: setComputed === true ? true : false,
                fallback: true
            } , options );

            // add the animation instance to the queue
            this.queue[ property ] = new hxManager.animator({
                element     : this.element,
                property    : property,
                eventType   : hxManager.vendorPatch.getEventType(),
                value       : config.keys.nonXform.indexOf( property ) < 0 ? _buildTransformString( this.components[property] ) : this.components[property][property][0],
                duration    : options.duration,
                easing      : hxManager._easing( options.easing ),
                delay       : options.delay,
                fallback    : options.fallback,
                trigger     : this.trigger.bind( this ),
                cancel      : this.cancel.bind( this ),
                complete    : this._transitionEnd.bind( this )
            });

            // build and apply the transition string
            this.setTransition( property );

            if (this.queue[ property ]) {
                
                // apply the style string and start the fallback timeout
                var transform = {
                    property: hxManager.vendorPatch.getPrefixed( property ),
                    value: hxManager.vendorPatch.getPrefixed( this.queue[ property ].value )
                };
                
                $(this.element).css( transform.property , transform.value );
                this.queue[ property ].start();

                // trigger the hx_applyXform event
                this.trigger( 'hx_applyXform' , property , transform.value , options );
            }

            return this;*/

        },

        trigger: function() {

            this.forEach(function( node ) {
                node._hx.trigger.apply( node , arguments );
            });

            /*var type = arguments[0];
            var args = Array.prototype.slice.call( arguments , 1 );
            var evt = {};

            if (typeof _constructEvent[type] === 'function') {
                evt = _constructEvent[type].apply( this , args );
            } else {
                evt = hxManager.vendorPatch.createEvent( type , args[0] );
            }

            this.element.dispatchEvent( evt );*/

        },

        _transitionEnd: function( event , name ) {

            // trigger the hx_transitionEnd event
            this.trigger( 'hx_transitionEnd' , name );

            // remove the animator object from the queue
            delete this.queue[name];

            // check the remaining queue elements
            if (hxManager.helper.object.size.call( this.queue ) > 0)
                return;
                
            // trigger the hx_done event
            this.trigger( 'hx_done' );

            if (typeof this._callback === 'function')
                this._callback.call( this , event );

            this.hxManager = 0;
        },

        done: function( callback ) {
            this._callback = callback || function() {};
        },

        cancel: function() {
            
            for (var key in this.queue) {
                try {
                    this.queue[key].destroy();
                } catch( err ) {
                    delete this.queue[key];
                }
            }

            // trigger the hx_cancel event
            this.trigger( 'hx_cancel' );
        }

    };




    function mapComponentKeys( obj ) {
        
        var map = config.componentMap;
        obj.order = obj.order || [];
        
        for (var key in obj) {
            
            if (!map[key])
                continue;
            obj[map[key]] = obj[key];
            
            var i = obj.order.indexOf( key );
            if (i >= 0) {
                obj.order[i] = map[key];
            }

            delete obj[key];
        }

        return obj;
    }

    function _getXformOptions( options ) {

        var _options = {};
        
        for (var key in options) {
            if (config.keys.config.indexOf( key ) >= 0)
                _options[key] = options[key];
        }

        return _options;
    }

    function _getRawComponents( options ) {

        function _mapVectorToArray( vector ) {
            
            if (hxManager.helper.object.size.call( vector ) < 1 && typeof vector !== 'object')
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

        function exec() {

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

        return exec();
    }

    function _buildTransformString( property , component , order ) {

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

        function exec() {

            //if (config.keys.nonXform.indexOf( property ) < 0)
            if (property !== 'transform')
                return component[property][0];
            
            var xform = [];

            order.forEach(function( key ) {
                if (config.keys.config.indexOf( key ) < 0) {
                    var compString = _buildComponentString( key , component[key] );
                    if (compString !== '')
                        xform.push( compString );
                }
            });

            return xform.join(' ');
        }

        return exec();
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
        
        if (hxManager.helper.array.compare.call( defaults , newVals ) && config.keys.nonXform.indexOf( component ) < 0)
            newVals = [];
        
        return newVals;
    }

    function _isHXTransform( str ) {
        
        if (!str)
            return false;

        var types = {
            matrix3d: (/matrix3d\(/i),
            matrix: (/matrix\(/i)
        };

        var response = false;

        for (var key in types) {
            if (types[key].test( str )) {
                response = key;
                break;
            }
        }

        return response;
    }

    function _parse( str ) {
        
        var type = _isHXTransform( str );
        
        if (!str || !type)
            return {};
        
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

    
}());



























