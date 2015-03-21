/*! jquery.hx - 1.0.4 - Bernard McManus - a383dc5 - 2015-03-21 */

/*! wee-promise - 0.2.1 - Bernard McManus - master - gb12466 - 2015-03-21 */
!function(a){var b=this;"object"==typeof exports?module.exports=a:b.WeePromise=a}(function(a){"use strict";function b(a){var b=this;k([v,w,u],function(a){b[a]=[]}),h(function(){b[B]=e(b),i(b,function(){a(c(b,v),c(b,w))}),b[z]=!0})}function c(a,b){function c(d){h(a[z]?function(){a[s]||a[y](b,d)[y](u,d)}:function(){c(d)})}return c}function d(a,b,c,d,e){return function(){a=a.map(function(a){return g(a[t])?a[t]:a});var h=f(a,1),i=f(a,-1);if(j(h)===d){var k=h.map(function(a){return a[t][0]});b(e?k[0]:k)}else j(i)>0&&c(i[0][t][0])}}function e(a){return j(a[w])>0}function f(a,b){return a.filter(function(a){return a[s]===b})}function g(a){return a instanceof b}function h(b){a(b,1)}function i(a,b){try{return b()}catch(c){return a[y](w,c)}}function j(a){return a.length}function k(a,b){a.forEach(b)}var l,m="$$",n="prototype",o="always",p="then",q="catch",r=m+"pass",s=m+"state",t=m+"args",u=m+o,v=m+p,w=m+q,x=m+"add",y=m+"exec",z=m+"ready",A=m+"child",B=m+"handled",C=B+"Self",D={};return D[v]=1,D[w]=-1,b[n][x]=function(a,b){var c=this;return b&&c[a].push(b),c},b[n][y]=function(a,b){var c,d=this,e=d[a],f=j(e),h=0,k=D[a];return i(d,function(){for(;f>h;){if(k&&d[s]===k&&d[A]&&d[B]&&(e=!d[C]||d[z]?[]:e.slice(-1),h=f-1,!j(e)))return d;if(c=(k?e.shift():e[h]).apply(l,[b]),b=k?c:b,g(c))return d[r](c);if(a==w){if(d[B]&&(k=D[v],d[A]))return d[s]=k,d[t]=[c],d[y](v,c)[y](u,c);break}h++}return d[t]=d[s]?d[t]:[b],d[s]=k||d[s],d})},b[n][o]=function(a){return this[x](u,a)},b[n][p]=function(a,b){return this[x](v,a)[q](b)},b[n][q]=function(a){return this[x](w,a)},b[n][r]=function(a){var b=this;return a[C]=e(a),a[A]=!0,k([v,w,u],function(c){a[c]=a[C]?a[c].concat(b[c]):b[c]}),b[t]=a,a},b.all=function(a){return new b(function(b,c){k(a,function(e){e[o](d(a,b,c,j(a)))})})},b.race=function(a){return new b(function(b,c){k(a,function(e){e[o](d(a,b,c,1,!0))})})},b}(setTimeout));
/*! mojo - 0.1.6 - Bernard McManus - master - g727d74 - 2014-10-16 */
var _MOJO={},MOJO={};_MOJO.Shared=function(a,b){function c(a){return a.length}function d(b){return a.keys(b)}function e(a){return b.prototype.shift.call(a)}function f(a){return a instanceof b?a:a!==i?[a]:[]}function g(a,b){return{get:a,set:b,configurable:!0}}function h(a){return(a||{})[j]?a[j]:a}var i,j="handleMOJO";return{length:c,keys:d,shift:e,ensureArray:f,descriptor:g,getHandlerFunc:h}}(Object,Array),_MOJO.EventHandler=function(a){function b(a,b,c){var e=this;e.handler=a,e.context=b,e.active=!0,e.callback=function(){},e.args=d(c)}var c=a.Shared,d=c.ensureArray;return b.prototype={invoke:function(a,b){var c=this,e=c.handler;if(c.active&&!a.isBreak&&!a.shouldSkip(e)){var f=c.args.concat(d(b));f.unshift(a),e.apply(c.context,f),c.callback(a,e)}}},b}(_MOJO),_MOJO.Event=function(a,b){function c(b,c){var d=this;d.isBreak=e,d.cancelBubble=e,d.defaultPrevented=e,d.skipHandlers=[],d.target=b,d.type=c,d.timeStamp=a.now()}var d=!0,e=!1,f=b.Shared,g=f.ensureArray,h=f.getHandlerFunc;return c.prototype={skip:function(a){var b=this.skipHandlers;g(a).forEach(function(a){b.push(h(a))})},shouldSkip:function(a){return this.skipHandlers.indexOf(a)>=0},"break":function(){this.isBreak=d},preventDefault:function(){this.defaultPrevented=d},stopPropagation:function(){this.cancelBubble=d}},c}(Date,_MOJO),_MOJO.When=function(a,b,c){function d(a,b){return l(a).map(function(a){return a.handler}).indexOf(b)}function e(a,c){(a instanceof b?a:a.split(" ")).forEach(c)}function f(a,b){return a===b?null:a}var g=c.Shared,h=c.EventHandler,i=c.Event,j=g.keys,k=g.shift,l=g.ensureArray,m=g.length,n=g.getHandlerFunc,o={once:function(){var a=this,b=a._when(arguments);return b.forEach(function(a){a.callback=function(){this.active=!1}}),a},when:function(){var a=this;return a._when(arguments),a},_when:function(a){var b=this,c=k(a),d=m(a)>1?k(a):d,g=[],i=k(a),j=n(i),l=f(i,j);return e(c,function(a,c){g.push(new h(j,l,d)),b._addHandler(a,g[c])}),g},happen:function(a,b){var c=this;return a=c._ensureEType(a),e(a,function(a){var d=c._getHandlers(a,!0),e=new i(c,a);d.filter(function(a){return a.invoke(e,b),!a.active}).forEach(function(b){c._removeHandler(c._getHandlers(a),b.handler)})}),c},dispel:function(a,b){var c=this,d=c._getHandlers(),f=n(b);return a=c._ensureEType(a),e(a,function(a){f?c._removeHandler(d[a],f):delete d[a]}),c},_ensureEType:function(a){return a||j(this._getHandlers()).join(" ")},_getHandlers:function(b,c){var d=this,e=d.handlers=d.handlers||{},f=b?e[b]=e[b]||[]:e;return c?b?f.slice():a.create(f):f},_addHandler:function(a,b){var c=this;c._getHandlers(a).push(b)},_removeHandler:function(a,b){var c=d(a,b);c>=0&&a.splice(c,1)}};return o}(Object,Array,_MOJO),MOJO=function(a){function b(a){a=a||{};var c=this;b.Each(a,function(a,b){c[b]=a}),b.Construct(c)}var c=b.prototype=Object.create(a.When);return c.each=function(a){var c=this;return b.Each(c,a,c.keys),c},c.set=function(a,b){var c=this;return c[a]=b,c.happen("set",a),c},c.remove=function(a){var b=this;return delete b[a],b.happen("remove",a),b},b}(_MOJO),MOJO.Each=function(a){function b(a,b,c){(c||d(a)).forEach(function(c,d){b(a[c],c,d)})}var c=a.Shared,d=c.keys;return b}(_MOJO),MOJO.Create=function(a,b){function c(c){var d=a.create(b.prototype);return b.Each(c,function(a,b){d[b]=a}),d}return c}(Object,MOJO),MOJO.Construct=function(a,b){function c(b){var c={};a.defineProperties(b,{handlers:{get:function(){return c},set:function(a){c=a},configurable:!0},keys:f(function(){return e(b)}),length:f(function(){return g(b.keys)}),handleMOJO:{value:(b.handleMOJO||function(){}).bind(b),configurable:!0}})}var d=b.Shared,e=d.keys,f=d.descriptor,g=d.length;return c}(Object,_MOJO),function(a){"object"==typeof exports?module.exports=a:window.MOJO=a}(MOJO);
/**
 * BezierEasing - use bezier curve for transition easing function
 * is based on Firefox's nsSMILKeySpline.cpp
 * Usage:
 * var spline = BezierEasing(0.25, 0.1, 0.25, 1.0)
 * spline(x) => returns the easing value | x must be in [0, 1] range
 *
 */
