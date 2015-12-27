// import Promise from 'wee-promise';
import Wee$ from 'engine/wee-money';
import Timer from 'engine/timer';
import { Easing } from 'main';
import {
  $_void,
  $_limit,
  // $_exists,
  $_ensure,
  // $_extend,
  // $_defineGetters
} from 'engine/util';

let timer = new Timer();

export default class Tweenbean extends Wee$ {
  constructor( property , duration , easeFn ){
    super();
    var that = this;
    that.started = 0;
    that.elapsed = 0;
    that.pct = 0;
    // that.resolved = false;
    /*that.duration = $_ensure( duration , 0 );
    that.easeFn = $_ensure( easeFn , Easing.ease.get );*/
    that.duration = duration || 0;
    that.easeFn = Easing.ease.get;
    that.tweenFn = function( pct , elapsed ){
      // if (!that.resolved) {
        that.pct = pct;
        that.elapsed = elapsed;
        property.at( pct );
      // }
    };

    /*that.then(function(){
      // that.resolved = true;
      that.tweenFn( 1 , that.duration );
      timer.off( that );
    });*/

    /*that.$once( 'tween:start' , function( e ){
      setTimeout( that.resolve , that.duration );
    });
    that.then(function(){
      that.tweenFn( 1 , that.duration );
    });*/
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
      /*that.then(function(){
        timer.off( that );
        that.tweenFn( 1 , that.duration );
      });*/
      timer.once(function( e , timestamp ){
        that.started = timestamp;
        that.$emit( 'tween:start' );
        // setTimeout( that.resolve , that.duration );
      });
      timer.on( that );
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
      that.resolve();
      timer.off( that );
      that.$emit( 'tween:end' );
    }
    that.cb();
  }
}
