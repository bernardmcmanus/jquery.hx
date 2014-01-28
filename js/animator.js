(function( hx ) {

    var animator = function( config ) {

        config = $.extend({
            timeout: null,
            buffer: 50
        }, config);

        $.extend( this , config );
    };

    animator.prototype = {
        start: function() {

            if (this.fallback === false)
                return;

            var t = this.duration + this.delay + this.buffer;
            
            this.element.addEventListener( this.eventType , this );
            this.element.addEventListener( 'hx_init' , this );

            var fallback = function() {
                this.trigger( 'hx_fallback' , this.property );
                this.trigger( this.eventType , {
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
            this.element.removeEventListener( this.eventType , this );
            this.element.removeEventListener( 'hx_init' , this );
        }
    };

    $.extend( hx , {animator: animator} );
    
}( hxManager ));




























