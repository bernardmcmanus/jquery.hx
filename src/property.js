import {
  $_each,
  $_defineValues,
  $_string,
  $_extend,
  $_precision
} from 'core/util';
import Tween from 'tween';

export default class Property {
  constructor( options ){
    var that = this;
    options = $_extend({ precision: 2 }, options );
    that._init( options );
  }
  _init( options ){
    var that = this;
    var initial = $_string.interpret( options.template , options.initial );
    $_defineValues( that , options );
    that.from( initial );
  }
  tweenFn( pct ){
    var that = this;
    $_each( that.eventual , function( value , key ){
      that[key] = that.calc( key , pct );
    });
  }
  calc( key , pct ){
    var that = this;
    return $_precision( that.initial[key] + (that.eventual[key] - that.initial[key]) * pct , that.precision );
  }
  plain(){
    return $_extend( {} , this );
  }
  tweener( duration , easeFn ){
    var that = this;
    $_extend( that.initial , that.plain() );
    return {
      name: that.name,
      duration: duration,
      easeFn: easeFn,
      tweenFn: function( pct , elapsed ){
        that.tweenFn( pct , elapsed );
      }
    };
  }
  fork( options ){
    var that = this;
    options = $_extend({
      name: that.name,
      template: that.template,
      initial: that.plain(),
      tweenFn: that.tweenFn
    }, options );
    options.ancestor = that;
    return new Property( options );
  }
  from( initial ){
    return $_extend( this , initial );
  }
  to( eventual ){
    var that = this;
    $_defineValues( that , { eventual: $_extend( {} , eventual )});
    return that;
  }
  tween( duration , easeFn ){
    var tweener = this.tweener( duration , easeFn );
    return new Tween( tweener );
  }
  isDefault(){
    var ancestor = this.ancestor;
    return ancestor ? this.toString() == ancestor.toString() : false;
  }
  toString(){
    var that = this;
    return $_string.compile( that.template , that );
  }
}
