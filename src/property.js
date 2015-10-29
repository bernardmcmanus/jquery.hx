import { /*$_extend,*/ $_map, $_defined, $_defineGetters } from 'core/util';
import Tween from 'tween';

export default class Property {
  constructor( options ){
    var that = this;
    that.initialize( options );
    that.parseTemplate();
  }
  initialize( options ){
    var that = this;
    var descriptors = $_map( options , function( value ){
      return function(){ return value; };
    });
    $_defineGetters( that , descriptors );
  }
  parseTemplate(){
    var that = this;
    that.template.match( /\$\{([^\}]+)\}/g ).forEach(function( key ){
      key = key.match( /\$\{([^\}]+)\}/ )[1];
      that[key] = $_defined( that[key] ) ? that[key] : '';
    });
  }
  tween( cb ){
    var that = this;
    return new Tween( cb );
  }
}
