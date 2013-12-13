window.hxManager = window.hxManager || {};

hxManager._getTransformType = function( options ) {
    var raw = [];
    var calc = [];
    for (var key in options) {
        if (this.keys.config.indexOf( key ) < 0) {
            if (this.keys.calculated.indexOf( key ) >= 0) {
                calc.push( key );
            } else {
                raw.push( key );
            }
        }
        if (raw.length > 0 && calc.length > 0)
            throw 'Error: Incompatible transform properties.';
    }
    return calc.length > 0 ? 'calc' : 'raw';
};

hxManager._calcWidthScale = function( width ) {
    return width / this.element.getBoundingClientRect().width;
};

hxManager._calcHeightScale = function( height ) {
    return height / this.element.getBoundingClientRect().height;
};

hxManager._getFixedOrigin = function( scale ) {

    var defined = $.extend({}, window.getComputedStyle( this.element ));
    var computed = this.element.getBoundingClientRect();

    defined.width = parseInt(defined.width, 10);
    defined.height = parseInt(defined.height, 10);

    var sx = ((computed.width - defined.width) * scale[0]) / 2;
    var sy = ((computed.height - defined.height) * scale[1]) / 2;

    var dx = ((computed.width * scale[0] - defined.width) / 2) - sx;
    var dy = ((computed.height * scale[1] - defined.height) / 2) - sy;
    
    return [ dx , dy ];
};

hxManager._getCalculatedComponents = function( options ) {
    var defaults = [];
    var components = {};
    for (var key in options) {
        if (this.keys.config.indexOf( key ) >= 0) continue;
        switch (key) {
            case 'width':
                var scaleX = this._calcWidthScale( options[key] );
                components.translate3d = components.translate3d || [ 0 , 0 , 0 ];
                components.scale3d = components.scale3d || [ 1 , 1 , 1 ];
                components.translate3d[0] = components.translate3d[0] + this._getFixedOrigin( [scaleX, 1] )[0];
                components.scale3d[0] = components.scale3d[0] * scaleX;
                break;
            case 'height':
                var scaleY = this._calcHeightScale( options[key] );
                components.translate3d = components.translate3d || [ 0 , 0 , 0 ];
                components.scale3d = components.scale3d || [ 1 , 1 , 1 ];
                components.translate3d[1] = components.translate3d[1] + this._getFixedOrigin( [1, scaleY] )[1];
                components.scale3d[1] = components.scale3d[1] * scaleY;
                break;
        }
    }
    return components;
};



















