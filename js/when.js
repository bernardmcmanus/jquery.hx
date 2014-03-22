(function( window , hx ) {


    var when = function( subject ) {
        var whenModule = new _when();
        subject.when = whenModule.when.bind( whenModule );
        subject.happen = whenModule.happen.bind( whenModule );
    };


    var _when = function() {
        this.handlers = {};
    };


    _when.prototype = {

        when: function( event , handler , context ) {

            if (!event) {
                throw 'Error: you must pass an event type to hxManager._when.when';
            }

            if (!handler || typeof handler !== 'function') {
                throw 'Error: you must pass a valid handler to hxManager._when.when';
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



























