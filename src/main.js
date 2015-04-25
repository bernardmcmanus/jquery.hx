import { $_is } from 'core/util';
import $Class from 'core/class';
import $Element from 'core/element';
import $$ from 'core/jquery-special';

export default function $hx( jq ) {
  if ($_is( jq , $hx )) {
    return jq;
  }
  var that = $hx.$new( this , jq ).mapd(function( el ) {
    return new $Element( el );
  });
}

$Class( $hx ).inherits( $$ , {
  _new: function( jq ) {
    $$.call( this , jq );
  },
  it: function( iterator ) {
    var that = this;
    return that.each(function( i ) {
      iterator( this , i );
    });
  },
  mapd: function( iterator ) {
    var that = this;
    return that.it(function( el , i ) {
      that[i] = iterator( el , i );
    });
  }
});

// export default function $hx( jq ) {
//   if ($_is( jq , $hx )) {
//     return jq;
//   }
//   /*var that = $hx.$new( this , jq ).mapd(function( el ) {
//     return $Element( el );
//   });*/
//   var that = $hx.$new( this , jq );
//   that.$elements = that.toArray().map(function( element ) {
//     // return new $Element( element );
//     return $(element);
//   });
// }

// $Class( $hx ).inherits( $ , overrides , {
//   _new: function( jq ) {
//     $.fn.init.call( this , jq );
//   },
//   asdf: function() {

//   }
// });



















