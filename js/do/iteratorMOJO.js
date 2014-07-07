hxManager.IteratorMOJO = (function( Config , Subscriber ) {


    var Object_defineProperty = Object.defineProperty;
    var Object_keys = Object.keys;


    function IteratorMOJO( hxm , seed ) {

        var that = this;

        var type = (that.type = seed.type);

        that.duration = typeof seed.duration !== 'undefined' ? seed.duration : 400;
        that.delay = typeof seed.delay !== 'undefined' ? seed.delay : 0;

        var orderFrom = hxm.toArray().map(function( node ) {
            return node._hx.getOrder( type );
        });

        var animateFrom = hxm.get( type , null , false );

        hxm.update( seed );

        var orderTo = hxm.toArray().map(function( node ) {
            return node._hx.getOrder( type );
        });

        var animateTo = hxm.get( type , null , false );

        that.order = hxm.toArray().map(function( node , i ) {
            return (orderFrom[i].length > orderTo[i].length ? orderFrom[i] : orderTo[i]);
        });

        //that.properties = that._getProperties( hxm , animateFrom , animateTo );
        that.properties = that._getProperties( hxm , seed );

        that.diff = that._getDiff( hxm , that.properties , animateFrom , animateTo );
        that.current = $.extend( true , [] , animateFrom );
        that.dest = $.extend( true , [] , animateTo );

        /*console.log('from' , animateFrom);
        console.log('to' , animateTo);*/

        MOJO.Hoist( that );

        Object_defineProperty( that , 'hxm' , {
            get: function() {
                return hxm;
            }
        });
    }


    var IteratorMOJO_prototype = (IteratorMOJO.prototype = new MOJO());


    IteratorMOJO_prototype.run = function() {
        
        var that = this;

        function onComplete() {
            subscriber.destroy();
            that.complete = true;
            that.happen( 'complete' );
        }

        function timingCallback( progress , timestamp ) {
            progress = (that.progress = that._getEasedProgress( progress ));
            that.calculate( progress );
        }

        var subscriber = (that.subscriber = new Subscriber( that.duration , that.delay , onComplete , timingCallback ));
    };


    IteratorMOJO_prototype.calculate = function( percent ) {

        var that = this;

        that.hxm.each(function( i ) {

            var componentMOJO = that.hxm[i]._hx.componentMOJO;

            for (var key in that.diff[i]) {

                var current = (that.current[i][key] = that.current[i][key] || []);
                var diff = that.diff[i][key];
                var dest = that.dest[i][key];

                for (var j = 0; j < diff.length; j++) {
                    
                    var value = diff[j] * (1 - percent);
                    current[j] = dest[j] - value;
                }

                componentMOJO[that.type][key].update( that.current[i][key].values );
            }
        });

        that.hxm.paint();
    };


    IteratorMOJO_prototype._getEasedProgress = function( progress ) {

        var that = this;
        var subscriber = that.subscriber;

        var easeArgs = [ null , subscriber.elapsed , 0 , 1 , subscriber.duration ];
        var eased = Easing( 'easeOutElastic' , easeArgs );
        
        return eased;
    };


    IteratorMOJO_prototype._getProperties = function( hxm , seed ) {

        function getCSSKeys( seed ) {
            
            var optionKeys = Config.keys.options;
            var keyMap = Config.properties;
            var CSSKeys = Object.keys( seed );

            return CSSKeys
                .filter(function( key ) {
                    return optionKeys.indexOf( key ) < 0;
                })
                .map(function( key ) {
                    return keyMap[key] || key;
                });
        }

        return hxm.toArray().map(function( node , i ) {
            return getCSSKeys( seed );
        });
    };


    /*IteratorMOJO_prototype._getProperties = function( hxm , from , to ) {

        return hxm.toArray().map(function( node , i ) {
            
            var fromKeys = Object_keys( from[i] );
            var toKeys = Object_keys( to[i] );
            var allKeys = fromKeys.concat( toKeys );

            return allKeys.filter(function( key , i ) {
                return allKeys.indexOf( key ) === i;
            });
        });
    };*/


    IteratorMOJO_prototype._getDiff = function( hxm , properties , from , to ) {

        return hxm.toArray().map(function( node , i ) {
            
            var diff = {};

            for (var key in properties[i]) {

                var property = properties[i][key];
                var _from = (from[i][property] = from[i][property] || []);
                var _to = (to[i][property] = to[i][property] || []);
                var len = (_from.length >= _to.length ? _from.length : _to.length);
                var defaults = (_from.length >= _to.length ? _from.defaults : _to.defaults);

                var diffArray = [];

                for (var j = 0; j < len; j++) {

                    var fromElement = (_from[j] || defaults[j]);
                    var toElement = (_to[j] || defaults[j]);

                    diffArray.push( toElement - fromElement );
                }

                diff[property] = diffArray;

                return diff;
            }
        });
    };


    return IteratorMOJO;

    
}( hxManager.Config , hxManager.Subscriber ));
























