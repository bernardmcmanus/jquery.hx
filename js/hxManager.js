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

        return $.extend( jQ , nodes , this );
    };


    hxManager.prototype = {

        _addPod: function( actions ) {

            this.each(function( i ) {

                var pod = new hxManager.pod( this[i] );

                actions.forEach(function( action ) {

                    var xform = hxManager.get.xformKeys( action );
                    var options = hxManager.get.xformOptions( action );
                    var raw = hxManager.get.rawComponents( xform.mapped );
                    var defs = hxManager.get.xformDefaults( raw );

                    pod.addBean({
                        type: action.type,
                        xform: xform,
                        options: options,
                        raw: raw,
                        defaults: defs
                    });

                });

                this[i]._hx.addPod( pod );

            }.bind( this ));

            return this;
        },

        _addPromise: function( func ) {

            var p = [];

            this.each(function( i ) {

                var promise = new Promise(function( resolve , reject ) {
                    this[i]._hx.addPromise( resolve );
                }.bind( this ));

                p.push( promise );

            }.bind( this ));

            Promise.all( p ).then( func.bind( this ));
        },

        /*_isComplete: function() {

            for (var i = 0; i < this.length; i++) {
                if (!this[i]._hx.queue.isComplete()) {
                    return false;
                }
            }

            return true;
        },*/

        /*go: function( property ) {
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
        },*/

        then: function( action ) {

            if (typeof action === 'object' && !Array.isArray( action )) {
                this.hx( action );
            }
            else if (Array.isArray( action ) && typeof action[0] === 'object') {
                this.hx( action );
            }
            else if (typeof action === 'function') {
                this._addPromise( action );
            }

            return this;
        }

    };


    /*var nodeHooks = {

        queueComplete: function( e ) {

            if (!this._isComplete()) {
                return;
            }
            
            this._callback();
        },

    };*/

    
}( window ));



























