var animator = function( config ) {

    config = $.extend({
        timeout: null,
        buffer: 50
    }, config);

    $.extend( this , config );
};

animator.prototype = {
    start: function() {
        var self = this;
        var t = this.duration + this.delay + this.buffer;
        this.element.addEventListener( 'webkitTransitionEnd' , this );
        this.timeout = setTimeout(function() {
            self._dispatchEvent.call( self );
        } , t );
    },
    handleEvent: function( event ) {
        
        var name = event.propertyName || event.detail.propertyName;

        var re = new RegExp( name , 'i' );
        if (re.test(this.property))
            name = this.property;

        if (event.type === 'webkitTransitionEnd' && name === this.property)
            this.destroy();
    },
    _createEvent: function() {
        var evt = {};
        try {
            evt = new CustomEvent( 'webkitTransitionEnd' , {
                bubbles: true,
                cancelable: true,
                detail: {
                    propertyName: this.property
                }
            });
        } catch( err ) {
            evt = document.createEvent('Event');
            evt.initEvent( 'webkitTransitionEnd' , true , true );
            evt.detail = {
                propertyName: this.property
            };
        }
        return evt;
    },
    _dispatchEvent: function() {
        var evt = this._createEvent();
        this.element.dispatchEvent( evt );
    },
    destroy: function() {
        clearTimeout( this.timeout );
        this.element.removeEventListener( 'webkitTransitionEnd' , this );
    }
};



















