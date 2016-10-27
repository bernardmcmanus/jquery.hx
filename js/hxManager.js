var Promise = require( 'wee-promise' );
var helper = require( 'shared/helper' );
var DomNodeFactory = require( 'domNode/domNodeFactory' );
var PodFactory = require( 'pod/podFactory' );
var Bean = require( 'pod/bean' );
var IteratorMOJO = require( 'pod/iteratorMOJO' );

module.exports = hxManager;

function hxManager( j ){
    var that = this;
    if (helper.instOf( j , hxManager )) {
        return j;
    }
    j.each(function( i ) {
        that[i] = DomNodeFactory( j[i] );
    });
    helper.defProp( that , 'length' , helper.descriptor(
        function() {
            return helper.length( j );
        }
    ));
    return that;
}

hxManager.prototype = $.extend(helper.create( $.prototype ), {
    animate: function( bundle ) {
        var that = this;
        return eachNode( that , function( $hx , node , i ) {
            var pod = PodFactory( node , 'animation' );
            helper.ensureArray( bundle ).forEach(function( seed ) {
                if (helper.isFunc( seed )) {
                    pod.addCallback(seed.bind( that ));
                }
                else {
                    var bean = new Bean( seed , node , i );
                    pod.addBean( bean );
                }
            });
            $hx.addPod( pod );
        });
    },
    iterate: function( bundle ) {
        var that = this;
        return eachNode( that , function( $hx , node , i ) {
            var pod = PodFactory( node , 'precision' );
            helper.ensureArray( bundle ).forEach(function( seed ) {
                if (helper.isFunc( seed )) {
                    pod.addCallback(seed.bind( that ));
                }
                else {
                    var bean = new Bean( seed , node , i );
                    var iterator = new IteratorMOJO( node , bean );
                    pod.addBean( iterator );
                }
            });
            $hx.addPod( pod );
        });
    },
    promise: function( func , method ) {
        method = method || 'all';
        var that = this;
        var pods = that.toArray().map(function( node ) {
            var $hx = node.$hx;
            var pod = PodFactory( node , 'promise' );
            $hx.addPod( pod );
            return pod;
        });
        Promise[ method ]( pods ).then(function() {
            new Promise(
                // create the macroPromise
                func.bind( that )
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
                if (helper.instOf( err , Error )) {
                    $.hx.error( err );
                    $(document).trigger( 'hx.error' , err );
                }
            });
        });
        return that;
    },
    pause: function() {
        return this._precAction( 'pause' );
    },
    resume: function() {
        return this._precAction( 'resume' );
    },
    _precAction: function( method , attempts ) {
        attempts = attempts || 0;
        var that = this;
        var pods = that.toArray()
            .map(function( node ) {
                return node.$hx.getCurrentPod();
            })
            .filter(function( pod ) {
                return pod.type === 'precision';
            });
        if (helper.length( pods ) !== helper.length( that ) && attempts < 10) {
            var unsubscribe = $.hx.subscribe(function() {
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
    },
    paint: function( type ) {            
        return eachNode( this , function( $hx ) {
            $hx.paint( type );
        });
    },
    reset: function( type ) {
        return eachNode( this , function( $hx ) {
            $hx.resetComponents( type );
        });
    },
    then: function( func ) {
        return this.promise( func );
    },
    race: function( func ) {
        return this.promise( func , 'race' );
    },
    defer: function( time ) {
        return this.promise(function( resolve ) {
            if (time) {
                var unsubscribe = $.hx.subscribe(function( elapsed ) {
                    if (elapsed >= time) {
                        unsubscribe();
                        resolve();
                    }
                });
            }
        });
    },
    update: function( bundle ) {
        // update a node's components without applying the transition
        var that = this;
        helper.ensureArray( bundle ).forEach(function( seed ) {
            eachNode( that , function( $hx , node , i ) {
                var bean = new Bean( seed , node , i );
                $hx.updateComponent( bean );
            });
        });
        return that;
    },
    resolve: function( all ) {
        // all controls whether all pod types or only promise pods will be resolved
        all = (!helper.isUndef( all ) ? all : false);
        // force resolve the current pod in each queue
        return eachNode( this , function( $hx ) {
            var pod = $hx.getCurrentPod();
            if (pod && (all || (!all && pod.type === 'promise'))) {
                pod.resolvePod();
            }
        });
    },
    detach: function() {
        // detach callbacks from the subscriber module,
        // but still allow the pod to continue running
        return eachNode( this , function( $hx ) {
            var pod = $hx.getCurrentPod();
            if (pod) {
                pod.detach();
            }
        });
    },
    clear: function() {
        // clear all pods in each queue
        return eachNode( this , function( $hx ) {
            $hx.clearQueue();
        });
    },
    break: function() {
        var that = this;
        // clear all but the current pod in each queue
        eachNode( that , function( $hx ) {
            $hx.clearQueue( false );
        });
        // resolve any remaining promise pods
        return that.resolve();
    },
    zero: function( hxArgs ) {
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
    },
    done: function( func ) {
        var that = this;
        that.promise(function( resolve ) {
            (func || function() {}).call( that );
            resolve();
        });
    },
    get: function( find , pretty ) {
        return this.toArray().map(function( node ) {
            return node.$hx.getComponents( find , pretty );
        });
    },
    cleanup: function() {
        eachNode( this , function( $hx ) {
            $hx.cleanup();
        });
    }
});

function eachNode( hxm , callback ) {
    hxm.toArray().forEach(function( node , i ) {
        callback( node.$hx , node , i );
    });
    return hxm;
}
