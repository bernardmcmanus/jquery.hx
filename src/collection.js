import {
  $_ensure,
  $_defineValues
} from 'core/util';

export default class Collection {
  constructor( name , properties ){
    var that = this;
    $_ensure( properties , [] ).forEach(function( property ){
      that.add( property );
    });
    $_defineValues( that , {
      name: name,
      order: Object.keys( that )
    });
  }
  add( property ){
    var that = this;
    that[property.name] = property;
  }
  remove( name ){
    var that = this,
      order = that.order,
      index = order.indexOf( name );
    if (index >= 0) {
      order.splice( index , 1 );
    }
    that[name] = that[name].ancestor.fork();
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
