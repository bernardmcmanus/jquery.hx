(function( hx ) {

    var animator = function( options ) {

        options = $.extend({
            timeout: null,
            buffer: 50
        }, options);

        $.extend( this , options );

        console.log(this);
    };

    animator.prototype = {
        
        start: function() {

            if (this.fallback === false)
                return;

            this.running = true;

            var t = this.duration + this.delay + this.buffer;
            
            this.node.addEventListener( this.eventType , this );
            this.node.addEventListener( 'hx_init' , this );

            var fallback = function() {
                this.node._hx.trigger( 'fallback' , this.property );
                this.node._hx.trigger( this.eventType , {
                    propertyName: this.property
                });
            }.bind( this );

            this.timeout = setTimeout( fallback , t );
        },

        handleEvent: function( e ) {
            switch (e.type) {
                case this.eventType:
                    var name = e.propertyName || e.detail.propertyName;
                    var re = new RegExp( this.property , 'i' );
                    if (re.test( name )) {
                        this.destroy();
                        this.complete( e , this.property );
                    }
                    break;
                case 'hx_init':
                    this.cancel();
                    break;
            }
        },

        destroy: function() {
            clearTimeout( this.timeout );
            this.running = false;
            this.node.removeEventListener( this.eventType , this );
            this.node.removeEventListener( 'hx_init' , this );
        }
    };

    $.extend( hx , {animator: animator} );
    
}( hxManager ));




























