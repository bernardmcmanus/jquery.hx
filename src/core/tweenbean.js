import Wee$ from 'core/wee-money';
import Timer from 'core/timer';
import { Easing } from 'main';
import * as util from 'core/util';

let timer = new Timer(),
  startEvent = 'tweenbean:start',
  updateEvent = 'tweenbean:update',
  endEvent = 'tweenbean:end';

export default class Tweenbean extends Wee$ {
  static get events(){
    return {
      start: startEvent,
      update: updateEvent,
      end: endEvent
    };
  }
  constructor( tweenFn ){
    super();
    var that = this;
    that.started = 0;
    that.elapsed = -1;
    that.pct = -1;
    that.duration = 0;
    that.fulfilled = false;
    that.tweenFn = tweenFn || util.$_void;
    that.easeFn = Easing.ease.get;
    that.then(function(){
      timer.off( that );
      that.$emit( endEvent , function(){
        that._tic( 1 , 1 , that.duration );
      });
      that.$dispel();
      that.fulfilled = true;
    });
  }
  _tic( pctEased , pctLinear , elapsed ){
    var that = this;
    if (that.pct != pctEased && !that.fulfilled) {
      that.pct = pctEased;
      that.elapsed = elapsed;
      that.$emit( updateEvent , pctEased , function( e ){
        that.tweenFn();
        if (pctLinear >= 1) {
          that.resolve();
        }
      });
    }
  }
  ease( easeFn ){
    var that = this;
    that.easeFn = easeFn || that.easeFn;
    return that;
  }
  subscribe( subscriber ){
    subscriber = util.$_ensure( subscriber , util.$_void );
    return this.$when( updateEvent , subscriber );
  }
  start( duration ){
    var that = this;
    if (!that.started) {
      that.started = true;
      that.duration = duration || 0;
      timer.once(function( e , timestamp ){
        that.started = timestamp;
        setTimeout( that.resolve , that.duration );
      });
      timer.on( that );
      that.$emit( startEvent );
    }
    return that;
  }
  handleE$( e , timestamp ){
    if (e.type == Timer.events.tic) {
      var that = this,
        duration = that.duration,
        elapsed = util.$_limit( timestamp - that.started , 0 , duration ),
        pctLinear = util.$_ensure(util.$_limit(( elapsed / duration ), 0 , 1 ), 1 ),
        pctEased = that.easeFn( pctLinear );
      that._tic( pctEased , pctLinear , elapsed );
    }
  }
}
