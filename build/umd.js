import $hx from './index';

if (typeof define == 'function' && define.amd) {
  define([], function() { return $hx });
}
else if (typeof exports == 'object') {
  module.exports = $hx;
}
else {
  this.$hx = $hx;
}
