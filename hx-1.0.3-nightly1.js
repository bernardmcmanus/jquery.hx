/*! jquery.hx - 1.0.3 nightly build 1 - Bernard McManus - 2014-06-03 */


(function( window ) {


    function hxManager( j ) {

        if (j instanceof hxManager) {
            return j;
        }

        var nodes = [];

        j.each(function() {
            nodes.push(
                new hxManager.DomNode( this )
            );
        });

        Object.defineProperty( this , 'length' , {
            get: function() {
                return nodes.length;
            },
            configurable: true
        });

        $.extend( this , nodes );
    }


    hxManager.prototype = Object.create( jQuery.prototype );


    hxManager.prototype._addXformPod = function( bundle ) {

        var that = this;

        that.each(function( i ) {

            var pod = new hxManager.Pod( that[i] , 'xform' );

            bundle.forEach(function( seed ) {

                var bean = new hxManager.Bean( seed );
                pod.addBean( bean );

            });

            that[i]._hx.addXformPod( pod );
        });
    };


    hxManager.prototype._addPromisePod = function( func , method ) {

        method = method || 'all';

        var that = this;
        var micro = [];
        var pods = [];
        var _func = func.bind( that );
        var clear = that.clear.bind( that );

        that.each(function( i ) {

            // create a promisePod for each dom node
            var pod = new hxManager.Pod( that[i] , 'promise' );

            // when the pod reaches its turn in the queue, resolve its promise
            pod.when( 'promiseMade' , pod.resolvePromise , pod );

            // create a microPromise for each pod
            var microPromise = new Promise(function( resolve ) {
                // when the pod is resolved, resolve the microPromise
                pod.when( 'promiseResolved' , resolve );
            });

            // add the promise to the dom node queue
            that[i]._hx.addPromisePod( pod );

            pods.push( pod );
            micro.push( microPromise );

        });

        // when the appropriate microPromises have been resolved, create the macroPromise
        Promise[ method ]( micro ).then(function() {

            var macroPromise = new Promise( _func );

            // if the macroPromise is resolved, resolve the pods
            macroPromise.then(function() {
                pods.forEach(function( pod ) {
                    pod.resolvePod();
                });
            });

            // otherwise, clear the queue so we can start again
            macroPromise.catch(function( err ) {
                clear();
                if (err instanceof Error) {
                    console.error( err.stack );
                }
            });
        });
    };


    hxManager.prototype.then = function( func ) {

        var that = this;

        if (typeof func === 'function') {
            that._addPromisePod( func );
        }

        return that;
    };


    hxManager.prototype.race = function( func ) {

        var that = this;
        
        if (typeof func === 'function') {
            that._addPromisePod( func , 'race' );
        }

        return that;
    };


    hxManager.prototype.defer = function( time ) {

        var that = this;
        
        that._addPromisePod(function( resolve , reject ) {
            if (typeof time !== 'undefined') {
                setTimeout( resolve , time );
            }
        });

        return that;
    };


    hxManager.prototype.update = function( seed ) {

        // update a node's components without applying the transition

        var that = this;

        if (typeof seed === 'object') {

            seed = Array.isArray( seed ) ? hxManager.helper.array.last( seed ) : seed;
            seed.order = hxManager.get.seedOrder( seed );

            that.each(function( i ) {

                var bean = new hxManager.Bean( seed );
                that[i]._hx.updateComponent( bean );

            });
        }

        return that;
    };


    hxManager.prototype.resolve = function( all ) {

        var that = this;

        // all controls whether all pod types or only promise pods will be resolved
        all = (typeof all !== 'undefined' ? all : false);

        // force resolve the current pod in each queue
        that.each(function( i ) {

            var pod = that[i]._hx.getCurrentPod();

            if (pod && (all || (!all && pod.type === 'promise'))) {
                pod.resolvePod();
            }

        });

        return that;
    };


    hxManager.prototype.clear = function() {

        var that = this;
        
        // clear all pods in each queue            
        that.each(function( i ) {

            that[i]._hx.clearQueue();

        });

        return that;
    };


    hxManager.prototype.break = function() {

        var that = this;
        
        // clear all but the current pod in each queue
        that.each(function( i ) {

            that[i]._hx.clearQueue( false );

        });

        // resolve any remaining promise pods
        that.resolve();

        return that;
    };


    hxManager.prototype.zero = function( hxArgs ) {

        // duration is intentionally passed as a string to
        // avoid being overridden by vendorPatch.getDuration

        var that = this;

        $.extend( hxArgs , {
            duration: '0',
            delay: 0,
            fallback: false
        });

        that.hx( hxArgs ).clear( true );

        return that;
    };


    hxManager.prototype.done = function( func ) {

        var that = this;

        if (typeof func !== 'function') {
            return;
        }
        
        function resolution( resolve , reject ) {
            func.call( that );
            resolve();
        }

        that._addPromisePod( resolution );
    };


    window.hxManager = hxManager;

    
}( window ));




























(function( window , hx ) {


    var When = {

        when: function( event , handler , context ) {

            this._initHandlerModule();

            if (!event || (!handler || typeof handler !== 'function')) {
                throw 'Error: Invalid when args.';
            }

            context = context || null;
            var _handler = handler.bind( context );

            _addHandler( this , event , _handler );
        },

        happen: function( event , args ) {

            this._initHandlerModule();

            var handlers = _getHandlers( this , event );

            handlers.forEach(function( func ) {
                func.apply( null , args );
            });
        },

        dispel: function( event ) {
            this._initHandlerModule();
            delete this.handlers[event];
        },

        _initHandlerModule: function() {
            this.handlers = this.handlers || new whenModule();
        }
    };


    function whenModule() {}


    function _addHandler( instance , event , handler ) {
        var group = (instance.handlers[event] = instance.handlers[event] || []);
        group.push( handler );
    }


    function _getHandlers( instance , event ) {
        return instance.handlers[event] || [];
    }


    $.extend( hx , { When : When });

    
}( window , hxManager ));




























