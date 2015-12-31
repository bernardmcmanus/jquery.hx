import Tweenbean from 'core/tweenbean';
import * as util from 'core/util';

export default class Collection {
  constructor( name , properties ){
    var that = this;
    util.$_defineValues( that , {
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
  to( cb ){
    return util.$_each( this , function( property , name ){
      var value = cb( property );
      property.to( value );
    });
  }
  tween( cb ){
    var that = this;
    return new Tweenbean( cb ).subscribe(function( e , pct ){
      util.$_each( that , function( property ){
        property.at( pct );
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
