import Promise from 'wee-promise';
import { $_extend, $_limit } from 'core/util';

export default function Tween( timeFunction ){
  var that = this;
  that.pct = 0;
  that.elapsed = 0;
  that.timeFunction = timeFunction;
  Promise.call( that );
}

Tween.prototype = $_extend(Object.create( Promise.prototype ), {
  constructor: Tween,
  easeFunction: function( pct ){
    return pct
  },
  for: function( time ){
    var that = this;
    that._start(function( elapsed ){
      var pct = $_limit(( elapsed / time ), 0 , 1 );
      that.pct = pct = that.easeFunction( pct );
      that.elapsed = elapsed = $_limit( elapsed , 0 , time );
      that.timeFunction( pct , elapsed );
      if (elapsed < time) {
        return true;
      }
      that.resolve();
    });
    return that;
  },
  ease: function( easeFunction ){
    var that = this;
    that.easeFunction = easeFunction;
    return that;
  },
  _start: function( cb ){
    var that = this,
      start = 0,
      elapsed = 0;
    requestAnimationFrame(function recurse( timestamp ){
      if (!that._state) {
        if (!start) {
          start = timestamp;
        }
        elapsed += (timestamp - start - elapsed);
        cb( elapsed );
        requestAnimationFrame( recurse );
      }
    });
  }
});

Tween.prototype.then = function(){
  var that = this;
  var promise = Promise.prototype.then.apply( that , arguments );
  return $_extend( that , promise );
};

console.log(Tween.prototype);
