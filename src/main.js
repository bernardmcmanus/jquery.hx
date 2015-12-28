import Bezier from 'bezier-easing';
import { $_map } from 'core/util';
import beziers from 'config/beziers';
// import Property from 'core/property';
// import Collection from 'core/collection';

// import E$ from 'emoney';
// import tinycolor from 'tinycolor';

export { default as Property } from 'core/property';

export { default as Collection } from 'core/collection';

export var Easing = $_map( beziers , function( points ){
  return new Bezier( points );
});

/*var hx = {
  new: function(){
    console.debug('hx.new');
  },
  easing: Easing
};

export default hx;*/
