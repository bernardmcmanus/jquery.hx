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
        this.manager.vendorPatch.addEventListener( this.manager.element , this );
        this.timeout = setTimeout(function() {
            self._dispatchEvent.call( self );
        } , t );
    },
    handleEvent: function( event ) {
        var name = event.propertyName || event.detail.propertyName;
        var re = new RegExp( this.property , 'i' );
        if (re.test( name )) {
            this.destroy();
            this.manager._transitionEnd.call( this.manager , event , this.property );
        }
    },
    _createEvent: function() {
        var evt = {};
        try {
            evt = new CustomEvent( 'transitionend' , {
                bubbles: true,
                cancelable: true,
                detail: {
                    propertyName: this.property
                }
            });
        } catch( err ) {
            evt = document.createEvent('Event');
            evt.initEvent( 'transitionend' , true , true );
            evt.detail = {
                propertyName: this.property
            };
        }
        return evt;
    },
    _dispatchEvent: function() {
        var evt = this._createEvent();
        this.manager.element.dispatchEvent( evt );
    },
    destroy: function() {
        clearTimeout( this.timeout );
        this.manager.vendorPatch.removeEventListener( this.manager.element , this );
    }
};



















