hxManager.Bean = hxManager.Inject(
[
    Error,
    jQuery,
    MOJO,
    'Config',
    'SubscriberMOJO',
    'keys',
    'has',
    'isFunc',
    'indexOf',
    'del'
],
function(
    Error,
    $,
    MOJO,
    Config,
    SubscriberMOJO,
    keys,
    has,
    isFunc,
    indexOf,
    del
){


    var TOLERANCE = ( 1000 / 240 );
    var TIMING = 'timing';
    var PROGRESS = 'progress';
    var BEAN_START = 'beanStart';
    var BEAN_PAINT = 'beanPaint';
    var BEAN_COMPLETE = 'beanComplete';


    var MOJO_Each = MOJO.Each;
    var OptionKeys = Config.optionKeys;
    var PropertyMap = Config.properties;
    var Buffer = Config.buffer;


    function Bean( seed , node , index ) {

        if (!seed.type) {
            throw new Error( 'Bean type is required.' );
        }

        var that = this;

        that.running = false;
        that.buffer = 0;
        that.progress = 0;

        MOJO.Construct( that );
        
        $.extend( that , getCompiledData( seed , node , index ));
    }


    var Calc = (
        Bean.Calc = function( elapsed , duration , delay ) {
            elapsed = elapsed - delay;
            elapsed = elapsed < 0 ? 0 : elapsed;
            return (elapsed / (duration ? duration + Buffer : 1));
        }
    );


    var CheckTol = (
        Bean.CheckTol = function( current , target , duration , delay ) {
            return (target - current) <= (TOLERANCE / (duration + delay + Buffer));
        }
    );


    Bean.prototype = MOJO.Create({

        run: function( $hx ) {

            var that = this;

            if (that.running) {
                return false;
            }

            that.running = true;

            that.when( PROGRESS , that );
            that.once( BEAN_PAINT , $hx , that );
            that.happen( BEAN_START );

            return true;
        },

        handleMOJO: function( e ) {
            
            var that = this;
            var args = arguments;
            var progress, $hx;

            switch (e.type) {

                case TIMING:
                    that._timing.apply( that , args );
                break;

                case PROGRESS:
                    progress = args[1];
                    if (that.running && progress > 0) {
                        that.dispel( PROGRESS , that );
                        that.happen( BEAN_PAINT );
                    }
                break;

                case BEAN_PAINT:
                    $hx = args[1];
                    $hx.setTransition( that );
                    $hx.updateComponent( that );
                break;
            }
        },

        _timing: function( e , elapsed , diff ) {

            var that = this;
            var duration = that.options.duration;
            var delay = that.options.delay;

            if (!that.running) {
                that.buffer += diff;
            }

            var progress = Calc(( elapsed - that.buffer) , duration , delay );

            if (CheckTol( progress , 1 , duration , delay )) {
                progress = 1;
            }

            that.happen( PROGRESS , progress );

            if (progress === 1) {
                that.happen( BEAN_COMPLETE );
            }
        },

        getOrder: getOrder,

        getOptions: getOptions,

        getStyles: getStyles
    });


    function getOrder( seed ) {

        var passed = (seed.order || []).map( mapCallback );
        
        var computed = keys( seed )
            .filter(function( key , i ) {
                return indexOf( OptionKeys , key ) < 0;
            })
            .map( mapCallback );

        function mapCallback( key ) {
            return PropertyMap[key] || key;
        }

        return {
            passed: passed,
            computed: computed
        };
    }


    function getOptions( seed , node , index ) {

        var defaults = Config.defaults;
        var options = $.extend( {} , defaults , seed );

        MOJO_Each( options , function( val , key ) {

            if (!has( defaults , key )) {
                del( options , key );
            }
            else if (key === 'done') {
                // make sure we don't execute the done function just yet
                options[key] = val.bind( null , node , index );
            }
            else {
                options[key] = getBeanProperty( val , node , index );
            }
        });

        return options;
    }


    function getStyles( seed , node , index ) {

        var styles = {};

        MOJO_Each( seed , function( val , key ) {
            
            var mappedKey = PropertyMap[key] || key;

            if (indexOf( OptionKeys , mappedKey ) < 0) {
                styles[mappedKey] = getBeanProperty( val , node , index );
            }
        });

        return styles;
    }


    function getBeanProperty( property , node , index ) {
        return (isFunc( property ) ? property( node , index ) : property);
    }


    function getCompiledData( seed , node , index ) {

        var options = getOptions( seed , node , index );

        return {
            ref: options.ref,
            seed: seed,
            type: seed.type,
            order: getOrder( seed ),
            options: options,
            styles: getStyles( seed , node , index )
        };
    }


    return Bean;

});



















