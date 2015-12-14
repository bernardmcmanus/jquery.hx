import Promise from 'wee-promise';
import Timer from 'timer';
import { $_limit, $_defineGetters } from 'core/util';

let $timer = new Timer();

export default class Tween extends Promise {
  constructor( timeFunction ){
    super();
    var that = this;
    that.pct = 0;
    that.elapsed = 0;
    that.timeFunction = timeFunction;
    $_defineGetters( that , {
      pending: function(){ return that._state < 1; }
    });
  }
  easeFunction( pct ){
    return pct;
  }
  for( time ){
    var that = this;
    that._start(function( elapsed ){
      var pct = $_limit(( elapsed / time ), 0 , 1 );
      that.pct = pct = that.easeFunction( pct );
      that.elapsed = elapsed = $_limit( elapsed , 0 , time );
      if (that.timeFunction) {
        that.timeFunction( pct , elapsed );
      }
      if (elapsed < time) {
        return true;
      }
      that.resolve();
    });
    return that;
  }
  ease( easeFunction ){
    var that = this;
    that.easeFunction = easeFunction;
    return that;
  }
  _start( cb ){
    var that = this;
    $timer.on(function tic( e , data , timestamp ){
      if (that.pending) {
        if (!data.start) {
          data.start = timestamp;
        }
        data.elapsed += (timestamp - data.start - data.elapsed);
        cb( data.elapsed );
      }
      else {
        $timer.off( tic );
      }
    });
  }
}
