(function( window ) {


    window.hxManager = function( jQ ) {

        if (jQ.hxManager) {
            return jQ;
        }

        var nodes = [];

        jQ.each(function() {
            nodes.push(
                new hxManager.domNode( this )
            );
        });

        this.hxManager = 1;
        this._callback = function() {};

        return $.extend( jQ , nodes , this );
    };


    hxManager.prototype = {

        _set: function( property , options ) {

            addHooks.call( this );

            var xform = hxManager.get.xformKeys( options );

            this.each(function( i ) {
                
                var raw = hxManager.get.rawComponents( xform.mapped );
                var defs = hxManager.get.xformDefaults( raw );
                
                this[i]._hx.updateComponent( property , raw , defs );

                var xformString = hxManager.get.xformString( property , this[i]._hx.components[property] , xform.mapped.order );
                var opt = hxManager.get.xformOptions( options );

                this[i]._hx.applyXform( property , xform.passed , xformString , opt );

            }.bind( this ));

            return this;
        },

        _isComplete: function() {

            for (var i = 0; i < this.length; i++) {
                if (!this[i]._hx.queue.isComplete()) {
                    return false;
                }
            }

            return true;
        },

        go: function( property ) {
            // clear the queue and run the most recently added transformation
            return this;
        },

        step: function( property ) {
            // progress to the next transformation in the queue
            return this;
        },

        times: function( n ) {
            // repeat the most recently added transformation n times
            return this;
        },

        at: function( property , percent , func ) {
            // execute func at percent completion of queue[property]
            return this;
        },

        done: function( func ) {
            this._callback = func || function() {};
            return this;
        }

    };


    var nodeHooks = {

        queueComplete: function( e ) {

            if (!this._isComplete()) {
                return;
            }
            
            $(this).off( 'hx.queueComplete' , this._nodeHooks.queueComplete );
            this._callback();
        },

    };


    function addHooks() {

        if (this._nodeHooks) {
            return;
        }

        this._nodeHooks = hxManager.get.scopedModule( nodeHooks , this );

        $(this).on( 'hx.queueComplete' , this._nodeHooks.queueComplete );
    }

    
}( window ));



























