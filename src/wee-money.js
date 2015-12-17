import { $_extend } from 'core/util';
import E$ from 'emoney';
import Promise from 'wee-promise';

export default function Wee$(){
  E$.construct( this );
  Promise.call( this );
}

Wee$.prototype = $_extend( Object.create( Promise.prototype ) , E$.create({
  constructor: Wee$
}));
