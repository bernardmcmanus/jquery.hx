// import * as util from 'core/util';
// import Bezier from 'bezier';
import Bezier from 'bezier-easing';
import { $_map } from 'core/util';
import beziers from 'conf/beziers';

// import Q from 'qlite';
// import E$ from 'emoney';
// import tinycolor from 'tinycolor';

// export default $hx;

// console.log(Q);

var $hx = {
  new: function() {
    console.debug('$hx.new');
  },
  easing: $_map( beziers , function( points ) {
    return new Bezier( points );
  })
};

export default $hx;
