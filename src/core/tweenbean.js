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
    that.easeFn = Easing.ease.get;
    that.tweenFn = function( pct , elapsed ){
      if (that.pct != pct && !that.fulfilled) {
        that.pct = pct;
        that.elapsed = elapsed;
        that.$emit( 'tweenbean:tic' , function(){
          tweenFn( pct );
        });
      }
    };
    that.then(function(){
      that.fulfilled = true;
      that.$emit( 'tweenbean:end' , function(){
        that.tweenFn( 1 , that.duration );
      });
    });
  }
  ease( fn ){
    var that = this;
    that.easeFn = fn || that.easeFn;
    return that;
  }
  start( cb ){
    var that = this;
    if (!that.started) {
      that.cb = $_ensure( cb , $_void );
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
    that.tweenFn( pct , elapsed );
    if (pctLinear >= 1) {
      timer.off( that );
      that.resolve();
    }
    that.cb();
  }
}
