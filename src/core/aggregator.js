import Promise from 'wee-promise';
import * as util from 'core/util';

export default class Aggregator {
  constructor( cb ){
    this.cb = debounce( cb || $_void );
  }
  add( name , fn ){
    this[name] = fn;
    return this;
  }
  fcall( name , args ){
    var that = this;
    args = util.$_ensure( args , [] );
    that[name].apply( null , args );
    that.cb.apply( null , args );
  }
}

export function debounce( cb ){
  var cancel = util.$_void;
  return function(){
    var context = this,
      args = util.$_toArray( arguments );
    cancel();
    cancel = asap(function(){
      cb.apply( context , args );
    });
  };
}

function asap( cb ){
  var cancelled = false;
  Promise.async(function(){
    if (!cancelled) {
      cb();
    }
  });
  return function(){
    cancelled = true;
  };
}
