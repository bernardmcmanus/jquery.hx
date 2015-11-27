import {
  $_map,
  $_each,
  $_defineGetters,
  $_ensure,
  $_string,
  $_extend,
  $_precision
} from 'core/util';
import Tween from 'tween';

export default class Property {
  constructor( options ){
    var that = this;
    $_extend( options , { precision: 2 });
    that.initialize( options );
  }
  initialize( options ){
    var that = this;
    var initial = $_string.interpret( options.template , options.initial );
    var descriptors = $_map( options , function( value ){
      return function(){ return value; };
    });
    $_defineGetters( that , descriptors );
    that.from( initial );
  }
  from( initial ){
    var that = this;
    initial = $_ensure( initial , {} );
    $_defineGetters( that , {
      initial: function(){ return initial; }
    });
    return $_extend( that , initial );
  }
  to( eventual ){
    var that = this;
    eventual = $_ensure( eventual , {} );
    $_defineGetters( that , {
      eventual: function(){ return eventual; }
    });
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
  toString(){
    var that = this;
    return $_string.compile( that.template , that );
  }
}
