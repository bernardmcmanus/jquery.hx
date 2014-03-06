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

            var xform = hxManager.get.xformKeys( options );

            this.forEach(function( node ) {
                
                var raw = hxManager.get.rawComponents( xform.mapped );
                var defs = hxManager.get.xformDefaults( raw );
                
                node._hx.updateComponent( property , raw , defs );

                var xformString = hxManager.get.xformString( property , node._hx.components[property] , xform.mapped.order );
                var opt = hxManager.get.xformOptions( options );

                node._hx.applyXform( property , xform.passed , xformString , opt );

            }.bind( this ));

            return $(this);
        },

        go: function( property ) {
            // clear the queue and run the most recently added transformation
        },

        step: function( property ) {
            // progress to the next transformation in the queue
        },

        times: function( n ) {
            // repeat the most recently added transformation n times
        },

        at: function( property , percent , func ) {
            // execute func at percent completion of queue[property]
        },

        done: function( func ) {
            this._callback = func || function() {};
        }

    };

    
}( window ));



























