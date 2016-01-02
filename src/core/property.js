import Tweenbean from 'core/tweenbean';
import * as $string from 'core/string';
import * as util from 'core/util';

export default class Property {
  static valueAt( initial , eventual , pct , precision ){
    return util.precision( initial + (eventual - initial) * pct , precision );
  }
  static parseValue( value , initial ){
    var result = value;
    if (util.defined( value ) && !util.is( value , 'object' )) {
      let initialKeys = util.keys( initial );
      result = {};
      result[initialKeys[0]] = value;
    }
    return util.extend( {} , result );
  }
  constructor( options ){
    var that = this,
      ancestor = options.ancestor || {},
      initial = $string.interpret( options.template );

    initial = util.extend( ancestor.plain , Property.parseValue( options.initial , initial ));
    options = util.extend({ precision: 2, getters: [], eventual: {} }, options );
    options.initial = initial;

    (function( getters ){
      var arr, getter, i, key;
      /* jshint -W084 */
      while (arr = getters.shift()) {
        getter = util.last( arr );
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

    if (util.keys( options.getters ).indexOf( 'undefined' ) >= 0) {
      throw new Error( 'Properties may not contain numeric keys.' );
    }

    util.defineValues( that , options );
    util.defineGetters( that , {
      plain: function(){
        return util.extend( {} , that );
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
    return util.extend( this , Property.parseValue( value , this.initial ));
  }
  to( value ){
    var that = this;
    util.extend( that.eventual , Property.parseValue( value , this.initial ));
    util.extend( that.initial , that.plain );
    return that;
  }
  tween( cb ){
    var that = this;
    return new Tweenbean( cb ).subscribe(function( e , pct ){
      if (!that.at( pct )) {
        e.preventDefault();
      }
    });
  }
  at( pct ){
    var that = this,
      changed = false;
    util.each( that.eventual , function( value , key ){
      var current = that._crunch( key , pct );
      if (changed || that[key] != current) {
        that[key] = current;
        changed = true;
      }
    });
    return changed;
  }
  fork( options ){
    var that = this;
    options = util.extend({
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
    return $string.compile( that.template , that );
  }
}