(function (definition) {
  window.BezierEasing = definition();
}(function () {
  var global = this;

  // These values are established by empiricism with tests (tradeoff: performance VS precision)
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 0.001;
  var SUBDIVISION_PRECISION = 0.0000001;
  var SUBDIVISION_MAX_ITERATIONS = 10;

  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  var float32ArraySupported = 'Float32Array' in global;

  function BezierEasing (mX1, mY1, mX2, mY2) {
    // Validate arguments
    if (arguments.length !== 4) {
      throw new Error("BezierEasing requires 4 arguments.");
    }
    for (var i=0; i<4; ++i) {
      if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
        throw new Error("BezierEasing arguments should be integers.");
      } 
    }
    if (mX1 < 0 || mX1 > 1 || mX2 < 0 || mX2 > 1) {
      throw new Error("BezierEasing x values must be in [0, 1] range.");
    }

    var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
   
    function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C (aA1)      { return 3.0 * aA1; }
   
    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function calcBezier (aT, aA1, aA2) {
      return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
    }
   
    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function getSlope (aT, aA1, aA2) {
      return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }

    function newtonRaphsonIterate (aX, aGuessT) {
      for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) return aGuessT;
        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    }

    function calcSampleValues () {
      for (var i = 0; i < kSplineTableSize; ++i) {
        mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function binarySubdivide (aX, aA, aB) {
      var currentX, currentT, i = 0;
      do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0.0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
      } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
      return currentT;
    }

    function getTForX (aX) {
      var intervalStart = 0.0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample != lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;

      // Interpolate to provide an initial guess for t
      var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;

      var initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT);
      } else if (initialSlope == 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
      }
    }

    var _precomputed = false;
    function precompute() {
      _precomputed = true;
      if (mX1 != mY1 || mX2 != mY2)
        calcSampleValues();
    }

    var f = function (aX) {
      if (!_precomputed) precompute();
      if (mX1 === mY1 && mX2 === mY2) return aX; // linear
      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
      if (aX === 0) return 0;
      if (aX === 1) return 1;
      return calcBezier(getTForX(aX), mY1, mY2);
    };
    var str = "BezierEasing("+[mX1, mY1, mX2, mY2]+")";
    f.toString = function () { return str; };

    return f;
  }

  return BezierEasing;

}));



window.hxManager = function( j ) {
    var that = this;
    return that._init( that , j );
};


hxManager.__ready = function() {

    hxManager.Inject(
    [
        document,
        Error,
        jQuery,
        WeePromise,
        MOJO,
        hxManager,
        'DomNodeFactory',
        'PodFactory',
        'Bean',
        'IteratorMOJO',
        'defProp',
        'create',
        'descriptor',
        'ensureArray',
        'isFunc',
        'isUndef',
        'instOf',
        'length',
        'PROTOTYPE'
    ],
    function(
        document,
        Error,
        $,
        Promise,
        MOJO,
        hxManager,
        DomNodeFactory,
        PodFactory,
        Bean,
        IteratorMOJO,
        defProp,
        create,
        descriptor,
        ensureArray,
        isFunc,
        isUndef,
        instOf,
        length,
        PROTOTYPE
    ){

        var hxManager_prototype = (hxManager[PROTOTYPE] = create( $[PROTOTYPE] ));


        hxManager_prototype._init = function( that , j ) {

            if (instOf( j , hxManager )) {
                return j;
            }

            j.each(function( i ) {
                that[i] = DomNodeFactory( j[i] );
            });

            defProp( that , 'length' , descriptor(
                function() {
                    return length( j );
                }
            ));

            return that;
        };


        hxManager_prototype.animate = function( bundle ) {

            var that = this;

            return eachNode( that , function( $hx , node , i ) {

                var pod = PodFactory( node , 'animation' );

                ensureArray( bundle ).forEach(function( seed ) {

                    if (isFunc( seed )) {
                        pod.addCallback(
                            bind( that , seed )
                        );
                    }
                    else {
                        var bean = new Bean( seed , node , i );
                        pod.addBean( bean );
                    }
                });

                $hx.addPod( pod );
            });
        };


        hxManager_prototype.iterate = function( bundle ) {

            var that = this;

            return eachNode( that , function( $hx , node , i ) {

                var pod = PodFactory( node , 'precision' );

                ensureArray( bundle ).forEach(function( seed ) {

                    if (isFunc( seed )) {
                        pod.addCallback(
                            bind( that , seed )
                        );
                    }
                    else {
                        var bean = new Bean( seed , node , i );
                        var iterator = new IteratorMOJO( node , bean );
                        pod.addBean( iterator );
                    }
                });

                $hx.addPod( pod );
            });
        };


        hxManager_prototype.promise = function( func , method ) {

            method = method || 'all';

            var that = this;

            var pods = toArray( that ).map(function( node ) {
                var $hx = node.$hx;
                var pod = PodFactory( node , 'promise' );
                $hx.addPod( pod );
                return pod;
            });

            Promise[ method ]( pods ).then(function() {
                
                new Promise(

                    // create the macroPromise

                    bind( that , func )
                )
                .then(function() {

                    // if the macroPromise is resolved, resolve the pods

                    pods.forEach(function( pod ) {
                        pod.resolvePod();
                    });
                })
                .catch(function( err ) {

                    // otherwise, clear the queue so we can start again

                    that
                    .clear()
                    .trigger( 'hx.reject' , arguments );

                    if (instOf( err , Error )) {
                        $.hx.error( err );
                        $(document).trigger( 'hx.error' , err );
                    }
                });
            });

            return that;
        };


        hxManager_prototype.pause = function() {
            return this._precAction( 'pause' );
        };


        hxManager_prototype.resume = function() {
            return this._precAction( 'resume' );
        };


        hxManager_prototype._precAction = function( method , attempts ) {

            attempts = attempts || 0;

            var that = this;

            var pods = toArray( that )
                .map(function( node ) {
                    return node.$hx.getCurrentPod();
                })
                .filter(function( pod ) {
                    return pod.type === 'precision';
                });

            if (length( pods ) !== length( that ) && attempts < 10) {
                var unsubscribe = subscribe(function() {
                    attempts++;
                    unsubscribe();
                    that._precAction( method , attempts );
                });
            }
            else {
                pods.forEach(function( pod ) {
                    pod[ method ]();
                });
            }

            return that;
        };


        hxManager_prototype.paint = function( type ) {            
            return eachNode( this , function( $hx ) {
                $hx.paint( type );
            });
        };
        

        hxManager_prototype.reset = function( type ) {
            return eachNode( this , function( $hx ) {
                $hx.resetComponents( type );
            });
        };


        hxManager_prototype.then = function( func ) {
            return this.promise( func );
        };


        hxManager_prototype.race = function( func ) {
            return this.promise( func , 'race' );
        };


        hxManager_prototype.defer = function( time ) {
            return this.promise(function( resolve ) {
                if (time) {
                    var unsubscribe = subscribe(function( elapsed ) {
                        if (elapsed >= time) {
                            unsubscribe();
                            resolve();
                        }
                    });
                }
            });
        };


        hxManager_prototype.update = function( bundle ) {

            // update a node's components without applying the transition

            var that = this;

            ensureArray( bundle ).forEach(function( seed ) {

                eachNode( that , function( $hx , node , i ) {

                    var bean = new Bean( seed , node , i );
                    $hx.updateComponent( bean );
                });
            });

            return that;
        };


        hxManager_prototype.resolve = function( all ) {

            // all controls whether all pod types or only promise pods will be resolved
            all = (!isUndef( all ) ? all : false);

            // force resolve the current pod in each queue
            return eachNode( this , function( $hx ) {

                var pod = $hx.getCurrentPod();

                if (pod && (all || (!all && pod.type === 'promise'))) {
                    pod.resolvePod();
                }
            });
        };


        hxManager_prototype.detach = function() {

            // detach callbacks from the subscriber module,
            // but still allow the pod to continue running
            
            return eachNode( this , function( $hx ) {
                var pod = $hx.getCurrentPod();
                if (pod) {
                    pod.detach();
                }
            });
        };


        hxManager_prototype.clear = function() {

            // clear all pods in each queue
            
            return eachNode( this , function( $hx ) {
                $hx.clearQueue();
            });
        };


        hxManager_prototype.break = function() {

            var that = this;
            
            // clear all but the current pod in each queue
            eachNode( that , function( $hx ) {
                $hx.clearQueue( false );
            });

            // resolve any remaining promise pods
            return that.resolve();
        };


        hxManager_prototype.zero = function( hxArgs ) {

            var that = this;

            // update the stored components
            that.update( hxArgs );

            // remove any stored transitions
            eachNode( that , function( $hx ) {
                $hx.resetTransition();
                $hx.applyTransition();
            });

            // run paint
            return that.paint();
        };


        // !!! done does not return the hxManager instance
        hxManager_prototype.done = function( func ) {

            var that = this;

            that.promise(function( resolve ) {
                (func || function() {}).call( that );
                resolve();
            });
        };


        // !!! get does not return the hxManager instance
        hxManager_prototype.get = function( find , pretty ) {
            return toArray( this ).map(function( node ) {
                return node.$hx.getComponents( find , pretty );
            });
        };


        // !!! clean does not return the hxManager instance
        hxManager_prototype.cleanup = function() {
            eachNode( this , function( $hx ) {
                $hx.cleanup();
            });
        };


        $(document).trigger( 'hx.ready' );


        function eachNode( hxm , callback ) {
            toArray( hxm ).forEach(function( node , i ) {
                callback( node.$hx , node , i );
            });
            return hxm;
        }


        function subscribe( callback ) {
            return $.hx.subscribe( callback );
        }


        function bind( hxm , func ) {
            return func.bind( hxm );
        }


        function toArray( hxm ) {
            return hxm.toArray();
        }
    });
};




















