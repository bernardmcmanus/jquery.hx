(function( $ ) {

    
    $.fn.hx = function( action , options ) {
        
        var self = this;
        
        if (!self.hxManager)
            self = new hxManager( $(this).get(0) );
        
        if (action)
            $.fn.hx[action].call( self , options );

        return self;
    };


    $.fn.hx.transform = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 0,
            relative: true
        }, (options || {}));

        var xform = mapComponentKeys( options );

        if (options.relative) {
            this.apply( 'transform' , xform );
        } else {
            this.set( 'transform' , xform );
        }
    };


    $.fn.hx.fadeOut = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 0,
            pseudoHide: true
        }, (options || {}));

        function trueHide() {

            function task1() {
                this.setTransition( 'opacity' , {
                    duration: 0,
                    delay: 0
                });
                flow.progress();
            }

            function task2() {
                this.element.style.display = 'none';
                this.element.style.opacity = 1;
                flow.progress();
            }

            var flow = new hxManager.workflow();
            
            flow.add( task1 , this );
            flow.add( task2 , this );

            flow.run();
        }

        var complete = function( e ) {
            
            if (e.originalEvent.detail.propertyName !== 'opacity')
                return;

            $(this).off( 'hx_transitionEnd' , complete );
            
            if (options.pseudoHide) {
                hxManager.pseudoHide( this.element );
            } else {
                trueHide.call( this );
            }

        }.bind( this );

        $(this).on( 'hx_transitionEnd' , complete );

        var xform = $.extend( {} , options , {
            opacity: 0
        });

        this.set( 'opacity' , xform );
    };


    $.fn.hx.fadeIn = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 0,
        }, (options || {}));

        var complete = function( e ) {
            if (e.originalEvent.detail.propertyName !== 'opacity')
                return;
            $(this).off( 'hx_transitionEnd' , complete );
            hxManager.pseudoShow( this.element );
        }.bind( this );

        $(this).on( 'hx_transitionEnd' , complete );

        var xform = $.extend( {} , options , {
            opacity: 1
        });

        this.set( 'opacity' , xform );
    };


    $.fn.hx.cancel = function() {
        return;
    };

    $.fn.hx.debug = function( options ) {

        var events = (Array.isArray( options.events) ? options.events : [options.events]) || [];
        var log = options.log || function() {};
        var self = this;

        var listen = function( evt ) {

            $(this.element).on( evt , function( e ) {
                    
                switch (evt) {
                    case 'hx_init':
                        log('new hxManager instance');
                        break;
                    case 'hx_setTransition':
                        log('updated ' + e.originalEvent.detail.propertyName + ' transition ' + e.originalEvent.detail.string);
                        break;
                    case 'hx_applyXform':
                        log('applied ' + e.originalEvent.detail.propertyName + ' ' + e.originalEvent.detail.string);
                        break;
                    case 'hx_transitionEnd':
                        log(e.originalEvent.detail.propertyName + ' complete');
                        break;
                    case 'hx_fallback':
                        log(e.originalEvent.detail.propertyName + ' fallback triggered');
                        break;
                    case 'hx_cancel':
                        log('hxManager instance canceled');
                        break;
                    case 'hx_done':
                        log('done');
                        break;
                }
            });

        }.bind( this );

        for (var i = 0; i < events.length; i++) {
            listen( events[i] );
        }
        
    };


    function mapComponentKeys( obj ) {
        var map = {
            translate: 'translate3d',
            scale: 'scale3d',
            rotate: 'rotate3d'
        };
        for (var key in obj) {
            if (!map[key])
                continue;
            obj[map[key]] = obj[key];
            delete obj[key];
        }
        return obj;
    }

 
}( jQuery ));





















