/*! jquery.hx - 1.1.0 - Bernard McManus - 20ef081 - 2016-01-25 */


(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.hxManager = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 *
 * Credits: is based on Firefox's nsSMILKeySpline.cpp
 * Usage:
 * var spline = BezierEasing([ 0.25, 0.1, 0.25, 1.0 ])
 * spline.get(x) => returns the easing value | x must be in [0, 1] range
 *
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === "function";

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

function binarySubdivide (aX, aA, aB, mX1, mX2) {
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

function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
  for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
    var currentSlope = getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0.0) return aGuessT;
    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}

/**
 * points is an array of [ mX1, mY1, mX2, mY2 ]
 */
function BezierEasing (points, b, c, d) {
  if (arguments.length === 4) {
    return new BezierEasing([ points, b, c, d ]);
  }
  if (!(this instanceof BezierEasing)) return new BezierEasing(points);

  if (!points || points.length !== 4) {
    throw new Error("BezierEasing: points must contains 4 values");
  }
  for (var i=0; i<4; ++i) {
    if (typeof points[i] !== "number" || isNaN(points[i]) || !isFinite(points[i])) {
      throw new Error("BezierEasing: points should be integers.");
    }
  }
  if (points[0] < 0 || points[0] > 1 || points[2] < 0 || points[2] > 1) {
    throw new Error("BezierEasing x values must be in [0, 1] range.");
  }

  this._str = "BezierEasing("+points+")";
  this._css = "cubic-bezier("+points+")";
  this._p = points;
  this._mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  this._precomputed = false;

  this.get = this.get.bind(this);
}

BezierEasing.prototype = {

  get: function (x) {
    var mX1 = this._p[0],
      mY1 = this._p[1],
      mX2 = this._p[2],
      mY2 = this._p[3];
    if (!this._precomputed) this._precompute();
    if (mX1 === mY1 && mX2 === mY2) return x; // linear
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) return 0;
    if (x === 1) return 1;
    return calcBezier(this._getTForX(x), mY1, mY2);
  },

  getPoints: function() {
    return this._p;
  },

  toString: function () {
    return this._str;
  },

  toCSS: function () {
    return this._css;
  },

  // Private part

  _precompute: function () {
    var mX1 = this._p[0],
      mY1 = this._p[1],
      mX2 = this._p[2],
      mY2 = this._p[3];
    this._precomputed = true;
    if (mX1 !== mY1 || mX2 !== mY2)
      this._calcSampleValues();
  },

  _calcSampleValues: function () {
    var mX1 = this._p[0],
      mX2 = this._p[2];
    for (var i = 0; i < kSplineTableSize; ++i) {
      this._mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
  },

  /**
   * getTForX chose the fastest heuristic to determine the percentage value precisely from a given X projection.
   */
  _getTForX: function (aX) {
    var mX1 = this._p[0],
      mX2 = this._p[2],
      mSampleValues = this._mSampleValues;

    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }
};

// CSS mapping
BezierEasing.css = {
  "ease":        BezierEasing.ease      = BezierEasing(0.25, 0.1, 0.25, 1.0),
  "linear":      BezierEasing.linear    = BezierEasing(0.00, 0.0, 1.00, 1.0),
  "ease-in":     BezierEasing.easeIn    = BezierEasing(0.42, 0.0, 1.00, 1.0),
  "ease-out":    BezierEasing.easeOut   = BezierEasing(0.00, 0.0, 0.58, 1.0),
  "ease-in-out": BezierEasing.easeInOut = BezierEasing(0.42, 0.0, 0.58, 1.0)
};

