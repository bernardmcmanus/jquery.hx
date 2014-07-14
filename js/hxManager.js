window.hxManager = (function() {


    function hxManager( j ) {

        if (j instanceof hxManager) {
            return j;
        }

        var that = this;

        j.each(function( i ) {
            that[i] = hxManager.DomNodeFactory( j[i] );
        });

        Object.defineProperty( that , 'length' , {
            get: function() {
                return j.length;
            }
        });
    }


    var hxManager_prototype = (hxManager.prototype = Object.create( jQuery.prototype ));


    hxManager_prototype._addAnimationPod = function( bundle ) {

        var that = this;

        that.each(function( i ) {

            var pod = hxManager.PodFactory( that[i] , 'animation' );

            bundle.forEach(function( seed ) {

                var bean = new hxManager.Bean( seed );
                pod.addBean( bean );
            });

            that[i]._hx.addAnimationPod( pod );
        });

        return that;
    };


    hxManager_prototype._addPromisePod = function( func , method ) {

        if (typeof func !== 'function') {
            throw new TypeError( 'PromisePod requires a function.' );
        }

        method = method || 'all';

        var that = this;
        var micro = [];
        var pods = [];
        var _func = func.bind( that );

        that.eachNode(function( node , node_hx ) {

            // create a promisePod for each dom node
            var pod = hxManager.PodFactory( node , 'promise' );

            // when the pod reaches its turn in the queue, resolve its promise
            pod.when( 'promiseMade' , function() {
                pod.resolvePromise();
            });

            // create a microPromise for each pod
            var microPromise = new Promise(function( resolve ) {
                // when the pod is resolved, resolve the microPromise
                pod.when( 'promiseResolved' , resolve );
            });

            // add the promise to the dom node queue
            node_hx.addPromisePod( pod );

            pods.push( pod );
            micro.push( microPromise );
        });

        // when the appropriate microPromises have been resolved, create the macroPromise
        Promise[ method ]( micro ).then(function() {

            var macroPromise = new Promise( _func );

            // if the macroPromise is resolved, resolve the pods
            macroPromise.then(function() {
                pods.forEach(function( pod ) {
                    pod.resolvePod();
                });
            });

            // otherwise, clear the queue so we can start again
            macroPromise.catch(function( err ) {
                that.clear();
                if (err instanceof Error) {
                    $.hx.error( err );
                }
            });
        });

        return that;
    };


    hxManager_prototype.eachNode = function( callback ) {
        var that = this;
        that.toArray().forEach(function( node , i ) {
            callback( node , node._hx , i );
        });
        return that;
    };


    hxManager_prototype.animate = function( bundle ) {

        bundle = bundle instanceof Array ? bundle : [ bundle ];

        var that = this;

        that.eachNode(function( node , node_hx ) {

            var pod = hxManager.PodFactory( node , 'precision' );

            bundle.forEach(function( seed ) {

                var bean = new hxManager.Bean( seed );
                var iterator = new hxManager.IteratorMOJO( node , bean );

                pod.addIterator( iterator );
            });

            node_hx.addPrecisionPod( pod );
        });

        return that;
    };


    hxManager_prototype.pause = function() {
        return this._precisionPodAction( 'pause' );
    };


    hxManager_prototype.resume = function() {
        return this._precisionPodAction( 'resume' );
    };


    hxManager_prototype._precisionPodAction = function( method ) {

        var that = this;

        that.eachNode(function( node , node_hx ) {

            var pod = node_hx.getCurrentPod();

            if (pod.type === 'precision') {
                pod[ method ]();
            }
        });

        return that;
    };


    hxManager_prototype.loop = function( func , it ) {

        if (typeof func !== 'function') {
            throw new TypeError( 'loop requires a function.' );
        }

        var that = this;

        it = it || 0;
        func.call( that , it );
        it++;

        that.done(function() {
            that.loop( func , it );
        });

        return that;
    };


    hxManager_prototype.paint = function( type ) {

        var that = this;
        
        that.eachNode(function( node , node_hx ) {
            node_hx.paint( type );
        });

        return that;
    };
    

    hxManager_prototype.reset = function( type ) {

        var that = this;

        that.eachNode(function( node , node_hx ) {
            node_hx.resetComponents( type );
        });

        return that;
    };


    hxManager_prototype.then = function( func ) {
        return this._addPromisePod( func );
    };


    hxManager_prototype.race = function( func ) {
        return this._addPromisePod( func , 'race' );
    };


    hxManager_prototype.defer = function( time ) {

        var that = this;

        return that._addPromisePod(function( resolve ) {
            
            if (time) {
                
                var subscriber = new hxManager.Subscriber( time , 0 , resolve );

                that.eachNode(function( node , node_hx ) {
                    
                    var pod = node_hx.getCurrentPod();

                    pod.when( 'podComplete' , function onResolve( e ) {
                        pod.dispel( 'podComplete' , onResolve );
                        subscriber.destroy();
                    });
                });
            }
        });
    };


    hxManager_prototype.update = function( bundle ) {

        // update a node's components without applying the transition

        var that = this;

        if (typeof bundle === 'object') {

            bundle = bundle instanceof Array ? bundle : [ bundle ];

            bundle.forEach(function( seed ) {

                that.eachNode(function( node , node_hx ) {

                    var bean = new hxManager.Bean( seed );
                    node_hx.updateComponent( bean );
                });
            });
        }

        return that;
    };


    hxManager_prototype.resolve = function( all ) {

        var that = this;

        // all controls whether all pod types or only promise pods will be resolved
        all = (typeof all !== 'undefined' ? all : false);

        // force resolve the current pod in each queue
        that.eachNode(function( node , node_hx ) {

            var pod = node_hx.getCurrentPod();

            if (pod && (all || (!all && pod.type === 'promise'))) {
                pod.resolvePod();
            }
        });

        return that;
    };


    hxManager_prototype.clear = function() {

        var that = this;
        
        // clear all pods in each queue
        that.eachNode(function( node , node_hx ) {
            node_hx.clearQueue();
        });

        return that;
    };


    hxManager_prototype.break = function() {

        var that = this;
        
        // clear all but the current pod in each queue
        that.eachNode(function( node , node_hx ) {
            node_hx.clearQueue( false );
        });

        // resolve any remaining promise pods
        return that.resolve();
    };


    hxManager_prototype.zero = function( hxArgs ) {

        var that = this;

        that.update( hxArgs );
        return that.paint();
    };


    // !!! done does not return the hxManager instance
    hxManager_prototype.done = function( func ) {

        var that = this;
        
        function resolution( resolve ) {
            (func || function() {}).call( that );
            resolve();
        }

        that._addPromisePod( resolution );
    };


    // !!! get does not return the hxManager instance
    hxManager_prototype.get = function( type , property , pretty ) {

        return this.toArray().map(function( node ) {
            return node._hx.getComponents( type , property , pretty );
        });
    };


    // !!! clean does not return the hxManager instance
    hxManager_prototype.clean = function() {

        this.eachNode(function( node , node_hx ) {
            node_hx.clean();
        });
    };


    return hxManager;

    
}());



























