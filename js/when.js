(function( window , hx ) {


    var when = function( subject ) {
        var whenModule = new _when();
        subject.when = whenModule.when.bind( whenModule );
        subject.happen = whenModule.happen.bind( whenModule );
        subject.dispel = whenModule.dispel.bind( whenModule );
    };


    var _when = function() {
        this.handlers = {};
    };


    _when.prototype = {

        when: function( event , handler , context ) {

            if (!event || (!handler || typeof handler !== 'function')) {
                throw 'Error: Invalid when args.';
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

        dispel: function( event ) {
            delete this.handlers[event];
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



