(function( window , hx ) {


    var Config = {
        
        keys: {
            options: [ 'type' , 'duration' , 'easing' , 'delay' , 'done' , 'fallback' , 'order' ],
            transform: [ 'translate3d' , 'scale3d' , 'translate' , 'scale' , 'rotate3d' , 'rotateX' , 'rotateY' , 'rotateZ' , 'matrix' , 'matrix3d' ]
        },

        maps: {

            component: {
                translate: 'translate3d',
                scale: 'scale3d',
                rotate: 'rotate3d',
                translate2d: 'translate',
                scale2d: 'scale',
                matrix: 'matrix3d',
                matrix2d: 'matrix'
            },

            styleString: {

                translate: {
                    join: 'px,',
                    append: 'px'
                },

                scale: {
                    join: ',',
                    append: ''
                },

                rotate: {
                    join: ',',
                    append: 'deg'
                },

                matrix: {
                    join: ',',
                    append: ''
                },

                other: {
                    join: '',
                    append: ''
                }
            },

            transform: {

                matrix3d: {
                    a1: 0,
                    b1: 1,
                    c1: 2,
                    d1: 3,
                    a2: 4,
                    b2: 5,
                    c2: 6,
                    d2: 7,
                    a3: 8,
                    b3: 9,
                    c3: 10,
                    d3: 11,
                    a4: 12,
                    b4: 13,
                    c4: 14,
                    d4: 15
                },

                matrix: {
                    a: 0,
                    b: 1,
                    c: 2,
                    d: 3,
                    tx: 4,
                    ty: 5
                },

                rotateX: {
                    '0': 0
                },

                rotateY: {
                    '0': 0
                },

                rotateZ: {
                    '0': 0
                },

                other: {
                    x: 0,
                    y: 1,
                    z: 2,
                    a: 3
                }
            },

            nonTransform: {

                other: {
                    '0': 0
                }
            }
        },

        defaults: {

            transform: {
                matrix3d: [ 1 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 1 ],
                translate3d: [ 0 , 0 , 0 ],
                scale3d: [ 1 , 1 , 1 ],
                rotate3d: [ 0 , 0 , 0 , 0 ],
                rotateX: [ 0 ],
                rotateY: [ 0 ],
                rotateZ: [ 0 ],
                matrix: [ 1 , 0 , 0 , 1 , 0 , 0 ],
                translate: [ 0 , 0 ],
                scale: [ 1 , 1 ]
            },

            nonTransform: {
                value: ''
            },

            options: {
                duration: 400,
                easing: 'ease',
                delay: 0,
                fallback: true,
                done: function() {}
            }
        },

        VendorPatch: {

            vendors: {
                webkit  : (/webkit/i),
                moz     : (/firefox/i),
                o       : (/opera/i),
                ms      : (/msie/i)
            },

            os: {
                android : (/android/i),
                ios     : (/(ios|iphone)/i),
                macos   : (/mac os/i),
                windows : (/windows/i)
            },

            tests: {
                mobile  : (/mobile/i),
                andNat  : (/(chrome|firefox)/i)
            },

            events: {
                webkit  : 'webkitTransitionEnd',
                moz     : 'transitionend',
                o       : 'oTransitionEnd',
                ms      : 'transitionend',
                other   : 'transitionend'
            },

            prefixProps: [
                (/(^\-{0})+transition/g),
                (/(^\-{0})+transform/g)
            ]
        },

        Animator: {
            timeout: null,
            buffer: 50
        },

        Pod: {
            types: [ 'xform' , 'promise' ]
        },

        DomNode: {
            removeOnClean: [ '_hx' , 'hx_display' ]
        }
    };

    
    $.extend( hx , { Config : Config });

    
}( window , hxManager ));




























(function( window , hx ) {


    var Helper = {};


    Helper.array = {

        compare: function ( subject , array ) {
            
            if (!subject || !array) {
                return false;
            }

            if (subject.length != array.length) {
                return false;
            }

            for (var i = 0, l = subject.length; i < l; i++) {
                if (subject[i] instanceof Array && array[i] instanceof Array) {
                    if (!subject[i].compare( array[i] )) {
                        return false;
                    }
                }
                else if (subject[i] != array[i]) {
                    return false;
                }
            }

            return true;
        },

        last: function( subject , value ) {

            var L = subject.length > 0 ? subject.length - 1 : 0;

            if (typeof value !== 'undefined') {
                subject[L] = value;
            }

            return subject[L];
        }

    };


    Helper.object = {

        each: function( subject , iterator , context ) {

            if (!subject || !iterator) {
                return;
            }

            context = context || window;

            var keys = Object.keys( subject );

            for (var i = 0; i < keys.length; i++) {
                iterator.call( context , subject[keys[i]] , keys[i] , i );
            }
        },

        getOrder: function( subject ) {
            var a = [];
            for (var key in subject) {
                a.push( key );
            }
            return a;
        },

        size: function( subject ) {

            if (typeof subject !== 'object') {
                return 0;
            }

            var dataTypes = [ Boolean , Number , String ];

            for (var i = 0; i < dataTypes.length; i++) {
                if (subject instanceof dataTypes[i]) {
                    return 0;
                }
            }

            return Object.keys( subject ).length;
        }

    };

    
    $.extend( hx , { Helper : Helper });


}( window , hxManager ));
























(function( window , hx , Config ) {


    function VendorPatch() {

        this.ua = _getUserAgent();
        this.os = _getOS();
        this.isMobile = _isMobile();

        Object.defineProperty( this , 'eventType' , {
            get: function() {
                return Config.events[ this.ua ];
            }
        });
    }


    VendorPatch.prototype = {

        getPrefixed: function( str ) {

            if (this.ua === 'other') {
                return str;
            }

            Config.prefixProps.forEach(function( re ) {

                var match = re.exec( str );
                
                if (match) {
                    str = str.replace( re , ('-' + this.ua + '-' + match[0]) );
                }

            }.bind( this ));

            return str;
        },

        getComputedMatrix: function( element ) {
            var style = getComputedStyle( element );
            var transform = this.ua !== 'other' ? (this.ua + 'Transform') : 'transform';
            return style[transform] || style.transform;
        },

        getBezierSupport: function() {
            if (_isAndroidNative( this.os )) {
                return false;
            }
            return true;
        },

        getDuration: function( duration ) {
            if (duration === 0 && _isAndroidNative( this.os )) {
                return 1;
            }
            return duration;
        }
        
    };


    function _getUserAgent() {
        var uaString = navigator.userAgent;
        for (var key in Config.vendors) {
            if (Config.vendors[key].test( uaString )) {
                return key;
            }
        }
        return 'other';
    }


    function _getOS() {
        var uaString = navigator.userAgent;
        for (var key in Config.os) {
            if (Config.os[key].test( uaString )) {
                return key;
            }
        }
        return 'other';
    }


    function _isMobile() {
        return Config.tests.mobile.test( navigator.userAgent );
    }


    function _isAndroidNative( os ) {
        return (os === 'android' && !Config.tests.andNat.test( navigator.userAgent ));
    }


    $.extend( hx , { VendorPatch : new VendorPatch() });

    
}( window , hxManager , hxManager.Config.VendorPatch ));




























/*
**  Derived from AliceJS easing definitions
**  http://blackberry.github.io/Alice/
*/


