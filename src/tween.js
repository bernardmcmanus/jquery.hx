import Promise from 'wee-promise';
import Timer from 'timer';
import { Easing } from 'main';
import {
  $_limit,
  $_ensure,
  $_extend,
  $_defineGetters
} from 'core/util';

let $timer = new Timer();

/**
 * @class Tween
 * @classdesc Tween
 * @extends Promise
 * @param {(object|array)} tweeners
 * @param {string} tweeners.name - The property name.
 * @param {number} [tweeners.duration=0] - The tween duration.
 * @param {function} [tweeners.easeFn] - The easing function.
 * @param {function} tweeners.tweenFn - The property's tween function.
 */
export default class Tween extends Promise {
  constructor( tweeners ){
    super();
    this.tweeners = $_ensure( tweeners , [] ).map(function( tweener ){
      var promise = new Promise();
      return $_extend({
        pct: 0,
        elapsed: 0,
        duration: 0,
        easeFn: Easing.ease.get,
        promise: promise
      }, tweener );
    });
  }
  run( cb ){
    var that = this,
      start = 0,
      tweeners = that.tweeners,
      promises = tweeners.map(function( tweener ){
        return tweener.promise;
      }),
      tic = function( e , timestamp ){
        start = start || timestamp;
        var i = 0,
          pctLinear;
        for (; i < tweeners.length; i++) {
          tweeners[i].elapsed = $_limit( timestamp - start , 0 , tweeners[i].duration );
          pctLinear = $_limit(( tweeners[i].elapsed / tweeners[i].duration ), 0 , 1 );
          if (isNaN( pctLinear )) {
            pctLinear = 1;
          }
          tweeners[i].pct = tweeners[i].easeFn( pctLinear );
          tweeners[i].tweenFn( tweeners[i].pct , tweeners[i].elapsed );
          if (pctLinear >= 1) {
            tweeners[i].promise.resolve();
            tweeners.splice( i , 1 );
            i--;
          }
        }
        if (cb) {
          cb();
        }
      };
    Promise.all( promises ).then(function(){
      $timer.off( tic );
      that.resolve();
    });
    $timer.on( tic );
    return that;
  }
}