hxManager.Helper = (function( Function , Object , Array , isNaN ) {


    var UNDEFINED;
    var NULL = null;
    var PROTOTYPE = 'prototype';
    var CALL = 'call';


    function compareArray( subject , array ) {
        
        if (!subject || !array) {
            return false;
        }

        if (length( subject ) != length( array )) {
            return false;
        }

        for (var i = 0, l = length( subject ); i < l; i++) {
            if (isArr( subject[i] ) && isArr( array[i] )) {
                if (!compareArray( subject[i] , array[i] )) {
                    return false;
                }
            }
            else if (subject[i] !== array[i]) {
                return false;
            }
        }

        return true;
    }


    function length( subject ) {
        return subject.length;
    }


    function isArr( subject ) {
        return instOf( subject , Array );
    }


    function instOf( subject , constructor ) {
        return (subject instanceof constructor);
    }


    function is( subject , type ) {
        return typeof subject === type;
    }


    function treeSearch( branch , find ) {
        for (var key in branch) {
            if (key === find) {
                return branch[key];
            }
            else if (find in branch[key]) {
                return treeSearch( branch[key] , find );
            }
        }
    }


    return {

        NULL: NULL,

        PROTOTYPE: PROTOTYPE,

        compareArray: compareArray,

        ensureArray: function( subject ) {
            return (isArr( subject ) ? subject : [ subject ]);
        },

        length: length,

        shift: function( subject ) {
            return Array[ PROTOTYPE ].shift[ CALL ]( subject );
        },

        pop: function( subject ) {
            return Array[ PROTOTYPE ].pop[ CALL ]( subject );
        },

        descriptor: function( getter , setter ) {
            return {
                get: getter,
                set: setter
            };
        },

        indexOf: function( subject , search ) {
            return subject.indexOf( search );
        },

        keys: function( subject ) {
            return Object.keys( subject );
        },

        create: function( subject ) {
            return Object.create( subject );
        },

        defProp: function( subject , name , descriptor ) {
            Object.defineProperty( subject , name , descriptor );
        },

        defProps: function( subject , props ) {
            Object.defineProperties( subject , props );
        },

        has: function( subject , key ) {
            return subject.hasOwnProperty( key );
        },

        is: is,

        del: function( subject , key ) {
            delete subject[key];
        },

        instOf: instOf,

        isFunc: function( subject ) {
            return instOf( subject , Function );
        },

        isObj: function( subject , strict ) {
            return strict ? instOf( subject , Object ) : is( subject , 'object' );
        },

        isArr: isArr,

        isNum: function( subject ) {
            return !isNaN( subject * 1 );
        },

        isNull: function( subject ) {
            return subject === NULL;
        },

        isUndef: function( subject ) {
            return subject === UNDEFINED;
        },

        test: function( subject , testval ) {
            return subject.test( testval );
        },

        treeSearch: treeSearch
    };


}( Function , Object , Array , isNaN ));
























hxManager.Inject = (function( hxManager ) {


    var Helper = hxManager.Helper;
    var pop = Helper.pop;
    var has = Helper.has;
    var is = Helper.is;


    function Inject() {

        var that = this;
        var args = arguments;
        var callback = pop( args );
        var imports = pop( args ) || parse( callback );

        imports = imports.map(function( subject ) {
            
            var out;

            if (is( subject , 'string' )) {
                if (has( Helper , subject )) {
                    out = Helper[subject];
                }
                else {
                    out = hxManager[subject];
                }
            }
            else {
                out = subject;
            }

            return out;
        });

        return callback.apply( null , imports );
    }


    Inject.parse = parse;


    function parse( func ) {
        return (/\((.*?)\)/)
            .exec( func.toString() )
            .pop()
            .replace( /(\s|(\/\*)(.*?)(\*\/))/g , '' )
            .split( ',' );
    }


    return Inject;


}( hxManager ));
























hxManager.Config = hxManager.Inject(
[
    MOJO,
    'defProps',
    'descriptor'
],
function(
    MOJO,
    defProps,
    descriptor
){


    var properties = {};

    var Config = {

        buffer: ((1000 / 60) * 2),

        optionKeys: [ 'ref' , 'type' , 'duration' , 'easing' , 'delay' , 'done' , 'order' ],

        properties: properties,

        defaults: {
            ref: null,
            duration: 400,
            easing: 'ease',
            delay: 0,
            done: function() {}
        }
    };


    defProps( properties , {

        inverse: descriptor(function() {
            var out = {};
            MOJO.Each( this , function( val , key ) {
                out[val] = key;
            });
            return out;
        })
    });

    
    return Config;

});




















hxManager.VendorPatch = hxManager.Inject(
[
    window,
    navigator,
    Date,
    RegExp,
    setTimeout,
    clearTimeout,
    'instOf',
    'test',
    'indexOf'
],
function(
    window,
    navigator,
    Date,
    RegExp,
    setTimeout,
    clearTimeout,
    instOf,
    test,
    indexOf
){


    var OTHER = 'other';
    var USER_AGENT = navigator.userAgent;

    var VENDORS = {
        webkit  : (/webkit/i),
        moz     : (/firefox/i),
        o       : (/opera/i),
        ms      : (/msie/i)
    };

    var OS = {
        android : (/android/i),
        ios     : (/(ipad|iphone|ipod)/i),
        macos   : (/mac os/i),
        windows : (/windows/i)
    };

    var PREFIX = [
        (/(?!\-)transform/g),
        (/(?!\-)transition/g),
        {
            regx: (/(?!\-)filter/g),
            omit: [ 'ms' ]
        }
    ];


    var vendor = UA_RegExp( VENDORS );
    var os = UA_RegExp( OS );


    function getRequestAnimationFrame() {
        
        var name = 'equestAnimationFrame';
        var initTime = Date.now();

        function timestamp() {
            return Date.now() - initTime;
        }
        
        return (
            window['r' + name] ||
            window['webkitR' + name] ||
            window['mozR' + name] ||
            window['oR' + name] ||
            window['msR' + name] ||
            function( callback ) {
                var timeout = setTimeout(function() {
                    callback( timestamp() );
                    clearTimeout( timeout );
                }, ( 1000 / 60 ));
            }
        ).bind( null );
    }


    function UA_RegExp( search ) {
        for (var key in search) {
            if (test( search[key] , USER_AGENT )) {
                return key;
            }
        }
        return OTHER;
    }


    function isAndroidNative( os ) {
        return (os === 'android' && !test( /(chrome|firefox)/i , USER_AGENT ));
    }


    return {

        RAF: getRequestAnimationFrame(),

        unclamped: function() {
            return isAndroidNative( os ) === false;
        },

        prefix: function( str ) {

            if (vendor === OTHER) {
                return str;
            }

            PREFIX.forEach(function( pfx ) {

                var re, omit = [];

                if (instOf( pfx , RegExp )) {
                    re = pfx;
                }
                else {
                    re = pfx.regx;
                    omit = pfx.omit || omit;
                }

                if (indexOf( omit , vendor ) < 0) {
                    var match = re.exec( str );
                    if (match) {
                        str = str.replace( re , ('-' + vendor + '-' + match[0]) );
                    }
                }
            });

            return str;
        }
    };

});





















hxManager.Bezier = hxManager.Inject(
[
    Array,
    Error,
    BezierEasing,
    'VendorPatch',
    'PROTOTYPE',
    'create',
    'defProps',
    'descriptor',
    'isUndef'
],
function(
    Array,
    Error,
    BezierEasing,
    VendorPatch,
    PROTOTYPE,
    create,
    defProps,
    descriptor,
    isUndef
){


    var UNCLAMPED = VendorPatch.unclamped();


    function Bezier( name , points ) {

        var that = this;
        var easeFunction = BezierEasing.apply( null , points );

        points.forEach(function( point ) {
            that.push(
                UNCLAMPED ? point : clamp( point )
            );
        });

        defProps( that , {

            name: {value: name},

            string: descriptor(function() {
                return 'cubic-bezier(' + that.join( ',' ) + ')';
            }),

            function: {value: easeFunction},
        });
    }


    Bezier.define = function( name , points ) {

        if (!isUndef( Definitions[name] )) {
            throw new Error( name + ' is already defined' );
        }
        
        Definitions[name] = new Bezier( name , points );
        return Definitions[name];
    };


    Bezier.retrieve = function( name ) {
        return Definitions[name] || Definitions[ Definitions.default ];
    };


    Bezier[PROTOTYPE] = create( Array[PROTOTYPE] );


    function clamp( point ) {
        return (point < 0 ? 0 : (point > 1 ? 1 : point));
    }


    var Definitions = {
        default: 'ease'
    };


    return Bezier;

});




















