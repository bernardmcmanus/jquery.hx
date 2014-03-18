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

        _addPromisePod: function( func ) {

            var micro = [];
            var pods = [];
            var _func = func.bind( this );

            this.each(function( i ) {

                // create a promisePod for each dom node
                var pod = new hxManager.pod( this[i] , 'promise' );

                // create a microPromise for each pod
                var microPromise = new Promise(function( resolve ) {
                    // when the promisePod is resolved, resolve the microPromise
                    pod.when( 'promiseResolved' , resolve );
                });

                // when the pod reaches its turn in the queue, resolve it
                pod.when( 'promiseMade' , pod.resolve , pod );

                pods.push( pod );
                micro.push( microPromise );
                this[i]._hx.addPromisePod( pod );

            }.bind( this ));

            // when all microPromises have been resolved, create the macroPromise
            Promise.all( micro ).then(function() {

                var macroPromise = new Promise( _func );

                // if the macroPromise is resolved, complete the pods
                macroPromise.then(function() {
                    pods.forEach(function( pod ) {
                        pod.complete();
                    });
                });

                // otherwise, clear the queue so we can start again
                macroPromise.catch(function() {
                    console.log('macroPromise was rejected!');
                });
            });
        },

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

        then: function( hxArgs ) {

            if (typeof hxArgs === 'function') {
                this._addPromisePod( hxArgs );
            }

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



























