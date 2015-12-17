import Promise from 'wee-promise';
import Wee$ from 'wee-money';
import Timer from 'timer';
import { Easing } from 'main';
import {
  $_void,
  $_limit,
  $_exists,
  $_ensure,
  $_extend,
  $_defineGetters
} from 'core/util';

let timer = new Timer();

/**
 * @class Tween
 * @classdesc Tween
 * @extends Promise
 * @param {(object|array)} tweenbeans
 * @param {string} tweenbeans.name - The property name.
 * @param {number} [tweenbeans.duration=0] - The tween duration.
 * @param {function} [tweenbeans.easeFn] - The easing function.
 * @param {function} tweenbeans.tweenFn - The property's tween function.
 */
export default class Tween extends Wee$ {
  constructor( tweenbeans ){
    super();
    var that = this;
    that._started = 0;
    that.tweenbeans = $_ensure( tweenbeans , [] )/*.map(function( tweenbean ){
      return tweenbean.$watch( that );
    })*/;
  }
  run( cb ){
    var that = this;
    if (!that._started) {
      that.cb = $_ensure( cb , $_void );
      Promise.all( that.tweenbeans ).then(function(){
        timer.off( that );
        that.resolve();
      });
      timer.on( that );
      that.$emit( 'tween:start' );
    }
    return that;
  }
  handleE$( e , timestamp ){
    var that = this,
      tweenbeans = that.tweenbeans,
      i = 0,
      pctLinear;
    that._started = that._started || timestamp;
    for (; i < tweenbeans.length; i++) {
      tweenbeans[i].elapsed = $_limit( timestamp - that._started , 0 , tweenbeans[i].duration );
      pctLinear = $_ensure($_limit(( tweenbeans[i].elapsed / tweenbeans[i].duration ), 0 , 1 ), 1 );
      tweenbeans[i].pct = tweenbeans[i].easeFn( pctLinear );
      tweenbeans[i].tweenFn( tweenbeans[i].pct , tweenbeans[i].elapsed );
      if (pctLinear >= 1) {
        tweenbeans[i].resolve();
        tweenbeans.splice( i , 1 );
        i--;
      }
    }
    that.cb();
  }
}