(function( window , hx , VendorPatch ) {


    var type = {
        linear: [ 0.25 , 0.25 , 0.75 , 0.75 ],
        ease: [ 0.25 , 0.1 , 0.25 , 1 ],
        'ease-in': [ 0.42 , 0 , 1 , 1 ],
        'ease-out': [ 0 , 0 , 0.58 , 1 ],
        'ease-in-out': [ 0.42 , 0 , 0.58 , 1 ],
        easeInQuad: [ 0.55 , 0.085 , 0.68 , 0.53 ],
        easeInCubic: [ 0.55 , 0.055 , 0.675 , 0.19 ],
        easeInQuart: [ 0.895 , 0.03 , 0.685 , 0.22 ],
        easeInQuint: [ 0.755 , 0.05 , 0.855 , 0.06 ],
        easeInSine: [ 0.47 , 0 , 0.745 , 0.715 ],
        easeInExpo: [ 0.95 , 0.05 , 0.795 , 0.035 ],
        easeInCirc: [ 0.6 , 0.04 , 0.98 , 0.335 ],
        easeInBack: [ 0.6 , -0.28 , 0.735 , 0.045 ],
        easeOutQuad: [ 0.25 , 0.46 , 0.45 , 0.94 ],
        easeOutCubic: [ 0.215 , 0.61 , 0.355 , 1 ],
        easeOutQuart: [ 0.165 , 0.84 , 0.44 , 1 ],
        easeOutQuint: [ 0.23 , 1 , 0.32 , 1 ],
        easeOutSine: [ 0.39 , 0.575 , 0.565 , 1 ],
        easeOutExpo: [ 0.19 , 1 , 0.22 , 1 ],
        easeOutCirc: [ 0.075 , 0.82 , 0.165 , 1 ],
        easeOutBack: [ 0.175 , 0.885 , 0.32 , 1.275 ],
        easeInOutQuad: [ 0.455 , 0.03 , 0.515 , 0.955 ],
        easeInOutCubic: [ 0.645 , 0.045 , 0.355 , 1 ],
        easeInOutQuart: [ 0.77 , 0 , 0.175 , 1 ],
        easeInOutQuint: [ 0.86 , 0 , 0.07 , 1 ],
        easeInOutSine: [ 0.445 , 0.05 , 0.55 , 0.95 ],
        easeInOutExpo: [ 1 , 0 , 0 , 1 ],
        easeInOutCirc: [ 0.785 , 0.135 , 0.15 , 0.86 ],
        easeInOutBack: [ 0.68 , -0.55 , 0.265 , 1.55 ],
        easeOutBackMod1: [ 0.7 , -1 , 0.5 , 2 ],
        easeMod1: [ 0.25 , 0.2 , 0.25 , 1 ],
        gravityUp: [ 0.05 , 0.6 , 0.3 , 1 ],
        gravityDown: [ 0.65 , 0.01 , 0.78 , 0.5 ]
    };

    
    function Easing( def ) {

        var b;

        if ((/cubic\-bezier\(/).test( def )) {
            b = parseBezierString( def );
        }
        else if (typeof def === 'object') {
            b = [ def.p1 , def.p2 , def.p3 , def.p4 ];
        }
        else {
            b = type[def] ? type[def] : type.ease;
        }

        // check unclamped bezier support
        if (!VendorPatch.getBezierSupport()) {
            b = getClampedBezier( b );
        }

        return 'cubic-bezier(' + b.join( ',' ) + ')';
    }


    function parseBezierString( str ) {
        var arr = str.replace( /(\s|\))/gi , '' ).split( '(' )[1].split( ',' );
        return arr.map(function( a ) {
            return parseFloat( a , 10 );
        });
    }


    function getClampedBezier( arr ) {
        return arr.map(function( a ) {
            return (a < 0 ? 0 : (a > 1 ? 1 : a));
        });
    }


    $.extend( hx , { Easing : Easing });


}( window , hxManager , hxManager.VendorPatch ));


















(function( window , hx , Config , Helper , VendorPatch , Easing ) {


    var Get = {};


    Get.scopedModule = function( module , context ) {

        var _module = {};

        Helper.object.each( module , function( func , key ) {
            _module[key] = func.bind( context );
        });

        return _module;
    };


    // TODO - implement Get.computedMatrix to account for transforms applied in CSS
    /*Get.computedMatrix = function( node ) {

        function _isMatrix( str ) {
            
            if (!str) {
                return false;
            }

            var types = {
                matrix3d: (/matrix3d\(/i),
                matrix: (/matrix\(/i)
            };

            var response = false;

            Helper.object.each( types , function( val , key ) {
                if (response !== false) {
                    return;
                }
                if (val.test( str )) {
                    response = key;
                }
            });

            return response;
        }

        function _parse( str ) {
            
            var type = _isMatrix( str );
            
            if (!type) {
                return {};
            }
            
            var defaults = Get.componentDefaults( type );
            var arr = str.replace( /(px|\s|\))/gi , '' ).split( '(' )[1].split( ',' );

            arr.map(function( i ) {
                return parseFloat( i , 10 );
            });

            arr = _checkComponentDefaults( type , arr , defaults );

            return {
                type: type,
                transform: arr
            };
        }

        function exec() {

            var matrix = VendorPatch.getComputedMatrix( node );

            if (_isMatrix( matrix ) !== false) {
                
                matrix = _parse( matrix );
                
                if (matrix.transform.length < 1) {
                    return null;
                }

                return matrix;

            }
            else {
                return null;
            }

        }

        return exec();
    };*/


    Get.orderedBundle = function( bundle ) {

        var xformSeeds = [];
        var otherSeeds = [];

        bundle.forEach(function( seed ) {

            if (seed.type === 'transform') {
                xformSeeds.push( seed );
            }
            else {
                otherSeeds.push( seed );
            }
        });

        return xformSeeds.concat( otherSeeds );
    };

    
    $.extend( hx , { Get : Get });

    
}( window , hxManager , hxManager.Config , hxManager.Helper , hxManager.VendorPatch , hxManager.Easing ));




























(function( window , hx , Config , When ) {

    function Animator( options ) {

        $.extend( this , Config , options );
        this.listeners = this._getListeners();

        Object.defineProperty( this , 'running' , {
            get: function() {
                return this.timeout !== null;
            }
        });
    }


    Animator.prototype = Object.create( When );


    Animator.prototype.start = function() {
        $(this.node).on( this.eventType , this.listeners._transitionEnd );
        this.timeout = (this.fallback !== false ? _createFallback( this ) : 1);
    };


    Animator.prototype._getListeners = function() {

        return {
            _transitionEnd: this._transitionEnd.bind( this )
        };
    };


    Animator.prototype._transitionEnd = function( e , data ) {

        e.originalEvent = e.originalEvent || {};
        data = data || {};

        var name = e.originalEvent.propertyName || data.propertyName;
        var re = new RegExp( this.property , 'i' );
        
        if (re.test( name )) {
            this.destroy();
            this.happen( 'complete' );
        }
    };


    Animator.prototype.destroy = function() {
        clearTimeout( this.timeout );
        this.timeout = null;
        $(this.node).off( this.eventType , this.listeners._transitionEnd );
    };


    function _createFallback( instance ) {

        var t = instance.duration + instance.delay + instance.buffer;

        var fallback = function() {
            var data = {propertyName: instance.property};
            $(instance.node).trigger( instance.eventType , data );
        };

        return setTimeout( fallback , t );
    }


    $.extend( hx , { Animator : Animator });

    
}( window , hxManager , hxManager.Config.Animator , hxManager.When ));





