hxManager.Easing = hxManager.Inject(
[
    'Bezier',
    'NULL',
    'is'
],
function(
    Bezier,
    NULL,
    is
){

    function Easing( definition ) {

        var out;

        if (is( definition , 'string' )) {
            out = Bezier.retrieve( definition );
        }
        else if (is( definition , 'object' )) {
            out =  new Bezier( NULL , definition );
        }

        return out;
    }


    return Easing;

});
hxManager.StyleDefinition = hxManager.Inject(
[
    Error,
    'Config',
    'ensureArray',
    'pop',
    'shift',
    'isUndef'
],
function(
    Error,
    Config,
    ensureArray,
    pop,
    shift,
    isUndef
){


    var PropertyMap = Config.properties;


    function StyleDefinition() {

        var that = this;
        var args = arguments;
        var other = Properties.other;

        that.name = shift( args );
        that.pName = args[0] || that.name;

        that.defaults = other.defaults;
        that.keymap = other.keymap;

        that.stringGetter = function( name , CSSProperty ) {
            return CSSProperty[0];
        };
    }


    StyleDefinition.define = function() {

        var args = arguments;
        var name = pop( args );
        var prettyName = args[0] || name;
        
        if (Properties[name]) {
            throw new Error( name + ' is already defined' );
        }

        if (name !== prettyName) {
            PropertyMap[prettyName] = name;
        }

        Properties[name] = new StyleDefinition( name , prettyName );
        return Properties[name];
    };


    StyleDefinition.isDefined = function( name ) {
        return !isUndef( Properties[name] );
    };


    StyleDefinition.retrieve = function( name ) {
        return Properties[name] || new StyleDefinition( name );
    };


    StyleDefinition.prototype = {

        set: function( key , value ) {
            var that = this;
            if (key === 'defaults' || key === 'keymap') {
                value = ensureArray( value );
            }
            that[key] = value;
            return that;
        },

        toString: function( CSSProperty ) {
            return this.stringGetter( CSSProperty.name , CSSProperty );
        }
    };


    var Properties = {

        other: {
            defaults: [ '' ],
            keymap: [ 0 ]
        }
    };


    return StyleDefinition;

});




















