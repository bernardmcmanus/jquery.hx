import Promise from 'wee-promise';
import * as util from 'core/util';
import { debounce } from 'core/aggregator';
import { Easing } from 'main';
import { prefix } from 'jquery/prefixer';
import Stack from 'core/stack';

$.fn.hx = function( fn ){
  /* jshint -W103 */
  var that = this;
  // $.prototype.init.call( that , that.selector , that.context );
  if (!util.is( that , $.fn.hx )) {
    that.__proto__ = $.fn.hx.prototype;
    // console.log(that);
  }
  return fn ? that.each( fn ) : that;
};

var paint = (function(){
  // var gotCalls = 0;
  var stack = new Stack(),
    paintFn = debounce(function(){
      // console.log($.extend({},stack));
      stack.flush(function( $element ){
        $element.css($element.data( 'css' ));
        // console.log('gotCalls %s',gotCalls++);
      });
    });
  return function( $element ){
    if (stack.indexOf( $element ) < 0) {
      stack.enqueue( $element );
    }
    paintFn();
  };
}());

$.fn.hx.prototype = $.extend(Object.create( $.prototype ), {
  constructor: $.fn.hx,
  pushStack: function( elems ){
    var that = this,
      ret = $(elems).hx(),
      intRe = /\d+/;
    ret.prevObject = that;
    util.each( that , function( value , key ){
      if (!util.defined( ret[key] ) && !intRe.test( key )) {
        ret[key] = value;
      }
    });
    return ret;
  },
  enqueue: function( fn ){
    var that = this;
    return that.queue(function( next ){
      new Promise(function( resolve ){
        return fn( resolve );
      })
      .then( next , function( err ){
        next();
        console.error( err.stack );
      });
    });
  },
  tween: function( duration , easing ){
    var that = this;
    return that.each(function( i ){
      var $element = that.eq( i );
      $element.enqueue(function( next ){
        var tweenables = $element.data( 'tweenables' ),
          css = $element.data( 'css' ) || {},
          promises = util.ensure( tweenables , [] ).map(function( tweenable ){
            return tweenable
              .tween(function(){
                css[prefix( tweenable.name )] = prefix( tweenable.toString() );
                paint( $element );
              })
              // .ease( Easing[easing].get )
              .start( duration );
          });
        $element
          .data( 'css' , css )
          .removeData( 'tweenables' );
        return Promise.all( promises ).then( next );
      });
    });
  }
});

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
    values = util.map( property.plain , function( value , key , i ){
      return values[i];
    });
    property.from( values );
  }
  return property || properties.matrix.fork();
}*/
