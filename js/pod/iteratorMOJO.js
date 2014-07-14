hxManager.IteratorMOJO = (function( Bean , Subscriber ) {


    var MOJO_Each = MOJO.Each;


    function IteratorMOJO( node , bean ) {

        var that = this;
        var bean_options = bean.options;

        that.bean = bean;
        that.node = node;
        that.type = bean.type;
        that.styles = bean.styles;
        that.properties = bean.order.computed;
        that.subscribed = false;
        that.subscriber = null;

        that.progress = 0;
        that.duration = bean_options.duration;
        that.delay = bean_options.delay;
        that.easing = bean_options.easing;

        MOJO.Hoist( that );

        Object.defineProperty( that , 'paused' , {
            get: function() {
                var subscriber = that.subscriber;
                return (subscriber ? subscriber.paused : false);
            }
        });
    }


    IteratorMOJO.prototype = new MOJO({

        run: function() {
            
            var that = this;
            var node_hx = that.node._hx;

            if (that.subscribed) {
                return false;
            }

            that.subscribed = true;
            that.current = that._getCurrent( that.node );
            that.dest = that._getDest( that.current , that.styles );
            that.diff = that._getDiff( that.node , that.current , that.dest );

            function onComplete() {
                
                if (!that.subscribed) {
                    return that.unsubscribe();
                }

                that.resolveIterator();
            }

            function timingCallback( progress ) {
                
                if (!that.subscribed) {
                    return that.unsubscribe();
                }
                
                that.progress = progress;

                if (!that.paused) {
                    that.calculate(
                        that._ease( progress )
                    );
                }
            }

            that.subscriber = new Subscriber( that.duration , that.delay , onComplete , timingCallback );

            return true;
        },

        calculate: function( percent ) {

            var that = this;

            MOJO_Each( that.diff , function( diff , key ) {

                var current = that.current[key];
                var dest = that.dest[key];

                diff.forEach(function( val , i ) {

                    var value = val * (1 - percent);
                    current[i] = dest[i] - value;
                });
            });

            that.paint( that.current );
        },

        pause: function() {
            var that = this;
            if (that.subscribed) {
                that.subscriber.pause();
            }
        },

        resume: function() {
            var that = this;
            if (that.subscribed) {
                that.subscriber.resume();
            }
        },

        resolveIterator: function() {
            var that = this;
            that.happen( 'complete' );
            that.unsubscribe();
            that.paint( that.dest );
        },

        destroy: function() {
            var that = this;
            that.dispel( 'complete' );
            that.unsubscribe();
        },

        unsubscribe: function() {
            var that = this;
            if (that.subscribed) {
                that.subscriber.destroy();
            }
            that.subscribed = false;
        },

        paint: function( model ) {

            var that = this;
            var node_hx = that.node._hx;
            var bean = that._updateBean( model );

            node_hx.updateComponent( bean );
            node_hx.paint( that.type );
        },

        _updateBean: function( model ) {

            var that = this;
            var bean = that.bean;

            MOJO_Each( model , function( property , key ) {
                bean.styles[key] = property;
            });

            return bean;
        },

        _ease: function( progress ) {

            if (progress === 0) {
                return 0;
            }

            var that = this;
            var subscriber = that.subscriber;

            var time = (subscriber.duration * progress);
            var easeArgs = [ null , time , 0 , 1 , subscriber.duration ];
            
            return Easing( that.easing , easeArgs );
        },

        _getCurrent: function( node ) {

            var that = this;

            var current = {};
            var type = that.type;
            var properties = that.properties;

            properties.forEach(function( property ) {
                current[property] = node._hx.getComponents( type , property , false );
            });

            return current;
        },

        _getDest: function( current , styles ) {

            var that = this;
            var newProperties = {};

            MOJO_Each( current , function( CSSProperty , key ) {

                CSSProperty = CSSProperty.clone();
                CSSProperty.update( styles[key] );
                newProperties[key] = CSSProperty;
            });

            return newProperties;
        },

        _getDiff: function( node , current , dest ) {

            var diff = {};

            MOJO_Each( current , function( property , key ) {
                
                diff[key] = property.map(function( val , i ) {
                    return dest[key][i] - val;
                });
            });

            return diff;
        }
    });


    return IteratorMOJO;

    
}( hxManager.Bean , hxManager.Subscriber ));
























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
            linear: function (x, t, b, c, d) {
                return t / d;
            },
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

        return (easing[type] || easing.swing).apply( null , args );
    }

