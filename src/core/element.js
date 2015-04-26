import {
  $_guid,
  $_defined,
  $_defineGetters,
  $_defineProperties
} from 'core/util';
import $Class from 'core/class';
import $$ from 'core/jquery-special';

export default function $Element( node ) {
  if (node.$hx) {
    return node;
  }
  var that = $Element.$new( this , node );
}

$Class( $Element ).inherits( $$ , {
  _new: function( node ) {
    node.$hx = $$.call( this , node );
  }
});



















