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

        that.each(function( i ) {

            // create a promisePod for each dom node
            var pod = hxManager.PodFactory( that[i] , 'promise' );

            // when the pod reaches its turn in the queue, resolve its promise
            pod.when( 'promiseMade' , pod.resolvePromise.bind( pod ));

            // create a microPromise for each pod
            var microPromise = new Promise(function( resolve ) {
                // when the pod is resolved, resolve the microPromise
                pod.when( 'promiseResolved' , resolve );
            });

            // add the promise to the dom node queue
            that[i]._hx.addPromisePod( pod );

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
                    console.error( err.stack );
                }
            });
        });

        return that;
    };


    /*hxManager_prototype.when = function( e , handler ) {

        var that = this;

        that.each(function( i ) {
            that[i]._hx.when( e , handler , that[i] );
        });

        return that;
    };


    hxManager_prototype.happen = function( e , args ) {

        var that = this;

        that.each(function( i ) {
            that[i]._hx.happen( e , args );
        });

        return that;
    };


    hxManager_prototype.dispel = function( e , handler ) {

        var that = this;

        that.each(function( i ) {
            that[i]._hx.dispel( e , handler );
        });

        return that;
    };*/


    hxManager_prototype.animate = function( bundle ) {

        bundle = bundle instanceof Array ? bundle : [ bundle ];

        var that = this;

        that.each(function( i ) {

            var pod = hxManager.PodFactory( that[i] , 'precision' );

            bundle.forEach(function( seed ) {

                var bean = new hxManager.Bean( seed );
                var iterator = new hxManager.IteratorMOJO( that[i] , bean );

                pod.addIterator( iterator );
            });

            that[i]._hx.addPrecisionPod( pod );
        });

        return that;

        /*if (typeof func !== 'function') {
            throw new TypeError( 'animate requires a function.' );
        }

        var that = this;

        that._addPromisePod(function( resolve , reject ) {

            var controller = new hxManager.Doer( that );

            function promiseAction( method ) {
                controller.destroy();
                method();
            }
            
            controller.resolve = promiseAction.bind( null , resolve );
            controller.reject = promiseAction.bind( null , reject );
            
            func( controller );
            controller.run();

            that.each(function( i ) {
                
                var pod = that[i]._hx.getLastPod();

                pod.when( 'podComplete podCanceled' , function onResolve( e ) {
                    controller.destroy();
                    pod.dispel( 'podComplete podCanceled' , onResolve );
                });
            });
        });*/

        return that;
    };


    hxManager_prototype.loop = function( n , func , it ) {

        if (typeof func !== 'function') {
            throw new TypeError( 'repeat requires a function.' );
        }

        var that = this;

        it = it || 0;

        for (var i = 0; i < (n || 1); i++) {
            func.call( that , it );
            it++;
        }

        if (!n) {
            that.done(function() {
                that.loop( null , func , it );
            });
        }

        return that;
    };


    hxManager_prototype.paint = function( /*type ,*/ transition ) {

        var that = this;
        var bean;

        if (transition !== undefined) {
            transition.type = transition.type || 'all';
            bean = new hxManager.Bean( transition );
        }

        //debugger;

        that.each(function( i ) {

            if (bean) {
                that[i]._hx.setTransition( bean );
                that[i]._hx.applyTransition();
            }

            that[i]._hx.paint( /*type*/ );
        });

        return that;
    };
    

    hxManager_prototype.reset = function( type ) {

        var that = this;

        that.each(function( i ) {
            that[i]._hx.resetComponents( type );
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

                var pods = that.toArray().map(function( node ) {
                    return node._hx.getLastPod();
                });

                pods.forEach(function( pod ) {
                    pod.when( 'podComplete' , function onResolve( e ) {
                        pod.dispel( 'podComplete' , onResolve );
                        subscriber.destroy();
                    });
                });

                /*that.when( 'podComplete' , function onResolve( e ) {
                    that.dispel( 'podComplete' , onResolve );
                    subscriber.destroy();
                });*/
            }
        });
    };


    hxManager_prototype.update = function( bundle ) {

        // update a node's components without applying the transition

        var that = this;

        if (typeof bundle === 'object') {

            bundle = bundle instanceof Array ? bundle : [ bundle ];

            bundle.forEach(function( seed ) {

                that.each(function( i ) {

                    var bean = new hxManager.Bean( seed );
                    that[i]._hx.updateComponent( bean );
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
        that.each(function( i ) {

            var pod = that[i]._hx.getCurrentPod();

            if (pod && (all || (!all && pod.type === 'promise'))) {
                pod.resolvePod();
            }
        });

        return that;
    };


    hxManager_prototype.clear = function() {

        var that = this;
        
        // clear all pods in each queue
        that.each(function( i ) {
            that[i]._hx.clearQueue();
        });

        return that;
    };


    hxManager_prototype.break = function() {

        var that = this;
        
        // clear all but the current pod in each queue
        that.each(function( i ) {
            that[i]._hx.clearQueue( false );
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

        //var that = this;
        //var components = [];

        return this.toArray().map(function( node ) {
            return node._hx.getComponents( type , property , pretty );
        });

        /*that.each(function( i ) {
            components.push(
                that[i]._hx.getComponents( type , property , pretty )
            );
        });
        
        return components;*/
    };


    return hxManager;

    
}());



























