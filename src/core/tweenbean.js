import Wee$ from 'core/wee-money';
import Timer from 'core/timer';
import { Easing } from 'main';
import * as util from 'core/util';

let startEvent = 'tweenbean:start',
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
    that.tweenFn = tweenFn || util.$void;
    that.easeFn = Easing.ease.get;
    that.then(function(){
      Timer.off( that );
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
    subscriber = util.ensure( subscriber , util.$void );
    return this.$when( updateEvent , subscriber );
  }
  start( duration ){
    var that = this;
    if (!that.started) {
      that.started = true;
      that.duration = duration || 0;
      Timer.once(function( e , timestamp ){
        that.started = timestamp;
        setTimeout( that.resolve , that.duration );
      });
      Timer.on( that );
      that.$emit( startEvent );
    }
    return that;
  }
  handleE$( e , timestamp ){
    if (e.type == Timer.events.tic) {
      var that = this,
        duration = that.duration,
        elapsed = util.limit( timestamp - that.started , 0 , duration ),
        pctLinear = util.ensure(util.limit(( elapsed / duration ), 0 , 1 ), 1 ),
        pctEased = that.easeFn( pctLinear );
      that._tic( pctEased , pctLinear , elapsed );
    }
  }
}
