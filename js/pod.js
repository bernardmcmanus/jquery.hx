(function( window , hx , Config , Helper , When , VendorPatch ) {


    // =========================== pod constructor ========================== //


    var pod = function( node , type ) {

        if (!isValidType( type )) {
            throw new TypeError( 'you must pass a valid type to the hxManager.pod constructor.' );
        }

        var _pod = null;
        var whenModule = new When();

        switch (type) {

            case 'xform':
                _pod = new xformPod( node , whenModule );
                break;

            case 'promise':
                _pod = new promisePod( whenModule );
                break;
        }

        return _pod;
    };


    function isValidType( type ) {
        return (type && type !== '' && Config.types.indexOf( type ) >= 0);
    }


    // ============================== xformPod ============================== //


    var xformPod = function( node , whenModule ) {

        this.node = node;
        this.beans = {};
        this.type = 'xform';

        this.when = whenModule.when.bind( whenModule );
        this.happen = whenModule.happen.bind( whenModule );
    };


    xformPod.prototype = {

        addBean: function( bean ) {
            var type = bean.getData( 'type' );
            var cluster = (this.beans[type] = this.beans[type] || []);
            cluster.push( bean );
        },

        run: function() {

            var sequence = getActiveSequence( this.beans );

            setTransition( this.node , sequence );

            Helper.object.each( sequence , function( bean , key ) {
                
                if (bean.hasAnimator()) {
                    return;
                }

                this._runBean( bean );

            } , this );
        },

        _runBean: function( bean ) {

            bean.setValue(
                this.node._hx.updateComponent( bean )
            );

            var options = {
                node: this.node,
                property: bean.getData( 'type' ),
                eventType: VendorPatch.getEventType(),
            };

            bean.createAnimator( options );
            bean.when( 'complete' , this._beanComplete , this );

            applyXform( this.node , bean );
            bean.startAnimator();

            this.happen( 'beanStart' , [ bean ] );
        },

        isComplete: function() {
            return Helper.object.size( this.beans ) === 0;
        },

        _beanComplete: function( bean ) {

            var type = bean.getData( 'type' );
            var cluster = this.beans[type];

            cluster.splice( 0 , 1 );

            this.happen( 'beanComplete' , [ bean ] );

            if (cluster.length > 0) {
                this.run();
            }
            else {
                this._clusterComplete( type );
            }
        },

        _clusterComplete: function( property ) {
            
            var sequence = getActiveSequence( this.beans );
            setTransition( this.node , sequence );

            delete this.beans[property];

            this.happen( 'clusterComplete' , [ property ] );

            if (this.isComplete()) {
                this._podComplete();
            }
        },

        _podComplete: function() {
            this.happen( 'podComplete' , [ this ] );
        }
        
    };


    function setTransition( node , sequence ) {

        var tProp = VendorPatch.getPrefixed( 'transition' );
        var tString = buildTransitionString( sequence );

        if (node.style.transition === tString) {
            return;
        }

        $(node).css( tProp , tString );
    }


    function applyXform( node , bean ) {
        var tProp = VendorPatch.getPrefixed( bean.getData( 'type' ));
        $(node).css( tProp , bean.getData( 'value' ));
    }


    function getActiveSequence( beans ) {

        var sequence = {};
        
        Helper.object.each( beans , function( bean , key ) {
            if (bean.length > 0) {
                sequence[key] = bean[0];
            }
        });

        return sequence;
    }


    function buildTransitionString( sequence ) {
        
        var arr = [];

        Helper.object.each( sequence , function( part , key ) {
            var options = part.options;
            var component = key + ' ' + options.duration + 'ms ' + options.easing + ' ' + options.delay + 'ms';
            if (arr.indexOf( component ) < 0) {
                arr.push( component );
            }
        });
        
        return VendorPatch.getPrefixed(
            arr.join( ', ' )
        );
    }


    // ============================= promisePod ============================= //


    var promisePod = function( whenModule ) {
        this.type = 'promise';
        this.when = whenModule.when.bind( whenModule );
        this.happen = whenModule.happen.bind( whenModule );
    };


    promisePod.prototype = {

        run: function() {
            this.happen( 'promiseMade' );
        },

        resolve: function() {
            this.happen( 'promiseResolved' );
        },

        complete: function() {
            this.happen( 'podComplete' , [ this ] );
        }
    };


    // ====================================================================== //


    $.extend( hx , {pod: pod} );

    
}( window , hxManager , hxManager.config.pod , hxManager.helper , hxManager.when , hxManager.vendorPatch ));



























