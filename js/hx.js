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
            done: function() {},
            relative: true
        }, (options || {}));

        // -------------------------------------------------------------- //
            // prevent individual callbacks from being added
            // there is a bug that may cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        var xForm = mapComponentKeys($.extend( {} , options , {
            done: [ options.done ]
        }));

        //delete xForm.relative;

        if (options.relative) {
            this.apply( 'transform' , xForm );
        } else {
            this.set( 'transform' , xForm );
        }
    };


    $.fn.hx.fadeOut = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 0,
            done: function() {},
            pseudoHide: true
        }, (options || {}));

        // -------------------------------------------------------------- //
            // prevent individual callbacks from being added
            // there is a bug that may cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        function trueHide() {

            var flow = new hxManager.workflow();

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

            flow.add( task1 , this );
            flow.add( task2 , this );

            flow.run();
        }

        function complete() {
            
            if (options.pseudoHide) {
                
                hxManager.pseudoHide( this.element );
                
            } else {

                trueHide.call( this );
            }
        }

        var xForm = $.extend( {} , options , {
            opacity: 0,
            done: [ complete , options.done ]
        });

        delete xForm.pseudoHide;

        this.set( 'opacity' , xForm );
    };


    $.fn.hx.fadeIn = function( options ) {

        options = $.extend({
            duration: 400,
            easing: 'ease',
            delay: 0,
            done: function() {}
        }, (options || {}));

        // -------------------------------------------------------------- //
            // prevent individual callbacks from being added
            // there is a bug that may cause the animation to break
            options.done = function() {};
        // -------------------------------------------------------------- //

        function complete() {
            hxManager.pseudoShow( this.element );
        }

        var xForm = $.extend( {} , options , {
            opacity: 1,
            done: [ complete , options.done ]
        });

        this.set( 'opacity' , xForm );
    };


    $.fn.hx.cancel = function() {
        return;
    };


    function mapComponentKeys( obj ) {
        var map = {
            translate: 'translate3d',
            scale: 'scale3d',
            rotate: 'rotate3d'
        };
        for (var key in obj) {
            if (!map[key]) continue;
            obj[map[key]] = obj[key];
            delete obj[key];
        }
        return obj;
    }

 
}( jQuery ));





















