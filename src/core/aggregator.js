import Promise from 'wee-promise';
import Stack from 'core/stack';
import * as util from 'core/util';

export default class Aggregator {
  constructor( cb ){
    this.cb = debounce( cb || util.$void );
  }
  add( name , fn ){
    this[name] = fn;
    return this;
  }
  fcall( name , args ){
    var that = this;
    args = util.ensure( args , [] );
    that[name].apply( null , args );
    that.cb.apply( null , args );
  }
}

/*export var consolidate = (function(){
  var stack = new Stack(),
    flush = debounce(function(){
      console.log('flush %s',stack.length);
      stack.flush();
    });
  return function( fn ){
    stack.enqueue( fn );
    console.log('enqueue %s',stack.length);
    flush();
  };
}());*/

export function debounce( cb ){
  var cancel = util.$void;
  return function(){
    var context = this,
      args = util.toArray( arguments );
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
