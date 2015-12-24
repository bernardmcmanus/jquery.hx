// import Promise from 'wee-promise';
import Tweenbean from 'tweenbean';
import Tween from 'tween';
import {
  $_ensure,
  $_defineValues
} from 'core/util';

export default class Collection {
  constructor( name , properties ){
    var that = this;
    $_defineValues( that , {
      name: name,
      order: []
    });
    $_ensure( properties , [] ).forEach(function( property ){
      that.add( property );
    });
  }
  add( property ){
    var that = this,
      name = property.name,
      order = that.order,
      index = order.indexOf( name );
    if (index < 0) {
      order.push( name );
      that[name] = property;
    }
  }
  remove( name ){
    var that = this,
      order = that.order,
      index = order.indexOf( name );
    if (index >= 0) {
      order.splice( index , 1 );
      that[name] = that[name].ancestor.fork();
    }
  }
  tween( duration , easeFn ){
    var that = this;
    var tweenbeans = that.order.map(function( name ){
      return new Tweenbean( that[name] , duration , easeFn );
    });
    return new Tween( tweenbeans );
  }
  /*sort( cb ){
    var that = this;
    that.properties = that.properties.sort( cb );
    return that;
  }*/
  toString(){
    var that = this;
    return that.order
      .map(function( name ){
        return that[name].toString();
      })
      .filter(function( str ){
        return !!str;
      })
      .join(' ');
  }
}