(function( window , hx , Helper ) {


    var EACH = Helper.object.each;
    var ODP = Object.defineProperty;


    function KeyMap() {

        if (arguments.length < 1) {
            throw new Error( 'invalid KeyMap arguments' );
        }

        var master = Array.prototype.shift.call( arguments );
        var family = Array.isArray( master ) ? 'array' : 'object';

        EACH( arguments , function( val ) {
            val = (val instanceof KeyMap ? val.export() : val);
            master = $.extend( new _empty( family ) , val , master );
        });

        ODP( this , 'master' , {
            get: function() {
                return master;
            },
            set: function( value ) {
                master = value;
            }
        });

        ODP( this , 'family' , {
            get: function() {
                return family;
            },
            set: function( value ) {
                if (value !== 'array' && value !== 'object') {
                    throw new Error( 'invalid family' );
                }
                family = value;
            }
        });

        ODP( this , 'length' , {
            get: function() {
                return this.keys().length;
            }
        });

        $.extend( this , master );
    }


    KeyMap.prototype = {

        cast: function( deep ) {

            deep = (typeof deep !== 'undefined' ? deep : false);

            this.each(function( val , key ) {

                /*if (typeof val === 'object') {
                    this[key] = new KeyMap( val );
                }*/

                if (!(val instanceof KeyMap) && typeof val === 'object') {
                    this[key] = new KeyMap( val );
                }

                if (deep && typeof val === 'object') {
                    this[key].cast( true );
                }

                /*if (deep && containsType( val , 'object' )) {
                    this[key].cast( true );
                }*/
            });

            return this;
        },

        merge: function() {

            EACH( arguments , function( extender ) {
                EACH( extender , function( val , key ) {
                    this[key] = (typeof this[key] !== 'undefined' ? this[key] : val);
                } , this );
            } , this );

            this._update();

            return this;
        },

        /*
        **  scrub
        **  removes any properties with keys
        **  that ARE NOT in the template
        */

        scrub: function( template ) {
            clean( this , template , 'scrub' );
            this._update();
            return this;
        },

        /*
        **  subtract
        **  removes any properties with keys
        **  that ARE in the template
        */

        subtract: function( template ) {
            clean( this , template , 'subtract' );
            this._update();
            return this;
        },

        unique: function() {

            if (this.family !== 'array') {
                return this;
            }

            var val, j, k, unique = this.export();

            for (var i = 0; i < unique.length; i++) {
                val = unique[i];
                j = unique.indexOf( val );
                k = unique.lastIndexOf( val );
                if (k >= 0 && j !== k) {
                    delete unique[k];
                    i--;
                }
            }

            this.wipe();
            $.extend( this , unique );
            this._update();

            return this;
        },

        compare: function( compareTo ) {

            if (!compareTo) {
                return false;
            }

            var output = this.clone().cast( true );

            output.each(function( val , key ) {
                if (val instanceof KeyMap) {
                    this[key] = val.compare( compareTo[key] );
                }
                else {
                    this[key] = (compareTo[key] === val);
                }
            });

            return output;
        },

        mapTo: function( template ) {
            map( this , template , 'mapTo' );
            this._update();
            return this;
        },

        mapFrom: function( template ) {
            map( this , template , 'mapFrom' );
            this._update();
            return this;
        },

        wipe: function() {
            this.each(function( val , key ) {
                delete this[key];
            });
            return this;
        },

        clone: function() {
            return new KeyMap(
                this.export()
            )
            .setMaster(
                this.getMaster()
            );
        },

        export: function(/* subject */) {

            var subject = (typeof arguments[0] === 'object' ? arguments[0] : this);
            var as = (arguments.length === 2 ? arguments[1] : (typeof arguments[0] === 'string' ? arguments[0] : this.family));
            
            var output = new _empty( as );
            return _export( subject , output );
        },

        setMaster: function( master ) {
            master = master || this.export();
            this.master = master;
            return this;
        },

        getMaster: function() {
            var family = Array.isArray( this.master ) ? 'array' : 'object';
            var output = new _empty( family );
            return _export( this.master , output );
        },

        invert: function() {
            this.each(function( val , key ) {
                delete this[key];
                this[val] = key;
            });
            this._update();
            return this;
        },

        revert: function() {
            this.wipe();
            $.extend( this , this.getMaster() );
            this._update();
            return this;
        },

        each: function( iterator ) {
            EACH( this , iterator , this );
            return this;
        },

        keys: function() {
            return Object.keys( this );
        },

        hasAlphaKeys: function() {
            var keyString = this.keys().join( '' );
            return (/[\D]/).test( keyString );
        },

        isSequential: function() {
            var lastKey = parseInt( this.keys().pop() , 10 );
            return lastKey === (this.length - 1);
        },

        isArray: function() {
            return (!this.hasAlphaKeys() && this.isSequential());
        },

        _update: function() {

            if (this.family === 'object' && this.isArray()) {
                this.family = 'array';
            }

            this._normalize();
        },

        _normalize: function() {

            if (this.family !== 'array' || this.isArray()) {
                return;
            }

            this.each(function( val , key , i ) {
                delete this[key];
                this[i] = val;
            });
        }
    };


    function _export( subject , output ) {
        EACH( subject , function( val , key ) {
            output[key] = (val instanceof KeyMap ? val.export() : val);
        });
        return output;
    }


    function _empty( family ) {
        return (family === 'array' ? [] : {});
    }


    /*function containsType( subject , type ) {
        var response = false;
        if (typeof subject !== 'object') {
            return response;
        }
        EACH( subject , function( val ) {
            if (response) {
                return;
            }
            if (typeof val === 'type') {
                response = true;
            }
        });
        return response;
    }*/


    function clean( keyMap , template , method ) {

        if (!Array.isArray( template )) {
            throw new TypeError( method + ' template must be an array.' );
        }

        keyMap.each(function( val , key ) {

            switch (keyMap.family) {

                case 'array':
                    if (method === 'scrub' && template.indexOf( val ) < 0) {
                        delete this[key];
                    }
                    if (method === 'subtract' && template.indexOf( val ) >= 0) {
                        delete this[key];
                    }
                break;

                case 'object':
                    if (method === 'scrub' && template.indexOf( key ) < 0) {
                        delete this[key];
                    }
                    if (method === 'subtract' && template.indexOf( key ) >= 0) {
                        delete this[key];
                    }
                break;
            }
        });
    }


    function map( keyMap , template , method ) {

        if (typeof template !== 'object' || Array.isArray( template )) {
            throw new TypeError( method + ' template must be an object.' );
        }

        // invert the template if this is mapFrom
        if (method === 'mapFrom') {
            template = new KeyMap( template ).invert().export();
        }

        keyMap.each(function( val , key ) {

            switch (keyMap.family) {

                case 'array':
                    if (method === 'mapFrom') {
                        delete this[key];
                        this[template[key]] = val;
                    }
                    else if (method === 'mapTo') {
                        if (typeof template[val] !== 'undefined') {
                            this[key] = template[val];
                        }
                    }
                break;

                case 'object':
                    if (typeof template[key] !== 'undefined') {
                        delete this[key];
                        this[template[key]] = val;
                    }
                break;
            }
        });

        if (keyMap.family === 'array' && keyMap.hasAlphaKeys()) {
            keyMap.family = 'object';
        }
        else if (keyMap.family === 'object' && keyMap.isArray()) {
            keyMap.family = 'array';
        }
    }


    $.extend( hx , { KeyMap : KeyMap });

    
}( window , hxManager , hxManager.Helper ));




























