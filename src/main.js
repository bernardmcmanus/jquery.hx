import {
  $_is,
  $_defined,
  $_defineGetters,
  $_defineProperties
} from 'core/util';
import $Class from 'core/class';
import $Element from 'core/element';
import $$ from 'core/jquery-special';

export default function $hx( jq ) {
  if ($_is( jq , $hx )) {
    return jq;
  }
  var that = $hx.$new( this , jq ).each(function( i ) {
    return new $Element( this );
  });
}

$_defineProperties( $hx , {
  src: {
    value: (function() {
      var script = $('script[src$="#{BUILD}"]').get( 0 );
      return script ? script.src : undefined;
    }())
  }
});

$_defineGetters( $hx , {
  multiThread: function() {
    return $_defined( $hx.src ) && $_defined( Worker ) && $_defined( Blob ) && $_defined( URL );
  }
});

$Class( $hx ).inherits( $$ , {
  _new: function( jq ) {
    $$.call( this , jq );
  },
  it: function( iterator ) {
    var that = this;
    return that.each(function( i ) {
      iterator( this.$hx , i );
    });
  },
  get: function() {
    var that = this;
    var args = Array.$cast( arguments );
    if ($_is( args[0] , 'string' )) {
      // get styles 'n such
    }
    else {
      return that.$super( $$ , 'get' )( args );
    }
  }
});



















