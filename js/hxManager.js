window.hxManager = (function() {


    function hxManager( j ) {

        if (j instanceof hxManager) {
            return j;
        }

        var nodes = [];

        j.each(function() {
            nodes.push(
                hxManager.DomNodeFactory( this )
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


    var hxManager_prototype = (hxManager.prototype = Object.create( jQuery.prototype ));


    hxManager_prototype._addXformPod = function( bundle ) {

        var that = this;

        that.each(function( i ) {

            var pod = hxManager.PodFactory( that[i] , 'xform' );

            bundle.forEach(function( seed ) {

                var bean = new hxManager.Bean( seed );
                pod.addBean( bean );

            });

            that[i]._hx.addXformPod( pod );
        });

        return that;
    };


    hxManager_prototype._addPromisePod = function( func , method ) {

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


    hxManager_prototype.paint = function( type ) {

        var that = this;

        that.each(function( i ) {
            that[i]._hx.paint( type );
        });

        return that;
    };


    hxManager_prototype.paintSync = function( type ) {

        var that = this;

        function resolution( resolve ) {
            that.paint( type );
            resolve();
        }

        that._addPromisePod( resolution );

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

        var that = this;

        if (typeof func === 'function') {
            that._addPromisePod( func );
        }

        return that;
    };


    hxManager_prototype.race = function( func ) {

        var that = this;
        
        if (typeof func === 'function') {
            that._addPromisePod( func , 'race' );
        }

        return that;
    };


    hxManager_prototype.defer = function( time ) {

        var that = this;
        
        that._addPromisePod(function( resolve , reject ) {
            if (typeof time !== 'undefined') {
                setTimeout( resolve , time );
            }
        });

        return that;
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
        that.resolve();

        return that;
    };


    hxManager_prototype.zero = function( hxArgs ) {

        var that = this;

        that.update( hxArgs );
        that.paint();

        return that;
    };


    hxManager_prototype.done = function( func ) {

        var that = this;

        if (typeof func !== 'function') {
            return;
        }
        
        function resolution( resolve ) {
            func.call( that );
            resolve();
        }

        that._addPromisePod( resolution );
    };


    hxManager_prototype.get = function( type , property ) {

        var that = this;
        var components = [];

        that.each(function( i ) {
            components.push(
                that[i]._hx.getComponents( type , property )
            );
        });
        
        return components;
    };


    return hxManager;

    
}());



