/*jshint -W061 */
hxManager.CSSProperty = hxManager.Inject(
[   
    Array,
    parseFloat,
    eval,
    'StyleDefinition',
    'PROTOTYPE',
    'NULL',
    'compareArray',
    'defProps',
    'descriptor',
    'keys',
    'create',
    'length',
    'instOf',
    'isArr',
    'isObj',
    'isUndef'
],
function(
    Array,
    parseFloat,
    _eval,
    StyleDefinition,
    PROTOTYPE,
    NULL,
    compareArray,
    defProps,
    descriptor,
    keys,
    create,
    length,
    instOf,
    isArr,
    isObj,
    isUndef
){


    function CSSProperty( name , values ) {

        var that = this;
        var definition = StyleDefinition.retrieve( name );
        var isNull;

        defProps( that , {

            name: descriptor(function() {
                return name;
            }),

            pName: descriptor(function() {
                return definition.pName;
            }),

            defaults: descriptor(function() {
                return definition.defaults;
            }),

            isNull: descriptor(
                function() {
                    return isNull;
                },
                function( value ) {
                    isNull = value;
                }
            ),

            keymap: descriptor(function() {
                return definition.keymap;
            }),

            string: descriptor(function() {
                return definition.toString( that );
            }),

            length: descriptor(function() {
                return length(
                    keys( that )
                );
            }),

            values: descriptor(function() {
                if (length( that ) === 1) {
                    return that[0];
                }
                else {
                    var key, obj = {}, keymap = that.keymap;
                    for (var i = 0; i < length( keymap ); i++) {
                        key = keymap[i];
                        obj[key] = that[i];
                    }
                    return obj;
                }
            })
        });

        that.defaults.forEach(function( val , i ) {
            that[i] = val;
        });

        that.update( values );
    }


    var CSSProperty_prototype = (CSSProperty[PROTOTYPE] = create( Array[PROTOTYPE] ));


    CSSProperty_prototype.clone = function( cloneDefaults ) {
        var that = this;
        var subject = (cloneDefaults ? that.defaults : that.values);
        return new CSSProperty( that.name , subject );
    };


    CSSProperty_prototype.update = function( values ) {

        values = (instOf( values , CSSProperty ) && values.isNull ? NULL : values);

        var that = this;
        var keymap = that.keymap;
        var key, i;

        that.isNull = (values === NULL);

        values = (( values || values === 0 ) ? values : that.defaults );

        if (!isObj( values )) {
            values = [ values ];
        }

        for (i = 0; i < length( keymap ); i++) {

            if (isArr( values )) {
                key = i;
            }
            else {
                key = keymap[i];
            }

            if (!isUndef( values[key] )) {
                that[i] = mergeUpdates( that[i] , values[key] );
            }
        }

        function mergeUpdates( storedVal , newVal ) {
            var parts = parseExpression( newVal );
            return ( parts.op ? _eval( storedVal + parts.op + parts.val ) : parts.val );
        }
    };


    CSSProperty_prototype.isDefault = function() {
        var that = this;
        return that.isNull && compareArray( that , that.defaults );
    };


    function parseExpression( exp ) {

        var re = /(\+|\-|\*|\/|\%)\=/;
        var out = {op: NULL, val: 0};
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


    return CSSProperty;

});




















hxManager.ComponentMOJO = hxManager.Inject(
[
    MOJO,
    'StyleDefinition',
    'CSSProperty',
    'treeSearch',
    'defProp',
    'keys',
    'indexOf',
    'length',
    'has',
    'del',
    'isUndef'
],
function(
    MOJO,
    StyleDefinition,
    CSSProperty,
    treeSearch,
    defProp,
    keys,
    indexOf,
    length,
    has,
    del,
    isUndef
){


    var VALUE = 'value';


    function ComponentMOJO() {

        var that = this;
        var order = {};

        MOJO.Construct( that );

        defProp( that , 'order' , {
            value: order
        });
    }


    ComponentMOJO.prototype = MOJO.Create({

        getString: function( type ) {

            var that = this;
            var order = that.getOrder( type );

            var arr = order
                .map(function( key ) {
                    var name = getPropertyName( type , key );
                    var component = that.getComponents( name );
                    component = has( component , VALUE ) ? component[VALUE] : component;
                    if ($.hx.preFilter) component = $.hx.preFilter(component);
                    return component.isDefault() ? '' : component.string;
                })
                .filter(function( str ) {
                    return str !== '';
                });

            return arr.join( ' ' );
        },

        getComponents: function( find ) {

            var that = this;
            var out = that;

            if (find) {
                out = treeSearch( that , find );
            }

            if (isUndef( out )) {
                out = StyleDefinition.isDefined( find ) ? new CSSProperty( find , null ) : {};
            }

            return out;
        },

        updateComponent: function( bean ) {

            var that = this;
            var styles = bean.styles;
            var type = bean.type;
            var component = (that[type] = that[type] || {});

            MOJO.Each( styles , function( property , key ) {

                var name = getPropertyName( type , key );

                if (isUndef( component[key] )) {
                    component[key] = new CSSProperty( name , property );
                }
                else {
                    component[key].update( property );
                }

                if (component[key].isDefault()) {
                    del( component , key );
                    if (length(keys( component )) < 1) {
                        del( that , type );
                    }
                }
            });

            that._updateOrder( bean );
        },

        getOrder: function( type ) {

            var that = this;
            var order = that.order;

            if (type) {
                return order[type] || [];
            }

            return order;
        },

        setOrder: function( type , newOrder ) {

            var that = this;
            var order = that.order;

            if (newOrder) {
                order[type] = newOrder;
            }
            else {
                del( order , type );
            }
        },

        _updateOrder: function( bean ) {
            
            var that = this;

            var type = bean.type;
            var storedOrder = that.getOrder( type );
            var passedOrder = bean.order.passed;
            var computedOrder = bean.order.computed;
            var newOrder = passedOrder.concat( storedOrder , computedOrder );

            var componentKeys = keys( that.getComponents( type ));

            newOrder = newOrder.filter(function( property , i ) {
                return (indexOf( newOrder , property ) === i && indexOf( componentKeys , property ) >= 0);
            });

            that.setOrder( type , newOrder );
        }
    });


    function getPropertyName( type , property ) {
        return (property === VALUE ? type : property);
    }


    return ComponentMOJO;

});




























hxManager.TransitionMOJO = hxManager.Inject(
[
    MOJO,
    'VendorPatch',
    'Easing',
],
function(
    MOJO,
    VendorPatch,
    Easing
){


    function TransitionMOJO() {
        MOJO.Construct( this );
    }


    TransitionMOJO.prototype = MOJO.Create({

        getString: function() {

            var that = this;
            var arr = [];

            that.each(function( options , type ) {

                var duration = options.duration;
                var easing = options.easing;
                //var delay = options.delay;
                var str = getTransitionString( type , duration , easing , 0 );

                arr.push( str );
            });
            
            return VendorPatch.prefix(
                arr.join( ', ' )
            );
        },

        setTransition: function( bean ) {
            this.set( bean.type , getTransitionObject( bean ));
        },

        deleteTransition: function( type ) {
            this.remove( type );
        }
    });


    function getTransitionObject( bean ) {
        var options = bean.options;
        return {
            duration: options.duration,
            easing: Easing( options.easing ).string
            //delay: options.delay
        };
    }


    function getTransitionString( type , duration , easing , delay ) {
        return (type + ' ' + duration + 'ms ' + easing + ' ' + delay + 'ms');
    }


    return TransitionMOJO;

});




















hxManager.Queue = hxManager.Inject(
[
    Array,
    'PROTOTYPE',
    'defProps',
    'create',
    'descriptor',
    'ensureArray',
    'isUndef',
    'indexOf'
],
function(
    Array,
    PROTOTYPE,
    defProps,
    create,
    descriptor,
    ensureArray,
    isUndef,
    indexOf
){


    function Queue() {

        var that = this;

        defProps( that , {

            complete: descriptor(function() {
                return !length( that );
            })
        });
    }


    var Queue_prototype = (Queue[PROTOTYPE] = create( Array[PROTOTYPE] ));


    Queue_prototype.run = function() {
        var pod = this[0];
        if (pod) {
            pod.run();
        }
    };


    Queue_prototype.pushPod = function( pod ) {

        var that = this;

        that.push( pod );

        if (length( that ) === 1) {
            that.run();
        }
    };


    Queue_prototype.proceed = function() {

        var that = this;

        that.shift();

        if (!that.complete) {
            that.run();
            return true;
        }

        return false;
    };


    Queue_prototype.clear = function( all ) {

        // all controls whether all pods or all but the current pod will be cleared
        all = (!isUndef( all ) ? all : true);

        var that = this;

        while (length( that ) > (all ? 0 : 1)) {
            that.pop().cancel();
        }
    };


    Queue_prototype.getPodCount = function( type ) {

        type = ensureArray( type );

        return length(
            this.filter(function( pod ) {
                return indexOf( type , pod.type ) >= 0;
            })
        );
    };


    /*
    **  iOS encounters a strange issue using Helper.length
    **  (but not this length function), mainly in Queue.prototype.clear,
    **  where pods are removed from the queue and cancelled,
    **  but length( queue ) continues to return the same value.
    **  It's inconsistent and difficult to reproduce, so fixing
    **  for now by adding this length function in the same context.
    */

    function length( subject ) {
        return subject.length;
    }


    return Queue;

});




























hxManager.DomNodeFactory = hxManager.Inject(
[
    Object,
    jQuery,
    MOJO,
    'Config',
    'VendorPatch',
    'Queue',
    'CSSProperty',
    'ComponentMOJO',
    'TransitionMOJO',
    'ensureArray',
    'isUndef',
    'instOf',
    'keys'
],
function(
    Object,
    $,
    MOJO,
    Config,
    VendorPatch,
    Queue,
    CSSProperty,
    ComponentMOJO,
    TransitionMOJO,
    ensureArray,
    isUndef,
    instOf,
    keys
){


    var BEAN_START = 'beanStart';
    var BEAN_COMPLETE = 'beanComplete';
    var CLUSTER_COMPLETE = 'clusterComplete';
    var POD_PAUSED = 'podPaused';
    var POD_RESUMED = 'podResumed';
    var POD_COMPLETE = 'podComplete';
    var POD_CANCELED = 'podCanceled';


    var MOJO_Each = MOJO.Each;
    var PropertyMap = Config.properties;
    var Prefix = VendorPatch.prefix;


    function DomNodeFactory( element ) {

        // if this is already an hx element, return it
        if (!isUndef( element.$hx )) {
            return element;
        }

        // otherwise, create a new hx element
        var $hx = new MOJO(
            getBoundModule( hxModule , element )
        );

        $hx.queue = new Queue();
        $hx.componentMOJO = new ComponentMOJO();
        $hx.transitionMOJO = new TransitionMOJO();

        element.$hx = $hx;

        return element;
    }


    var hxModule = {

        paint: function( typeArray ) {

            var that = this;
            var $hx = that.$hx;
            var style = {};

            if (isUndef( typeArray )) {
                typeArray = keys( $hx.getOrder() );
            }
            else {
                typeArray = ensureArray( typeArray );
            }

            typeArray.forEach(function( type ) {
                var property = Prefix( type );
                var string = $hx.getStyleString( type );
                style[property] = string;
            });

            $(that).css( style );
        },

        handleMOJO: function( e ) {
            
            var that = this;
            var $hx = that.$hx;
            var args = arguments;
            var type, bean, pod;

            switch (e.type) {

                case BEAN_START:
                    bean = args[1];
                    $(that).trigger( 'hx.start' , {
                        ref: bean.ref,
                        bean: bean.seed
                    });
                break;

                case BEAN_COMPLETE:
                    bean = args[1];
                    $(that).trigger( 'hx.end' , {
                        ref: bean.ref,
                        bean: bean.seed
                    });
                    bean.options.done();
                break;

                case CLUSTER_COMPLETE:
                    type = args[1];
                    $hx.deleteTransition( type );
                    $hx.applyTransition();
                break;

                case POD_PAUSED:
                case POD_RESUMED:

                    var evtString = ('hx.' + (e.type === POD_PAUSED ? 'pause' : 'resume'));
                    pod = args[1];

                    $(that).trigger( evtString , {
                        progress: pod.progress
                    });
                break;

                case POD_COMPLETE:
                    pod = args[1];
                    pod.dispel( POD_COMPLETE , $hx );
                    $hx.proceed();
                break;

                case POD_CANCELED:

                    pod = args[1];

                    if (pod.type === 'promise') {
                        pod.dispel( POD_COMPLETE );
                    }
                    else {

                        pod.dispel( POD_COMPLETE , $hx );

                        pod.once( POD_COMPLETE , function() {
                            if (!$hx.getPodCount( 'animation' )) {
                                $hx.resetTransition();
                                $hx.applyTransition();
                            }
                        });
                    }
                break;
            }
        },

        setTransition: function( bean ) {
            this.$hx.transitionMOJO.setTransition( bean );
        },

        deleteTransition: function( type ) {
            this.$hx.transitionMOJO.deleteTransition( type );
        },

        resetTransition: function() {

            var transitionMOJO = this.$hx.transitionMOJO;

            MOJO_Each( transitionMOJO , function( val , type ) {
                transitionMOJO.deleteTransition( type );
            });
        },

        applyTransition: function() {
            var that = this;
            var property = Prefix( 'transition' );
            var string = that.$hx.getTransitionString();
            if (that.style.transition === string) {
                return;
            }
            $(that).css( property , string );
        },

        getComponents: function( find , pretty ) {

            find = PropertyMap[find] || find;
            pretty = (!isUndef( pretty ) ? pretty : true);
            
            var $hx = this.$hx;
            var components = $hx.componentMOJO.getComponents( find );
            var out = {};

            if (instOf( components , ComponentMOJO )) {
                components.each(function( styleObj , key ) {
                    out[key] = $hx.getComponents( key , pretty );
                });
            }
            else if (instOf( components , CSSProperty )) {
                out = getProperty( components );
            }
            else if (!isUndef( components )) {

                MOJO_Each( components , function( property , key ) {
                    
                    key = getKey( key );
                    property = getProperty( property );
                    
                    if (key === 'value') {
                        out = property;
                    }
                    else {
                        out[key] = property;
                    }
                });
            }

            function getProperty( property ) {
                return (pretty ? property.values : property.clone());
            }

            function getKey( key ) {
                return (pretty ? (PropertyMap.inverse[ key ] || key) : key);
            }

            return out;
        },

        getOrder: function( type ) {
            return this.$hx.componentMOJO.getOrder( type );
        },

        updateComponent: function( bean ) {
            this.$hx.componentMOJO.updateComponent( bean );
        },

        resetComponents: function( type ) {

            var componentMOJO = this.$hx.componentMOJO;

            if (type) {
                componentMOJO.remove( type );
            }
            else {
                componentMOJO.each(function( val , key ) {
                    componentMOJO.remove( key );
                });
            }
        },

        getStyleString: function( type ) {
            return this.$hx.componentMOJO.getString( type );
        },

        getTransitionString: function() {
            return this.$hx.transitionMOJO.getString();
        },

        addPod: function( pod ) {

            var $hx = this.$hx;
            var evt = [
                BEAN_START,
                BEAN_COMPLETE,
                CLUSTER_COMPLETE,
                POD_PAUSED,
                POD_RESUMED,
                POD_COMPLETE,
                POD_CANCELED
            ];

            pod.when( evt , $hx );
            $hx.queue.pushPod( pod );
        },

        proceed: function() {
            return this.$hx.queue.proceed();
        },

        clearQueue: function( all ) {
            this.$hx.queue.clear( all );
        },

        getCurrentPod: function() {
            return this.$hx.queue[0] || false;
        },

        getPodCount: function( type ) {
            return this.$hx.queue.getPodCount( type );
        },

        cleanup: function() {
            delete this.$hx;
        }
    };


    function getBoundModule( module , context ) {

        var scope = {}, func;

        for (var key in module) {
            func = module[key];
            scope[key] = func.bind( context );
        }

        return scope;
    }


    return DomNodeFactory;

});




























hxManager.TimingMOJO = hxManager.Inject(
[
    MOJO,
    'VendorPatch',
    'defProp',
    'descriptor',
    'length'
],
function(
    MOJO,
    VendorPatch,
    defProp,
    descriptor,
    length
){


    var TIMING = 'timing';
    var SUBSCRIBERS = 'subscribers';


    var RAF = VendorPatch.RAF;
    var shouldLoop = false;


    function start() {
        shouldLoop = true;
        RAF( step );
    }


    function step( timestamp ) {

        //console.log(timestamp);

        TimingMOJO.happen( TIMING , timestamp );

        if (!TimingMOJO[ SUBSCRIBERS ]) {
            shouldLoop = false;
        }
        else if (shouldLoop) {
            RAF( step );
        }
    }


    var TimingMOJO = new MOJO({

        subscribe: function( callback ) {

            TimingMOJO.when( TIMING , callback );

            if (!shouldLoop) {
                start();
            }
        },

        unsubscribe: function( callback ) {
            TimingMOJO.dispel( TIMING , callback );
        }
    });


    defProp( TimingMOJO , SUBSCRIBERS , descriptor(
        function() {
            return length( TimingMOJO.handlers[ TIMING ] || [] );
        }
    ));


    return TimingMOJO;

});




















hxManager.SubscriberMOJO = hxManager.Inject(
[
    MOJO,
    'TimingMOJO',
    'NULL',
    'defProp',
    'descriptor',
    'length'
],
function(
    MOJO,
    TimingMOJO,
    NULL,
    defProp,
    descriptor,
    length
){


    var TIMING = 'timing';
    var SUBSCRIBERS = 'subscribers';


    function SubscriberMOJO() {

        var that = this;

        that.time = NULL;
        that.startTime = NULL;

        MOJO.Construct( that );

        defProp( that , SUBSCRIBERS , descriptor(
            function() {
                return length( that.handlers[ TIMING ] || [] );
            }
        ));

        that[TIMING] = that[TIMING].bind( that );
    }


    SubscriberMOJO.prototype = MOJO.Create({

        timing: function( e , timestamp ) {

            var that = this;
            var diff = timestamp - (that.time || timestamp);

            that.time = timestamp;

            if (!that.startTime) {
                that.startTime = timestamp;
            }

            var elapsed = timestamp - that.startTime;

            that.happen( TIMING , [ elapsed , diff ]);

            if (that[SUBSCRIBERS] < 1) {
                that.destroy();
            }
        },

        subscribe: function() {
            TimingMOJO.subscribe( this[TIMING] );
        },

        destroy: function() {
            TimingMOJO.unsubscribe( this[TIMING] );
        }
    });


    return SubscriberMOJO;

});




















hxManager.Bean = hxManager.Inject(
[
    Error,
    jQuery,
    MOJO,
    'Config',
    'SubscriberMOJO',
    'keys',
    'has',
    'isFunc',
    'indexOf',
    'del'
],
function(
    Error,
    $,
    MOJO,
    Config,
    SubscriberMOJO,
    keys,
    has,
    isFunc,
    indexOf,
    del
){


    var TOLERANCE = ( 1000 / 240 );
    var TIMING = 'timing';
    var PROGRESS = 'progress';
    var BEAN_START = 'beanStart';
    var BEAN_PAINT = 'beanPaint';
    var BEAN_COMPLETE = 'beanComplete';


    var MOJO_Each = MOJO.Each;
    var OptionKeys = Config.optionKeys;
    var PropertyMap = Config.properties;
    var Buffer = Config.buffer;


    function Bean( seed , node , index ) {

        if (!seed.type) {
            throw new Error( 'Bean type is required.' );
        }

        var that = this;

        that.running = false;
        that.buffer = 0;
        that.progress = 0;

        MOJO.Construct( that );
        
        $.extend( that , getCompiledData( seed , node , index ));
    }


    var Calc = (
        Bean.Calc = function( elapsed , duration , delay ) {
            elapsed = elapsed - delay;
            elapsed = elapsed < 0 ? 0 : elapsed;
            return (elapsed / (duration ? duration + Buffer : 1));
        }
    );


    var CheckTol = (
        Bean.CheckTol = function( current , target , duration , delay ) {
            return (target - current) <= (TOLERANCE / (duration + delay + Buffer));
        }
    );


    Bean.prototype = MOJO.Create({

        run: function( $hx ) {

            var that = this;

            if (that.running) {
                return false;
            }

            that.running = true;

            that.when( PROGRESS , that );
            that.once( BEAN_PAINT , $hx , that );
            that.happen( BEAN_START );

            return true;
        },

        handleMOJO: function( e ) {
            
            var that = this;
            var args = arguments;
            var progress, $hx;

            switch (e.type) {

                case TIMING:
                    that._timing.apply( that , args );
                break;

                case PROGRESS:
                    progress = args[1];
                    if (that.running && progress > 0) {
                        that.dispel( PROGRESS , that );
                        that.happen( BEAN_PAINT );
                    }
                break;

                case BEAN_PAINT:
                    $hx = args[1];
                    $hx.setTransition( that );
                    $hx.updateComponent( that );
                break;
            }
        },

        _timing: function( e , elapsed , diff ) {

            var that = this;
            var duration = that.options.duration;
            var delay = that.options.delay;

            if (!that.running) {
                that.buffer += diff;
            }

            var progress = Calc(( elapsed - that.buffer) , duration , delay );

            if (CheckTol( progress , 1 , duration , delay )) {
                progress = 1;
            }

            that.happen( PROGRESS , progress );

            if (progress === 1) {
                that.happen( BEAN_COMPLETE );
            }
        },

        getOrder: getOrder,

        getOptions: getOptions,

        getStyles: getStyles
    });


    function getOrder( seed ) {

        var passed = (seed.order || []).map( mapCallback );
        
        var computed = keys( seed )
            .filter(function( key , i ) {
                return indexOf( OptionKeys , key ) < 0;
            })
            .map( mapCallback );

        function mapCallback( key ) {
            return PropertyMap[key] || key;
        }

        return {
            passed: passed,
            computed: computed
        };
    }


    function getOptions( seed , node , index ) {

        var defaults = Config.defaults;
        var options = $.extend( {} , defaults , seed );

        MOJO_Each( options , function( val , key ) {

            if (!has( defaults , key )) {
                del( options , key );
            }
            else if (key === 'done') {
                // make sure we don't execute the done function just yet
                options[key] = val.bind( null , node , index );
            }
            else {
                options[key] = getBeanProperty( val , node , index );
            }
        });

        return options;
    }


    function getStyles( seed , node , index ) {

        var styles = {};

        MOJO_Each( seed , function( val , key ) {
            
            var mappedKey = PropertyMap[key] || key;

            if (indexOf( OptionKeys , mappedKey ) < 0) {
                styles[mappedKey] = getBeanProperty( val , node , index );
            }
        });

        return styles;
    }


    function getBeanProperty( property , node , index ) {
        return (isFunc( property ) ? property( node , index ) : property);
    }


    function getCompiledData( seed , node , index ) {

        var options = getOptions( seed , node , index );

        return {
            ref: options.ref,
            seed: seed,
            type: seed.type,
            order: getOrder( seed ),
            options: options,
            styles: getStyles( seed , node , index )
        };
    }


    return Bean;

});




















hxManager.IteratorMOJO = hxManager.Inject(
[
    MOJO,
    'Easing',
    'Bean',
    'isNum'
],
function(
    MOJO,
    Easing,
    Bean,
    isNum
){


    var MOJO_Each = MOJO.Each;
    var Calc = Bean.Calc;
    var CheckTol = Bean.CheckTol;


    function IteratorMOJO( node , bean ) {

        var that = this;
        var bean_options = bean.options;

        that.bean = bean;
        that.node = node;
        that.type = bean.type;
        that.running = false;
        that.styles = bean.styles;
        that.properties = bean.order.computed;

        that.duration = bean_options.duration;
        that.delay = bean_options.delay;
        that.easing = Easing( bean_options.easing );

        MOJO.Construct( that );
    }


    IteratorMOJO.prototype = MOJO.Create({

        calculate: function( percent ) {

            var that = this;

            MOJO_Each( that.diff , function( diff , key ) {

                var current = that.current[key];
                var dest = that.dest[key];

                diff.forEach(function( val , i ) {

                    var value = val * (1 - percent);
                    
                    if (isNum( val )) {
                        current[i] = dest[i] - value;
                    }
                    else {
                        current[i] = (val === current.defaults[i] ? dest[i] : val);
                    }
                });
            });

            that.paint( that.current );
        },

        paint: function( model ) {

            var that = this;
            var $hx = that.node.$hx;
            var bean = that._updateBean( model );

            $hx.updateComponent( bean );
            $hx.paint( that.type );
        },

        resolve: function( model , attached ) {
            var that = this;
            if (attached) {
                that.paint( model );
            }
            that.happen( 'beanComplete' , that );
        },

        handleMOJO: function( e ) {
            
            var that = this;
            var args = arguments;
            var progress;

            switch (e.type) {

                case 'init':
                    that._init();
                break;

                case 'timing':
                    that._timing.apply( that , args );
                break;

                case 'progress':
                    progress = args[1];
                    if (!that.running && progress >= 0) {
                        that.running = true;
                        that.dispel( 'progress' , that );
                    }
                break;

                case 'podCanceled':
                    if (!that.running) {
                        that.happen( 'beanCanceled' );
                    }
                break;
            }
        },

        _init: function() {
            var that = this;
            var node = that.node;
            var $hx = node.$hx;
            var current = that.current = that._getCurrent( node );
            that.dest = that._getDest( current , that.styles );
            that.diff = that._getDiff( node , current , that.dest );
            $hx.deleteTransition( that.type );
            $hx.applyTransition();
            that.when( 'progress' , that );
            that.happen( 'beanStart' );
        },

        _timing: function( e , elapsed , diff , attached ) {

            var that = this;
            var duration = that.duration;
            var delay = that.delay;
            var progress = Calc( elapsed , duration , delay );

            if (CheckTol( progress , 1 , duration , delay )) {
                progress = 1;
            }

            that.happen( 'progress' , progress );

            if (progress === 1) {
                that.resolve( that.dest , attached );
            }
            else if (attached) {
                that.calculate(
                    that.easing.function( progress )
                );
            }
        },

        _updateBean: function( model ) {

            var that = this;
            var bean = that.bean;

            MOJO_Each( model , function( property , key ) {
                bean.styles[key] = property;
            });

            return bean;
        },

        _getCurrent: function( node ) {

            var that = this;

            var current = {};
            var type = that.type;
            var properties = that.properties;

            properties.forEach(function( property ) {
                var find = (property === 'value' ? type : property);
                current[property] = node.$hx.getComponents( find , false );
            });

            return current;
        },

        _getDest: function( current , styles ) {

            var that = this;
            var newProperties = {};

            MOJO_Each( current , function( CSSProperty , key ) {

                var clone = CSSProperty.clone();
                clone.update( styles[key] );
                newProperties[key] = clone;
            });

            return newProperties;
        },

        _getDiff: function( node , current , dest ) {

            var diff = {};

            MOJO_Each( current , function( property , key ) {
                
                diff[key] = property.map(function( val , i ) {
                    return isNum( val ) ? dest[key][i] - val : val;
                });
            });

            return diff;
        }
    });


    return IteratorMOJO;

});




















hxManager.AnimationPod = hxManager.Inject(
[
    MOJO,
    'SubscriberMOJO',
    'NULL',
    'defProps',
    'descriptor',
    'length'
],
function(
    MOJO,
    SubscriberMOJO,
    NULL,
    defProps,
    descriptor,
    length
){


    var TYPE = 'TYPE';
    var TIMING = 'timing';
    var TIMING_CALLBACK = 'timingCallback';
    var POD_COMPLETE = 'podComplete';
    var POD_CANCELED = 'podCanceled';
    var POD_FORCED = 'forceResolve';
    var SUBSCRIBE = 'subscribe';
    var BEAN_START = 'beanStart';
    var BEAN_PAINT = 'beanPaint';
    var BEAN_COMPLETE = 'beanComplete';
    var CLUSTER_COMPLETE = 'clusterComplete';
    var PROGRESS = 'progress';


    var MOJO_Each = MOJO.Each;


    function AnimationPod( node ) {

        var that = this;

        that.type = AnimationPod[TYPE];
        that.node = node;
        that.beans = {};

        that.forced = false;
        that.paused = false;
        that.buffer = 0;
        that.attached = true;
        that[PROGRESS] = [];

        MOJO.Construct( that );

        defProps( that , {

            sequence: descriptor(function() {
                var sequence = {};
                MOJO_Each( that.beans , function( cluster , type ) {
                    if (length( cluster ) > 0) {
                        sequence[type] = cluster[0];
                    }
                });
                return sequence;
            }),

            subscribers: descriptor(function() {
                return length( that.handlers[ TIMING ] || [] );
            }),

            complete: descriptor(function() {
                return that.subscribers === 0;
            })
        });

        that._init();
    }


    AnimationPod[TYPE] = 'animation';


    AnimationPod.prototype = MOJO.Create({

        _init: function() {

            var that = this;
            var subscriber = new SubscriberMOJO();

            subscriber.when( TIMING , that );

            that.once([ SUBSCRIBE , POD_COMPLETE , POD_FORCED , POD_CANCELED ] , subscriber , that );
        },

        addBean: function( bean ) {

            var that = this;
            var type = bean.type;
            that._getBeans( type ).push( bean );

            var index = that.subscribers;

            that.when( TIMING , bean );

            bean.when( PROGRESS , index , that );
            bean.once([ BEAN_START , BEAN_COMPLETE ] , that );
        },

        addCallback: function( callback ) {
            
            var that = this;

            that.when( TIMING_CALLBACK , function( e , elapsed , diff , attached ) {
                if (attached) {
                    callback( elapsed , that.progress );
                }
            });
        },

        run: function() {
            var that = this;
            that.happen( SUBSCRIBE );
            that._runSequence();
        },

        detach: function() {
            this.attached = false;
        },

        _runSequence: function() {

            var that = this;
            var $hx = that.node.$hx;

            MOJO_Each( that.sequence , function( bean , type ) {
                if (bean.run( $hx )) {
                    bean.once( BEAN_PAINT , function( e ) {
                        $hx.applyTransition();
                        $hx.paint( bean.type );
                    });
                }
            });
        },

        _next: function( type ) {
            var that = this;
            var cluster = that._getBeans( type );
            cluster.shift();
            return length( cluster ) > 0;
        },

        _getBeans: function( type ) {

            var that = this;
            var beans = that.beans;
            var out;

            if (type) {
                out = (beans[type] = beans[type] || []);
            }
            else {
                out = beans;
            }
            
            return out;
        },

        resolvePod: function() {
            var that = this;
            if (that.complete) {
                that.happen( POD_COMPLETE , that );
            }
            else {
                that.happen( POD_FORCED );
            }
        },

        _resolveBeans: function( type ) {
            var that = this;
            that._getBeans( type ).forEach(function( bean ) {
                that.dispel( NULL , bean );
            });
        },

        cancel: function() {
            var that = this;
            that.happen( POD_CANCELED , that );
        },

        handleMOJO: function( e ) {

            var that = this;
            var args = arguments;
            var subscriber, index, progress, bean, type;

            switch (e.type) {

                case TIMING:
                    that._timing.apply( that , args );
                break;

                case SUBSCRIBE:
                    subscriber = args[1];
                    subscriber.subscribe();
                break;

                case POD_COMPLETE:
                    subscriber = args[1];
                    subscriber.dispel();
                    that.dispel();
                break;

                case POD_CANCELED:
                    that.dispel([ CLUSTER_COMPLETE , BEAN_COMPLETE ]);
                    that.happen( POD_FORCED );
                break;

                case POD_FORCED:

                    that.forced = true;
                    subscriber = args[1];

                    if (!that.attached) {
                        that.happen( POD_COMPLETE , that );
                    }
                    else {
                        that.dispel( NULL , that );
                        that.happen( POD_COMPLETE , that );
                        that.once( POD_COMPLETE , subscriber , that );
                    }
                break;

                case PROGRESS:
                    index = args[1];
                    progress = args[2];
                    that[PROGRESS][index] = progress > 1 ? 1 : progress;
                break;

                case BEAN_START:
                    bean = e.target;
                    that.happen( BEAN_START, bean );
                break;

                case BEAN_COMPLETE:

                    bean = e.target;
                    type = bean.type;

                    that.dispel( NULL , bean );

                    if (!that.forced && that._next( type )) {
                        that._runSequence();
                    }
                    else if (!that.forced) {
                        that.happen( CLUSTER_COMPLETE , type );
                    }

                    // trigger beanComplete after clusterComplete so transition
                    // is reset before bean done function is executed

                    if (!that.forced) {
                        that.happen( BEAN_COMPLETE , bean );
                    }
                    else {
                        that._resolveBeans( type );
                    }

                    if (that.complete) {
                        that.resolvePod();
                    }
                break;
            }
        },

        _timing: function( e , elapsed , diff ) {

            var that = this;
            var attached = that.attached;

            if (that.paused) {
                that.buffer += diff;
            }
            else {
                that.happen([ TIMING , TIMING_CALLBACK ] , [( elapsed - that.buffer ) , diff , attached ]);
            }
        }
    });


    return AnimationPod;

});




















hxManager.PrecisionPod = hxManager.Inject(
[
    MOJO,
    'SubscriberMOJO',
    'NULL',
    'defProps',
    'descriptor',
    'length'
],
function(
    MOJO,
    SubscriberMOJO,
    NULL,
    defProps,
    descriptor,
    length
){


    var TYPE = 'TYPE';
    var TIMING = 'timing';
    var TIMING_CALLBACK = 'timingCallback';
    var POD_PAUSED = 'podPaused';
    var POD_RESUMED = 'podResumed';
    var POD_COMPLETE = 'podComplete';
    var POD_CANCELED = 'podCanceled';
    var POD_FORCED = 'forceResolve';
    var SUBSCRIBE = 'subscribe';
    var INIT = 'init';
    var BEAN_START = 'beanStart';
    var BEAN_COMPLETE = 'beanComplete';
    var BEAN_CANCELED = 'beanCanceled';
    var PROGRESS = 'progress';


    function PrecisionPod() {

        var that = this;

        that.type = PrecisionPod[TYPE];
        that.forced = false;
        that.paused = false;
        that.buffer = 0;
        that.attached = true;
        that[PROGRESS] = [];

        MOJO.Construct( that );

        defProps( that , {

            subscribers: descriptor(function() {
                return length( that.handlers[ TIMING ] || [] );
            }),
            
            complete: descriptor(function() {
                return that.subscribers === 0;
            })
        });

        that._init();
    }


    PrecisionPod[TYPE] = 'precision';


    PrecisionPod.prototype = MOJO.Create({

        _init: function() {

            var that = this;
            var subscriber = new SubscriberMOJO();

            subscriber.when( TIMING , that );

            that.once([ SUBSCRIBE , POD_COMPLETE , POD_FORCED , POD_CANCELED ] , subscriber , that );
        },

        addBean: function( iteratorMOJO ) {

            var that = this;
            var index = that.subscribers;

            that.when( TIMING , iteratorMOJO );
            that.once([ INIT , POD_CANCELED ] , iteratorMOJO );

            iteratorMOJO.when( PROGRESS , index , that );
            iteratorMOJO.once([ BEAN_START , BEAN_COMPLETE , BEAN_CANCELED ] , that );
        },

        addCallback: function( callback ) {
            
            var that = this;

            that.when( TIMING_CALLBACK , function( e , elapsed , diff , attached ) {
                if (attached) {
                    callback( elapsed , that.progress );
                }
            });
        },

        run: function() {
            this.happen([ INIT , SUBSCRIBE ]);
        },

        detach: function() {
            this.attached = false;
        },

        pause: function() {
            var that = this;
            that.paused = true;
            that.happen( POD_PAUSED , that );
        },

        resume: function() {
            var that = this;
            that.paused = false;
            that.happen( POD_RESUMED , that );
        },

        resolvePod: function() {
            var that = this;
            if (that.complete) {
                that.happen( POD_COMPLETE , that );
            }
            else {
                that.happen( POD_FORCED );
            }
        },

        cancel: function() {
            var that = this;
            that.happen( POD_CANCELED , that );
        },

        handleMOJO: function( e ) {

            var that = this;
            var args = arguments;
            var subscriber, index, progress, iteratorMOJO;

            switch (e.type) {

                case TIMING:
                    that._timing.apply( that , args );
                break;

                case SUBSCRIBE:
                    subscriber = args[1];
                    subscriber.subscribe();
                break;

                case POD_COMPLETE:
                    subscriber = args[1];
                    subscriber.dispel();
                    that.dispel();
                break;

                case POD_CANCELED:
                    that.dispel( BEAN_COMPLETE );
                    that.happen( POD_FORCED );
                break;

                case POD_FORCED:

                    that.forced = true;
                    subscriber = args[1];

                    if (that.paused || !that.attached) {
                        that.happen( POD_COMPLETE , that );
                    }
                    else {
                        that.dispel( NULL , that );
                        that.happen( POD_COMPLETE , that );
                        that.once( POD_COMPLETE , subscriber , that );
                    }
                break;

                case PROGRESS:
                    index = args[1];
                    progress = args[2];
                    that[PROGRESS][index] = progress > 1 ? 1 : progress;
                break;

                case BEAN_START:
                    iteratorMOJO = e.target;
                    that.happen( BEAN_START, iteratorMOJO.bean );
                break;

                case BEAN_CANCELED:
                    iteratorMOJO = e.target;
                    iteratorMOJO.dispel();
                    that.dispel( NULL , iteratorMOJO );
                break;

                case BEAN_COMPLETE:

                    iteratorMOJO = e.target;

                    that.dispel( NULL , iteratorMOJO );

                    if (!that.forced) {
                        that.happen( BEAN_COMPLETE , iteratorMOJO.bean );
                    }

                    if (that.complete) {
                        that.resolvePod();
                    }
                break;
            }
        },

        _timing: function( e , elapsed , diff ) {

            var that = this;
            var attached = that.attached;

            if (that.paused) {
                that.buffer += diff;
            }
            else {
                that.happen([ TIMING , TIMING_CALLBACK ] , [( elapsed - that.buffer ) , diff , attached ]);
            }
        }
    });


    return PrecisionPod;

});




















hxManager.PromisePod = (function( Promise , $ , MOJO ) {


    var TYPE = 'TYPE';


    function PromisePod() {

        var that = this;
        that.type = PromisePod[TYPE];
        that.attached = true;
        MOJO.Construct( that );

        var promise = new Promise(function( resolve , reject ) {
            promise.resolve = resolve;
            promise.reject = reject;
        });

        return $.extend( promise , that );
    }


    PromisePod[TYPE] = 'promise';


    PromisePod.prototype = MOJO.Create({

        run: function() {
            var that = this;
            new Promise(function( resolve ) {
                resolve();
            })
            .then(function() {
                that.resolve();
            });
        },

        resolvePod: function() {
            var that = this;
            that.happen( 'podComplete' , that );
        },

        cancel: function() {
            var that = this;
            that.happen( 'podCanceled' , that );
        },

        detach: function() {
            
        }
    });


    return PromisePod;


}( WeePromise , jQuery , MOJO ));




















hxManager.PodFactory = hxManager.Inject(
[
    'AnimationPod',
    'PrecisionPod',
    'PromisePod'
],
function(
    AnimationPod,
    PrecisionPod,
    PromisePod
){


    var TYPE = 'TYPE';


    function PodFactory( node , type ) {

        switch (type) {

            case AnimationPod[TYPE]:
                return new AnimationPod( node );

            case PrecisionPod[TYPE]:
                return new PrecisionPod();

            case PromisePod[TYPE]:
                return new PromisePod();
        }
    }


    return PodFactory;

});
hxManager.Inject(
[
    Error,
    jQuery,
    hxManager,
    'shift',
    'isFunc',
    'is'
],
function(
    Error,
    $,
    hxManager,
    shift,
    isFunc,
    is
){

    $.fn.hx = function() {

        var args = arguments;
        var hxm = new hxManager( this );
        var out;

        if (is( args[0] , 'string' )) {

            var method = shift( args );

            if (!isFunc( hxm[method] )) {
                throw new Error( method + ' is not a function.' );
            }

            out = hxm[method].apply( hxm , args );
        }
        else if (is( args[0] , 'object' )) {
            out = hxm.animate( args[0] );
        }
        else {
            out = hxm;
        }

        return out;
    };

});




















hxManager.Inject(
[
    jQuery,
    MOJO,
    hxManager,
    'VendorPatch',
    'StyleDefinition',
    'Bezier',
    'TimingMOJO',
    'del',
    'NULL'
],
function(
    $,
    MOJO,
    hxManager,
    VendorPatch,
    StyleDefinition,
    Bezier,
    TimingMOJO,
    del,
    NULL
){


    // Do some important stuff when hx is loaded


    var DefineProperty = StyleDefinition.define;
    var DefineBezier = Bezier.define;


    $.hx = {
        defineProperty: DefineProperty,
        defineBezier: DefineBezier,
        subscribe: function( callback ) {

            var startTime = NULL;

            TimingMOJO.subscribe( timingCallback );

            function timingCallback( e , timestamp ) {
                startTime = (startTime === NULL ? timestamp : startTime);
                callback(( timestamp - startTime ));
            }

            return function() {
                TimingMOJO.unsubscribe( timingCallback );
            };
        },
        error: function( error ) {
            try { console.error( error.stack ); }
            catch( err ) {}
        }
    };


    // define a bunch of properties
    [
        [
            [ 'matrix' , 'matrix3d' ],
            [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
            [ 'a1', 'b1', 'c1', 'd1', 'a2', 'b2', 'c2', 'd2', 'a3', 'b3', 'c3', 'd3', 'a4', 'b4', 'c4', 'd4' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( ',' ) + ')';
            }
        ],
        [
            [ 'translate' , 'translate3d' ],
            [ 0 , 0 , 0 ],
            [ 'x' , 'y' , 'z' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( 'px,' ) + 'px)';
            }
        ],
        [
            [ 'scale' , 'scale3d' ],
            [ 1 , 1 , 1 ],
            [ 'x' , 'y' , 'z' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( ',' ) + ')';
            }
        ],
        [
            [ 'rotate' , 'rotate3d' ],
            [ 0 , 0 , 0 , 0 ],
            [ 'x' , 'y' , 'z' , 'a' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( ',' ) + 'deg)';
            }
        ],
        [
            [ 'rotateX' ],
            0,
            NULL,
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + 'deg)';
            }
        ],
        [
            [ 'rotateY' ],
            0,
            NULL,
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + 'deg)';
            }
        ],
        [
            [ 'rotateZ' ],
            0,
            NULL,
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + 'deg)';
            }
        ],
        [
            [ 'matrix2d' , 'matrix' ],
            [ 1 , 0 , 0 , 1 , 0 , 0 ],
            [ 'a1' , 'b1' , 'c1' , 'd1' , 'a4' , 'b4' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( ',' ) + ')';
            }
        ],
        [
            [ 'translate2d' , 'translate' ],
            [ 0 , 0 ],
            [ 'x' , 'y' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( 'px,' ) + 'px)';
            }
        ],
        [
            [ 'scale2d' , 'scale' ],
            [ 1 , 1 ],
            [ 'x' , 'y' ],
            function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( ',' ) + ')';
            }
        ],
        [
            [ 'opacity' ],
            1,
            NULL,
            NULL
        ]
    ]
    .forEach(function( definition ) {

        var property = DefineProperty.apply( NULL , definition[0] );

        [
            'defaults',
            'keymap',
            'stringGetter'
        ]
        .forEach(function( key , i ) {

            var args = definition[i+1];
            
            if (args !== NULL) {
                property.set( key , args );
            }
        });
    });


    /*
    **  Derived from AliceJS easing definitions
    **  http://blackberry.github.io/Alice/
    */
    var beziers = {
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


    MOJO.Each( beziers , function( points , name ) {
        DefineBezier( name , points );
    });
    

    // initialize the hxManager prototype
    var __ready = '__ready';
    hxManager[ __ready ]();
    del( hxManager , __ready );
});



















