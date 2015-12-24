import Bezier from 'bezier-easing';
import { $_map } from 'core/util';
import beziers from 'conf/beziers';
// import Property from 'property';

// import E$ from 'emoney';
// import tinycolor from 'tinycolor';

export var Easing = $_map( beziers , function( points ){
  return new Bezier( points );
});

var hx = {
  new: function(){
    console.debug('hx.new');
  },
  easing: Easing
};

export default hx;
