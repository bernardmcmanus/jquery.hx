import Wee$ from 'core/wee-money';
import Timer from 'core/timer';
import { Easing } from 'main';
import {
  $_void,
  $_limit,
  $_ensure
} from 'core/util';

let timer = new Timer();

export default class Tweenbean extends Wee$ {
  constructor( duration , tweenFn ){
    super();
    var that = this;
    that.started = 0;
    that.elapsed = 0;
    that.pct = 0;
    that.fulfilled = false;
    that.duration = duration || 0;
    that.tweenFn = tweenFn || $_void;
    that.easeFn = Easing.ease.get;
    that.then(function(){
      that.fulfilled = true;
      that.$emit( 'tweenbean:end' , function(){
        that._tic( 1 , that.duration );
      });
    });
  }
  _tic( pct , elapsed ){
    var that = this;
    if (that.pct != pct && !that.fulfilled) {
      that.pct = pct;
      that.elapsed = elapsed;
      that.$emit( 'tweenbean:tic' , function(){
        that.tweenFn( pct );
      });
    }
  }
  ease( fn ){
    var that = this;
    that.easeFn = fn || that.easeFn;
    return that;
  }
  start( cb ){
    var that = this;
    if (!that.started) {
      that.cb = cb || $_void;
      timer.once(function( e , timestamp ){
        that.started = timestamp;
        setTimeout( that.resolve , that.duration );
      });
      timer.on( that );
      that.$emit( 'tweenbean:start' );
    }
    return that;
  }
  handleE$( e , timestamp ){
    var that = this,
      duration = that.duration,
      elapsed = $_limit( timestamp - that.started , 0 , duration ),
      pctLinear = $_ensure($_limit(( elapsed / duration ), 0 , 1 ), 1 ),
      pct = that.easeFn( pctLinear );
    that._tic( pct , elapsed );
    if (pctLinear >= 1) {
      timer.off( that );
      that.resolve();
    }
    that.cb();
  }
}
