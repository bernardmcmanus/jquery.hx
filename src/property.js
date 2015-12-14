import {
  $_each,
  $_defineValues,
  $_ensure,
  $_string,
  $_extend,
  $_precision
} from 'core/util';
import Tween from 'tween';

export default class Property {
  constructor( options ){
    var that = this;
    options = $_extend({ precision: 2 }, options );
    that.initialize( options );
  }
  initialize( options ){
    var that = this;
    var initial = $_string.interpret( options.template , options.initial );
    $_defineValues( that , options );
    that.from( initial );
  }
  fork(){
    var that = this;
    return new Property({
      name: that.name,
      template: that.template,
      initial: that.initial,
      ancestor: that
    });
  }
  from( initial ){
    var that = this;
    $_defineValues( that , { initial: $_ensure( initial , {} )});
    return $_extend( that , that.initial );
  }
  to( eventual ){
    var that = this;
    $_defineValues( that , { eventual: $_ensure( eventual , {} )});
    return that;
  }
  tween( cb ){
    var that = this;
    return new Tween(function( pct ){
      $_each( that.eventual , function( value , key ){
        that[key] = $_precision(( value - that.initial[key] ) * pct , that.precision );
      });
      cb( pct );
    });
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
