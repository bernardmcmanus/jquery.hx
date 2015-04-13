import {
  $_is,
  $_defined,
  $_defineProperties,
  $_defineGetters
} from 'core/util';
import $Class from 'core/class';

export default function $hx( jq ) {
  return this.init( jq );
}

$Class( $hx ).inherits( $ , {
  _new: function( jq ) {
    var that = this;
    $.fn.init.call( that , jq );
  },
  init: function( jq ) {
    var that = this;
    if (!$_defined( jq ) && that.length) {
      that.splice( 0 , that.length );
    }
    else if ($_is( jq , $hx )) {
      console.log('jq is already $hx');
      return jq;
    }
    else {
      console.log('return new $hx');
    }
    return $hx.$new( this , jq );
  },
  asdf: function() {

  }
});



















