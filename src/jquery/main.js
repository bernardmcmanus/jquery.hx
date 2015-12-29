import Promise from 'wee-promise';
import {
  Property,
  Collection,
  Easing
} from 'main';
import * as util from 'core/util';

/*function parseMatrix( $element ){
  var str = $element.css( '-webkit-transform' ),
    property,
    values = str
      .replace( /[^\d\.\-,]/g , '' )
      .split( ',' )
      .map(function( n ){
        return parseFloat( n , 10 );
      })
      .filter(function( n ){
        return !isNaN( n );
      });
  if (values.length) {
    property = properties[( values.length == 6 ? 'matrix2d' : 'matrix' )].fork();
    values = util.$_map( property.plain , function( value , key , i ){
      return values[i];
    });
    property.from( values );
  }
  return property || properties.matrix.fork();
}*/

$.fn.hx = function( opts ){
  /* jshint -W103 */
  var that = this;
  // $.prototype.init.call( that , that.selector , that.context );
  if (!util.$_is( that , $.fn.hx )) {
    that.__proto__ = $.fn.hx.prototype;
    // console.log(that);
  }
  return that;
};

$.fn.hx.prototype = $.extend(Object.create( jQuery.prototype ), {
  constructor: $.fn.hx,
  pushStack: function( elems ){
    var that = this,
      ret = $(elems).hx(),
      intRe = /\d+/;
    ret.prevObject = that;
    util.$_each( that , function( value , key ){
      if (!util.$_defined( ret[key] ) && !intRe.test( key )) {
        ret[key] = value;
      }
    });
    return ret;
  },
  tween: function( duration , easing ){
    var that = this;
    that.each(function(){
      var $element = $(this);
      $element.queue(function( next ){
        var tweenables = $element.data( 'tweenables' ),
          promises = util.$_ensure( tweenables , [] ).map(function( tweenable ){
            return tweenable
              .tween( duration )
              // .ease( Easing[easing].get )
              .start(function(){
                // console.log(tweenable.name,tweenable.toString());
                $element.css( tweenable.name , tweenable.toString() );
              });
          });
        $element.removeData( 'tweenables' );
        Promise.all( promises ).then( next , function( err ){
          next();
          console.error( err.stack );
        });
      });
    });
    return that;
  },
  paint: function(){
    var that = this,
      strings = that.data( 'css' ),
      css = util.$_map( strings , function( collection ){
        return collection.toString();
      });
    // console.log(strings);
    console.log(css);
    return that;
  }
});

var properties = {};

$.hx = {
  _prototype: $.fn.hx.prototype,
  properties: properties,
  defineProperty: function( opts ){
    properties[opts.name] = new Property( opts );
    return this;
  },
  defineMethod: function( name , collectionName ){
    $.fn.hx.prototype[name] = function( opts ){
      var that = this;
      return that.each(function(){
        var $element = $(this),
          propOrCollection = $element.data( collectionName || name );
        if (!propOrCollection) {
          propOrCollection = collectionName ? new Collection( collectionName ) : properties[name];
        }
        $element
          .queue(function( next ){
            Promise.resolve().then(function(){
              if (util.$_is( propOrCollection , Collection )) {
                function setPropertyValues( values , name ){
                  var property = propOrCollection[name] || properties[name].fork();
                  property.to( values );
                  propOrCollection.add( property );
                }
                if (name == collectionName) {
                  util.$_each( opts , setPropertyValues );
                }
                else {
                  setPropertyValues( opts , name );
                }
              }
              else {
                propOrCollection.to( opts );
              }
              var tweenables = util.$_ensure( $element.data( 'tweenables' ) , [] );
              tweenables.push( propOrCollection );
              $element.data( 'tweenables' , tweenables );
            })
            .then( next , function( err ){
              next();
              console.error( err.stack );
            });
          })
          .data( collectionName || name , propOrCollection );
      });
    };
    $.prototype[name] = function( opts ){
      return this.hx()[name]( opts );
    };
    return this;
  }
};

$.hx
  .defineMethod( 'opacity' )
  .defineMethod( 'transform' , 'transform' )
  .defineMethod( 'translate' , 'transform' )
  .defineMethod( 'rotate' , 'transform' )
  .defineMethod( 'rotateX' , 'transform' )
  .defineMethod( 'rotateY' , 'transform' )
  .defineMethod( 'rotateZ' , 'transform' )
  .defineProperty({
    name: 'opacity',
    template: '${value}',
    initial: 1
  })
  .defineProperty({
    name: 'matrix',
    template: 'matrix3d(${a1},${b1},${c1},${d1},${a2},${b2},${c2},${d2},${a3},${b3},${c3},${d3},${a4},${b4},${c4},${d4})',
    initial: {
      a1: 1, b1: 0, c1: 0, d1: 0,
      a2: 0, b2: 1, c2: 0, d2: 0,
      a3: 0, b3: 0, c3: 1, d3: 0,
      a4: 0, b4: 0, c4: 0, d4: 1
    }
  })
  .defineProperty({
    name: 'matrix2d',
    template: 'matrix(${a},${b},${c},${d},${x},${y})',
    initial: { a: 1, b: 0, c: 0, d: 1, x: 0, y: 0 }
  })
  .defineProperty({
    name: 'translate',
    template: 'translate3d(${x}px,${y}px,${z}px)',
    initial: { x: 0, y: 0, z: 0 }
  })
  .defineProperty({
    name: 'translateX',
    template: 'translateX(${value}px)',
    initial: 0
  })
  .defineProperty({
    name: 'translateY',
    template: 'translateY(${value}px)',
    initial: 0
  })
  .defineProperty({
    name: 'translateZ',
    template: 'translateZ(${value}px)',
    initial: 0
  })
  .defineProperty({
    name: 'translate2d',
    template: 'translate(${x}px,${y}px)',
    initial: { x: 0, y: 0 }
  })
  .defineProperty({
    name: 'scale',
    template: 'scale3d(${x},${y},${z})',
    initial: { x: 1, y: 1, z: 1 }
  })
  .defineProperty({
    name: 'scale2d',
    template: 'scale(${x},${y})',
    initial: { x: 1, y: 1 }
  })
  .defineProperty({
    name: 'rotate',
    template: 'rotate3d(${x},${y},${z},${a}deg)',
    initial: { x: 0, y: 0, z: 0, a: 0 },
    getters: [
      [ 'x' , 'y' , 'z' , function( initial , eventual ){
        return eventual;
      }]
    ]
  })
  .defineProperty({
    name: 'rotateX',
    template: 'rotateX(${value}deg)',
    initial: 0
  })
  .defineProperty({
    name: 'rotateY',
    template: 'rotateY(${value}deg)',
    initial: 0
  })
  .defineProperty({
    name: 'rotateZ',
    template: 'rotateZ(${value}deg)',
    initial: 0
  });

