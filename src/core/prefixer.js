var prefixProperties = [];

export default function Prefixer( obj ) {
  return obj.$each(function( key , val ) {
    prefixProperties.forEach(function( pname ) {
      key = prefix( pname , key );
      val = prefix( pname , val );
    });
    obj[key] = val;
  });
}

export function addProperty( names ) {
  Array.$ensure( names ).forEach(function( name ) {
    name = name.toLowerCase();
    if (prefixProperties.indexOf( name ) < 0) {
      prefixProperties.push( name );
    }
  });
}

function prefix( pname , str ) {
  var re = new RegExp( '(?:-[^-]+-)?((?:' + pname + '))' , 'gi' );
  return (str || '').replace( re , function( match , group ) {
    return (vendorPrefix ? '-' + vendorPrefix + '-' : '') + group;
  });
}

var vendorPrefix = (function() {
  var vendors = { webkit: /webkit/i, moz: /firefox/i, ms: /msie/i };
  return vendors.$keys.filter(function( prefix ) {
    var re = vendors[prefix];
    return re.test( navigator.userAgent );
  })
  .pop();
}());



















