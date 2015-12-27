import { $_extend } from 'engine/util';
import E$ from 'emoney';
import Promise from 'wee-promise';

export default function Wee$(){
  Promise.call( this );
  E$.call( this );
}

Wee$.prototype = $_extend(
  Object.create( Promise.prototype ),
  Object.create( E$.prototype ),
  { constructor: Wee$ }
);
