(function( window ) {


    window.hxManager = function( jQ ) {

        if (jQ.length < 1) {
            throw 'Error: You must pass a valid jQuery object to the hxManager constructor.';
        }

        var nodes = [];

        $(jQ).each(function() {
            nodes.push(
                new hxManager.domNode( this )
            );
        });

        this.selector = jQ.selector;
        this._callback = function() {};

        return $.extend( nodes , this );
    };


    hxManager.prototype = {

        _set: function( property , options ) {

            options = hxManager.get.xformKeys( options );

            this.forEach(function( node ) {
                
                var raw = hxManager.get.rawComponents( options );
                var defs = hxManager.get.xformDefaults( raw );
                
                node._hx.updateComponent( property , raw , defs );

                var xformString = hxManager.get.xformString( property , node._hx.components[property] , options.order );
                var opt = hxManager.get.xformOptions( options );

                node._hx.applyXform( property , xformString , opt );

            }.bind( this ));

            return this;
        },

        go: function( property ) {
            // clear the queue and run the most recently added transformation
        },

        step: function( property ) {
            // progress to the next transformation in the queue
        },

        at: function( property , percent , func ) {
            // execute func at percent completion of queue[property]
        },

        done: function( func ) {
            // execute func upon completion of entire queue
        }

    };

    
}( window ));



























