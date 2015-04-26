import { $_is , $_defined } from 'core/util';
import $Class from 'core/class';
import Prefixer from 'core/prefixer';
import fn from 'fn.hx';

export default function $$( jq ) {
  var that = this;
  return $_is( that , $$ ) ? that : $$.$new( that , jq );
}

$Class( $$ ).inherits( $ , {
  hx: fn,
  _new: function( jq ) {
    $.fn.init.call( this , jq );
  },
  pushStack: function ( elems ) {
    var that = this;
    var ret = new that.constructor( elems );
    var intRe = /\d+/;
    ret.prevObject = that;
    that.$each(function( key , val ) {
      if (!$_defined( ret[key] ) && !intRe.test( key )) {
        ret[key] = val;
      }
    });
    return ret;
  },
  $css: function() {
    var args = Array.$cast( arguments );
    var that = this;
    if (args.length > 1) {
      args = [ Object.$build.apply( null , args ) ];
    }
    if ($_is( args[0] , 'object' )) {
      Prefixer( args[0] );
    }
    // console.log(args[0]);
    return that.css.apply( that , args );
  }
});


















