export function $_defineGetters( subject , getters ){
  var descriptors = $_map( getters , function( getter ){
    return { get: getter, configurable: true, enumerable: false };
  });
  Object.defineProperties( subject , descriptors );
}

export function $_each( subject , cb ){
  for (var key in subject){
    if ($_has( subject , key )){
      cb( subject[key] , key );
    }
  }
}

export var $_extend = (function(){
  var createAssigner = function(keysFunc, defaults){
    return function(obj){
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++){
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++){
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  function allKeys(obj){
    if (!isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    /*// Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);*/
    return keys;
  }

  function isObject(obj){
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  return createAssigner( allKeys );
}());

export function $_has( subject , property ){
  return subject.hasOwnProperty( property );
}

export function $_map( subject , cb , seed ){
  seed = seed || new subject.constructor();
  return Object.keys( subject ).reduce(function( result , key , index ){
    result[key] = cb( subject[key] , key , index );
    return result;
  },seed);
}

/*export function $_clone( subject ){
  return $.extend( true , new getPrototype( subject ).constructor() , subject );
}*/

export function $_is( subject , test ){
  if (typeof test == 'string'){
    return typeof subject == test;
  }
  else if (test === Array){
    return Array.isArray( subject );
  }
  else {
    return subject instanceof test;
  }
}

export function $_defined( subject ){
  return !$_is( subject , 'undefined' );
}

export function $_reportErr( err ){
  if ($_is( err , Error )){
    console.error( err.stack );
  }
  return err;
}
