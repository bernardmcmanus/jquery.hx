import { $_guid } from 'core/util';
import $Class from 'core/class';
import $$ from 'core/jquery-special';

export default function $Element( node ) {
  var that = $Element.$new( this , node );
}

$Class( $Element ).inherits( $$ , {
  _new: function( node ) {
    $$.call( this , node );
  }
});



















