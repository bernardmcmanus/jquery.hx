

window.hxManager = function( j ) {
    var that = this;
    return that._init( that , j );
};


setTimeout(function() {

    hxManager.Inject(
    [
        document,
        Error,
        jQuery,
        Promise,
        MOJO,
        hxManager,
        'DomNodeFactory',
        'PodFactory',
        'Bean',
        'IteratorMOJO',
        'defProp',
        'create',
        'descriptor',
        'ensureArray',
        'isFunc',
        'isUndef',
        'instOf',
        'length',
        'PROTOTYPE'
    ],
    function(
        document,
        Error,
        $,
        Promise,
        MOJO,
        hxManager,
        DomNodeFactory,
        PodFactory,
        Bean,
        IteratorMOJO,
        defProp,
        create,
        descriptor,
        ensureArray,
        isFunc,
        isUndef,
        instOf,
        length,
        PROTOTYPE
    ){

        var hxManager_prototype = (hxManager[PROTOTYPE] = create( $[PROTOTYPE] ));


        hxManager_prototype._init = function( that , j ) {

            if (instOf( j , hxManager )) {
                return j;
            }

            j.each(function( i ) {
                that[i] = DomNodeFactory( j[i] );
            });

            defProp( that , 'length' , descriptor(
                function() {
                    return length( j );
                }
            ));

            return that;
        };


        hxManager_prototype.animate = function( bundle ) {

            var that = this;

            return eachNode( that , function( $hx , node , i ) {

                var pod = PodFactory( node , 'animation' );

                ensureArray( bundle ).forEach(function( seed ) {

                    if (isFunc( seed )) {
                        pod.addCallback(
                            bind( that , seed )
                        );
                    }
                    else {
                        var bean = new Bean( seed , node , i );
                        pod.addBean( bean );
                    }
                });

                $hx.addPod( pod );
            });
        };


        hxManager_prototype.iterate = function( bundle ) {

            var that = this;

            return eachNode( that , function( $hx , node , i ) {

                var pod = PodFactory( node , 'precision' );

                ensureArray( bundle ).forEach(function( seed ) {

                    if (isFunc( seed )) {
                        pod.addCallback(
                            bind( that , seed )
                        );
                    }
                    else {
                        var bean = new Bean( seed , node , i );
                        var iterator = new IteratorMOJO( node , bean );
                        pod.addBean( iterator );
                    }
                });

                $hx.addPod( pod );
            });
        };


        hxManager_prototype.promise = function( func , method ) {

            method = method || 'all';

            var that = this;

            var pods = toArray( that ).map(function( node ) {
                var $hx = node.$hx;
                var pod = PodFactory( node , 'promise' );
                $hx.addPod( pod );
                return pod;
            });

            Promise[ method ]( pods ).then(function() {
                
                new Promise(

                    // create the macroPromise

                    bind( that , func )
                )
                .then(function() {

                    // if the macroPromise is resolved, resolve the pods

                    pods.forEach(function( pod ) {
                        pod.resolvePod();
                    });
                })
                .catch(function( err ) {

                    // otherwise, clear the queue so we can start again

                    that
                    .clear()
                    .trigger( 'hx.reject' , arguments );

                    if (instOf( err , Error )) {
                        $.hx.error( err );
                        $(document).trigger( 'hx.error' , err );
                    }
                });
            });

            return that;
        };


        hxManager_prototype.pause = function() {
            return this._precAction( 'pause' );
        };


        hxManager_prototype.resume = function() {
            return this._precAction( 'resume' );
        };


        hxManager_prototype._precAction = function( method , attempts ) {

            attempts = attempts || 0;

            var that = this;

            var pods = toArray( that )
                .map(function( node ) {
                    return node.$hx.getCurrentPod();
                })
                .filter(function( pod ) {
                    return pod.type === 'precision';
                });

            if (length( pods ) !== length( that ) && attempts < 10) {
                var unsubscribe = subscribe(function() {
                    attempts++;
                    unsubscribe();
                    that._precAction( method , attempts );
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
            return eachNode( this , function( $hx ) {
                $hx.paint( type );
            });
        };
        

        hxManager_prototype.reset = function( type ) {
            return eachNode( this , function( $hx ) {
                $hx.resetComponents( type );
            });
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

                eachNode( that , function( $hx , node , i ) {

                    var bean = new Bean( seed , node , i );
                    $hx.updateComponent( bean );
                });
            });

            return that;
        };


        hxManager_prototype.resolve = function( all ) {

            // all controls whether all pod types or only promise pods will be resolved
            all = (!isUndef( all ) ? all : false);

            // force resolve the current pod in each queue
            return eachNode( this , function( $hx ) {

                var pod = $hx.getCurrentPod();

                if (pod && (all || (!all && pod.type === 'promise'))) {
                    pod.resolvePod();
                }
            });
        };


        hxManager_prototype.detach = function() {

            // detach callbacks from the subscriber module,
            // but still allow the pod to continue running
            
            return eachNode( this , function( $hx ) {
                var pod = $hx.getCurrentPod();
                if (pod) {
                    pod.detach();
                }
            });
        };


        hxManager_prototype.clear = function() {

            // clear all pods in each queue
            
            return eachNode( this , function( $hx ) {
                $hx.clearQueue();
            });
        };


        hxManager_prototype.break = function() {

            var that = this;
            
            // clear all but the current pod in each queue
            eachNode( that , function( $hx ) {
                $hx.clearQueue( false );
            });

            // resolve any remaining promise pods
            return that.resolve();
        };


        hxManager_prototype.zero = function( hxArgs ) {

            var that = this;

            // update the stored components
            that.update( hxArgs );

            // remove any stored transitions
            eachNode( that , function( $hx ) {
                $hx.resetTransition();
                $hx.applyTransition();
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
                return node.$hx.getComponents( find , pretty );
            });
        };


        // !!! clean does not return the hxManager instance
        hxManager_prototype.cleanup = function() {
            eachNode( this , function( $hx ) {
                $hx.cleanup();
            });
        };


        $(document).trigger( 'hx.ready' );


        function eachNode( hxm , callback ) {
            toArray( hxm ).forEach(function( node , i ) {
                callback( node.$hx , node , i );
            });
            return hxm;
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

    });

}, 1);



















