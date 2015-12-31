import Bezier from 'bezier-easing';
import * as util from 'core/util';
import beziers from 'config/beziers';

export { default as Property } from 'core/property';

export { default as Collection } from 'core/collection';

export var Easing = util.$_map( beziers , function( points ){
  return new Bezier( points );
});