(function( window , hx , Config , Helper , When , Easing , Animator , KeyMap ) {


    var ODP = Object.defineProperty;


    function Bean( seed ) {

        if (!seed.type) {
            throw new TypeError( 'Bean type is required.' );
        }

        ODP( this , 'hasAnimator' , {
            get: function() {
                return (typeof this.animator !== 'undefined');
            }
        });

        ODP( this , 'complete' , {
            get: function() {
                return (this.hasAnimator ? !this.animator.running : false);
            }
        });

        ODP( this , 'easing' , {
            get: function() {
                return Easing( this.options.easing );
            }
        });

        $.extend( this , getCompiledData( seed ));
    }


    Bean.prototype = Object.create( When );


    Bean.prototype.setStyleString = function( str ) {
        this.styleString = str;
    };


    Bean.prototype.createAnimator = function( options ) {

        if (!this.hasAnimator) {
            
            $.extend( options , this.options.export() );
            this.animator = new Animator( options );

            this.animator.when( 'complete' , onComplete , this );
        }
    };


    Bean.prototype.startAnimator = function() {
        if (this.hasAnimator && !this.animator.running) {
            this.animator.start();
        }
    };


    Bean.prototype.resolveBean = function() {
        if (this.hasAnimator && !this.complete) {
            this.animator.destroy();
        }
    };


    function onComplete() {
        this.happen( 'complete' , [ this ] );
    }


    function getCompiledData( seed ) {

        var type = seed.type;

        var order = _getOrder( seed );

        var options = _getOptions( seed );

        var defaults = _getDefaults( type , order );

        var raw = _getRaw( seed , defaults );

        var compiled = _getCompiled( type , raw , defaults );

        var rules = _getRules( type , compiled , raw );

        return {
            type: type,
            order: order,
            options: options,
            raw: raw,
            defaults: defaults,
            compiled: compiled,
            rules: rules
        };
    }


    function _getOrder( seed ) {

        var order = new KeyMap({
            passed: (seed.order || []),
            computed: Helper.object.getOrder( seed )
        });

        return order
            .cast()
            .each(function( keyMap , key ) {
                keyMap
                    .subtract( Config.keys.options )
                    .unique()
                    .setMaster()
                    .mapTo( Config.maps.component );
            });

        /*var order = new KeyMap(
            (seed.order || []).concat( Helper.object.getOrder( seed ))
        );

        return order
            .subtract( Config.keys.options )
            .unique()
            .setMaster()
            .mapTo( Config.maps.component );*/
    }


    function _getOptions( seed ) {

        var options = new KeyMap( seed , Config.defaults.options );

        return options
            .scrub(
                Object.keys( Config.defaults.options )
            )
            .setMaster();
    }


    function _getRaw( seed , defaults ) {

        var raw = new KeyMap( seed );

        return raw
            .subtract( Config.keys.options )
            .setMaster()
            .mapTo( Config.maps.component )
            .each(function( val , key ) {
                if (val === null) {
                    val = defaults[key].export();
                }
                raw[key] = (typeof val === 'object' ? val : [ val ]);
            })
            .cast();
    }


    function _getDefaults( type , order ) {

        var defaults = new KeyMap(
            Config.defaults[type] || Config.defaults.nonTransform
        );

        return defaults
            .scrub( order.computed.export() )
            .each(function( val , key ) {
                defaults[key] = (typeof val === 'object' ? val : [ val ]);
            })
            .cast()
            .setMaster();
    }


    function _getCompiled( type , raw , defaults ) {

        var compiled = raw.clone();

        return compiled
            .cast()
            .each(function( keyMap , key ) {
                //if (keyMap instanceof KeyMap) {
                    var map = Config.maps[ type ] || Config.maps.nonTransform;
                    keyMap
                        .mapTo( map[key] || map.other )
                        .merge(
                            defaults[key].export()
                        );
                //}
            })
            .setMaster();
    }


    function _getRules( type , compiled , raw ) {

        var compareTo = raw.clone()
            .cast()
            .each(function( keyMap , key ) {
                //if (keyMap instanceof KeyMap) {
                    //console.log(keyMap);
                    var map = Config.maps[ type ] || Config.maps.nonTransform;
                    keyMap.mapTo( map[key] || map.other );
                //}
            });

        //return compareTo;

        //var rules = compiled.clone();

        return compiled.clone()
            .cast()
            .compare( compareTo );

        /*return rules
            .cast()
            .each(function( keyMap , key ) {
                if (keyMap instanceof KeyMap) {
                    var map = Config.maps[ type ] || Config.maps.nonTransform;
                    keyMap.mapFrom( map[key] || map.other );
                }
            })
            .compare( raw )
            .each(function( keyMap , key ) {
                if (keyMap instanceof KeyMap) {
                    var map = Config.maps[ type ] || Config.maps.nonTransform;
                    keyMap.mapTo( map[key] || map.other );
                }
            });*/
    }


    $.extend( hx , { Bean : Bean });

    
}( window , hxManager , hxManager.Config , hxManager.Helper , hxManager.When , hxManager.Easing , hxManager.Animator , hxManager.KeyMap ));




























