var helper = require( 'shared/helper' );

var OTHER = 'other';
var USER_AGENT = navigator.userAgent;
var VENDORS = {
    webkit  : (/webkit/i),
    moz     : (/firefox/i),
    o       : (/opera/i),
    ms      : (/msie/i)
};
var OS = {
    android : (/android/i),
    ios     : (/(ipad|iphone|ipod)/i),
    macos   : (/mac os/i),
    windows : (/windows/i)
};
var PREFIX = [
    (/(?:-[^-]+-)?((?:transform))/g),
    (/(?:-[^-]+-)?((?:transition))/g),
    { regx: (/(?:-[^-]+-)?((?:filter))/g), omit: [ 'ms' ]}
];

var vendor = UA_RegExp( VENDORS );
var os = UA_RegExp( OS );

module.exports.unclamped = function() {
    return isAndroidNative( os ) === false;
};

module.exports.prefix = function( str ) {
    if (vendor === OTHER) {
        return str;
    }
    PREFIX.forEach(function( pfx ) {
        var re, omit = [];
        if (helper.instOf( pfx , RegExp )) {
            re = pfx;
        }
        else {
            re = pfx.regx;
            omit = pfx.omit || omit;
        }
        if (helper.indexOf( omit , vendor ) < 0) {
            str = str.replace( re , ( '-' + vendor + '-$1' ));
        }
    });
    return str;
};

module.exports.RAF = (function(){
    var name = 'equestAnimationFrame';
    var requestAnimationFrame = (
        window['r' + name] ||
        window['webkitR' + name] ||
        window['mozR' + name] ||
        window['oR' + name] ||
        window['msR' + name] ||
        (function(){
            var initTime = Date.now();
            return function( callback ) {
                var timeout = setTimeout(function() {
                    callback( Date.now() - initTime );
                    clearTimeout( timeout );
                }, ( 1000 / 60 ));
            };
        }())
    );
    return function( callback ){
        return requestAnimationFrame( callback );
    };
}());

function UA_RegExp( search ) {
    for (var key in search) {
        if (helper.test( search[key] , USER_AGENT )) {
            return key;
        }
    }
    return OTHER;
}

function isAndroidNative( os ) {
    return (os === 'android' && !helper.test( /(chrome|firefox)/i , USER_AGENT ));
}
