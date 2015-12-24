import Promise from 'wee-promise';
import {
  $_extend,
  $_ensure,
  $_void
} from 'core/util';

export default class Aggregator {
  constructor( fns ){
    var that = this;
    $_extend( that , fns , {
      all: $_void
    });
  }
  fcall( name , args ){
    var that = this;
    args = $_ensure( args , [] );
    $_ensure( that[name] , $_void ).apply( null , args );
    debounce(function(){
      that.all.apply( null , args );
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
