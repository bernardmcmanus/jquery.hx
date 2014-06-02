(function( window , hx ) {


    var When = {

        when: function( event , handler , context ) {

            this._initHandlerModule();

            if (!event || (!handler || typeof handler !== 'function')) {
                throw 'Error: Invalid when args.';
            }

            context = context || null;
            var _handler = handler.bind( context );

            _addHandler( this , event , _handler );
        },

        happen: function( event , args ) {

            this._initHandlerModule();

            var handlers = _getHandlers( this , event );

            handlers.forEach(function( func ) {
                func.apply( null , args );
            });
        },

        dispel: function( event ) {
            this._initHandlerModule();
            delete this.handlers[event];
        },

        _initHandlerModule: function() {
            this.handlers = this.handlers || new whenModule();
        }
    };


    function whenModule() {}


    function _addHandler( instance , event , handler ) {
        var group = (instance.handlers[event] = instance.handlers[event] || []);
        group.push( handler );
    }


    function _getHandlers( instance , event ) {
        return instance.handlers[event] || [];
    }


    $.extend( hx , { When : When });

    
}( window , hxManager ));



























