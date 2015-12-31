export function $_void( input ){
  return input;
}

export function $_limit( subject , min , max ){
  return Math.max(Math.min( subject , max ) , min );
}

export function $_precision( subject , precision ){
  var multiplier = Math.pow( 10 , precision );
  return Math.round( subject * multiplier ) / multiplier;
}

export var $_reqAFrame = (function(){
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

export function $_ensure( subject , rescuer ){
  if ($_is( rescuer , Array ) && $_defined( subject )) {
    rescuer[0] = subject;
  }
  else if ($_isFunction( rescuer ) && $_isFunction( subject )) {
    return subject;
  }
  return $_is( subject , rescuer ) ? subject : rescuer;
}

/*export function $_ensure( subject , rescuer ){
  if ($_is( rescuer , Array )) {
    // return $_is( subject , Array ) ? subject : ($_defined( subject ) ? [ subject ] : []);
    if ($_defined( subject )) {
      rescuer[0] = subject;
    }
    return $_is( subject , Array ) ? subject : rescuer;
  }
  return subject || rescuer;
}*/

/*export function $_sanitize( subject ){
  return !subject ? subject : $_map( subject , function( value ){
    if (value && $_is( value , 'object' )) {
      return $_sanitize( value );
    }
    else {
      // strip null, undefined, and empty strings
      return value || (value !== 0 ? undefined : value);
    }
  });
}*/

/*export function $_parsePrimitives( subject ) {
  var result;
  if (subject && $util.is( subject , 'object' )) {
    result = Array.isArray( subject ) ? [] : {};
    $_keys( subject ).forEach(function( key ) {
      result[key] = $_parsePrimitives( subject[key] );
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

export function $_toArray( subject ){
  return Array.prototype.slice.call( subject , 0 );
}

export function $_last( subject , getKey ){
  var lastKey = $_keys( subject ).slice( -1 );
  return getKey ? lastKey : subject[lastKey];
}

export function $_defineGetters( subject , getters ){
  var descriptors = $_map( getters , function( getter ){
    return { get: getter, configurable: true, enumerable: false };
  });
  Object.defineProperties( subject , descriptors );
}

export function $_defineValues( subject , getters ){
  var descriptors = $_map( getters , function( value ){
    return { value: value, configurable: true, writable: false, enumerable: false };
  });
  Object.defineProperties( subject , descriptors );
}

/*export var $_extend = (function(){
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
    if ($_is( target , 'boolean' )) {
      deep = target;
      target = args[1] || {};
      i = 2;
    }
    if (!$_is( target , 'object' ) && !$_is( target , 'function' )) {
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
          if (deep && copy && (isPlainObject( copy ) || (copyIsArray = $_is( copy , Array )))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && $_is( src , Array ) ? src : [];
            }
            else {
              clone = src && isPlainObject( src ) ? src : {};
            }
            target[name] = $_extend( deep , clone , copy );
          }
          else if ($_defined( copy )) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };
  function isPlainObject( subject ){
    return $_is( subject , 'object' ) && !$_is( subject , Array ) && !subject.nodeType && subject !== window;
  }
}());*/

export var $_extend = (function(){
  function allKeys( obj ){
    if (!isObject( obj )) {
      return [];
    }
    var keys = [];
    for (var key in obj) {
      keys.push( key );
    }
    return keys;
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
        keys = allKeys(source),
        l = keys.length;
      obj = obj || (source ? new source.constructor() : obj);
      if (obj) {
        var key, i;
        for (i = 0; i < l; i++){
          key = keys[i];
          if ($_defined( source[key] )) {
            obj[key] = source[key];
          }
        }
      }
    }
    return obj;
  };
}());

export function $_has( subject , property ){
  return subject.hasOwnProperty( property );
}

export function $_keys( subject ){
  var keys = subject.order || subject.keys,
    name = (keys == subject.order ? 'order' : 'keys');
  return $_is( keys , Array ) && !$_has( subject , name ) ? keys : Object.keys( subject );
}

export function $_each( subject , cb ){
  if ($_is( subject , Array )) {
    for (var i = 0; i < subject.length; i++) {
      cb( subject[i] , i );
    }
  }
  else if ($_is( subject , 'object' )) {
    let keys = $_keys( subject );
    $_each( keys , function( key ){
      cb( subject[key] , key );
    });
  }
  /*else if ($_is( subject , 'object' )) {
    for (var key in subject) {
      if ($_has( subject , key )){
        cb( subject[key] , key );
      }
    }
  }*/
  else if (subject) {
    cb( subject , 0 );
  }
  return subject;
}

export function $_map( subject , cb , seed ){
  seed = seed || ($_is( seed , Array ) ? [] : {});
  return $_keys( subject ).reduce(function( result , key , index ){
    result[key] = cb( subject[key] , key , index );
    return result;
  },seed);
}

export function $_is( subject , test ){
  if (typeof test == 'string'){
    return typeof subject == test;
  }
  else if (test === Array){
    return Array.isArray( subject );
  }
  else if ($_exists( subject ) && $_exists( test )) {
    return subject.constructor === ($_isFunction( test ) ? test : test.constructor);
  }
  return subject === test;
}

export function $_isFunction( subject ){
  return $_is( subject , 'function' );
}

export function $_defined( subject ){
  return !$_is( subject , 'undefined' );
}

export function $_exists( subject ){
  return $_defined( subject ) && subject !== null && (!$_is( subject , 'number' ) || !isNaN( subject ));
}

export function $_numeric( subject ){
  return $_exists( subject ) && /^(\d*\.)?\d+$/.test( subject.toString() );
}

export function $_reportErr( err ){
  if ($_is( err , Error )){
    console.error( err.stack );
  }
  return err;
}
