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

        _addXformPod: function( hxArgs ) {

            this.each(function( i ) {

                var pod = new hxManager.pod( this[i] , 'xform' );

                hxArgs.forEach(function( seed ) {

                    var bean = new hxManager.bean( seed );
                    pod.addBean( bean );

                });

                this[i]._hx.addXformPod( pod );

            }.bind( this ));

            return this;
        },

        _addPromisePod: function( func , method ) {

            method = method || 'all';

            var micro = [];
            var pods = [];
            var _func = func.bind( this );
            var clear = this.clear.bind( this );

            this.each(function( i ) {

                // create a promisePod for each dom node
                var pod = new hxManager.pod( this[i] , 'promise' );

                // when the pod reaches its turn in the queue, resolve it
                pod.when( 'promiseMade' , pod.resolve , pod );

                // create a microPromise for each pod
                var microPromise = new Promise(function( resolve ) {
                    // when the pod is resolved, resolve the microPromise
                    pod.when( 'promiseResolved' , resolve );
                });

                // add the promise to the dom node queue
                this[i]._hx.addPromisePod( pod );

                pods.push( pod );
                micro.push( microPromise );

            }.bind( this ));

            // when the appropriate microPromises have been resolved, create the macroPromise
            Promise[ method ]( micro ).then(function() {

                var macroPromise = new Promise( _func );

                // if the macroPromise is resolved, complete the pods
                macroPromise.then(function() {
                    pods.forEach(function( pod ) {
                        pod.complete();
                    });
                });

                // otherwise, clear the queue so we can start again
                macroPromise.catch( clear );
            });
        },

        /*
        **  these methods are experimental
        **  and are subject to change
        */

        then: function( hxArgs ) {

            if (typeof hxArgs === 'function') {
                this._addPromisePod( hxArgs );
            }

            return this;
        },

        race: function( hxArgs ) {
            
            if (typeof hxArgs === 'function') {
                this._addPromisePod( hxArgs , 'race' );
            }

            return this;
        },

        defer: function( time ) {
            
            this._addPromisePod(function( resolve , reject ) {
                if (typeof time !== 'undefined') {
                    setTimeout( resolve , time );
                }
            });

            return this;
        },

        resolve: function( all ) {

            // all controls whether all pod types or only promise pods will be resolved
            all = (typeof all !== 'undefined' ? all : false);

            // force resolve the current pod in each queue
            this.each(function( i ) {

                var pod = this[i]._hx.queue.getCurrent();

                if (pod && (all || (!all && pod.getType() === 'promise'))) {
                    pod.complete();
                }

            }.bind( this ));

            return this;
        },

        clear: function() {
            
            // clear all pods in each queue            
            this.each(function( i ) {

                this[i]._hx.queue.clear();

            }.bind( this ));

            return this;
        },

        cancel: function() {
            
            // clear all but the current pod in each queue
            this.each(function( i ) {

                this[i]._hx.queue.clear( false );

            }.bind( this ));

            // resolve any remaining promise pods
            this.resolve();

            return this;
        },

        done: function( hxArgs ) {
            
            function resolution( resolve , reject ) {
                hxArgs();
                resolve();
            }

            if (typeof hxArgs === 'function') {
                this._addPromisePod( resolution );
            }
        }
    };

    
}( window ));



