(function( window , hx , Config , Helper , When , VendorPatch ) {


    var EACH = Helper.object.each;
    var ODP = Object.defineProperty;


    // =========================== pod constructor ========================== //


    function Pod( node , type ) {

        if (!isValidType( type )) {
            throw new TypeError( 'Invalid pod type' );
        }

        var _pod = null;

        switch (type) {

            case 'xform':
                _pod = new xformPod( node );
                break;

            case 'promise':
                _pod = new promisePod();
                break;
        }

        return _pod;
    }


    function isValidType( type ) {
        return (typeof type === 'string' && Config.types.indexOf( type ) >= 0);
    }


    // ============================== xformPod ============================== //


    function xformPod( node ) {

        this.node = node;
        this.beans = {};
        
        ODP( this , 'type' , {
            get: function() {
                return 'xform';
            }
        });

        ODP( this , 'resolved' , {
            get: function() {
                return Helper.object.size( this.beans ) === 0;
            }
        });
    }


    var xformPod_prototype = (xformPod.prototype = Object.create( When ));


    xformPod_prototype.addBean = function( bean ) {
        var type = bean.type;
        var cluster = (this.beans[type] = this.beans[type] || []);
        cluster.push( bean );
    };


    xformPod_prototype.run = function() {

        var sequence = getActiveSequence( this.beans );

        setTransition( this.node , sequence );

        EACH( sequence , function( bean , key ) {
            
            if (bean.hasAnimator) {
                return;
            }

            this._runBean( bean );

        } , this );
    };


    xformPod_prototype._runBean = function( bean ) {

        bean.setStyleString(
            this.node._hx.updateComponent( bean )
        );

        var options = {
            node: this.node,
            property: bean.type,
            eventType: VendorPatch.eventType,
        };

        bean.createAnimator( options );
        bean.when( 'complete' , this._beanComplete , this );

        // check the hx_display code and correct style.display if needed
        this.node._hx.checkDisplayState();

        applyXform( this.node , bean );
        bean.startAnimator();

        this.happen( 'beanStart' , [ bean ] );
    };


    xformPod_prototype._beanComplete = function( bean ) {

        var type = bean.type;
        var cluster = this.beans[type];

        this.happen( 'beanComplete' , [ bean ] );

        // if cluster is undefined, the pod must have been force-completed
        if (!cluster) {
            return;
        }

        cluster.shift();

        if (cluster.length > 0) {
            this.run();
        }
        else {
            this._clusterComplete( type );
        }
    };


    xformPod_prototype._clusterComplete = function( type ) {

        var sequence = getActiveSequence( this.beans );
        setTransition( this.node , sequence , true );

        delete this.beans[type];

        this.happen( 'clusterComplete' , [ type ] );

        if (this.resolved) {
            this.resolvePod();
        }
    };


    xformPod_prototype.resolvePod = function() {

        if (!this.resolved) {
            forceResolve( this , this.beans );
        }
        else {
            this.happen( 'podComplete' , [ this ] );
        }
    };


    xformPod_prototype.cancel = function() {

        this.happen( 'podCanceled' , [ this ] );

        EACH( this.beans , function( cluster , key ) {
            while (cluster.length > 0) {
                cluster.shift().resolveBean();
            }
        });
    };


    function forceResolve( instance , beans ) {

        EACH( beans , function( cluster , key ) {
            
            var lastBean = cluster.pop();
            delete beans[key];

            lastBean.resolveBean();

            instance.happen( 'beanComplete' , [ lastBean ] );
            instance.happen( 'clusterComplete' , [ lastBean.type ] );

        });

        instance.happen( 'podComplete' , [ instance ] );

        // if this is the last xform pod in the queue, reset the transition
        if (!instance.node._hx.getPodCount( 'xform' )) {
            setTransition( instance.node , {} , true );
        }
    }


    function setTransition( node , sequence , last ) {

        last = typeof last !== 'undefined' ? last : false;

        var tProp = VendorPatch.getPrefixed( 'transition' );
        var tString = buildTransitionString( sequence , last );

        if (node.style.transition === tString) {
            return;
        }

        $(node).css( tProp , tString );
    }


    function applyXform( node , bean ) {
        var tProp = VendorPatch.getPrefixed( bean.type );
        $(node).css( tProp , bean.styleString );
    }


    function getActiveSequence( beans ) {

        var sequence = {};
        
        EACH( beans , function( cluster , key ) {
            if (cluster.length > 0) {
                sequence[key] = cluster[0];
            }
        });

        return sequence;
    }


    function buildTransitionString( sequence , last ) {
        
        var arr = [];

        EACH( sequence , function( bean , type ) {

            var options = bean.options;
            var easing = bean.easing;

            // android native browser won't respond to zero duration when cancelling a transition
            if (!last) {
                options.duration = VendorPatch.getDuration( options.duration );
            }

            // don't add a component for transitions with duration and delay of 0
            if (options.duration < 1 && options.delay < 1) {
                return;
            }

            var component = type + ' ' + options.duration + 'ms ' + easing + ' ' + options.delay + 'ms';
            if (arr.indexOf( component ) < 0) {
                arr.push( component );
            }
        });
        
        return VendorPatch.getPrefixed(
            arr.join( ', ' )
        );
    }


    // ============================= promisePod ============================= //


    function promisePod() {
        ODP( this , 'type' , {
            get: function() {
                return 'promise';
            }
        });
    }


    var promisePod_prototype = (promisePod.prototype = Object.create( When ));


    promisePod_prototype.run = function() {
        this.happen( 'promiseMade' );
    };


    promisePod_prototype.resolvePromise = function() {
        this.happen( 'promiseResolved' );
    };


    promisePod_prototype.resolvePod = function() {
        this.happen( 'podComplete' , [ this ] );
    };


    promisePod_prototype.cancel = function() {
        this.happen( 'podCanceled' , [ this ] );
    };


    // ====================================================================== //


    $.extend( hx , { Pod : Pod });

    
}( window , hxManager , hxManager.Config.Pod , hxManager.Helper , hxManager.When , hxManager.VendorPatch ));




























(function( window , hx ) {


    function Queue() {

        Object.defineProperty( this , 'current' , {
            get: function() {
                return this[0] || false;
            }
        });

        Object.defineProperty( this , 'complete' , {
            get: function() {
                return this.length === 0;
            }
        });
    }


    Queue.prototype = Object.create( Array.prototype );


    Queue.prototype.pushPod = function( pod ) {

        this.push( pod );

        if (this.length === 1) {
            this.current.run();
        }
    };


    Queue.prototype.next = function() {

        this.shift();

        if (!this.complete) {
            this.current.run();
            return true;
        }

        return false;
    };


    Queue.prototype.clear = function( all ) {

        // all controls whether all pods or all but the current pod will be cleared
        all = (typeof all !== 'undefined' ? all : true);

        while (this.length > (all ? 0 : 1)) {
            this.pop().cancel();
        }
    };


    Queue.prototype.getPodCount = function( type ) {

        var count = 0;

        this.forEach(function( pod ) {
            if (!type || pod.getType() === type) {
                count++;
            }
        });

        return count;
    };


    $.extend( hx , { Queue : Queue });

    
}( window , hxManager ));




























