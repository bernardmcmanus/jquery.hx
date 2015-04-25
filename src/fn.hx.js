import $hx from 'main';
// import { $_is } from 'core/util';

export default function fn() {
  var args = Array.$cast( arguments );
  var hx = new $hx( this );
  var out;
  /*if ($_is( args[0] , 'string' )) {
    var method = args.shift();
    if (!$_is( hx[method] , 'function' )) {
      throw new Error( method + ' is not a function.' );
    }
    out = hx[method].apply( hx , args );
  }
  else if ($_is( args[0] , 'object' )) {
    out = hx.animate( args[0] );
  }
  else {*/
    out = hx;
  // }
  return out;
}
