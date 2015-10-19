export function $_defineGetters( subject , getters ) {
  var descriptors = $_map( getters , function( getter ) {
    return { get: getter, configurable: true, enumerable: false };
  });
  Object.defineProperties( subject , descriptors );
}

export function $_each( subject , cb ) {
  for (var key in subject) {
    if ($_has( subject , key )) {
      cb( subject[key] , key );
    }
  }
}

export function $_has( subject , property ) {
  return subject.hasOwnProperty( property );
}

export function $_map( subject , cb , seed ) {
  seed = seed || new subject.constructor();
  return Object.keys( subject ).reduce(function( result , key , index ) {
    result[key] = cb( subject[key] , key , index );
    return result;
  },seed);
}

/*export function $_clone( subject ) {
  return $.extend( true , new getPrototype( subject ).constructor() , subject );
}*/

export function $_is( subject , test ) {
  if (typeof test == 'string') {
    return typeof subject == test;
  }
  else if (test === Array) {
    return Array.isArray( subject );
  }
  else {
    return subject instanceof test;
  }
}

export function $_defined( subject ) {
  return !$_is( subject , 'undefined' );
}

export function $_reportErr( err ) {
  if ($_is( err , Error )) {
    console.error( err.stack );
  }
  return err;
}