(function( window , hx , Config , Helper , Get , KeyMap , Queue ) {

    
    function DomNode( element ) {

        // if this is already an hx element, return it
        if (typeof element._hx !== 'undefined') {
            return element;
        }

        // otherwise, create a new hx element
        return _init( this , element );
    }


    var hxModule = {

        checkDisplayState: function() {
            if (!_checkDisplayState( this )) {
                _prepHidden( this );
            }
        },

        getStyleString: function( type ) {

            var that = this;
            var stringMap = Config.maps.styleString;
            var order = that._hx.getOrder( type );

            var arr = order.map(function( name ) {
                var property = that._hx.getComponents( type , name );
                var map = getPropertyMap( name );
                if (map) {
                    return name + '(' + property.join( map.join ) + map.append + ')';
                }
                return property[0];
            });

            function getPropertyMap( name ) {
                var re;
                for (var key in stringMap) {
                    re = new RegExp( key , 'i' );
                    if (re.test( name )) {
                        return stringMap[key];
                    }
                }
                return false;
            }

            return arr.join( ' ' );
        },

        getComponents: function( type , property ) {
            var component = this._hx.components;
            if (type) {
                component[type] = (this._hx.components[type] = this._hx.components[type] || {});
                if (property) {
                    component[type][property] = component[type][property] || [];
                    return component[type][property];
                }
                return component[type];
            }
            return component;
        },

        _setComponent: function( type , newComponent ) {
            
            var that = this;
            var updated = {};

            var defaults = new KeyMap(
                Config.defaults[type] || Config.defaults.nonTransform
            )
            .scrub(
                Object.keys( newComponent )
            );

            new KeyMap( newComponent )
                .each(function( val , property ) {
                    if (Helper.array.compare( val , defaults[property] )) {
                        that._hx._deleteComponent( type , property );
                    }
                    else {
                        updated[property] = val;
                    }
                });

            updated = $.extend( that._hx.getComponents( type ) , updated );
            that._hx.components[type] = updated;
        },

        _deleteComponent: function( type , property ) {
            delete this._hx.components[type][property];
        },

        updateComponent: function( bean ) {

            var that = this;

            var type = bean.type;
            var compiled = bean.compiled;
            var defaults = bean.defaults;
            var rules = bean.rules;
            var newComponents = {};

            compiled.each(function( compiledProperty , name ) {

                var ruleProperty = rules[name];
                var defaultProperty = defaults[name].export();
                var storedProperty = $.extend( defaultProperty , that._hx.getComponents( type , name ));
                
                newComponents[name] = storedProperty.map(function( storedVal , i ) {

                    // if ruleProperty[i] is true, update the stored value
                    if (ruleProperty[i]) {
                        return mergeUpdates( storedVal , compiledProperty[i] );
                    }

                    // otherwise, leave it as is
                    return storedVal;
                });
            });

            function mergeUpdates( storedVal , newVal ) {
                var _eval = eval;
                var parts = _parseExpression( newVal );
                return (parts.op ? _eval(storedVal + parts.op + parts.val) : parts.val);
            }

            that._hx._setComponent( type , newComponents );
            this._hx._updateOrder( bean );

            return that._hx.getStyleString( type );
        },

        getOrder: function( type ) {
            var order = this._hx.order;
            if (type) {
                order[type] = (this._hx.order[type] = this._hx.order[type] || []);
                return order[type];
            }
            return order;
        },

        _setOrder: function( type , newOrder ) {
            this._hx.order[type] = newOrder;
        },

        _updateOrder: function( bean ) {
            var that = this;
            var type = bean.type;
            var storedOrder = that._hx.getOrder( type );
            var passedOrder = bean.order.passed.export();
            var computedOrder = bean.order.computed.export();
            var newOrder = (passedOrder.concat( storedOrder )).concat( computedOrder );
            that._hx._setOrder( type ,
                new KeyMap( newOrder )
                    .unique()
                    .scrub(
                        Object.keys( that._hx.getComponents( type ))
                    )
                    .export()
            );
        },

        addXformPod: function( pod ) {

            pod.when( 'beanStart' , beanStart , this );
            pod.when( 'beanComplete' , beanComplete , this );
            pod.when( 'clusterComplete' , clusterComplete , this );
            pod.when( 'podComplete' , podComplete , this );
            pod.when( 'podCanceled' , xformCanceled , this );

            this._hx.queue.pushPod( pod );
        },

        addPromisePod: function( pod ) {

            pod.when( 'podComplete' , podComplete , this );
            pod.when( 'podCanceled' , promiseCanceled , this );

            this._hx.queue.pushPod( pod );
        },

        clearQueue: function( all ) {
            this._hx.queue.clear( all );
        },

        getCurrentPod: function() {
            return this._hx.queue.current;
        },

        getPodCount: function( type ) {
            return this._hx.queue.getPodCount( type );
        },

        cleanup: function() {

            Config.removeOnClean.forEach(function( key ) {
                delete this[key];
            }.bind( this ));
        }
    };


    function beanStart( bean ) {
        $(this).trigger( 'hx.xformStart' , {
            type: bean.type,
            xform: bean.raw.revert().export(),
            options: bean.options
        });
    }


    function beanComplete( bean ) {
        $(this).trigger( 'hx.xformComplete' , {
            type: bean.type,
        });
        bean.options.done.call( this );
    }

    function clusterComplete( type ) {
        // do something on cluster complete
    }

    function podComplete( pod ) {
        this._hx.queue.next();
    }

    function xformCanceled( pod ) {
        pod.dispel( 'beanComplete' );
        pod.dispel( 'clusterComplete' );
        pod.dispel( 'podComplete' );
    }

    function promiseCanceled( pod ) {
        pod.dispel( 'podComplete' );
    }


    function _init( instance , element ) {

        var _node = $.extend( element , instance );
        var _hxModule = Get.scopedModule( hxModule , _node );

        _node._hx = $.extend({
            queue: new Queue(),
            components: {},
            order: {}
        } , _hxModule );

        return _node;
    }

    
    function _checkDisplayState( instance ) {
        
        var hx_display = _getHXDisplay( instance );
        var style = instance.style.display;
        var response = null;

        if (hx_display === null) {
            
            var computed = getComputedStyle( instance ).display;

            // determine the hx_display code
            if (computed !== 'none' && style === '') {
                // visible, not styled inline
                hx_display = 0;
            }
            else if (computed !== 'none' && computed === style) {
                // visible, styled inline
                hx_display = 1;
            }
            else if (computed === 'none' && style === '') {
                // hidden, not styled inline
                hx_display = 2;
            }
            else if (computed === 'none' && computed === style) {
                // hidden, styled inline
                hx_display = 3;
            }

            _setHXDisplay( instance , hx_display );

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

    
    function _getHXDisplay( instance ) {
        var hx_display = typeof instance.hx_display !== 'undefined' ? instance.hx_display : null;
        if (hx_display !== null) {
            hx_display = parseInt( hx_display , 10 );
        }
        return hx_display;
    }

    
    function _setHXDisplay( instance , value ) {
        instance.hx_display = value;
    }

    
    function _prepHidden( instance ) {
        instance.style.opacity = 0;
        instance.style.display = 'block';
        // trigger a dom reflow
        instance.getBoundingClientRect();
    }


    function _parseExpression( exp ) {

        var re = /((\+|\-|\*|\/|\%){1})+\=/;
        var out = {op: null, val: 0};

        var match = re.exec( exp );

        if (match) {
            out.op = match[1];
            exp = exp.replace( re , '' );
        }

        out.val = exp;

        if (out.op) {
            out.val = parseFloat( out.val , 10 );
        }
        
        return out;
    }


    $.extend( hx , { DomNode : DomNode });

    
}( window , hxManager , hxManager.Config , hxManager.Helper , hxManager.Get , hxManager.KeyMap , hxManager.Queue ));




























(function( window , $ , hx , Helper , Get ) {

    
    $.fn.hx = function( hxArgs ) {

        var hxm = new hx( this );

        switch (typeof hxArgs) {

            case 'string':

                var method = Array.prototype.shift.call( arguments );

                try {
                    hxm[method].apply( hxm , arguments );
                }
                catch( err ) {
                    throw new TypeError( method + ' is not a function.' );
                }

            break;

            case 'object':

                if (Array.isArray( hxArgs )) {
                    // make sure transform seeds are placed first in the bundle
                    hxArgs = Get.orderedBundle( hxArgs );
                }
                else {
                    hxArgs = [ hxArgs ];
                }

                hxm._addXformPod( hxArgs );

            break;
        }

        return hxm;
    };

 
}( window , jQuery , hxManager , hxManager.Helper , hxManager.Get ));






















/*

Copyright (c) 2013 Yehuda Katz, Tom Dale, and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

!function(){var a,b,c,d;!function(){var e={},f={};a=function(a,b,c){e[a]={deps:b,callback:c}},d=c=b=function(a){function c(b){if("."!==b.charAt(0))return b;for(var c=b.split("/"),d=a.split("/").slice(0,-1),e=0,f=c.length;f>e;e++){var g=c[e];if(".."===g)d.pop();else{if("."===g)continue;d.push(g)}}return d.join("/")}if(d._eak_seen=e,f[a])return f[a];if(f[a]={},!e[a])throw new Error("Could not find module "+a);for(var g,h=e[a],i=h.deps,j=h.callback,k=[],l=0,m=i.length;m>l;l++)"exports"===i[l]?k.push(g={}):k.push(b(c(i[l])));var n=j.apply(this,k);return f[a]=g||n}}(),a("promise/all",["./utils","exports"],function(a,b){"use strict";function c(a){var b=this;if(!d(a))throw new TypeError("You must pass an array to all.");return new b(function(b,c){function d(a){return function(b){f(a,b)}}function f(a,c){h[a]=c,0===--i&&b(h)}var g,h=[],i=a.length;0===i&&b([]);for(var j=0;j<a.length;j++)g=a[j],g&&e(g.then)?g.then(d(j),c):f(j,g)})}var d=a.isArray,e=a.isFunction;b.all=c}),a("promise/asap",["exports"],function(a){"use strict";function b(){return function(){process.nextTick(e)}}function c(){var a=0,b=new i(e),c=document.createTextNode("");return b.observe(c,{characterData:!0}),function(){c.data=a=++a%2}}function d(){return function(){j.setTimeout(e,1)}}function e(){for(var a=0;a<k.length;a++){var b=k[a],c=b[0],d=b[1];c(d)}k=[]}function f(a,b){var c=k.push([a,b]);1===c&&g()}var g,h="undefined"!=typeof window?window:{},i=h.MutationObserver||h.WebKitMutationObserver,j="undefined"!=typeof global?global:this,k=[];g="undefined"!=typeof process&&"[object process]"==={}.toString.call(process)?b():i?c():d(),a.asap=f}),a("promise/cast",["exports"],function(a){"use strict";function b(a){if(a&&"object"==typeof a&&a.constructor===this)return a;var b=this;return new b(function(b){b(a)})}a.cast=b}),a("promise/config",["exports"],function(a){"use strict";function b(a,b){return 2!==arguments.length?c[a]:(c[a]=b,void 0)}var c={instrument:!1};a.config=c,a.configure=b}),a("promise/polyfill",["./promise","./utils","exports"],function(a,b,c){"use strict";function d(){var a="Promise"in window&&"cast"in window.Promise&&"resolve"in window.Promise&&"reject"in window.Promise&&"all"in window.Promise&&"race"in window.Promise&&function(){var a;return new window.Promise(function(b){a=b}),f(a)}();a||(window.Promise=e)}var e=a.Promise,f=b.isFunction;c.polyfill=d}),a("promise/promise",["./config","./utils","./cast","./all","./race","./resolve","./reject","./asap","exports"],function(a,b,c,d,e,f,g,h,i){"use strict";function j(a){if(!w(a))throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");if(!(this instanceof j))throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");this._subscribers=[],k(a,this)}function k(a,b){function c(a){p(b,a)}function d(a){r(b,a)}try{a(c,d)}catch(e){d(e)}}function l(a,b,c,d){var e,f,g,h,i=w(c);if(i)try{e=c(d),g=!0}catch(j){h=!0,f=j}else e=d,g=!0;o(b,e)||(i&&g?p(b,e):h?r(b,f):a===F?p(b,e):a===G&&r(b,e))}function m(a,b,c,d){var e=a._subscribers,f=e.length;e[f]=b,e[f+F]=c,e[f+G]=d}function n(a,b){for(var c,d,e=a._subscribers,f=a._detail,g=0;g<e.length;g+=3)c=e[g],d=e[g+b],l(b,c,d,f);a._subscribers=null}function o(a,b){var c,d=null;try{if(a===b)throw new TypeError("A promises callback cannot return that same promise.");if(v(b)&&(d=b.then,w(d)))return d.call(b,function(d){return c?!0:(c=!0,b!==d?p(a,d):q(a,d),void 0)},function(b){return c?!0:(c=!0,r(a,b),void 0)}),!0}catch(e){return c?!0:(r(a,e),!0)}return!1}function p(a,b){a===b?q(a,b):o(a,b)||q(a,b)}function q(a,b){a._state===D&&(a._state=E,a._detail=b,u.async(s,a))}function r(a,b){a._state===D&&(a._state=E,a._detail=b,u.async(t,a))}function s(a){n(a,a._state=F)}function t(a){n(a,a._state=G)}var u=a.config,v=(a.configure,b.objectOrFunction),w=b.isFunction,x=(b.now,c.cast),y=d.all,z=e.race,A=f.resolve,B=g.reject,C=h.asap;u.async=C;var D=void 0,E=0,F=1,G=2;j.prototype={constructor:j,_state:void 0,_detail:void 0,_subscribers:void 0,then:function(a,b){var c=this,d=new this.constructor(function(){});if(this._state){var e=arguments;u.async(function(){l(c._state,d,e[c._state-1],c._detail)})}else m(this,d,a,b);return d},"catch":function(a){return this.then(null,a)}},j.all=y,j.cast=x,j.race=z,j.resolve=A,j.reject=B,i.Promise=j}),a("promise/race",["./utils","exports"],function(a,b){"use strict";function c(a){var b=this;if(!d(a))throw new TypeError("You must pass an array to race.");return new b(function(b,c){for(var d,e=0;e<a.length;e++)d=a[e],d&&"function"==typeof d.then?d.then(b,c):b(d)})}var d=a.isArray;b.race=c}),a("promise/reject",["exports"],function(a){"use strict";function b(a){var b=this;return new b(function(b,c){c(a)})}a.reject=b}),a("promise/resolve",["exports"],function(a){"use strict";function b(a){var b=this;return new b(function(b){b(a)})}a.resolve=b}),a("promise/utils",["exports"],function(a){"use strict";function b(a){return c(a)||"object"==typeof a&&null!==a}function c(a){return"function"==typeof a}function d(a){return"[object Array]"===Object.prototype.toString.call(a)}var e=Date.now||function(){return(new Date).getTime()};a.objectOrFunction=b,a.isFunction=c,a.isArray=d,a.now=e}),b("promise/polyfill").polyfill()}();