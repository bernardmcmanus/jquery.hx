export function $void( input ){
  return input;
}

export function limit( subject , min , max ){
  return Math.max(Math.min( subject , max ) , min );
}

export function precision( subject , digits ){
  var multiplier = Math.pow( 10 , digits );
  return Math.round( subject * multiplier ) / multiplier;
}

export var reqAFrame = (function(){
  return function( cb ){
    return window.requestAnimationFrame( cb );
  };
  /*var called = 0;
  return function( cb ){
    setTimeout(function(){
      cb( performance.now() );
    },Math.floor( 1000 / 60 ));
    return called++;
  };*/
}());

export function ensure( subject , rescuer ){
  if (is( rescuer , Array ) && defined( subject )) {
    rescuer[0] = subject;
  }
  else if (isFunction( rescuer ) && isFunction( subject )) {
    return subject;
  }
  return is( subject , rescuer ) ? subject : rescuer;
}

/*export function ensure( subject , rescuer ){
  if (is( rescuer , Array )) {
    // return is( subject , Array ) ? subject : (defined( subject ) ? [ subject ] : []);
    if (defined( subject )) {
      rescuer[0] = subject;
    }
    return is( subject , Array ) ? subject : rescuer;
  }
  return subject || rescuer;
}*/

/*export function sanitize( subject ){
  return !subject ? subject : map( subject , function( value ){
    if (value && is( value , 'object' )) {
      return sanitize( value );
    }
    else {
      // strip null, undefined, and empty strings
      return value || (value !== 0 ? undefined : value);
    }
  });
}*/

/*export function parsePrimitives( subject ) {
  var result;
  if (subject && $util.is( subject , 'object' )) {
    result = Array.isArray( subject ) ? [] : {};
    keys( subject ).forEach(function( key ) {
      result[key] = parsePrimitives( subject[key] );
    });
  }
  else {
    result = subject;
    if ($util.contains([ 'true' , 'false' ] , subject )) {
      return subject == 'true';
    }
    else if (subject == 'null') {
      return null;
    }
    else if (subject == 'undefined') {
      return undefined;
    }
    else if ($util.is( subject , 'string' ) && $util.isTrueNumber( subject )) {
      return parseFloat( subject , 10 );
    }
  }
  return result;
}*/

export function toArray( subject ){
  return Array.prototype.slice.call( subject , 0 );
}

export function last( subject , getKey ){
  var lastKey = keys( subject ).slice( -1 );
  return getKey ? lastKey : subject[lastKey];
}

export function defineGetters( subject , getters ){
  var descriptors = map( getters , function( getter ){
    return { get: getter, configurable: true, enumerable: false };
  });
  Object.defineProperties( subject , descriptors );
}

export function defineValues( subject , getters ){
  var descriptors = map( getters , function( value ){
    return { value: value, configurable: true, writable: false, enumerable: false };
  });
  Object.defineProperties( subject , descriptors );
}

/*export var extend = (function(){
  return function(){
    // adapted from jQuery.extend (2.0.3)
    var args = arguments,
      options,
      name,
      src,
      copy,
      copyIsArray,
      clone,
      target = args[0] || {},
      i = 1,
      length = args.length,
      deep = false;
    if (is( target , 'boolean' )) {
      deep = target;
      target = args[1] || {};
      i = 2;
    }
    if (!is( target , 'object' ) && !is( target , 'function' )) {
      target = {};
    }
    for (; i < length; i++) {
      if ((options = args[i]) !== null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && (isPlainObject( copy ) || (copyIsArray = is( copy , Array )))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && is( src , Array ) ? src : [];
            }
            else {
              clone = src && isPlainObject( src ) ? src : {};
            }
            target[name] = extend( deep , clone , copy );
          }
          else if (defined( copy )) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };
  function isPlainObject( subject ){
    return is( subject , 'object' ) && !is( subject , Array ) && !subject.nodeType && subject !== window;
  }
}());*/

export var extend = (function(){
  function allKeys( obj ){
    if (!isObject( obj )) {
      return [];
    }
    var _keys = [];
    for (var key in obj) {
      _keys.push( key );
    }
    return _keys;
  }

  function isObject( obj ){
    var type = typeof obj;
    return type == 'function' || type == 'object' && !!obj;
  }

  return function( obj ){
    var args = arguments,
      length = args.length;
    for (var index = 1; index < length; index++){
      var source = args[index],
        _keys = allKeys(source),
        l = _keys.length;
      obj = obj || (source ? new source.constructor() : obj);
      if (obj) {
        var key, i;
        for (i = 0; i < l; i++){
          key = _keys[i];
          if (defined( source[key] )) {
            obj[key] = source[key];
          }
        }
      }
    }
    return obj;
  };
}());

export function has( subject , property ){
  return subject.hasOwnProperty( property );
}

export function keys( subject ){
  var _keys = subject.order || subject.keys,
    name = (_keys == subject.order ? 'order' : 'keys');
  return is( _keys , Array ) && !has( subject , name ) ? _keys : Object.keys( subject );
}

export function each( subject , cb ){
  if (is( subject , Array )) {
    for (var i = 0; i < subject.length; i++) {
      cb( subject[i] , i );
    }
  }
  else if (is( subject , 'object' )) {
    each(keys( subject ), function( key ){
      cb( subject[key] , key );
    });
  }
  /*else if (is( subject , 'object' )) {
    for (var key in subject) {
      if (has( subject , key )){
        cb( subject[key] , key );
      }
    }
  }*/
  else if (subject) {
    cb( subject , 0 );
  }
  return subject;
}

export function map( subject , cb , seed ){
  seed = seed || (is( seed , Array ) ? [] : {});
  return keys( subject ).reduce(function( result , key , index ){
    result[key] = cb( subject[key] , key , index );
    return result;
  },seed);
}

export function is( subject , test ){
  if (typeof test == 'string'){
    return typeof subject == test;
  }
  else if (test === Array){
    return Array.isArray( subject );
  }
  else if (exists( subject ) && exists( test )) {
    return subject.constructor === (isFunction( test ) ? test : test.constructor);
  }
  return subject === test;
}

export function isFunction( subject ){
  return is( subject , 'function' );
}

export function defined( subject ){
  return !is( subject , 'undefined' );
}

export function exists( subject ){
  return defined( subject ) && subject !== null && (!is( subject , 'number' ) || !isNaN( subject ));
}

export function numeric( subject ){
  return exists( subject ) && /^(\d*\.)?\d+$/.test( subject.toString() );
}

export function reportErr( err ){
  if (is( err , Error )){
    console.error( err.stack );
  }
  return err;
}
