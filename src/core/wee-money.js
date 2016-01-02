import E$ from 'emoney';
import Promise from 'wee-promise';
import * as util from 'core/util';

export default function Wee$(){
  Promise.call( this );
  E$.call( this );
}

Wee$.prototype = util.extend(
  Object.create( Promise.prototype ),
  Object.create( E$.prototype ),
  { constructor: Wee$ }
);
