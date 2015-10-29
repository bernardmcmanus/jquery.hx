import Q from 'qlite';

// var INTERVAL = Math.floor( 1000 / 60 );
var Promise = Q.defer().constructor;

window.ptime = function( cb ) {
  setTimeout( cb , 1 );
};

export default function Tween( cb ){
  var that = this;
  that.cb = cb;
  that.pct = 0;
  that.elapsed = 0;
  that.shouldLoop = false;
  Promise.call( that );
}

Tween.prototype = Object.create( Promise.prototype );

Tween.prototype.constructor = Tween;

Tween.prototype._start = function( cb ){
  var that = this;
  var start = 0;
  var elapsed = 0;
  that.shouldLoop = true;
  window.requestAnimationFrame(function recurse( timestamp ){
    if (that.shouldLoop){
      if (!start) {
        start = timestamp;
      }
      elapsed += (timestamp - start - elapsed);
      that.elapsed = elapsed;
      that.shouldLoop = !!cb( elapsed );
      // if (that.shouldLoop){
        window.requestAnimationFrame( recurse );
      // }
    }
  });
};

/*Tween.prototype.for = function( time ){
  var that = this;
  that._start(function( elapsed ){
    var diff = time - elapsed;
    var pct = that.pct = (elapsed / time);
    if (diff <= 0) {
      that.resolve();
    }
    else if (diff <= INTERVAL) {
      setTimeout( that.resolve.bind( that ) , diff );
    }
    else {
      that.cb( pct );
      return true;
    }
  });
  return that;
};*/

Tween.prototype.for = function( time ){
  var that = this;
  that._start(function( elapsed ){
    var pct = that.pct = (elapsed / time);
    that.cb( pct );
    if (pct < 1) return true;
    that.resolve();
  });
  return that;
};
