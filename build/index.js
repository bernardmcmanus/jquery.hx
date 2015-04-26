import $hx from 'main';
import fn from 'fn.hx';
import { addProperty } from 'core/prefixer';

export default $hx;

/*
** expose public methods
*/

$hx.prefix = addProperty;
$.fn.hx = fn;

/*
** default $hx configuration
*/

$hx.prefix([ 'transform' , 'transition' , 'filter' ]);
