import Tweenbean from 'core/tweenbean';
import { $_defineValues } from 'core/util';

export default class Collection {
  constructor( name , properties ){
    var that = this;
    $_defineValues( that , {
      name: name,
      order: []
    });
    if (properties) {
      properties.forEach(function( property ){
        that.add( property );
      });
    }
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
  tween( duration ){
    var that = this;
    return new Tweenbean( duration , function( pct ){
      that.order.forEach(function( name ){
        that[name].at( pct );
      });
    });
  }
  toString( delimiter ){
    var that = this;
    return that.order
      .map(function( name ){
        return that[name].toString();
      })
      .filter(function( str ){
        return !!str;
      })
      .join( delimiter || ' ' );
  }
}
