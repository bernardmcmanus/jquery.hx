export default function Prefixer( obj ) {
  prefixProperties.forEach(function( pname ) {
    obj.$each(function( key , val ) {
      key = prefix( pname , key );
      val = prefix( pname , val );
      obj[key] = val;
    });
  });
}

function prefix( pname , str ) {
  var re = new RegExp( '(?:-[^-]+-)?((?:' + pname + '))' , 'gi' );
  return (str || '').replace( re , function( match , group ) {
    return (vendorPrefix ? '-' + vendorPrefix + '-' : '') + group;
  });
}

var prefixProperties = [ 'transform' , 'transition' ];

var vendorPrefix = (function() {
  var vendors = { webkit: /webkit/i, moz: /firefox/i, ms: /msie/i };
  return vendors.$keys.filter(function( prefix ) {
    var re = vendors[prefix];
    return re.test( navigator.userAgent );
  })
  .pop();
}());



















