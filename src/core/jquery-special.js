import { $_is , $_defined } from 'core/util';
import $Class from 'core/class';

export default function $$( jq ) {
  var that = this;
  return $_is( that , $$ ) ? that : $$.$new( that , jq );
}

$Class( $$ ).inherits( $ , {
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
  }
});
