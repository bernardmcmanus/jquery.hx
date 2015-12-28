import Promise from 'wee-promise';
import {
  $_ensure,
  $_void
} from 'core/util';

export default class Aggregator {
  constructor( cb ){
    this.cancel = $_void;
    this.cb = $_ensure( cb , $_void );
  }
  add( name , fn ){
    this[name] = fn;
    return this;
  }
  fcall( name , args ){
    var that = this;
    args = $_ensure( args , [] );
    that[name].apply( null , args );
    that.debounce(function(){
      that.cb.apply( null , args );
    });
  }
  debounce( cb ){
    this.cancel();
    this.cancel = async( cb );
  }
}

function async( cb ){
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
