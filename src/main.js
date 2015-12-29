import Bezier from 'bezier-easing';
import { $_map } from 'core/util';
import beziers from 'config/beziers';

export { default as Property } from 'core/property';

export { default as Collection } from 'core/collection';

export var Easing = $_map( beziers , function( points ){
  return new Bezier( points );
});
