import Promise from 'wee-promise';
import {
  $_extend,
  $_ensure,
  $_void
} from 'core/util';

export default class Aggregator {
  constructor( fns , cb ){
    $_extend( this , fns , { cb: cb });
  }
  fcall( name , args ){
    var that = this;
    args = $_ensure( args , [] );
    that[name].apply( null , args );
    debounce(function(){
      that.cb.apply( null , args );
    });
  }
}

function debounce( cb ){
  $_ensure( debounce.cancel , $_void )();
  debounce.cancel = async( cb );
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
