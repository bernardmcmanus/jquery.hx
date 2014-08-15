window.hxManager = (function( Object , Error , $ , Promise ) {


    var PROTOTYPE = 'prototype';
    var PROMISE = 'promise';


    function hxManager( j ) {

        if (instOf( j , hxManager )) {
            return j;
        }

        var that = this;

        j.each(function( i ) {
            that[i] = hxManager.DomNodeFactory( j[i] );
        });

        Object.defineProperty( that , 'length' , {
            get: function() {
                return length( j );
            }
        });
    }


    var hxManager_prototype = (hxManager[PROTOTYPE] = Object.create( $[PROTOTYPE] ));


    hxManager_prototype.animate = function( bundle ) {

        var that = this;

        that.eachNode(function( node_hx , node , i ) {

            var pod = PodFactory( node , 'animation' );

            ensureArray( bundle ).forEach(function( seed ) {

                if (isFunc( seed )) {
                    pod.addCallback(
                        bind( that , seed )
                    );
                }
                else {
                    var bean = Bean( seed , node , i );
                    pod.addBean( bean );
                }
            });

            node_hx.addPod( pod );
        });

        return that;
    };


    hxManager_prototype.iterate = function( bundle ) {

        var that = this;

        that.eachNode(function( node_hx , node , i ) {

            var pod = PodFactory( node , 'precision' );

            ensureArray( bundle ).forEach(function( seed ) {

                if (isFunc( seed )) {
                    pod.addCallback(
                        bind( that , seed )
                    );
                }
                else {
                    var bean = Bean( seed , node , i );
                    var iterator = new hxManager.IteratorMOJO( node , bean );
                    pod.addBean( iterator );
                }
            });

            node_hx.addPod( pod );
        });

        return that;
    };


    hxManager_prototype.promise = function( func , method ) {

        method = method || 'all';

        var that = this;
        var micro = [];
        var pods = [];

        that.eachNode(function( node_hx , node ) {

            // create a promisePod for each dom node
            var pod = PodFactory( node , PROMISE );

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
            node_hx.addPod( pod );

            pods.push( pod );
            micro.push( microPromise );
        });

        // when the appropriate microPromises have been resolved, create the macroPromise
        Promise[ method ]( micro ).then(function() {

            var macroPromise = new Promise(
                bind( that , func )
            );

            // if the macroPromise is resolved, resolve the pods
            macroPromise.then(function() {
                pods.forEach(function( pod ) {
                    pod.resolvePod();
                });
            });

            // otherwise, clear the queue so we can start again
            macroPromise.catch(function( err ) {
                that.clear();
                if (instOf( err , Error )) {
                    $.hx.error( err );
                }
            });
        });

        return that;
    };


    hxManager_prototype.eachNode = function( callback ) {
        var that = this;
        toArray( that ).forEach(function( node , i ) {
            callback( node._hx , node , i );
        });
        return that;
    };


    hxManager_prototype.pause = function() {
        return this._precisionPodAction( 'pause' );
    };


    hxManager_prototype.resume = function() {
        return this._precisionPodAction( 'resume' );
    };


    hxManager_prototype._precisionPodAction = function( method , attempts ) {

        attempts = attempts || 0;

        var that = this;

        var pods = toArray( that )
            .map(function( node ) {
                return node._hx.getCurrentPod();
            })
            .filter(function( pod ) {
                return pod.type === 'precision';
            });

        if (length( pods ) !== length( that ) && attempts < 10) {
            var unsubscribe = subscribe(function() {
                attempts++;
                unsubscribe();
                that._precisionPodAction( method , attempts );
            });
        }
        else {
            pods.forEach(function( pod ) {
                pod[ method ]();
            });
        }

        return that;
    };


    hxManager_prototype.paint = function( type ) {

        var that = this;
        
        that.eachNode(function( node_hx ) {
            node_hx.paint( type );
        });

        return that;
    };
    

    hxManager_prototype.reset = function( type ) {

        var that = this;

        that.eachNode(function( node_hx ) {
            node_hx.resetComponents( type );
        });

        return that;
    };


    hxManager_prototype.then = function( func ) {
        return this.promise( func );
    };


    hxManager_prototype.race = function( func ) {
        return this.promise( func , 'race' );
    };


    hxManager_prototype.defer = function( time ) {
        return this.promise(function( resolve ) {
            if (time) {
                var unsubscribe = subscribe(function( elapsed ) {
                    if (elapsed >= time) {
                        unsubscribe();
                        resolve();
                    }
                });
            }
        });
    };


    hxManager_prototype.update = function( bundle ) {

        // update a node's components without applying the transition

        var that = this;

        ensureArray( bundle ).forEach(function( seed ) {

            that.eachNode(function( node_hx , node , i ) {

                var bean = Bean( seed , node , i );
                node_hx.updateComponent( bean );
            });
        });

        return that;
    };


    hxManager_prototype.resolve = function( all ) {

        var that = this;

        // all controls whether all pod types or only promise pods will be resolved
        all = (!isUndef( all ) ? all : false);

        // force resolve the current pod in each queue
        that.eachNode(function( node_hx ) {

            var pod = node_hx.getCurrentPod();

            if (pod && (all || (!all && pod.type === PROMISE))) {
                pod.resolvePod();
            }
        });

        return that;
    };


    hxManager_prototype.clear = function() {

        var that = this;
        
        // clear all pods in each queue
        that.eachNode(function( node_hx ) {
            node_hx.clearQueue();
        });

        return that;
    };


    hxManager_prototype.break = function() {

        var that = this;
        
        // clear all but the current pod in each queue
        that.eachNode(function( node_hx ) {
            node_hx.clearQueue( false );
        });

        // resolve any remaining promise pods
        return that.resolve();
    };


    hxManager_prototype.zero = function( hxArgs ) {

        var that = this;

        // update the stored components
        that.update( hxArgs );

        // remove any stored transitions
        that.eachNode(function( node_hx ) {
            node_hx.resetTransition();
            node_hx.applyTransition();
        });

        // run paint
        return that.paint();
    };


    // !!! done does not return the hxManager instance
    hxManager_prototype.done = function( func ) {

        var that = this;

        that.promise(function( resolve ) {
            (func || function() {}).call( that );
            resolve();
        });
    };


    // !!! get does not return the hxManager instance
    hxManager_prototype.get = function( find , pretty ) {
        return toArray( this ).map(function( node ) {
            return node._hx.getComponents( find , pretty );
        });
    };


    // !!! clean does not return the hxManager instance
    hxManager_prototype.cleanup = function() {

        this.eachNode(function( node_hx ) {
            node_hx.cleanup();
        });
    };


    function Bean( seed , node , i ) {
        return new hxManager.Bean( seed , node , i );
    }


    function PodFactory( node , type ) {
        return hxManager.PodFactory( node , type );
    }


    function subscribe( callback ) {
        return $.hx.subscribe( callback );
    }


    function bind( hxm , func ) {
        return func.bind( hxm );
    }


    function toArray( hxm ) {
        return hxm.toArray();
    }


    function Helper() {
        return hxManager.Helper;
    }


    function ensureArray( bundle ) {
        return Helper().ensureArray( bundle );
    }


    function instOf( subject , constructor ) {
        return Helper().instOf( subject , constructor );
    }


    function isFunc( subject ) {
        return Helper().isFunc( subject );
    }


    function isUndef( subject ) {
        return Helper().isUndef( subject );
    }


    function length( subject ) {
        return Helper().length( subject );
    }


    return hxManager;

    
}( Object , Error , jQuery , Promise ));



























