export function $_limit( subject , min , max ){
  return Math.max(Math.min( subject , max ) , min );
}

export function $_precision( subject , precision ){
  var multiplier = Math.pow( 10 , precision );
  return Math.round( subject * multiplier ) / multiplier;
}

export var $_reqAFrame = (function(){
  return window.requestAnimationFrame;
}());

export var $_string = {
  /*get regexp(){
    return /\$\{([^\$\{\}\:\"]+)\}/g;
  },*/
  regexp: function( modifiers ){
    return new RegExp( '\\$\\{([^\\$\\{\\}\\:\\"]+)\\}' , modifiers );
  },
  compile: function( subject , context ){
    return (subject || '').replace( $_string.regexp( 'g' ) , function( match , group ){
      return context[group];
    });
  },
  interpret: function( subject , context ){
    var matches = subject.match($_string.regexp( 'g' ));
    context = $_ensure( context , {} );
    $_ensure( matches , [] ).forEach(function( key ){
      key = $_ensure( key.match( $_string.regexp() ), [] )[1];
      context[key] = $_defined( context[key] ) ? context[key] : '';
    });
    return context;
  }
};

export function $_ensure( subject , rescuer ){
  if ($_defined( subject ) && $_is( rescuer , Array )) {
    rescuer[0] = subject;
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

export function $_toArray( subject ){
  return Array.prototype.slice.call( subject , 0 );
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

export function $_each( subject , cb ){
  for (var key in subject){
    if ($_has( subject , key )){
      cb( subject[key] , key );
    }
  }
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
  else if (test) {
    return subject instanceof (typeof test == 'object' ? test.constructor : test);
  }
  return false;
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
