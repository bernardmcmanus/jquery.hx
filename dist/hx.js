/*! jquery.hx - 2.0.0 - Bernard McManus - 6b4423a - 2015-03-22 */
// make sure no included libs try to use amd define
window.__TMP$define = window.define;
window.define = null;

(function (definition) {
  if (typeof exports === "object") {
    module.exports = definition();
  } else if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    window.BezierEasing = definition();
  }
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
      } else if (initialSlope === 0.0) {
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

    f.getControlPoints = function() { return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }]; };

    var args = [mX1, mY1, mX2, mY2];
    var str = "BezierEasing("+args+")";
    f.toString = function () { return str; };

    var css = "cubic-bezier("+args+")";
    f.toCSS = function () { return css; };

    return f;
  }

  // CSS mapping
  BezierEasing.css = {
    "ease":        BezierEasing(0.25, 0.1, 0.25, 1.0),
    "linear":      BezierEasing(0.00, 0.0, 1.00, 1.0),
    "ease-in":     BezierEasing(0.42, 0.0, 1.00, 1.0),
    "ease-out":    BezierEasing(0.00, 0.0, 0.58, 1.0),
    "ease-in-out": BezierEasing(0.42, 0.0, 0.58, 1.0)
  };

  return BezierEasing;

}));

/*! wee-promise - 0.2.1 - Bernard McManus - master - gb12466 - 2015-03-21 */
!function(a){var b=this;"object"==typeof exports?module.exports=a:b.WeePromise=a}(function(a){"use strict";function b(a){var b=this;k([v,w,u],function(a){b[a]=[]}),h(function(){b[B]=e(b),i(b,function(){a(c(b,v),c(b,w))}),b[z]=!0})}function c(a,b){function c(d){h(a[z]?function(){a[s]||a[y](b,d)[y](u,d)}:function(){c(d)})}return c}function d(a,b,c,d,e){return function(){a=a.map(function(a){return g(a[t])?a[t]:a});var h=f(a,1),i=f(a,-1);if(j(h)===d){var k=h.map(function(a){return a[t][0]});b(e?k[0]:k)}else j(i)>0&&c(i[0][t][0])}}function e(a){return j(a[w])>0}function f(a,b){return a.filter(function(a){return a[s]===b})}function g(a){return a instanceof b}function h(b){a(b,1)}function i(a,b){try{return b()}catch(c){return a[y](w,c)}}function j(a){return a.length}function k(a,b){a.forEach(b)}var l,m="$$",n="prototype",o="always",p="then",q="catch",r=m+"pass",s=m+"state",t=m+"args",u=m+o,v=m+p,w=m+q,x=m+"add",y=m+"exec",z=m+"ready",A=m+"child",B=m+"handled",C=B+"Self",D={};return D[v]=1,D[w]=-1,b[n][x]=function(a,b){var c=this;return b&&c[a].push(b),c},b[n][y]=function(a,b){var c,d=this,e=d[a],f=j(e),h=0,k=D[a];return i(d,function(){for(;f>h;){if(k&&d[s]===k&&d[A]&&d[B]&&(e=!d[C]||d[z]?[]:e.slice(-1),h=f-1,!j(e)))return d;if(c=(k?e.shift():e[h]).apply(l,[b]),b=k?c:b,g(c))return d[r](c);if(a==w){if(d[B]&&(k=D[v],d[A]))return d[s]=k,d[t]=[c],d[y](v,c)[y](u,c);break}h++}return d[t]=d[s]?d[t]:[b],d[s]=k||d[s],d})},b[n][o]=function(a){return this[x](u,a)},b[n][p]=function(a,b){return this[x](v,a)[q](b)},b[n][q]=function(a){return this[x](w,a)},b[n][r]=function(a){var b=this;return a[C]=e(a),a[A]=!0,k([v,w,u],function(c){a[c]=a[C]?a[c].concat(b[c]):b[c]}),b[t]=a,a},b.all=function(a){return new b(function(b,c){k(a,function(e){e[o](d(a,b,c,j(a)))})})},b.race=function(a){return new b(function(b,c){k(a,function(e){e[o](d(a,b,c,1,!0))})})},b}(setTimeout));
/*! emoney - 0.2.3 - Bernard McManus - master - g75a578 - 2015-01-10 */

