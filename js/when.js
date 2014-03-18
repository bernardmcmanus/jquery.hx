(function( window , hx ) {


    var when = function() {
        this.handlers = {};
    };


    when.prototype = {

        when: function( event , handler , context ) {

            if (!event) {
                throw 'Error: you must pass an event type to hxManager.when.when'
            }

            if (!handler || typeof handler !== 'function') {
                throw 'Error: you must pass a valid handler to hxManager.when.when'
            }

            context = context || null;
            var _handler = handler.bind( context );

            this._addHandler( event , _handler );
        },

        happen: function( event , args ) {

            var handlers = this._getHandlers( event );

            handlers.forEach(function( func ) {
                func.apply( null , args );
            });
        },

        _addHandler: function( event , handler ) {

            var group = (this.handlers[event] = this.handlers[event] || []);
            group.push( handler );
        },

        _getHandlers: function( event ) {
            return this.handlers[event] || [];
        }
        
    };


    $.extend( hx , {when: when} );

    
}( window , hxManager ));



























