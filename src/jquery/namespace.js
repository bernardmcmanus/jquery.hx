// import Promise from 'wee-promise';
import * as util from 'core/util';
import {
  Property,
  Collection
} from 'main';

var properties = {};

$.hx = {
  _prototype: $.fn.hx.prototype,
  properties: properties,
  defineProperty: function( opts ){
    properties[opts.name] = new Property( opts );
    return this;
  },
  defineMethod: function( name , collectionName ){
    $.fn.hx.prototype[name] = function( opts ){
      var that = this;
      return that.each(function( i ){
        var $element = that.eq( i ),
          propOrCollection = $element.data( collectionName || name );
        if (!propOrCollection) {
          propOrCollection = collectionName ? new Collection( collectionName ) : properties[name].fork();
        }
        $element
          .enqueue(function( next ){
            if (util.is( propOrCollection , Collection )) {
              function setPropertyValues( values , name ){
                var property = propOrCollection[name] || properties[name].fork();
                property.to( values );
                propOrCollection.add( property );
              }
              if (name == collectionName) {
                util.each( opts , setPropertyValues );
              }
              else {
                setPropertyValues( opts , name );
              }
            }
            else {
              propOrCollection.to( opts );
            }
            var tweenables = util.ensure( $element.data( 'tweenables' ) , [] );
            tweenables.push( propOrCollection );
            $element.data( 'tweenables' , tweenables );
            next();
          })
          .data( collectionName || name , propOrCollection );
      });
    };
    $.prototype[name] = function( opts ){
      return this.hx()[name]( opts );
    };
    return this;
  }
};