(function() {
    "use strict";
    var static$constants$$$Array = Array;
    var static$constants$$$Object = Object;
    var static$constants$$$Date = Date;
    var static$constants$$$Math = Math;
    var static$constants$$$Error = Error;

    var static$constants$$$PROTO = 'prototype';
    var static$constants$$$FUNCTION = 'function';
    var static$constants$$$OBJECT = 'object';
    var static$constants$$$STRING = 'string';
    var static$constants$$$UNDEFINED;

    var static$constants$$$WILDCARD = '*';
    var static$constants$$$WHEN = '$when';
    var static$constants$$$EMIT = '$emit';
    var static$constants$$$DISPEL = '$dispel';
    var static$constants$$$HANDLE_E$ = 'handleE$';
    var static$constants$$$CANCEL_BUBBLE = 'cancelBubble';
    var static$constants$$$DEFAULT_PREVENTED = 'defaultPrevented';



















    function static$shared$$$_uts() {
      var now = static$constants$$$Date.now();
      var last = static$shared$$$_uts.last;
      var inc = 0.001;
      last = (now === static$constants$$$Math.floor( last ) ? last : now) + inc;
      static$shared$$$_uts.last = last;
      return last;
    }

    function static$shared$$$_length( subject ) {
      return subject.length;
    }

    function static$shared$$$_indexOf( subject , element ) {
      return subject.indexOf( element );
    }

    function static$shared$$$_isArray( subject ) {
      return static$constants$$$Array.isArray( subject );
    }

    function static$shared$$$_ensureArray( subject ) {
      return (static$shared$$$_isArray( subject ) ? subject : ( subject !== static$constants$$$UNDEFINED ? [ subject ] : [] ));
    }

    function static$shared$$$_forEach( subject , callback ) {
      return static$shared$$$_ensureArray( subject ).forEach( callback );
    }

    function static$shared$$$_create( subject ) {
      return static$constants$$$Object.create( subject );
    }

    function static$shared$$$_defineProperty( subject , property , descriptor ) {
      static$constants$$$Object.defineProperty( subject , property , descriptor );
    }

    function static$shared$$$_delete( subject , key ) {
      delete subject[key];
    }

    function static$shared$$$_keys( subject ) {
      return static$constants$$$Object.keys( subject );
    }

    function static$shared$$$_shift( subject ) {
      return static$constants$$$Array[static$constants$$$PROTO].shift.call( subject );
    }

    function static$shared$$$_pop( subject ) {
      return static$constants$$$Array[static$constants$$$PROTO].pop.call( subject );
    }

    function static$shared$$$_slice( subject , start , end ) {
      return static$constants$$$Array[static$constants$$$PROTO].slice.call( subject , start || 0 , end );
    }

    function static$shared$$$_last( subject ) {
      return subject[static$shared$$$_length( subject ) - 1];
    }

    function static$shared$$$_is( subject , test ) {
      return (typeof test == static$constants$$$STRING) ? (typeof subject == test) : (subject instanceof test);
    }

    function static$shared$$$_ensureFunc( subject ) {
      return static$shared$$$_is( subject , static$constants$$$FUNCTION ) ? subject : function(){};
    }

    function static$shared$$$_defineProto( proto ) {
      var nonEnumerableProto = {};
      for (var key in proto) {
        static$shared$$$_defineProperty( nonEnumerableProto , key , {
          value: proto[key]
        });
      }
      return nonEnumerableProto;
    }

    function static$shared$$$_getHandlerFunc( subject ) {
      return (subject || {})[ static$constants$$$HANDLE_E$ ] ? subject[ static$constants$$$HANDLE_E$ ] : subject;
    }

    function static$shared$$$_getHandlerContext( handler , func ) {
      return handler === func ? null : handler;
    }



















    function main$$E$( seed ) {
      var that = this;
      if (static$shared$$$_is( that , main$$E$ )) {
        that.__init( that , ( seed || {} ));
      }
      else {
        return new main$$E$( seed );
      }
    }



















    var main$$default = main$$E$;
    function event$$Event( target , type ) {
      var that = this;
      that.target = target;
      that.type = type;
      that[static$constants$$$CANCEL_BUBBLE] = false;
      that[static$constants$$$DEFAULT_PREVENTED] = false;
      that.timeStamp = static$shared$$$_uts();
    }


    var event$$default = event$$Event;


    event$$Event[static$constants$$$PROTO] = {

      preventDefault: function() {
        this[static$constants$$$DEFAULT_PREVENTED] = true;
      },

      stopPropagation: function() {
        this[static$constants$$$CANCEL_BUBBLE] = true;
      }
    };



















    function eventHandler$$EventHandler( func , context , bindArgs ) {

      var that = this;

      that.func = func;
      that.context = context;
      that.uts = static$shared$$$_uts();
      that.bindArgs = static$shared$$$_ensureArray( bindArgs );

      that._reset( that );
    }

    var eventHandler$$default = eventHandler$$EventHandler;

    eventHandler$$EventHandler[static$constants$$$PROTO] = {

      _reset: function( that ) {
        that.before = static$shared$$$_ensureFunc();
        that.after = static$shared$$$_ensureFunc();
      },

      invoke: function( evt , invArgs ) {

        var that = this;

        if (evt[static$constants$$$CANCEL_BUBBLE]) {
          return;
        }

        var func = that.func;
        var args = static$shared$$$_slice( that.bindArgs ).concat(
          static$shared$$$_ensureArray( invArgs )
        );

        args.unshift( evt );
        that.before( evt , func );
        func.apply( that.context , args );
        if (!evt[static$constants$$$DEFAULT_PREVENTED]) {
          that.after( evt , func );
        }

        that._reset( that );
      }

    };



















    var static$is$emoney$$default = function( subject ) {
      return subject && static$shared$$$_is( subject , static$constants$$$OBJECT ) && static$constants$$$HANDLE_E$ in subject;
    };

    function when$$indexOfHandler( handlerArray , func ) {
      var arr = handlerArray.map(function( evtHandler ) {
        return evtHandler.func;
      });
      return static$shared$$$_indexOf( arr , func );
    }

    var when$$default = {

      /*parsed == [ eventList , [args] , [E$Handler] ]*/
      $once: function() {

        var that = this;
        var parsed = that.__parse( static$constants$$$WHEN , arguments );

        that._$when( arguments , function( evtHandler ) {
          evtHandler.before = function( evt , func ) {
            that.$dispel( parsed[0] , true , func );
          };
        });

        that.$$flush();

        return that;
      },

      $when: function() {
        var that = this;
        that._$when( arguments );
        that.$$flush();
        return that;
      },

      /*parsed == [ eventList , [args] , [callback] ]*/
      $emit: function() {

        var that = this;
        var parsed = that.__parse( static$constants$$$EMIT , arguments );

        that.$$enq(function() {
          static$shared$$$_forEach( parsed[0] , function( type ) {
            if (type != static$constants$$$WILDCARD) {
              that.__invoke( type , parsed[1] , parsed[2] );
            }
          });
        });

        that.$$flush();

        return that;
      },

      /*parsed == [ [eventList] , [wild] , [E$Handler] ]*/
      $dispel: function() {

        var that = this;
        var parsed = that.__parse( static$constants$$$DISPEL , arguments );
        var func = static$shared$$$_getHandlerFunc( parsed[2] );

        that.$$enq(function() {
          static$shared$$$_forEach( parsed[0] , function( type ) {
            that.__remove( type , func , !!parsed[1] );
          });
        });

        that.$$flush();

        return that;
      },

      /*args == parsed == [ eventList , [bindArgs] , [E$Handler] ]*/
      _$when: function( args , callback ) {

        callback = static$shared$$$_ensureFunc( callback );

        var that = this;
        var parsed = that.__parse( static$constants$$$WHEN , args );
        
        var func = static$shared$$$_getHandlerFunc( parsed[2] );
        var context = static$shared$$$_getHandlerContext( parsed[2] , func );

        that.$$enq(function() {
          static$shared$$$_forEach( parsed[0] , function( type , i ) {
            var evtHandler = that.__add( type , func , context , parsed[1] );
            callback( evtHandler );
          });
        });
      },

      __parse: function( type , args ) {

        var that = this;
        var parsed = [];
        var events = that.__events;

        args = static$shared$$$_slice( args );

        static$shared$$$_forEach([ 0 , 1 , 2 ] , function( i ) {

          // eventList
          if (!i) {
            parsed[0] = static$shared$$$_shift( args ) || static$shared$$$_ensureArray( type != static$constants$$$WHEN ? that.__events : static$constants$$$WILDCARD );
            if (type == static$constants$$$EMIT) {
              parsed[0] = (static$shared$$$_length( parsed[0] ) == 1 && !static$shared$$$_indexOf( parsed[0] , static$constants$$$WILDCARD ) ? that.__events : parsed[0]);
            }
          }
          
          // E$Handler / func
          else if (i < 2) {
            parsed[2] = static$shared$$$_is(static$shared$$$_last( args ) , static$constants$$$FUNCTION ) || static$is$emoney$$default(static$shared$$$_last( args )) ? static$shared$$$_pop( args ) : null;
            parsed[2] = type != static$constants$$$DISPEL ? (parsed[2] || that) : parsed[2];
          }

          // args / wild
          else {
            parsed[1] = args[0];
          }
        });

        return parsed;
      },

      __get: function( eventType , wild ) {
        var that = this;
        var handlers = that.handlers;
        var targetSet = eventType ? static$shared$$$_ensureArray( handlers[eventType] ) : handlers;
        if (eventType && wild && eventType != static$constants$$$WILDCARD) {
          targetSet = that.__get( static$constants$$$WILDCARD ).concat( targetSet ).sort(function( a , b ) {
            return a.uts - b.uts;
          });
        }
        return targetSet;
      },

      __invoke: function( type , args , callback ) {

        var that = this;
        var handlers = that.__get( type , true );
        var evt = new event$$default( that , type );
        
        static$shared$$$_forEach( handlers , function( evtHandler ) {
          evtHandler.invoke( evt , args );
        });

        if (!evt[static$constants$$$DEFAULT_PREVENTED]) {
          static$shared$$$_ensureFunc( callback )( evt );
        }
      },

      __add: function( type , func , context , args ) {
        
        var that = this;
        var evtHandler = new eventHandler$$default( func , context , args );
        var handlerArray = that.__get( type );

        handlerArray.push( evtHandler );
        that.handlers[type] = handlerArray;

        return evtHandler;
      },

      __remove: function( type , func , wild ) {

        var that = this;
        var handlers = that.__get();
        var handlerArray = that.__get( type );
        var i = 0, index, evtHandler;

        while (i < static$shared$$$_length( handlerArray )) {
          index = (func ? when$$indexOfHandler( handlerArray , func ) : i);
          if (index >= 0 && (wild || type != static$constants$$$WILDCARD)) {
            handlerArray.splice( index , 1 );
            i--;
          }
          i++;
        }
        
        if (!static$shared$$$_length( handlerArray )) {
          static$shared$$$_delete( handlers , type );
        }
        else {
          handlers[type] = handlerArray;
        }
      }
    };

    var static$construct$$default = function( subject ) {

      static$shared$$$_defineProperty( subject , '__stack' , {
        value: []
      });

      static$shared$$$_defineProperty( subject , '__inprog' , {
        value: false,
        writable: true
      });

      static$shared$$$_defineProperty( subject , '__events' , {
        get: function() {
          return static$shared$$$_keys( subject.handlers );
        }
      });

      static$shared$$$_defineProperty( subject , 'handlers' , {
        value: {}
      });

      static$shared$$$_defineProperty( subject , static$constants$$$HANDLE_E$ , {
        value: static$shared$$$_ensureFunc( subject[ static$constants$$$HANDLE_E$ ] ).bind( subject )
      });
    };

    var proto$$default = proto$$Proto();


    function proto$$Proto() {

      var proto = static$shared$$$_create( when$$default );

      proto.__init = function( that , seed ) {
        for (var key in seed) {
          that[key] = seed[key];
        }
        static$construct$$default( that );
      };

      proto.$watch = function( emitters ) {
        var that = this;
        static$shared$$$_forEach( emitters , function( emitter ) {
          emitter.$when( static$constants$$$WILDCARD , that );
        });
        return that;
      };

      proto.$ignore = function( emitters ) {
        var that = this;
        static$shared$$$_forEach( emitters , function( emitter ) {
          emitter.$dispel( static$constants$$$WILDCARD , true , that );
        });
        return that;
      };

      proto.$$enq = function( task ) {
        var that = this;
        that.__stack.push( task );
      };

      proto.$$flush = function( clear ) {
        
        var that = this;
        var stack = that.__stack;
        var task;

        if (that.__inprog && !clear) {
          return;
        }

        that.__inprog = true;

        while (static$shared$$$_length( stack )) {
          try {
            task = static$shared$$$_shift( stack );
            if (!clear) {
              task();
            }
          }
          catch( err ) {
            that.$$flush( true );
            throw err;
          }
        }
        
        that.__inprog = false;
      };

      return proto;
    }



















    var static$create$$default = function( subjectProto ) {

      var extendedProto = static$shared$$$_defineProto(
        static$shared$$$_create( proto$$default )
      );

      for (var key in subjectProto) {
        extendedProto[key] = subjectProto[key];
      }

      return extendedProto;
    };

    main$$default[static$constants$$$PROTO] = static$shared$$$_defineProto( proto$$default );
    main$$default.is = static$is$emoney$$default;
    main$$default.create = static$create$$default;
    main$$default.construct = static$construct$$default;

    var $$index$$default = main$$default;

    if (typeof define == 'function' && define.amd) {
      define([], function() { return $$index$$default });
    }
    else if (typeof exports == 'object') {
      module.exports = $$index$$default;
    }
    else {
      this.E$ = $$index$$default;
    }
}).call(this);


(function(window,document,Object,Array,RegExp,Math,Error,E$,BezierEasing,$,Promise) {
    "use strict";
    function main$$$hx() {

    }
    var main$$default = main$$$hx;
    var $$index$$default = main$$default;

    if (typeof define == 'function' && define.amd) {
      define([], function() { return $$index$$default });
    }
    else if (typeof exports == 'object') {
      module.exports = $$index$$default;
    }
    else {
      this.$hx = $$index$$default;
    }
}).apply(this,[window,document,Object,Array,RegExp,Math,Error,E$,BezierEasing,jQuery,WeePromise]);
// reset amd define
window.define = window.__TMP$define;
delete window.__TMP$define;