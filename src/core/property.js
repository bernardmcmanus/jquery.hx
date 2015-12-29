import Tweenbean from 'core/tweenbean';
import * as util from 'core/util';
import {
  $_last,
  $_each,
  $_defineValues,
  $_defineGetters,
  $_string,
  $_extend,
  $_precision
} from 'core/util';

export default class Property {
  static valueAt( initial , eventual , pct , precision ){
    return $_precision( initial + (eventual - initial) * pct , precision );
  }
  static parseValue( value , initial ){
    var result = value;
    if (util.$_defined( value ) && !util.$_is( value , 'object' )) {
      let initialKeys = Object.keys( initial );
      result = {};
      result[initialKeys[0]] = value;
    }
    return $_extend( {} , result );
  }
  constructor( options ){
    var that = this,
      ancestor = options.ancestor || {},
      initial = $_string.interpret( options.template );

    initial = $_extend( ancestor.plain , Property.parseValue( options.initial , initial ));
    options = $_extend({ precision: 2, getters: [], eventual: {} }, options );
    options.initial = initial;

    (function( getters ){
      var arr, getter, i, key;
      /* jshint -W084 */
      while (arr = getters.shift()) {
        getter = $_last( arr );
        for (i = 0; i < arr.length - 1; i++) {
          key = arr[i];
          getters[key] = getter;
        }
      }
      for (key in initial) {
        if (!getters[key]) {
          getters[key] = Property.valueAt;
        }
      }
    }( options.getters ));

    if (Object.keys( options.getters ).indexOf( 'undefined' ) >= 0) {
      throw new Error( 'Properties may not contain numeric keys.' );
    }

    $_defineValues( that , options );
    $_defineGetters( that , {
      plain: function(){
        return $_extend( {} , that );
      }
    });
    that.from( initial );
  }
  _crunch( key , pct ){
    var that = this;
    if (that[key] === that.eventual[key]) {
      return that[key];
    }
    return that.getters[key]( that.initial[key] , that.eventual[key] , pct , that.precision );
  }
  from( value ){
    return $_extend( this , Property.parseValue( value , this.initial ));
  }
  to( value ){
    var that = this;
    $_extend( that.eventual , Property.parseValue( value , this.initial ));
    $_extend( that.initial , that.plain );
    return that;
  }
  tween( duration ){
    var that = this;
    return new Tweenbean( duration , function( pct ){
      that.at( pct );
    });
  }
  at( pct ){
    var that = this;
    $_each( that.eventual , function( value , key ){
      that[key] = that._crunch( key , pct );
    });
  }
  fork( options ){
    var that = this;
    options = $_extend({
      name: that.name,
      template: that.template,
      initial: that.plain,
      getters: that.getters,
      precision: that.precision
    }, options );
    options.ancestor = that;
    return new Property( options );
  }
  toString(){
    var that = this;
    return $_string.compile( that.template , that );
  }
}
