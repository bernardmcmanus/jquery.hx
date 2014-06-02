(function( window ) {


    function hxManager( j ) {

        if (j instanceof hxManager) {
            return j;
        }

        var nodes = [];

        j.each(function() {
            nodes.push(
                new hxManager.DomNode( this )
            );
        });

        Object.defineProperty( this , 'length' , {
            get: function() {
                return nodes.length;
            },
            configurable: true
        });

        $.extend( this , nodes );
    }


    hxManager.prototype = Object.create( jQuery.prototype );


    hxManager.prototype._addXformPod = function( bundle ) {

        this.each(function( i ) {

            var pod = new hxManager.Pod( this[i] , 'xform' );

            bundle.forEach(function( seed ) {

                var bean = new hxManager.Bean( seed );
                pod.addBean( bean );

            });

            this[i]._hx.addXformPod( pod );

        }.bind( this ));

        /*this.each(function( i ) {

            var pod = new hxManager.Pod( this[i] , 'xform' );

            bundle.forEach(function( seed ) {

                var bean = new hxManager.Bean( seed );
                pod.addBean( bean );

            });

            this[i]._hx.addXformPod( pod );

        }.bind( this ));*/
    };


    hxManager.prototype._addPromisePod = function( func , method ) {

        method = method || 'all';

        var micro = [];
        var pods = [];
        var _func = func.bind( this );
        var clear = this.clear.bind( this );

        this.each(function( i ) {

            // create a promisePod for each dom node
            var pod = new hxManager.Pod( this[i] , 'promise' );

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
    };


    hxManager.prototype.then = function( func ) {

        if (typeof func === 'function') {
            this._addPromisePod( func );
        }

        return this;
    };


    hxManager.prototype.race = function( func ) {
        
        if (typeof func === 'function') {
            this._addPromisePod( func , 'race' );
        }

        return this;
    };


    hxManager.prototype.defer = function( time ) {
        
        this._addPromisePod(function( resolve , reject ) {
            if (typeof time !== 'undefined') {
                setTimeout( resolve , time );
            }
        });

        return this;
    };


    hxManager.prototype.update = function( seed ) {

        // update a node's components without applying the transition

        if (typeof seed === 'object') {

            seed = Array.isArray( seed ) ? hxManager.helper.array.last( seed ) : seed;
            seed.order = hxManager.get.seedOrder( seed );

            this.each(function( i ) {

                var bean = new hxManager.Bean( seed );
                this[i]._hx.updateComponent( bean );

            }.bind( this ));
        }

        return this;
    };


    hxManager.prototype.resolve = function( all ) {

        // all controls whether all pod types or only promise pods will be resolved
        all = (typeof all !== 'undefined' ? all : false);

        // force resolve the current pod in each queue
        this.each(function( i ) {

            var pod = this[i]._hx.getCurrentPod();

            if (pod && (all || (!all && pod.getType() === 'promise'))) {
                pod.complete();
            }

        }.bind( this ));

        return this;
    };


    hxManager.prototype.clear = function() {
        
        // clear all pods in each queue            
        this.each(function( i ) {

            this[i]._hx.clearQueue();

        }.bind( this ));

        return this;
    };


    hxManager.prototype.break = function() {
        
        // clear all but the current pod in each queue
        this.each(function( i ) {

            this[i]._hx.clearQueue( false );

        }.bind( this ));

        // resolve any remaining promise pods
        this.resolve();

        return this;
    };


    hxManager.prototype.zero = function( hxArgs ) {

        // duration is intentionally passed as a string to
        // avoid being overridden by vendorPatch.getDuration

        $.extend( hxArgs , {
            duration: '0',
            delay: 0,
            fallback: false
        });

        this.hx( hxArgs ).clear( true );

        return this;
    };


    hxManager.prototype.done = function( func ) {

        if (typeof func !== 'function') {
            return;
        }

        var _func = func.bind( this );
        
        function resolution( resolve , reject ) {
            _func();
            resolve();
        }

        this._addPromisePod( resolution );
    };


    window.hxManager = hxManager;

    
}( window ));



