module.exports = BezierEasing;

},{}],2:[function(_dereq_,module,exports){
/*! mojo - 0.1.6 - Bernard McManus - strict-hotfix - g727d74 - 2014-10-16 */
var _MOJO={},MOJO={};_MOJO.Shared=function(a,b){function c(a){return a.length}function d(b){return a.keys(b)}function e(a){return b.prototype.shift.call(a)}function f(a){return a instanceof b?a:a!==i?[a]:[]}function g(a,b){return{get:a,set:b,configurable:!0}}function h(a){return(a||{})[j]?a[j]:a}var i,j="handleMOJO";return{length:c,keys:d,shift:e,ensureArray:f,descriptor:g,getHandlerFunc:h}}(Object,Array),_MOJO.EventHandler=function(a){function b(a,b,c){var e=this;e.handler=a,e.context=b,e.active=!0,e.callback=function(){},e.args=d(c)}var c=a.Shared,d=c.ensureArray;return b.prototype={invoke:function(a,b){var c=this,e=c.handler;if(c.active&&!a.isBreak&&!a.shouldSkip(e)){var f=c.args.concat(d(b));f.unshift(a),e.apply(c.context,f),c.callback(a,e)}}},b}(_MOJO),_MOJO.Event=function(a,b){function c(b,c){var d=this;d.isBreak=e,d.cancelBubble=e,d.defaultPrevented=e,d.skipHandlers=[],d.target=b,d.type=c,d.timeStamp=a.now()}var d=!0,e=!1,f=b.Shared,g=f.ensureArray,h=f.getHandlerFunc;return c.prototype={skip:function(a){var b=this.skipHandlers;g(a).forEach(function(a){b.push(h(a))})},shouldSkip:function(a){return this.skipHandlers.indexOf(a)>=0},"break":function(){this.isBreak=d},preventDefault:function(){this.defaultPrevented=d},stopPropagation:function(){this.cancelBubble=d}},c}(Date,_MOJO),_MOJO.When=function(a,b,c){function d(a,b){return l(a).map(function(a){return a.handler}).indexOf(b)}function e(a,c){(a instanceof b?a:a.split(" ")).forEach(c)}function f(a,b){return a===b?null:a}var g=c.Shared,h=c.EventHandler,i=c.Event,j=g.keys,k=g.shift,l=g.ensureArray,m=g.length,n=g.getHandlerFunc,o={once:function(){var a=this,b=a._when(arguments);return b.forEach(function(a){a.callback=function(){this.active=!1}}),a},when:function(){var a=this;return a._when(arguments),a},_when:function(a){var b=this,c=k(a),d=m(a)>1?k(a):d,g=[],i=k(a),j=n(i),l=f(i,j);return e(c,function(a,c){g.push(new h(j,l,d)),b._addHandler(a,g[c])}),g},happen:function(a,b){var c=this;return a=c._ensureEType(a),e(a,function(a){var d=c._getHandlers(a,!0),e=new i(c,a);d.filter(function(a){return a.invoke(e,b),!a.active}).forEach(function(b){c._removeHandler(c._getHandlers(a),b.handler)})}),c},dispel:function(a,b){var c=this,d=c._getHandlers(),f=n(b);return a=c._ensureEType(a),e(a,function(a){f?c._removeHandler(d[a],f):delete d[a]}),c},_ensureEType:function(a){return a||j(this._getHandlers()).join(" ")},_getHandlers:function(b,c){var d=this,e=d.handlers=d.handlers||{},f=b?e[b]=e[b]||[]:e;return c?b?f.slice():a.create(f):f},_addHandler:function(a,b){var c=this;c._getHandlers(a).push(b)},_removeHandler:function(a,b){var c=d(a,b);c>=0&&a.splice(c,1)}};return o}(Object,Array,_MOJO),MOJO=function(a){function b(a){a=a||{};var c=this;b.Each(a,function(a,b){c[b]=a}),b.Construct(c)}var c=b.prototype=Object.create(a.When);return c.each=function(a){var c=this;return b.Each(c,a,c.keys),c},c.set=function(a,b){var c=this;return c[a]=b,c.happen("set",a),c},c.remove=function(a){var b=this;return delete b[a],b.happen("remove",a),b},b}(_MOJO),MOJO.Each=function(a){function b(a,b,c){(c||d(a)).forEach(function(c,d){b(a[c],c,d)})}var c=a.Shared,d=c.keys;return b}(_MOJO),MOJO.Create=function(a,b){function c(c){var d=a.create(b.prototype);return b.Each(c,function(a,b){d[b]=a}),d}return c}(Object,MOJO),MOJO.Construct=function(a,b){function c(b){var c={};a.defineProperties(b,{handlers:{get:function(){return c},set:function(a){c=a},configurable:!0},keys:f(function(){return e(b)}),length:f(function(){return g(b.keys)}),handleMOJO:{value:(b.handleMOJO||function(){}).bind(b),configurable:!0}})}var d=b.Shared,e=d.keys,f=d.descriptor,g=d.length;return c}(Object,_MOJO),function(a){"object"==typeof exports?module.exports=a:window.MOJO=a}(MOJO);
},{}],3:[function(_dereq_,module,exports){
(function (global){
/*! wee-promise - 1.0.4 - Bernard McManus - 6ff0c68 - 2015-12-27 */

(function(global,UNDEFINED){
"use strict";

function Stack(){
  var that = this;
  that.q = [];
  that.i = 0;
  that.len = 0;
}

Stack.prototype.put = function( element ){
  var that = this;
  that.q[that.len] = element;
  that.len++;
};

Stack.prototype.get = function(){
  var that = this,
    element = that.q[that.i];
  that.i++;
  if (that.i >= that.len) {
    that.q.length = that.i = that.len = 0;
  }
  return element;
};

var asyncProvider;

if (global.setImmediate) {
  asyncProvider = setImmediate;
}
else if (global.MessageChannel) {
  asyncProvider = (function(){
    var stack = new Stack(),
      channel = new MessageChannel();
    channel.port1.onmessage = function(){
      /* jshint -W084 */
      var fn;
      while (fn = stack.get()) {
        fn();
      }
    };
    return function( cb ){
      stack.put( cb );
      channel.port2.postMessage( 0 );
    };
  }());
}
else {
  asyncProvider = setTimeout;
}

WeePromise.async = function( cb ){
  asyncProvider( cb );
};


var PENDING = 0,
  RESOLVED = 1,
  REJECTED = 2;

function WeePromise( resolver ){
  var that = this,
    one = getSingleCallable(function( action , value ){
      action( that , value );
    });
  that._state = PENDING;
  that._stack = new Stack();
  that.resolve = function( value ){
    one( $resolve , value );
    return that;
  };
  that.reject = function( reason ){
    one( $reject , reason );
    return that;
  };
  if (resolver) {
    try {
      resolver( that.resolve , that.reject );
    }
    catch( err ){
      that.reject( err );
    }
  }
}

WeePromise.prototype.onresolved = function( value ){
  return value;
};

WeePromise.prototype.onrejected = function( reason ){
  throw reason;
};

WeePromise.prototype._flush = function(){
  var that = this,
    state = that._state;
  if (state) {
    WeePromise.async(function(){
      (function flush(){
        var promise = that._stack.get();
        if (promise) {
          var fn = (state == RESOLVED ? promise.onresolved : promise.onrejected);
          try {
            $resolve( promise , fn( that._value ));
          }
          catch( err ){
            $reject( promise , err );
          }
          flush();
        }
      }());
    });
  }
};

WeePromise.prototype.then = function( onresolved , onrejected ){
  var that = this,
    promise = new WeePromise();
  if (isFunction( onresolved )) {
    promise.onresolved = onresolved;
  }
  if (isFunction( onrejected )) {
    promise.onrejected = onrejected;
  }
  that._stack.put( promise );
  that._flush();
  return promise;
};

WeePromise.prototype.catch = function( onrejected ){
  return this.then( UNDEFINED , onrejected );
};

WeePromise.resolve = function( result ){
  return new WeePromise().resolve( result );
};

WeePromise.reject = function( reason ){
  return new WeePromise().reject( reason );
};

WeePromise.all = function( collection ){
  var promise = new WeePromise(),
    result = [],
    got = 0,
    need = collection.length;
  collection.forEach(function( child , i ){
    unwrap( child , function( state , value ){
      got++;
      result[i] = value;
      if (state == REJECTED) {
        promise.reject( value );
      }
      else if (got == need) {
        promise.resolve( result );
      }
    });
  });
  return promise;
};

WeePromise.race = function( collection ){
  var promise = new WeePromise();
  collection.forEach(function( child ){
    unwrap( child , function( state , value ){
      setState( promise , state , value );
    });
  });
  return promise;
};

function $resolve( context , value ){
  if (value === context) {
    $reject( context , new TypeError( 'A promise cannot be resolved with itself.' ));
  }
  else {
    unwrap( value , function( state , value ){
      setState( context , state , value );
    });
  }
}

function $reject( context , reason ){
  setState( context , REJECTED , reason );
}

function setState( context , state , value ){
  if (context._state != state) {
    context._value = value;
    context._state = state;
    context._flush();
  }
}

function unwrap( value , cb ){
  if (value instanceof WeePromise && value._state) {
    // non-pending WeePromise instances
    cb( value._state , value._value );
  }
  else if (isObject( value ) || isFunction( value )) {
    // objects and functions
    var then,
      one = getSingleCallable(function( fn , args ){
        fn.apply( UNDEFINED , args );
      });
    try {
      then = value.then;
      if (isFunction( then )) {
        then.call( value,
          function( _value ){
            one( unwrap , [ _value , cb ]);
          },
          function( _reason ){
            one( cb , [ REJECTED , _reason ]);
          }
        );
      }
      else {
        one( cb , [ RESOLVED , value ]);
      }
    }
    catch( err ){
      one( cb , [ REJECTED , err ]);
    }
  }
  else {
    // all other values
    cb( RESOLVED , value );
  }
}

function getSingleCallable( cb ){
  var called;
  return function(){
    if (!called) {
      cb.apply( UNDEFINED , arguments );
      called = true;
    }
  };
}

function isObject( subject ){
  return subject && typeof subject == 'object';
}

function isFunction( subject ){
  return typeof subject == 'function';
}

if (typeof exports == "object") {
module.exports = WeePromise;
} else {
global.WeePromise = WeePromise;
}
}(typeof window=="object"?window:global));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(_dereq_,module,exports){
var MOJO = _dereq_( 'mojo' );
var helper = _dereq_( 'shared/helper' );
var StyleDefinition = _dereq_( 'domNode/styleDefinition' );
var CSSProperty = _dereq_( 'domNode/cssProperty' );

module.exports = ComponentMOJO;

function ComponentMOJO() {
    var that = this;
    var order = {};
    MOJO.Construct( that );
    helper.defProp( that , 'order' , { value: order });
}

ComponentMOJO.prototype = MOJO.Create({
    getString: function( type ) {
        var that = this;
        var order = that.getOrder( type );
        var arr = order
            .map(function( key ) {
                var name = getPropertyName( type , key );
                var component = that.getComponents( name );
                component = helper.has( component , 'value' ) ? component.value : component;
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
            out = helper.treeSearch( that , find );
        }
        if (helper.isUndef( out )) {
            out = StyleDefinition.isDefined( find ) ? new CSSProperty( find , null ) : {};
        }
        return out;
    },
    updateComponent: function( bean ) {
        var that = this;
        var styles = bean.styles;
        var type = bean.type;
        var component = (that[type] = that[type] || {});
        helper.each( styles , function( property , key ) {
            var name = getPropertyName( type , key );
            if (helper.isUndef( component[key] )) {
                component[key] = new CSSProperty( name , property );
            }
            else {
                component[key].update( property );
            }
            if (component[key].isDefault()) {
                helper.del( component , key );
                if (helper.length(helper.keys( component )) < 1) {
                    helper.del( that , type );
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
            helper.del( order , type );
        }
    },
    _updateOrder: function( bean ) {  
        var that = this;
        var type = bean.type;
        var storedOrder = that.getOrder( type );
        var passedOrder = bean.order.passed;
        var computedOrder = bean.order.computed;
        var newOrder = passedOrder.concat( storedOrder , computedOrder );
        var componentKeys = helper.keys( that.getComponents( type ));
        newOrder = newOrder.filter(function( property , i ) {
            return (helper.indexOf( newOrder , property ) === i && helper.indexOf( componentKeys , property ) >= 0);
        });
        that.setOrder( type , newOrder );
    }
});

function getPropertyName( type , property ) {
    return (property === 'value' ? type : property);
}

},{"domNode/cssProperty":5,"domNode/styleDefinition":8,"mojo":2,"shared/helper":25}],5:[function(_dereq_,module,exports){
var helper = _dereq_( 'shared/helper' );
var StyleDefinition = _dereq_( 'domNode/styleDefinition' );

module.exports = CSSProperty;

function CSSProperty( name , values ) {
    var that = this;
    var definition = StyleDefinition.retrieve( name );
    var isNull;
    helper.defProps( that , {
        name: helper.descriptor(function() {
            return name;
        }),
        pName: helper.descriptor(function() {
            return definition.pName;
        }),
        defaults: helper.descriptor(function() {
            return definition.defaults;
        }),
        isNull: helper.descriptor(
            function() {
                return isNull;
            },
            function( value ) {
                isNull = value;
            }
        ),
        keymap: helper.descriptor(function() {
            return definition.keymap;
        }),
        string: helper.descriptor(function() {
            return definition.toString( that );
        }),
        length: helper.descriptor(function() {
            return helper.length(
                helper.keys( that )
            );
        }),
        values: helper.descriptor(function() {
            if (helper.length( that ) === 1) {
                return that[0];
            }
            else {
                var key, obj = {}, keymap = that.keymap;
                for (var i = 0; i < helper.length( keymap ); i++) {
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

CSSProperty.prototype = $.extend(helper.create( Array.prototype ), {
    constructor: CSSProperty,
    clone: function( cloneDefaults ) {
        var that = this;
        var subject = (cloneDefaults ? that.defaults : that.values);
        return new CSSProperty( that.name , subject );
    },
    update: function( values ) {
        values = (helper.instOf( values , CSSProperty ) && values.isNull ? null : values);
        var that = this;
        var keymap = that.keymap;
        var key, i;
        that.isNull = (values === null);
        values = (( values || values === 0 ) ? values : that.defaults );
        if (!helper.isObj( values )) {
            values = [ values ];
        }
        for (i = 0; i < helper.length( keymap ); i++) {
            if (helper.isArr( values )) {
                key = i;
            }
            else {
                key = keymap[i];
            }
            if (!helper.isUndef( values[key] )) {
                that[i] = mergeUpdates( that[i] , values[key] );
            }
        }
        function mergeUpdates( storedVal , newVal ) {
            /* jshint -W061 */
            var parts = parseExpression( newVal );
            return ( parts.op ? eval( storedVal + parts.op + parts.val ) : parts.val );
        }
    },
    isDefault: function() {
        var that = this;
        return that.isNull && helper.compareArray( that , that.defaults );
    }
});

function parseExpression( exp ) {
    var re = /(\+|\-|\*|\/|\%)\=/;
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

},{"domNode/styleDefinition":8,"shared/helper":25}],6:[function(_dereq_,module,exports){
var MOJO = _dereq_( 'mojo' );
var helper = _dereq_( 'shared/helper' );
var Queue = _dereq_( 'domNode/queue' );
var ComponentMOJO = _dereq_( 'domNode/componentMOJO' );
var TransitionMOJO = _dereq_( 'domNode/transitionMOJO' );
var CSSProperty = _dereq_( 'domNode/cssProperty' );
var PropertyMap = _dereq_( 'shared/config' ).properties;
var Prefix = _dereq_( 'shared/vendorPatch' ).prefix;

var BEAN_START = 'beanStart';
var BEAN_COMPLETE = 'beanComplete';
var CLUSTER_COMPLETE = 'clusterComplete';
var POD_PAUSED = 'podPaused';
var POD_RESUMED = 'podResumed';
var POD_COMPLETE = 'podComplete';
var POD_CANCELED = 'podCanceled';

module.exports = DomNodeFactory;

function DomNodeFactory( element ) {
    // if this is already an hx element, return it
    if (!helper.isUndef( element.$hx )) {
        return element;
    }
    // otherwise, create a new hx element
    var $hx = new MOJO(getBoundModule( hxModule , element ));
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
        if (helper.isUndef( typeArray )) {
            typeArray = helper.keys( $hx.getOrder() );
        }
        else {
            typeArray = helper.ensureArray( typeArray );
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
        helper.each( transitionMOJO , function( val , type ) {
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
        pretty = (!helper.isUndef( pretty ) ? pretty : true);
        var $hx = this.$hx;
        var components = $hx.componentMOJO.getComponents( find );
        var out = {};
        if (helper.instOf( components , ComponentMOJO )) {
            components.each(function( styleObj , key ) {
                out[key] = $hx.getComponents( key , pretty );
            });
        }
        else if (helper.instOf( components , CSSProperty )) {
            out = getProperty( components );
        }
        else if (!helper.isUndef( components )) {
            helper.each( components , function( property , key ) {
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

},{"domNode/componentMOJO":4,"domNode/cssProperty":5,"domNode/queue":7,"domNode/transitionMOJO":9,"mojo":2,"shared/config":23,"shared/helper":25,"shared/vendorPatch":26}],7:[function(_dereq_,module,exports){
var helper = _dereq_( 'shared/helper' );

module.exports = Queue;

function Queue() {
    var that = this;
    Array.call( that );
    helper.defProps( that , {
        complete: helper.descriptor(function() {
            return !length( that );
        })
    });
}

Queue.prototype = $.extend(helper.create( Array.prototype ), {
    constructor: Queue,
    run: function() {
        var pod = this[0];
        if (pod) {
            pod.run();
        }
    },
    pushPod: function( pod ) {
        var that = this;
        that.push( pod );
        if (length( that ) === 1) {
            that.run();
        }
    },
    proceed: function() {
        var that = this;
        that.shift();
        if (!that.complete) {
            that.run();
            return true;
        }
        return false;
    },
    clear: function( all ) {
        // all controls whether all pods or all but the current pod will be cleared
        all = (!helper.isUndef( all ) ? all : true);
        var that = this;
        while (length( that ) > (all ? 0 : 1)) {
            that.pop().cancel();
        }
    },
    getPodCount: function( type ) {
        type = helper.ensureArray( type );
        return length(
            this.filter(function( pod ) {
                return helper.indexOf( type , pod.type ) >= 0;
            })
        );
    }
});

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

},{"shared/helper":25}],8:[function(_dereq_,module,exports){
var helper = _dereq_( 'shared/helper' );
var PropertyMap = _dereq_( 'shared/config' ).properties;

module.exports = StyleDefinition;

function StyleDefinition() {
    var that = this;
    var args = arguments;
    var other = Properties.other;
    that.name = helper.shift( args );
    that.pName = args[0] || that.name;
    that.defaults = other.defaults;
    that.keymap = other.keymap;
    that.stringGetter = function( name , CSSProperty ) {
        return CSSProperty[0];
    };
}

StyleDefinition.define = function() {
    var args = arguments;
    var name = helper.pop( args );
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
    return !helper.isUndef( Properties[name] );
};

StyleDefinition.retrieve = function( name ) {
    return Properties[name] || new StyleDefinition( name );
};

StyleDefinition.prototype = {
    constructor: StyleDefinition,
    set: function( key , value ) {
        var that = this;
        if (key === 'defaults' || key === 'keymap') {
            value = helper.ensureArray( value );
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

},{"shared/config":23,"shared/helper":25}],9:[function(_dereq_,module,exports){
var MOJO = _dereq_( 'mojo' );
var helper = _dereq_( 'shared/helper' );
var VendorPatch = _dereq_( 'shared/vendorPatch' );
var Easing = _dereq_( 'shared/easing' );

module.exports = TransitionMOJO;

function TransitionMOJO() {
    MOJO.Construct( this );
}

TransitionMOJO.prototype = MOJO.Create({
    constructor: TransitionMOJO,
    getString: function() {
        var that = this;
        var arr = [];
        helper.each( that , function( options , type ) {
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

},{"mojo":2,"shared/easing":24,"shared/helper":25,"shared/vendorPatch":26}],10:[function(_dereq_,module,exports){
var hxManager = _dereq_( 'hxManager' );
var helper = _dereq_( 'shared/helper' );

module.exports = function() {
    var args = arguments;
    var hxm = new hxManager( this );
    var out;
    if (helper.is( args[0] , 'string' )) {
        var method = helper.shift( args );
        if (!helper.isFunc( hxm[method] )) {
            throw new Error( method + ' is not a function.' );
        }
        out = hxm[method].apply( hxm , args );
    }
    else if (helper.is( args[0] , 'object' )) {
        out = hxm.animate( args[0] );
    }
    else {
        out = hxm;
    }
    return out;
};

},{"hxManager":11,"shared/helper":25}],11:[function(_dereq_,module,exports){
var Promise = _dereq_( 'wee-promise' );
var helper = _dereq_( 'shared/helper' );
var DomNodeFactory = _dereq_( 'domNode/domNodeFactory' );
var PodFactory = _dereq_( 'pod/PodFactory' );
var Bean = _dereq_( 'pod/bean' );
var IteratorMOJO = _dereq_( 'pod/iteratorMOJO' );

module.exports = hxManager;

function hxManager( j ){
    var that = this;
    if (helper.instOf( j , hxManager )) {
        return j;
    }
    j.each(function( i ) {
        that[i] = DomNodeFactory( j[i] );
    });
    helper.defProp( that , 'length' , helper.descriptor(
        function() {
            return helper.length( j );
        }
    ));
    return that;
}

hxManager.prototype = $.extend(helper.create( $.prototype ), {
    animate: function( bundle ) {
        var that = this;
        return eachNode( that , function( $hx , node , i ) {
            var pod = PodFactory( node , 'animation' );
            helper.ensureArray( bundle ).forEach(function( seed ) {
                if (helper.isFunc( seed )) {
                    pod.addCallback(seed.bind( that ));
                }
                else {
                    var bean = new Bean( seed , node , i );
                    pod.addBean( bean );
                }
            });
            $hx.addPod( pod );
        });
    },
    iterate: function( bundle ) {
        var that = this;
        return eachNode( that , function( $hx , node , i ) {
            var pod = PodFactory( node , 'precision' );
            helper.ensureArray( bundle ).forEach(function( seed ) {
                if (helper.isFunc( seed )) {
                    pod.addCallback(seed.bind( that ));
                }
                else {
                    var bean = new Bean( seed , node , i );
                    var iterator = new IteratorMOJO( node , bean );
                    pod.addBean( iterator );
                }
            });
            $hx.addPod( pod );
        });
    },
    promise: function( func , method ) {
        method = method || 'all';
        var that = this;
        var pods = that.toArray().map(function( node ) {
            var $hx = node.$hx;
            var pod = PodFactory( node , 'promise' );
            $hx.addPod( pod );
            return pod;
        });
        Promise[ method ]( pods ).then(function() {
            new Promise(
                // create the macroPromise
                func.bind( that )
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
                if (helper.instOf( err , Error )) {
                    $.hx.error( err );
                    $(document).trigger( 'hx.error' , err );
                }
            });
        });
        return that;
    },
    pause: function() {
        return this._precAction( 'pause' );
    },
    resume: function() {
        return this._precAction( 'resume' );
    },
    _precAction: function( method , attempts ) {
        attempts = attempts || 0;
        var that = this;
        var pods = that.toArray()
            .map(function( node ) {
                return node.$hx.getCurrentPod();
            })
            .filter(function( pod ) {
                return pod.type === 'precision';
            });
        if (helper.length( pods ) !== helper.length( that ) && attempts < 10) {
            var unsubscribe = $.hx.subscribe(function() {
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
    },
    paint: function( type ) {            
        return eachNode( this , function( $hx ) {
            $hx.paint( type );
        });
    },
    reset: function( type ) {
        return eachNode( this , function( $hx ) {
            $hx.resetComponents( type );
        });
    },
    then: function( func ) {
        return this.promise( func );
    },
    race: function( func ) {
        return this.promise( func , 'race' );
    },
    defer: function( time ) {
        return this.promise(function( resolve ) {
            if (time) {
                var unsubscribe = $.hx.subscribe(function( elapsed ) {
                    if (elapsed >= time) {
                        unsubscribe();
                        resolve();
                    }
                });
            }
        });
    },
    update: function( bundle ) {
        // update a node's components without applying the transition
        var that = this;
        helper.ensureArray( bundle ).forEach(function( seed ) {
            eachNode( that , function( $hx , node , i ) {
                var bean = new Bean( seed , node , i );
                $hx.updateComponent( bean );
            });
        });
        return that;
    },
    resolve: function( all ) {
        // all controls whether all pod types or only promise pods will be resolved
        all = (!helper.isUndef( all ) ? all : false);
        // force resolve the current pod in each queue
        return eachNode( this , function( $hx ) {
            var pod = $hx.getCurrentPod();
            if (pod && (all || (!all && pod.type === 'promise'))) {
                pod.resolvePod();
            }
        });
    },
    detach: function() {
        // detach callbacks from the subscriber module,
        // but still allow the pod to continue running
        return eachNode( this , function( $hx ) {
            var pod = $hx.getCurrentPod();
            if (pod) {
                pod.detach();
            }
        });
    },
    clear: function() {
        // clear all pods in each queue
        return eachNode( this , function( $hx ) {
            $hx.clearQueue();
        });
    },
    break: function() {
        var that = this;
        // clear all but the current pod in each queue
        eachNode( that , function( $hx ) {
            $hx.clearQueue( false );
        });
        // resolve any remaining promise pods
        return that.resolve();
    },
    zero: function( hxArgs ) {
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
    },
    done: function( func ) {
        var that = this;
        that.promise(function( resolve ) {
            (func || function() {}).call( that );
            resolve();
        });
    },
    get: function( find , pretty ) {
        return this.toArray().map(function( node ) {
            return node.$hx.getComponents( find , pretty );
        });
    },
    cleanup: function() {
        eachNode( this , function( $hx ) {
            $hx.cleanup();
        });
    }
});

function eachNode( hxm , callback ) {
    hxm.toArray().forEach(function( node , i ) {
        callback( node.$hx , node , i );
    });
    return hxm;
}

},{"domNode/domNodeFactory":6,"pod/PodFactory":14,"pod/bean":16,"pod/iteratorMOJO":17,"shared/helper":25,"wee-promise":3}],12:[function(_dereq_,module,exports){
var helper = _dereq_( 'shared/helper' );
var VendorPatch = _dereq_( 'shared/vendorPatch' );
var StyleDefinition = _dereq_( 'domNode/styleDefinition' );
var Bezier = _dereq_( 'shared/bezier' );
var Easing = _dereq_( 'shared/easing' );
var TimingMOJO = _dereq_( 'pod/timingMOJO' );
var hxManager = _dereq_( 'hxManager' );
var hx = _dereq_( 'fn.hx' );

// Do some important stuff when hx is loaded
module.exports = hxManager;
window.hxManager = hxManager;
hxManager.Easing = Easing;
hxManager.VendorPatch = VendorPatch;
hxManager.StyleDefinition = StyleDefinition;
$.fn.hx = hx;
$.hx = {
    defineProperty: StyleDefinition.define,
    defineBezier: Bezier.define,
    subscribe: function( callback ) {
        var startTime = null;
        TimingMOJO.subscribe( timingCallback );
        function timingCallback( e , timestamp ) {
            startTime = (startTime === null ? timestamp : startTime);
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
        null,
        function( name , CSSProperty ) {
            return name + '(' + CSSProperty[0] + 'deg)';
        }
    ],
    [
        [ 'rotateY' ],
        0,
        null,
        function( name , CSSProperty ) {
            return name + '(' + CSSProperty[0] + 'deg)';
        }
    ],
    [
        [ 'rotateZ' ],
        0,
        null,
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
        null,
        null
    ]
]
.forEach(function( definition ) {
    var property = StyleDefinition.define.apply( null , definition[0] );
    [
        'defaults',
        'keymap',
        'stringGetter'
    ]
    .forEach(function( key , i ) {
        var args = definition[i+1];
        if (args !== null) {
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

helper.each( beziers , function( points , name ) {
    Bezier.define( name , points );
});

$(document).trigger( 'hx.ready' );

},{"domNode/styleDefinition":8,"fn.hx":10,"hxManager":11,"pod/timingMOJO":21,"shared/bezier":22,"shared/easing":24,"shared/helper":25,"shared/vendorPatch":26}],13:[function(_dereq_,module,exports){
var MOJO = _dereq_( 'mojo' );
var helper = _dereq_( 'shared/helper' );
var SubscriberMOJO = _dereq_( 'pod/subscriberMOJO' );

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

module.exports = AnimationPod;

function AnimationPod( node ) {
    var that = this;
    that.type = AnimationPod.type;
    that.node = node;
    that.beans = {};
    that.forced = false;
    that.paused = false;
    that.buffer = 0;
    that.attached = true;
    that[PROGRESS] = [];
    MOJO.Construct( that );
    helper.defProps( that , {
        sequence: helper.descriptor(function() {
            var sequence = {};
            helper.each( that.beans , function( cluster , type ) {
                if (helper.length( cluster ) > 0) {
                    sequence[type] = cluster[0];
                }
            });
            return sequence;
        }),
        subscribers: helper.descriptor(function() {
            return helper.length( that.handlers[ TIMING ] || [] );
        }),
        complete: helper.descriptor(function() {
            return that.subscribers === 0;
        })
    });
    that._init();
}

AnimationPod.type = 'animation';

AnimationPod.prototype = MOJO.Create({
    constructor: AnimationPod,
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
        helper.each( that.sequence , function( bean , type ) {
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
        return helper.length( cluster ) > 0;
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
            that.dispel( null , bean );
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
                    that.dispel( null , that );
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
                that.dispel( null , bean );
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

},{"mojo":2,"pod/subscriberMOJO":20,"shared/helper":25}],14:[function(_dereq_,module,exports){
var AnimationPod = _dereq_( 'pod/AnimationPod' );
var PrecisionPod = _dereq_( 'pod/precisionPod' );
var PromisePod = _dereq_( 'pod/promisePod' );

module.exports = function PodFactory( node , type ) {
    switch (type) {
        case AnimationPod.type:
            return new AnimationPod( node );
        case PrecisionPod.type:
            return new PrecisionPod();
        case PromisePod.type:
            return new PromisePod();
    }
};

},{"pod/AnimationPod":13,"pod/precisionPod":18,"pod/promisePod":19}],15:[function(_dereq_,module,exports){
var MOJO = _dereq_( 'mojo' );
var helper = _dereq_( 'shared/helper' );
var TimingMOJO = _dereq_( 'pod/timingMOJO' );

var TIMING = 'timing';

module.exports = SubscriberMOJO;

function SubscriberMOJO() {
    var that = this;
    that.time = null;
    that.startTime = null;
    MOJO.Construct( that );
    helper.defProp( that , 'subscribers' , helper.descriptor(
        function() {
            return helper.length( that.handlers[ TIMING ] || [] );
        }
    ));
    that[TIMING] = that[TIMING].bind( that );
}

SubscriberMOJO.prototype = MOJO.Create({
    constructor: SubscriberMOJO,
    timing: function( e , timestamp ) {
        var that = this;
        var diff = timestamp - (that.time || timestamp);
        that.time = timestamp;
        if (!that.startTime) {
            that.startTime = timestamp;
        }
        var elapsed = timestamp - that.startTime;
        that.happen( TIMING , [ elapsed , diff ]);
        if (that.subscribers < 1) {
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

},{"mojo":2,"pod/timingMOJO":21,"shared/helper":25}],16:[function(_dereq_,module,exports){
var MOJO = _dereq_( 'mojo' );
var helper = _dereq_( 'shared/helper' );
var Config = _dereq_( 'shared/config' );

var TOLERANCE = ( 1000 / 240 );
var TIMING = 'timing';
var PROGRESS = 'progress';
var BEAN_START = 'beanStart';
var BEAN_PAINT = 'beanPaint';
var BEAN_COMPLETE = 'beanComplete';

var OptionKeys = Config.optionKeys;
var PropertyMap = Config.properties;
var Buffer = Config.buffer;

module.exports = Bean;

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
    constructor: Bean,
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
    var computed = helper.keys( seed )
        .filter(function( key , i ) {
            return helper.indexOf( OptionKeys , key ) < 0;
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
    helper.each( options , function( val , key ) {
        if (!helper.has( defaults , key )) {
            helper.del( options , key );
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
    helper.each( seed , function( val , key ) {
        var mappedKey = PropertyMap[key] || key;
        if (helper.indexOf( OptionKeys , mappedKey ) < 0) {
            styles[mappedKey] = getBeanProperty( val , node , index );
        }
    });
    return styles;
}

function getBeanProperty( property , node , index ) {
    return (helper.isFunc( property ) ? property( node , index ) : property);
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

},{"mojo":2,"shared/config":23,"shared/helper":25}],17:[function(_dereq_,module,exports){
var MOJO = _dereq_( 'mojo' );
var helper = _dereq_( 'shared/helper' );
var Easing = _dereq_( 'shared/easing' );
var Bean = _dereq_( 'pod/bean' );

module.exports = IteratorMOJO;

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
    constructor: IteratorMOJO,
    calculate: function( percent ) {
        var that = this;
        helper.each( that.diff , function( diff , key ) {
            var current = that.current[key];
            var dest = that.dest[key];
            diff.forEach(function( val , i ) {
                var value = val * (1 - percent);
                if (helper.isNum( val )) {
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
        var progress = Bean.Calc( elapsed , duration , delay );
        if (Bean.CheckTol( progress , 1 , duration , delay )) {
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
        helper.each( model , function( property , key ) {
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
        helper.each( current , function( CSSProperty , key ) {
            var clone = CSSProperty.clone();
            clone.update( styles[key] );
            newProperties[key] = clone;
        });
        return newProperties;
    },
    _getDiff: function( node , current , dest ) {
        var diff = {};
        helper.each( current , function( property , key ) {
            diff[key] = property.map(function( val , i ) {
                return helper.isNum( val ) ? dest[key][i] - val : val;
            });
        });
        return diff;
    }
});

},{"mojo":2,"pod/bean":16,"shared/easing":24,"shared/helper":25}],18:[function(_dereq_,module,exports){
var MOJO = _dereq_( 'mojo' );
var helper = _dereq_( 'shared/helper' );
var SubscriberMOJO = _dereq_( 'pod/SubscriberMOJO' );

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

module.exports = PrecisionPod;

function PrecisionPod() {
    var that = this;
    that.type = PrecisionPod.type;
    that.forced = false;
    that.paused = false;
    that.buffer = 0;
    that.attached = true;
    that[PROGRESS] = [];
    MOJO.Construct( that );
    helper.defProps( that , {
        subscribers: helper.descriptor(function() {
            return helper.length( that.handlers[ TIMING ] || [] );
        }),
        complete: helper.descriptor(function() {
            return that.subscribers === 0;
        })
    });
    that._init();
}

PrecisionPod.type = 'precision';

PrecisionPod.prototype = MOJO.Create({
    constructor: PrecisionPod,
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
                    that.dispel( null , that );
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
                that.dispel( null , iteratorMOJO );
            break;
            case BEAN_COMPLETE:
                iteratorMOJO = e.target;
                that.dispel( null , iteratorMOJO );
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

},{"mojo":2,"pod/SubscriberMOJO":15,"shared/helper":25}],19:[function(_dereq_,module,exports){
var MOJO = _dereq_( 'mojo' );
var Promise = _dereq_( 'wee-promise' );
var helper = _dereq_( 'shared/helper' );

module.exports = PromisePod;

function PromisePod() {
    var that = this;
    that.type = PromisePod.type;
    that.attached = true;
    Promise.call( that );
    MOJO.Construct( that );
}

PromisePod.type = 'promise';

PromisePod.prototype = MOJO.Create($.extend( {} , helper.create( Promise.prototype ), {
    constructor: PromisePod,
    run: function() {
        this.resolve();
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
}));

},{"mojo":2,"shared/helper":25,"wee-promise":3}],20:[function(_dereq_,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"mojo":2,"pod/timingMOJO":21,"shared/helper":25}],21:[function(_dereq_,module,exports){
var MOJO = _dereq_( 'mojo' );
var helper = _dereq_( 'shared/helper' );
var VendorPatch = _dereq_( 'shared/vendorPatch' );

var TIMING = 'timing';

var shouldLoop = false;
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

helper.defProp( TimingMOJO , 'subscribers' , helper.descriptor(
    function() {
        return helper.length( TimingMOJO.handlers[ TIMING ] || [] );
    }
));

module.exports = TimingMOJO;

function start() {
    shouldLoop = true;
    VendorPatch.RAF( step );
}

function step( timestamp ) {
    TimingMOJO.happen( TIMING , timestamp );
    if (!TimingMOJO.subscribers) {
        shouldLoop = false;
    }
    else if (shouldLoop) {
        VendorPatch.RAF( step );
    }
}

},{"mojo":2,"shared/helper":25,"shared/vendorPatch":26}],22:[function(_dereq_,module,exports){
var helper = _dereq_( 'shared/helper' );
var BezierEasing = _dereq_( 'bezier-easing' );
var VendorPatch = _dereq_( 'shared/vendorPatch' );

var UNCLAMPED = VendorPatch.unclamped();

module.exports = Bezier;

function Bezier( name , points ) {
    var that = this;
    var bezier = new BezierEasing( points );
    Array.call( that );
    points.forEach(function( point ) {
        that.push( UNCLAMPED ? point : clamp( point ));
    });
    helper.defProps( that , {
        name: {value: name},
        string: helper.descriptor(function() {
            return 'cubic-bezier(' + that.join( ',' ) + ')';
        }),
        function: { value: bezier.get },
    });
}

Bezier.define = function( name , points ) {
    if (!helper.isUndef( Definitions[name] )) {
        throw new Error( name + ' is already defined' );
    }
    Definitions[name] = new Bezier( name , points );
    return Definitions[name];
};

Bezier.retrieve = function( name ) {
    return Definitions[name] || Definitions[ Definitions.default ];
};

Bezier.prototype = helper.create( Array.prototype );

Bezier.prototype.constructor = Bezier;

function clamp( point ) {
    return (point < 0 ? 0 : (point > 1 ? 1 : point));
}

var Definitions = {
    default: 'ease'
};

},{"bezier-easing":1,"shared/helper":25,"shared/vendorPatch":26}],23:[function(_dereq_,module,exports){
var helper = _dereq_( 'shared/helper' );

module.exports.buffer = ((1000 / 60) * 2);

module.exports.optionKeys = [ 'ref' , 'type' , 'duration' , 'easing' , 'delay' , 'done' , 'order' ];

module.exports.properties = (function(){
    var properties = {};
    helper.defProps( properties , {
        inverse: helper.descriptor(function() {
            var out = {};
            helper.each( this , function( val , key ) {
                out[val] = key;
            });
            return out;
        })
    });
    return properties;
}());

module.exports.defaults = {
    ref: null,
    duration: 400,
    easing: 'ease',
    delay: 0,
    done: function() {}
};

},{"shared/helper":25}],24:[function(_dereq_,module,exports){
var helper = _dereq_( 'shared/helper' );
var Bezier = _dereq_( 'shared/bezier' );

module.exports = function Easing( definition ) {
    var out;
    if (helper.is( definition , 'string' )) {
        out = Bezier.retrieve( definition );
    }
    else if (helper.is( definition , 'object' )) {
        out =  new Bezier( null , definition );
    }
    return out;
};

},{"shared/bezier":22,"shared/helper":25}],25:[function(_dereq_,module,exports){
function keys( subject ) {
    return Object.keys( subject );
}

function each( subject , cb ){
  if (isArr( subject )) {
    for (var i = 0; i < length( subject ); i++) {
      cb( subject[i] , i );
    }
  }
  else if (is( subject , 'object' )) {
    each(keys( subject ), function( key ){
      cb( subject[key] , key );
    });
  }
  else if (subject) {
    cb( subject , 0 );
  }
  return subject;
}

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

module.exports.keys = keys;
module.exports.each = each;
module.exports.compareArray = compareArray;
module.exports.length = length;
module.exports.isArr = isArr;
module.exports.instOf = instOf;
module.exports.is = is;
module.exports.treeSearch = treeSearch;

module.exports.ensureArray = function( subject ) {
    return (isArr( subject ) ? subject : [ subject ]);
};

module.exports.shift = function( subject ) {
    return Array.prototype.shift.call( subject );
};

module.exports.pop = function( subject ) {
    return Array.prototype.pop.call( subject );
};

module.exports.descriptor = function( getter , setter ) {
    return { get: getter, set: setter };
};

module.exports.indexOf = function( subject , search ) {
    return subject.indexOf( search );
};

module.exports.create = function( subject ) {
    return Object.create( subject );
};

module.exports.defProp = function( subject , name , descriptor ) {
    Object.defineProperty( subject , name , descriptor );
};

module.exports.defProps = function( subject , props ) {
    Object.defineProperties( subject , props );
};

module.exports.has = function( subject , key ) {
    return subject.hasOwnProperty( key );
};

module.exports.del = function( subject , key ) {
    delete subject[key];
};

module.exports.isFunc = function( subject ) {
    return instOf( subject , Function );
};

module.exports.isObj = function( subject , strict ) {
    return strict ? instOf( subject , Object ) : is( subject , 'object' );
};

module.exports.isNum = function( subject ) {
    return !isNaN( subject * 1 );
};

module.exports.isNull = function( subject ) {
    return subject === null;
};

module.exports.isUndef = function( subject ) {
    return is( subject , 'undefined' );
};

module.exports.test = function( subject , testval ) {
    return subject.test( testval );
};

},{}],26:[function(_dereq_,module,exports){
var helper = _dereq_( 'shared/helper' );

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
    (/(?:-[^-]+-)?((?:transform))/g),
    (/(?:-[^-]+-)?((?:transition))/g),
    { regx: (/(?:-[^-]+-)?((?:filter))/g), omit: [ 'ms' ]}
];

var vendor = UA_RegExp( VENDORS );
var os = UA_RegExp( OS );

module.exports.unclamped = function() {
    return isAndroidNative( os ) === false;
};

module.exports.prefix = function( str ) {
    if (vendor === OTHER) {
        return str;
    }
    PREFIX.forEach(function( pfx ) {
        var re, omit = [];
        if (helper.instOf( pfx , RegExp )) {
            re = pfx;
        }
        else {
            re = pfx.regx;
            omit = pfx.omit || omit;
        }
        if (helper.indexOf( omit , vendor ) < 0) {
            str = str.replace( re , ( '-' + vendor + '-$1' ));
        }
    });
    return str;
};

module.exports.RAF = (function(){
    var name = 'equestAnimationFrame';
    var requestAnimationFrame = (
        window['r' + name] ||
        window['webkitR' + name] ||
        window['mozR' + name] ||
        window['oR' + name] ||
        window['msR' + name] ||
        (function(){
            var initTime = Date.now();
            return function( callback ) {
                var timeout = setTimeout(function() {
                    callback( Date.now() - initTime );
                    clearTimeout( timeout );
                }, ( 1000 / 60 ));
            };
        }())
    );
    return function( callback ){
        return requestAnimationFrame( callback );
    };
}());

function UA_RegExp( search ) {
    for (var key in search) {
        if (helper.test( search[key] , USER_AGENT )) {
            return key;
        }
    }
    return OTHER;
}

function isAndroidNative( os ) {
    return (os === 'android' && !helper.test( /(chrome|firefox)/i , USER_AGENT ));
}

},{"shared/helper":25}]},{},[12])(12)
});
//# sourceMappingURL=hx.js.map
