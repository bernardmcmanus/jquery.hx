import * as util from 'core/util';

var prefixProperties = [ 'transform' , 'transition' , 'filter' ],
  vendors = { webkit: /webkit/i, moz: /firefox/i, ms: /msie/i },
  vendorPrefix = util.keys( vendors ).filter(function( prefix ){
    return vendors[prefix].test( navigator.userAgent );
  })[0];

export function prefix( str ){
  util.each( prefixProperties , function( name ){
    var re = new RegExp( '(?:-[^-]+-)?((?:' + name + '))' , 'gi' );
    str = str.replace( re , function( match , group ){
      return (vendorPrefix ? '-' + vendorPrefix + '-' : '') + group;
    });
  });
  return str;
}