/* ============================================================
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * https://raw.github.com/danro/jquery-easing/master/LICENSE
 * ======================================================== */

    function Easing( type , args ) {

        var easing = {

            def: 'easeOutQuad',
            swing: function (x, t, b, c, d) {
                return easing[easing.def](x, t, b, c, d);
            },
            easeInQuad: function (x, t, b, c, d) {
                return c*(t/=d)*t + b;
            },
            easeOutQuad: function (x, t, b, c, d) {
                return -c *(t/=d)*(t-2) + b;
            },
            easeInOutQuad: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t + b;
                return -c/2 * ((--t)*(t-2) - 1) + b;
            },
            easeInCubic: function (x, t, b, c, d) {
                return c*(t/=d)*t*t + b;
            },
            easeOutCubic: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
            },
            easeInOutCubic: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t + b;
                return c/2*((t-=2)*t*t + 2) + b;
            },
            easeInQuart: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t + b;
            },
            easeOutQuart: function (x, t, b, c, d) {
                return -c * ((t=t/d-1)*t*t*t - 1) + b;
            },
            easeInOutQuart: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                return -c/2 * ((t-=2)*t*t*t - 2) + b;
            },
            easeInQuint: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t*t + b;
            },
            easeOutQuint: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t*t*t + 1) + b;
            },
            easeInOutQuint: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                return c/2*((t-=2)*t*t*t*t + 2) + b;
            },
            easeInSine: function (x, t, b, c, d) {
                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
            },
            easeOutSine: function (x, t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
            },
            easeInOutSine: function (x, t, b, c, d) {
                return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
            },
            easeInExpo: function (x, t, b, c, d) {
                return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
            },
            easeOutExpo: function (x, t, b, c, d) {
                return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
            },
            easeInOutExpo: function (x, t, b, c, d) {
                if (t==0) return b;
                if (t==d) return b+c;
                if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            easeInCirc: function (x, t, b, c, d) {
                return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
            },
            easeOutCirc: function (x, t, b, c, d) {
                return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
            },
            easeInOutCirc: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
            },
            easeInElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            },
            easeOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
            },
            easeInOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
            },
            easeInBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*(t/=d)*t*((s+1)*t - s) + b;
            },
            easeOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
            },
            easeInOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158; 
                if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
            },
            easeInBounce: function (x, t, b, c, d) {
                return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
            },
            easeOutBounce: function (x, t, b, c, d) {
                if ((t/=d) < (1/2.75)) {
                    return c*(7.5625*t*t) + b;
                } else if (t < (2/2.75)) {
                    return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                } else if (t < (2.5/2.75)) {
                    return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                } else {
                    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                }
            },
            easeInOutBounce: function (x, t, b, c, d) {
                if (t < d/2) return easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
                return easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
            }
        };

        return easing[type].apply( null , args );
    }

