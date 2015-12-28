// import Promise from 'wee-promise';
import {
  Property,
  Collection,
  Easing
} from 'main';
import * as util from 'core/util';

function parseMatrix( $element ){
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
}

$.fn.hx = function( opts ){
  /* jshint -W103 */
  var that = this;
  if (!util.$_is( that , $.fn.hx )) {
    that.__proto__ = $.fn.hx.prototype;
  }
  // console.log(that);
  return that;
  // return that.tween( opts );
};

$.fn.hx.prototype = $.extend(Object.create( jQuery.prototype ), {
  constructor: $.fn.hx,
  _setValues: function( name , values ){
    var that = this;
    that.each(function(){
      var $element = $(this).hx(),
        collection = $element.data( name ),
        matrix;
      if (!collection) {
        matrix = parseMatrix( $element );
        collection = new Collection( name , [ matrix ]);
      }
      $element
        .queue(function( next ){
          util.$_each( values , function( value , name ){
            var property = collection[name] || properties[name].fork();
            property.to( value );
            collection.add( property );
          });
          $element.data( 'collection' , collection );
          next();
        })
        .data( name , collection );
    });
    return that;
  },
  tween: function( duration , easing ){
    var that = this;
    that.each(function(){
      var $element = $(this);
      $element.queue(function( next ){
        var collection = $element.data( 'collection' );
        $element.removeData( 'collection' );
        collection
          .tween( duration )
          // .ease( Easing[easing].get )
          .start(function(){
            $element.css( collection.name , collection.toString() );
          })
          .then( next , next );
      });
      // console.log(that.queue());
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
  /*get properties(){
    return properties;
  },*/
  defineProperty: function( opts ){
    properties[opts.name] = new Property( opts );
  },
  defineMethod: function( name ){
    $.fn.hx.prototype[name] = function( opts ){
      return this._setValues( name , opts );
    };
    $.prototype[name] = function( opts ){
      return this.hx()[name]( opts );
    };
  }
};

$.hx.defineMethod( 'transform' );

$.hx.defineProperty({
  name: 'opacity',
  template: '${value}',
  initial: { value: 1 }
});

$.hx.defineProperty({
  name: 'matrix',
  template: 'matrix3d(${a1},${b1},${c1},${d1},${a2},${b2},${c2},${d2},${a3},${b3},${c3},${d3},${a4},${b4},${c4},${d4})',
  initial: {
    a1: 1, b1: 0, c1: 0, d1: 0,
    a2: 0, b2: 1, c2: 0, d2: 0,
    a3: 0, b3: 0, c3: 1, d3: 0,
    a4: 0, b4: 0, c4: 0, d4: 1
  }
});

$.hx.defineProperty({
  name: 'matrix2d',
  template: 'matrix(${a},${b},${c},${d},${x},${y})',
  initial: { a: 1, b: 0, c: 0, d: 1, x: 0, y: 0 }
});

$.hx.defineProperty({
  name: 'translate',
  template: 'translate3d(${x}px,${y}px,${z}px)',
  initial: { x: 0, y: 0, z: 0 }
});

$.hx.defineProperty({
  name: 'translateZ',
  template: 'translateZ(${value}px)',
  initial: { value: 0 }
});
